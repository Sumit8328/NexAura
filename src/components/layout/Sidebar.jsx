import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Boxes, 
  TrendingUp, 
  ShieldAlert, 
  Route, 
  CheckSquare, 
  Truck, 
  FlaskConical, 
  History, 
  ChevronLeft, 
  ChevronRight,
  Radio,
  Cpu
} from 'lucide-react';
import KartavyaLogo from '../common/KartavyaLogo';

export const Sidebar = ({ isCollapsed, onToggleCollapse, mobileOpen, onCloseMobile }) => {
  const location = useLocation();

  const navItems = [
    { name: 'Command Centre', path: '/', icon: LayoutDashboard, badge: null },
    { name: 'Inventory', path: '/inventory', icon: Boxes, badge: '10 items' },
    { name: 'Demand Forecast', path: '/forecast', icon: TrendingUp, badge: 'AI Proj' },
    { name: 'Risk Intelligence', path: '/risk', icon: ShieldAlert, badge: '2 Crit', badgeVariant: 'red' },
    { name: 'Route Intelligence', path: '/routes', icon: Route, badge: '5 Corridors' },
    { name: 'Replenishment', path: '/recommendations', icon: CheckSquare, badge: '4 Pending', badgeVariant: 'amber' },
    { name: 'Shipments', path: '/shipments', icon: Truck, badge: '3 Transit', badgeVariant: 'cyan' },
    { name: 'Scenario Lab', path: '/scenario-lab', icon: FlaskConical, badge: 'Sandbox' },
    { name: 'Audit & Activity', path: '/audit', icon: History, badge: null },
  ];

  const sidebarContent = (
    <div className="flex flex-col h-full bg-midnight-900 border-r border-midnight-750 select-none">
      {/* Brand Header */}
      <div className="h-16 px-4 flex items-center justify-between border-b border-midnight-750 bg-midnight-950/60">
        <NavLink to="/" className="flex items-center overflow-hidden hover:opacity-95 transition-opacity">
          <KartavyaLogo collapsed={isCollapsed} />
        </NavLink>

        {/* Toggle Collapse on Desktop */}
        <button
          onClick={onToggleCollapse}
          className="hidden md:flex p-1.5 text-slate-400 hover:text-white rounded-md hover:bg-slate-800 transition-colors ml-2"
          title={isCollapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
        >
          {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>
      </div>

      {/* Nav List */}
      <div className="flex-1 py-4 px-2 space-y-1 overflow-y-auto">
        <div className="px-3 pb-2 text-[10px] font-mono font-semibold uppercase tracking-wider text-slate-400">
          {!isCollapsed ? 'Core Operations' : 'Ops'}
        </div>

        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;

          return (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={onCloseMobile}
              className={`group flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 ${
                isActive
                  ? 'bg-cyan-500/15 text-cyan-300 border border-cyan-500/40 shadow-[0_0_12px_-2px_rgba(0,240,255,0.25)]'
                  : 'text-slate-300 hover:text-white hover:bg-midnight-800/80 border border-transparent'
              }`}
              title={isCollapsed ? item.name : undefined}
            >
              <Icon className={`w-5 h-5 shrink-0 transition-colors ${
                isActive ? 'text-cyan-400 drop-shadow-[0_0_8px_rgba(0,240,255,0.6)]' : 'text-slate-400 group-hover:text-cyan-400'
              }`} />

              {!isCollapsed && (
                <div className="flex-1 flex items-center justify-between min-w-0">
                  <span className="truncate">{item.name}</span>
                  {item.badge && (
                    <span className={`text-[10px] font-mono font-bold px-1.5 py-0.5 rounded tracking-wide shrink-0 ${
                      item.badgeVariant === 'red'
                        ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                        : item.badgeVariant === 'amber'
                        ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                        : item.badgeVariant === 'cyan'
                        ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                        : 'bg-slate-800 text-slate-400 border border-slate-700'
                    }`}>
                      {item.badge}
                    </span>
                  )}
                </div>
              )}
            </NavLink>
          );
        })}
      </div>

      {/* Footer System Status */}
      <div className="p-3 border-t border-midnight-750 bg-midnight-950/40">
        {!isCollapsed ? (
          <div className="p-2.5 rounded-lg bg-midnight-900 border border-midnight-750 flex items-center justify-between text-xs font-mono">
            <div className="flex items-center gap-2">
              <Cpu className="w-4 h-4 text-cyan-400" />
              <div>
                <p className="font-bold text-slate-200 text-[11px]">Command Hub 01</p>
                <p className="text-[10px] text-emerald-400 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  Echelon Ready
                </p>
              </div>
            </div>
            <span className="text-[10px] text-slate-400 font-mono">v1.0-RC</span>
          </div>
        ) : (
          <div className="flex justify-center">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" title="System Ready" />
          </div>
        )}
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className={`hidden md:block h-screen fixed left-0 top-0 z-30 transition-all duration-300 ease-in-out ${
        isCollapsed ? 'w-18' : 'w-64'
      }`}>
        {sidebarContent}
      </aside>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div className="fixed inset-0 bg-midnight-950/80 backdrop-blur-sm" onClick={onCloseMobile} />
          <div className="fixed inset-y-0 left-0 w-72 max-w-full">
            {sidebarContent}
          </div>
        </div>
      )}
    </>
  );
};

export default Sidebar;
