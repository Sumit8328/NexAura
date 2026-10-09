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
    { name: 'Inventory', path: '/inventory', icon: Boxes, badge: '10 SKUs' },
    { name: 'Demand Forecast', path: '/forecast', icon: TrendingUp, badge: 'AI Engine' },
    { name: 'Risk Intelligence', path: '/risk', icon: ShieldAlert, badge: '2 Critical', badgeVariant: 'red' },
    { name: 'Route Intelligence', path: '/routes', icon: Route, badge: '5 Corridors' },
    { name: 'Replenishment Recommendations', path: '/recommendations', icon: CheckSquare, badge: '4 Pending', badgeVariant: 'amber' },
    { name: 'Shipments', path: '/shipments', icon: Truck, badge: '3 Transit', badgeVariant: 'cyan' },
    { name: 'Scenario Lab', path: '/scenario-lab', icon: FlaskConical, badge: 'Sandbox' },
    { name: 'Audit & Activity', path: '/audit', icon: History, badge: null },
  ];

  const sidebarContent = (
    <div className="flex flex-col h-full bg-[#141F30] border-r border-[#263449] select-none">
      {/* Brand Header */}
      <div className="h-16 px-4 flex items-center justify-between border-b border-[#263449] bg-[#0B1220]">
        <NavLink to="/" className="flex items-center overflow-hidden hover:opacity-95 transition-opacity">
          <KartavyaLogo collapsed={isCollapsed} />
        </NavLink>

        {/* Toggle Collapse on Desktop */}
        <button
          onClick={onToggleCollapse}
          className="hidden md:flex p-1.5 text-[#94A3B8] hover:text-[#F8FAFC] rounded-md hover:bg-[#1B293B] transition-colors ml-2"
          title={isCollapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
        >
          {isCollapsed ? <ChevronRight className="w-4 h-4 text-[#55E6C1]" /> : <ChevronLeft className="w-4 h-4" />}
        </button>
      </div>

      {/* Nav List */}
      <div className="flex-1 py-4 px-2 space-y-1 overflow-y-auto">
        <div className="px-3 pb-2 text-[10px] font-mono font-semibold uppercase tracking-wider text-[#94A3B8]/80">
          {!isCollapsed ? 'Operations Console' : 'Ops'}
        </div>

        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;

          return (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={onCloseMobile}
              className={`group flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-mono font-medium transition-all duration-150 relative ${
                isActive
                  ? 'bg-[#1B293B] text-[#55E6C1] border-l-2 border-[#55E6C1] shadow-[inset_4px_0_12px_-4px_rgba(85,230,193,0.25)]'
                  : 'text-[#94A3B8] hover:text-[#F8FAFC] hover:bg-[#1B293B]/70 border-l-2 border-transparent'
              }`}
              title={isCollapsed ? item.name : undefined}
            >
              <Icon className={`w-4 h-4 shrink-0 transition-colors ${
                isActive ? 'text-[#55E6C1] drop-shadow-[0_0_8px_rgba(85,230,193,0.5)]' : 'text-[#94A3B8] group-hover:text-[#55E6C1]'
              }`} />

              {!isCollapsed && (
                <div className="flex-1 flex items-center justify-between min-w-0">
                  <span className="truncate">{item.name}</span>
                  {item.badge && (
                    <span className={`text-[9px] font-mono font-bold px-1.5 py-0.5 rounded tracking-wide shrink-0 ${
                      item.badgeVariant === 'red'
                        ? 'bg-[#F87171]/15 text-[#F87171] border border-[#F87171]/30'
                        : item.badgeVariant === 'amber'
                        ? 'bg-[#FBBF24]/15 text-[#FBBF24] border border-[#FBBF24]/30'
                        : item.badgeVariant === 'cyan'
                        ? 'bg-[#38BDF8]/15 text-[#38BDF8] border border-[#38BDF8]/30'
                        : 'bg-[#0B1220] text-[#94A3B8] border border-[#263449]'
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
      <div className="p-3 border-t border-[#263449] bg-[#0B1220]/80">
        {!isCollapsed ? (
          <div className="p-2.5 rounded-lg bg-[#141F30] border border-[#263449] flex items-center justify-between text-xs font-mono">
            <div className="flex items-center gap-2">
              <Cpu className="w-4 h-4 text-[#55E6C1]" />
              <div>
                <p className="font-bold text-[#F8FAFC] text-[11px]">Command Hub 01</p>
                <p className="text-[10px] text-[#55E6C1] flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#55E6C1] animate-pulse" />
                  Echelon Ready
                </p>
              </div>
            </div>
            <span className="text-[10px] text-[#94A3B8] font-mono">v1.0-RC</span>
          </div>
        ) : (
          <div className="flex justify-center">
            <span className="w-2.5 h-2.5 rounded-full bg-[#55E6C1] animate-pulse" title="System Ready" />
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
