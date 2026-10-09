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
  X,
  Shield,
  Layers,
  FlaskConical,
  RotateCcw,
  Sparkles
} from 'lucide-react';
import { SyncStatusWidget } from './SyncStatusWidget';
import { useToast } from '../../context/ToastContext';
import { useSync } from '../../context/SyncContext';

export const TopNav = ({ onOpenMobile, isCollapsed }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { info, success } = useToast();
  const { triggerManualSync, isSyncing } = useSync();

  const [searchQuery, setSearchQuery] = useState('');
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  // Map route path to human title & operational theater category
  const getPageInfo = () => {
    switch (location.pathname) {
      case '/': return { title: 'Operational Command Centre', category: 'Mission Overview' };
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

  // Dynamic browser tab title synchronization
  React.useEffect(() => {
    document.title = `${title} | KARTAVYA — Predict. Prepare. Deliver.`;
  }, [title]);

  const handleRefresh = async () => {
    await triggerManualSync();
    info('Telemetry Refreshed', 'Refreshed local operational telemetry buffers.');
  };

  const notifications = [
    { id: 1, title: 'Critical Fuel Alert: Sector-4 Depot', desc: 'Stock coverage dropped to 3.7 days. Burn rate +41%.', time: '12m ago', type: 'critical', path: '/risk' },
    { id: 2, title: 'Corridor Echo Impassable', desc: 'Winter blizzard blocked Alpine Ridge Pass. Multi-modal reroute staged.', time: '34m ago', type: 'critical', path: '/routes' },
    { id: 3, title: 'Shipment KTV-9042 In Transit', desc: 'Armored Rail Tanker reached Mile Marker 312 on Corridor Diamond.', time: '1h ago', type: 'info', path: '/shipments' },
    { id: 4, title: 'New Replenishment Proposal', desc: 'Suggested 25,000L JP-8 dispatch pending duty officer confirmation.', time: '2h ago', type: 'warning', path: '/recommendations' }
  ];

  return (
    <header className="h-16 bg-[#141F30]/95 border-b border-[#263449] backdrop-blur-md sticky top-0 z-20 px-4 md:px-6 flex items-center justify-between gap-4">
      {/* Left: Mobile hamburger + Page Title & Breadcrumb */}
      <div className="flex items-center gap-3 min-w-0">
        <button
          onClick={onOpenMobile}
          className="md:hidden p-2 text-[#94A3B8] hover:text-[#F8FAFC] rounded-lg hover:bg-[#1B293B] transition-colors"
          title="Open Menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="min-w-0">
          <div className="flex items-center gap-1.5 text-[11px] font-mono text-[#94A3B8]">
            <span 
              className="font-semibold text-[#F8FAFC] hover:text-[#55E6C1] cursor-pointer transition-colors"
              onClick={() => navigate('/')}
            >
              KARTAVYA
            </span>
            <ChevronRight className="w-3 h-3 text-[#263449]" />
            <span className="text-[#55E6C1] truncate">{category}</span>
          </div>
          <h1 className="text-sm md:text-base font-bold text-[#F8FAFC] tracking-wide truncate">
            {title}
          </h1>
        </div>
      </div>

      {/* Middle: Tactical Search Trigger */}
      <div className="hidden lg:flex items-center flex-1 max-w-sm mx-4">
        <div className="relative w-full">
          <Search className="w-4 h-4 text-[#94A3B8] absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && searchQuery.trim()) {
                navigate(`/inventory?q=${encodeURIComponent(searchQuery)}`);
              }
            }}
            placeholder="Search SKU, depot, convoy, or commodity..."
            className="w-full bg-[#0B1220] border border-[#263449] rounded-lg pl-9 pr-8 py-1.5 text-xs font-mono text-[#F8FAFC] placeholder-[#94A3B8] focus:outline-none focus:border-[#55E6C1] focus:ring-1 focus:ring-[#55E6C1]/50 transition-all"
          />
          {searchQuery && (
            <button 
              onClick={() => setSearchQuery('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#94A3B8] hover:text-[#F8FAFC]"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Right: Demo Status + Freshness + Connectivity + Notifications + Duty Officer Profile */}
      <div className="flex items-center gap-2.5 md:gap-3 shrink-0">
        {/* Explicit Demo/Simulation Mode Indicator */}
        <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-[#1B293B] border border-[#263449] text-[10px] font-mono font-semibold text-[#55E6C1]" title="Synthetic demonstration environment">
          <span className="w-1.5 h-1.5 rounded-full bg-[#55E6C1] animate-pulse" />
          <span>SIMULATION MODE</span>
        </div>

        {/* Freshness / Refresh Indicator */}
        <button
          onClick={handleRefresh}
          disabled={isSyncing}
          className="hidden md:flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-[#1B293B] hover:bg-[#202E42] border border-[#263449] text-[11px] font-mono text-[#94A3B8] hover:text-[#F8FAFC] transition-colors"
          title="Refresh Operational Telemetry"
        >
          <RefreshCw className={`w-3 h-3 text-[#55E6C1] ${isSyncing ? 'animate-spin' : ''}`} />
          <span className="hidden xl:inline">SYNC:</span>
          <span>LIVE</span>
        </button>

        {/* Connectivity Status Widget */}
        <SyncStatusWidget />

        {/* Notification Bell */}
        <div className="relative">
          <button
            onClick={() => {
              setShowNotifications(!showNotifications);
              setShowUserMenu(false);
            }}
            className="relative p-2 text-[#94A3B8] hover:text-[#F8FAFC] rounded-lg hover:bg-[#1B293B] transition-colors"
            title="Operational Alerts"
          >
            <Bell className="w-4 h-4" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#F87171] animate-pulse shadow-[0_0_8px_#F87171]" />
          </button>

          {/* Notifications Dropdown */}
          {showNotifications && (
            <>
              <div className="fixed inset-0 z-30" onClick={() => setShowNotifications(false)} />
              <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-[#141F30] border border-[#263449] rounded-xl shadow-2xl p-4 z-40 animate-in fade-in zoom-in-95 duration-150">
                <div className="flex items-center justify-between pb-3 border-b border-[#263449]">
                  <span className="text-xs font-bold font-mono text-[#F8FAFC] uppercase flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-[#F87171] animate-pulse" />
                    Tactical Threat Feed
                  </span>
                  <span className="text-[10px] font-mono text-[#94A3B8]">4 Active Items</span>
                </div>

                <div className="mt-2 divide-y divide-[#263449]/70 max-h-72 overflow-y-auto">
                  {notifications.map((n) => (
                    <div 
                      key={n.id}
                      onClick={() => {
                        setShowNotifications(false);
                        navigate(n.path);
                      }}
                      className="py-2.5 px-2 hover:bg-[#1B293B] rounded cursor-pointer transition-colors"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <span className={`text-xs font-semibold ${
                          n.type === 'critical' ? 'text-[#F87171]' : n.type === 'warning' ? 'text-[#FBBF24]' : 'text-[#55E6C1]'
                        }`}>
                          {n.title}
                        </span>
                        <span className="text-[10px] font-mono text-[#94A3B8] shrink-0">{n.time}</span>
                      </div>
                      <p className="text-xs text-[#94A3B8] font-sans mt-0.5 line-clamp-2">
                        {n.desc}
                      </p>
                    </div>
                  ))}
                </div>

                <div className="pt-2.5 mt-2 border-t border-[#263449] flex items-center justify-between text-xs font-mono">
                  <button 
                    onClick={() => { setShowNotifications(false); navigate('/risk'); }}
                    className="text-[#55E6C1] hover:underline"
                  >
                    View Risk Intelligence →
                  </button>
                  <button 
                    onClick={() => setShowNotifications(false)}
                    className="text-[#94A3B8] hover:text-[#F8FAFC]"
                  >
                    Dismiss
                  </button>
                </div>
              </div>
            </>
          )}
        </div>

        {/* User / Duty Officer Profile Menu */}
        <div className="relative pl-1 border-l border-[#263449]">
          <button
            onClick={() => {
              setShowUserMenu(!showUserMenu);
              setShowNotifications(false);
            }}
            className="flex items-center gap-2.5 p-1 rounded-lg hover:bg-[#1B293B] transition-colors text-left"
            title="Duty Officer Profile & Session Options"
          >
            <div className="w-8 h-8 rounded-lg bg-[#1B293B] border border-[#263449] flex items-center justify-center text-[#55E6C1] shrink-0 font-mono font-bold text-xs shadow-inner">
              OP-1
            </div>
            <div className="hidden xl:block min-w-0 text-left">
              <p className="text-xs font-bold text-[#F8FAFC] font-mono truncate">Duty Officer</p>
              <p className="text-[10px] text-[#94A3B8] font-mono truncate">Logistics Desk</p>
            </div>
          </button>

          {/* Profile Dropdown Popover */}
          {showUserMenu && (
            <>
              <div className="fixed inset-0 z-30" onClick={() => setShowUserMenu(false)} />
              <div className="absolute right-0 mt-2 w-72 bg-[#141F30] border border-[#263449] rounded-xl shadow-2xl p-4 z-40 text-xs font-mono animate-in fade-in zoom-in-95 duration-150">
                <div className="flex items-center gap-3 pb-3 border-b border-[#263449]">
                  <div className="w-10 h-10 rounded-lg bg-[#1B293B] border border-[#55E6C1]/40 flex items-center justify-center text-[#55E6C1] font-mono font-bold text-sm">
                    OP-1
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-[#F8FAFC]">Duty Officer</h4>
                    <p className="text-[11px] text-[#94A3B8]">Forward Logistics Command</p>
                    <span className="inline-block mt-0.5 px-1.5 py-0.2 rounded text-[9px] bg-[#55E6C1]/10 text-[#55E6C1] border border-[#55E6C1]/30">
                      Simulation Mode
                    </span>
                  </div>
                </div>

                <div className="py-3 space-y-2 text-[#94A3B8] text-[11px] border-b border-[#263449]">
                  <div className="flex justify-between">
                    <span>Active Echelon:</span>
                    <span className="text-[#F8FAFC] font-bold">Sector Southwest</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Telemetry Dataset:</span>
                    <span className="text-[#55E6C1]">Standalone Demo</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Decision Authority:</span>
                    <span className="text-[#F8FAFC]">Human-in-the-Loop</span>
                  </div>
                </div>

                <div className="pt-3 space-y-1.5">
                  <button
                    onClick={() => {
                      setShowUserMenu(false);
                      navigate('/scenario-lab');
                    }}
                    className="w-full text-left px-2.5 py-1.5 rounded hover:bg-[#1B293B] text-[#55E6C1] flex items-center gap-2 transition-colors"
                  >
                    <FlaskConical className="w-3.5 h-3.5" />
                    <span>Run Stress Scenario</span>
                  </button>
                  <button
                    onClick={() => {
                      setShowUserMenu(false);
                      navigate('/audit');
                    }}
                    className="w-full text-left px-2.5 py-1.5 rounded hover:bg-[#1B293B] text-[#94A3B8] hover:text-[#F8FAFC] flex items-center gap-2 transition-colors"
                  >
                    <Clock className="w-3.5 h-3.5" />
                    <span>View Audit Trail</span>
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default TopNav;
