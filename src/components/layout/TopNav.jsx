import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { 
  Menu, 
  Search, 
  Bell, 
  RefreshCw, 
  User, 
  ChevronRight, 
  AlertTriangle,
  CheckCircle2,
  Clock,
  X
} from 'lucide-react';
import { SyncStatusWidget } from './SyncStatusWidget';
import { useToast } from '../../context/ToastContext';
import { useSync } from '../../context/SyncContext';

export const TopNav = ({ onOpenMobile, isCollapsed }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { info } = useToast();
  const { triggerManualSync, isSyncing } = useSync();

  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  // Map route path to human title
  const getPageInfo = () => {
    switch (location.pathname) {
      case '/': return { title: 'Operational Command Centre', category: 'Executive Theater' };
      case '/inventory': return { title: 'Forward Inventory Management', category: 'Stockpile Logistics' };
      case '/forecast': return { title: 'Predictive Demand Intelligence', category: 'Forward Estimation' };
      case '/risk': return { title: 'Supply Shortage & Risk Matrix', category: 'Early Warning Intelligence' };
      case '/routes': return { title: 'Multi-Modal Route Intelligence', category: 'Corridor Operations' };
      case '/recommendations': return { title: 'Autonomous Replenishment Review', category: 'Human-in-the-Loop' };
      case '/shipments': return { title: 'Shipment Dispatch & Lifecycle', category: 'Active Corridors' };
      case '/scenario-lab': return { title: 'Stress Scenario Sandbox', category: 'What-If Simulation' };
      case '/audit': return { title: 'Activity Trail & Custody Audit', category: 'Compliance & Verification' };
      default: return { title: 'Logistics Command', category: 'KARTAVYA' };
    }
  };

  const { title, category } = getPageInfo();

  const handleRefresh = async () => {
    await triggerManualSync();
    info('Telemetry Refreshed', 'Refreshed local operational telemetry buffers.');
  };

  const notifications = [
    { id: 1, title: 'Critical Fuel Alert: Sector-4 Depot', desc: 'Stock coverage dropped to 3.7 days. Burn rate +41%.', time: '12m ago', type: 'critical', path: '/risk' },
    { id: 2, title: 'Corridor Echo Impassable', desc: 'Winter blizzard blocked Alpine Ridge Pass. Airdrop required.', time: '34m ago', type: 'critical', path: '/routes' },
    { id: 3, title: 'Shipment AST-9042 Telemetry nominal', desc: 'Rail Tanker reached Mile Marker 312 on Corridor Diamond.', time: '1h ago', type: 'info', path: '/shipments' },
    { id: 4, title: 'New Replenishment Proposal', desc: 'Suggested 25,000L JP-8 dispatch pending officer validation.', time: '2h ago', type: 'warning', path: '/recommendations' }
  ];

  return (
    <header className="h-16 bg-midnight-900/90 border-b border-midnight-750 backdrop-blur-md sticky top-0 z-20 px-4 md:px-6 flex items-center justify-between gap-4">
      {/* Left: Mobile hamburger + Page Title & Breadcrumb */}
      <div className="flex items-center gap-3 min-w-0">
        <button
          onClick={onOpenMobile}
          className="md:hidden p-2 text-slate-300 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="min-w-0">
          <div className="flex items-center gap-1.5 text-[11px] font-mono text-slate-400">
            <span>KARTAVYA</span>
            <ChevronRight className="w-3 h-3 text-slate-600" />
            <span className="text-cyan-400/90 truncate">{category}</span>
          </div>
          <h1 className="text-sm md:text-base font-bold text-white tracking-wide truncate">
            {title}
          </h1>
        </div>
      </div>

      {/* Middle: Tactical Search Trigger */}
      <div className="hidden lg:flex items-center flex-1 max-w-xs mx-4">
        <div className="relative w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && searchQuery.trim()) {
                navigate(`/inventory?q=${encodeURIComponent(searchQuery)}`);
              }
            }}
            placeholder="Search depot, SKU, route or convoy..."
            className="w-full bg-midnight-950/80 border border-midnight-700/80 rounded-lg pl-9 pr-8 py-1.5 text-xs font-mono text-slate-200 placeholder-slate-400 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400/50 transition-all"
          />
          {searchQuery && (
            <button 
              onClick={() => setSearchQuery('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Right: Freshness + Connectivity + Notifications + User Profile */}
      <div className="flex items-center gap-2.5 md:gap-3.5 shrink-0">
        {/* Freshness / Refresh Indicator */}
        <button
          onClick={handleRefresh}
          disabled={isSyncing}
          className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-midnight-800/80 hover:bg-midnight-750 border border-midnight-700 text-[11px] font-mono text-slate-300 hover:text-white transition-colors"
          title="Refresh Operational Telemetry"
        >
          <RefreshCw className={`w-3 h-3 text-cyan-400 ${isSyncing ? 'animate-spin' : ''}`} />
          <span className="hidden xl:inline">FRESHNESS:</span>
          <span>LIVE</span>
        </button>

        {/* Connectivity Status Widget */}
        <SyncStatusWidget />

        {/* Notification Bell */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative p-2 text-slate-300 hover:text-white rounded-lg hover:bg-midnight-800 transition-colors"
            title="Operational Alerts"
          >
            <Bell className="w-4 h-4" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-rose-500 animate-pulse shadow-[0_0_8px_#f43f5e]" />
          </button>

          {/* Notifications Dropdown */}
          {showNotifications && (
            <>
              <div className="fixed inset-0 z-30" onClick={() => setShowNotifications(false)} />
              <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-midnight-900 border border-midnight-700/90 rounded-xl shadow-2xl p-4 z-40 animate-in fade-in zoom-in-95 duration-150">
                <div className="flex items-center justify-between pb-3 border-b border-midnight-750">
                  <span className="text-xs font-bold font-mono text-white uppercase flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
                    Tactical Threat Feed
                  </span>
                  <span className="text-[10px] font-mono text-slate-400">4 Active Items</span>
                </div>

                <div className="mt-2 divide-y divide-midnight-800/80 max-h-72 overflow-y-auto">
                  {notifications.map((n) => (
                    <div 
                      key={n.id}
                      onClick={() => {
                        setShowNotifications(false);
                        navigate(n.path);
                      }}
                      className="py-2.5 px-1 hover:bg-midnight-850 rounded cursor-pointer transition-colors"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <span className={`text-xs font-semibold ${
                          n.type === 'critical' ? 'text-rose-400' : n.type === 'warning' ? 'text-amber-400' : 'text-cyan-400'
                        }`}>
                          {n.title}
                        </span>
                        <span className="text-[10px] font-mono text-slate-400 shrink-0">{n.time}</span>
                      </div>
                      <p className="text-xs text-slate-300 font-sans mt-0.5 line-clamp-2">
                        {n.desc}
                      </p>
                    </div>
                  ))}
                </div>

                <div className="pt-2.5 mt-2 border-t border-midnight-750 flex items-center justify-between text-xs font-mono">
                  <button 
                    onClick={() => { setShowNotifications(false); navigate('/risk'); }}
                    className="text-cyan-400 hover:text-cyan-300 hover:underline"
                  >
                    View Risk Intelligence →
                  </button>
                  <button 
                    onClick={() => setShowNotifications(false)}
                    className="text-slate-400 hover:text-white"
                  >
                    Dismiss All
                  </button>
                </div>
              </div>
            </>
          )}
        </div>

        {/* User Profile Placeholder */}
        <div className="flex items-center gap-2.5 pl-2 border-l border-midnight-750">
          <div className="w-8 h-8 rounded-lg bg-cyan-950/80 border border-cyan-500/40 flex items-center justify-center text-cyan-400 shrink-0 font-mono font-bold text-xs">
            OP-1
          </div>
          <div className="hidden xl:block min-w-0 text-left">
            <p className="text-xs font-bold text-slate-200 font-mono truncate">Cdr. V. Vance</p>
            <p className="text-[10px] text-slate-400 font-mono truncate">Ops Echelon • Forward Hub</p>
          </div>
        </div>
      </div>
    </header>
  );
};

export default TopNav;
