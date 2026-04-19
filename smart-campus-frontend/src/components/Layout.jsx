import { Outlet, NavLink, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  CalendarPlus,
  ListChecks,
  CalendarDays,
  ShieldCheck,
  Building2,
  Menu,
  X,
} from 'lucide-react';
import { useState } from 'react';
import { useRole } from '../context/RoleContext';
import { RESOURCE_DASHBOARD_ROUTE } from '../config/navigation';

const STUDENT_NAV = [
  { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { path: '/new-booking', label: 'New Booking', icon: CalendarPlus },
  { path: '/my-bookings', label: 'My Bookings', icon: ListChecks },
  { path: '/calendar', label: 'Calendar', icon: CalendarDays },
  { path: RESOURCE_DASHBOARD_ROUTE, label: 'Resources', icon: Building2 },
];

const ADMIN_NAV = [
  { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { path: '/admin', label: 'Admin Panel', icon: ShieldCheck },
  { path: '/calendar', label: 'Calendar', icon: CalendarDays },
  { path: RESOURCE_DASHBOARD_ROUTE, label: 'Resources', icon: Building2 },
];

function Layout() {
  const location = useLocation();
  const { isAdmin } = useRole();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const navItems = isAdmin ? ADMIN_NAV : STUDENT_NAV;
  const moduleBadge = isAdmin ? 'ADMIN MODULE' : 'STUDENT MODULE';
  const badgeStyle = isAdmin
    ? 'bg-cyan-100 text-cyan-700'
    : 'bg-blue-100 text-blue-700';

  return (
    <div className="flex h-screen overflow-hidden bg-slate-50">
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <aside
        className={`
          fixed lg:static inset-y-0 left-0 z-40
          w-64 bg-slate-800 text-white flex flex-col
          transform transition-transform duration-300 ease-in-out
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}
      >
        <div className="flex items-center gap-3 px-5 py-5 border-b border-slate-700">
          <div className="w-10 h-10 bg-blue-500 rounded-xl flex items-center justify-center flex-shrink-0">
            <CalendarDays className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="font-bold text-sm leading-tight">Smart Campus</h1>
            <p className="text-xs text-slate-400">Operations Hub</p>
          </div>
          <button
            className="ml-auto lg:hidden text-slate-400 hover:text-white"
            onClick={() => setSidebarOpen(false)}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <nav className="flex-1 px-3 py-4 overflow-y-auto">
          <p className="px-3 mb-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">
            Navigation
          </p>
          <ul className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <li key={item.path}>
                  <NavLink
                    to={item.path}
                    onClick={() => setSidebarOpen(false)}
                    className={`
                      flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium
                      transition-all duration-200
                      ${
                        isActive
                          ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30'
                          : 'text-slate-300 hover:bg-slate-700 hover:text-white'
                      }
                    `}
                  >
                    <Icon className="w-5 h-5 flex-shrink-0" />
                    {item.label}
                  </NavLink>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="px-5 py-4 border-t border-slate-700">
          <p className="text-xs text-slate-500">&copy; 2026 Smart Campus</p>
        </div>
      </aside>

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <header className="flex items-center justify-between px-4 sm:px-6 py-3 bg-white border-b border-slate-200 flex-shrink-0">
          <button
            className="lg:hidden p-2 rounded-lg text-slate-500 hover:bg-slate-100"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu className="w-5 h-5" />
          </button>

          <h2 className="text-sm font-medium text-slate-600 hidden sm:block">
            Smart Campus Operations Hub
          </h2>

          <div className="flex-1 lg:hidden" />

          <div className="flex items-center gap-2">
            <span className={`px-3 py-1 text-xs font-semibold rounded-full ${badgeStyle}`}>
              {moduleBadge}
            </span>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-4 sm:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default Layout;
