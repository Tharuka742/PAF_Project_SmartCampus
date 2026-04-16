import { useState } from 'react';
import Sidebar from '../components/Sidebar';

const MainLayout = ({ children }) => {
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <div className="relative min-h-[100dvh] w-full overflow-x-hidden bg-transparent text-slate-900">
      <div className="pointer-events-none fixed inset-0 -z-10 bg-[linear-gradient(180deg,rgba(255,255,255,1)_0%,rgba(248,250,252,1)_55%,rgba(241,245,249,1)_100%)]" />
      <div className="pointer-events-none fixed top-[-10%] left-[-10%] -z-10 h-[40%] w-[40%] rounded-full bg-indigo-200/18 blur-[120px]" />
      <div className="pointer-events-none fixed right-[-10%] bottom-[-10%] -z-10 h-[40%] w-[40%] rounded-full bg-cyan-200/16 blur-[120px]" />

      <div className="relative z-10 flex min-h-[100dvh] w-full items-stretch">
        <Sidebar
          isMobileOpen={isMobileOpen}
          isCollapsed={isCollapsed}
          onToggleMobile={() => setIsMobileOpen((p) => !p)}
          onToggleCollapse={() => setIsCollapsed((p) => !p)}
        />

        <div className="hidden self-stretch bg-slate-200 md:block md:w-px" />

        <main className="flex min-h-[100dvh] flex-1 min-w-0 bg-transparent pt-14 md:min-h-full md:pt-0">
          {children}
        </main>
      </div>
    </div>
  );
};

export default MainLayout;