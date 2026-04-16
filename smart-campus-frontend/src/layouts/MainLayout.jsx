import { useState } from 'react';
import Sidebar from '../components/Sidebar';

const MainLayout = ({ children }) => {
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <div className="relative min-h-[100dvh] w-full overflow-x-hidden bg-slate-950 text-white">
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(2,6,23,0.96)_0%,rgba(2,11,35,0.94)_55%,rgba(2,6,23,0.98)_100%)]" />
      <div className="pointer-events-none absolute top-[-10%] left-[-10%] h-[40%] w-[40%] rounded-full bg-indigo-600/10 blur-[120px]" />
      <div className="pointer-events-none absolute right-[-10%] bottom-[-10%] h-[40%] w-[40%] rounded-full bg-cyan-600/10 blur-[120px]" />

      <div className="relative z-10 flex min-h-[100dvh] w-full items-stretch">
        <Sidebar
          isMobileOpen={isMobileOpen}
          isCollapsed={isCollapsed}
          onToggleMobile={() => setIsMobileOpen((p) => !p)}
          onToggleCollapse={() => setIsCollapsed((p) => !p)}
        />

        <div className="hidden self-stretch bg-white/10 md:block md:w-px" />

        <main className="flex min-h-[100dvh] flex-1 min-w-0 bg-transparent pt-14 md:min-h-full md:pt-0">
          {children}
        </main>
      </div>
    </div>
  );
};

export default MainLayout;