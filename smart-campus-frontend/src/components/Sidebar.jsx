import { Link, NavLink } from 'react-router-dom';
import { ChevronLeft, ChevronRight, Compass, LayoutDashboard, MapPin, Menu, Warehouse } from 'lucide-react';
import { useRole } from '../context/RoleContext';
import {
  MAIN_DASHBOARD_ROUTE,
  RESOURCE_CATALOGUE_ROUTE,
  RESOURCE_DASHBOARD_ROUTE,
} from '../config/navigation';

const navItems = [
  { label: 'Main Dashboard', to: MAIN_DASHBOARD_ROUTE, icon: LayoutDashboard },
  { label: 'Resource Dashboard', to: RESOURCE_DASHBOARD_ROUTE, icon: Compass },
  { label: 'Resource Catalogue', to: RESOURCE_CATALOGUE_ROUTE, icon: Warehouse },
];

export default function Sidebar({ isMobileOpen, isCollapsed, onToggleMobile, onToggleCollapse }) {
  const { role, setRole } = useRole();

  const sidebarWidthClass = isCollapsed ? 'md:w-20' : 'md:w-72';

  return (
    <>
      <button
        type="button"
        onClick={onToggleMobile}
        className="md:hidden fixed top-4 left-4 z-50 p-2 rounded-xl bg-slate-900/80 border border-white/10 text-slate-200"
        aria-label="Toggle sidebar"
      >
        <Menu size={18} />
      </button>

      <aside
        className={`fixed md:static inset-y-0 left-0 z-40 w-72 ${sidebarWidthClass} transform transition-all duration-300
          ${isMobileOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
          bg-slate-950/90 border-r border-white/10 md:border-r-0 backdrop-blur-xl md:self-stretch md:min-h-full`}
      >
        <div className="h-full flex flex-col p-4">
          <div className="flex items-center justify-between gap-2 px-2 py-3 border-b border-white/10 mb-4">
            <Link to={RESOURCE_DASHBOARD_ROUTE} className="flex items-center gap-3 min-w-0">
              <div className="p-2 rounded-xl bg-cyan-500/20 text-cyan-300 shrink-0">
                <MapPin size={20} />
              </div>
              {!isCollapsed && (
                <div className="min-w-0">
                  <p className="font-black text-white text-lg leading-none truncate">SmartCampus</p>
                  <p className="text-xs text-slate-400 mt-1 truncate">Module Navigator</p>
                </div>
              )}
            </Link>

            <button
              type="button"
              onClick={onToggleCollapse}
              className="hidden md:inline-flex p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/5"
              aria-label="Collapse sidebar"
            >
              {isCollapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
            </button>
          </div>

          <nav className="space-y-2">
            {navItems.map(({ label, to, icon: Icon }) => {
              const isExternalMain = to === MAIN_DASHBOARD_ROUTE;
              if (isExternalMain) {
                return (
                  <Link
                    key={to}
                    to={to}
                    onClick={() => isMobileOpen && onToggleMobile?.()}
                    className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all text-slate-300 hover:text-white hover:bg-white/5 border border-transparent"
                    title={isCollapsed ? label : undefined}
                  >
                    <Icon size={17} className="shrink-0" />
                    {!isCollapsed && <span>{label}</span>}
                  </Link>
                );
              }

              return (
                <NavLink
                  key={to}
                  to={to}
                  onClick={() => isMobileOpen && onToggleMobile?.()}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                      isActive
                        ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-400/30'
                        : 'text-slate-300 hover:text-white hover:bg-white/5 border border-transparent'
                    }`
                  }
                  title={isCollapsed ? label : undefined}
                >
                  <Icon size={17} className="shrink-0" />
                  {!isCollapsed && <span>{label}</span>}
                </NavLink>
              );
            })}
          </nav>

          <div className="mt-auto pt-4 border-t border-white/10">
            {!isCollapsed && <label className="block text-xs uppercase tracking-wider text-slate-400 mb-2">Role</label>}
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className={`w-full rounded-xl bg-slate-900 border border-white/10 px-3 py-2 text-sm text-white outline-none ${
                isCollapsed ? 'text-center' : ''
              }`}
              title="Role selector"
            >
              <option value="admin">Admin</option>
              <option value="student">Student</option>
            </select>
            {!isCollapsed && <p className="text-xs text-slate-500 mt-2">Switch role to preview module permissions.</p>}
          </div>
        </div>
      </aside>

      {isMobileOpen && (
        <button
          type="button"
          onClick={onToggleMobile}
          className="md:hidden fixed inset-0 bg-black/50 z-30"
          aria-label="Close sidebar overlay"
        />
      )}
    </>
  );
}
