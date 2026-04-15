import { useState } from 'react';
import Sidebar from '../components/Sidebar';

const MainLayout = ({ children }) => {
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <div className="min-h-screen relative w-full bg-slate-950 text-white">
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-indigo-600/10 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-cyan-600/10 blur-[120px] pointer-events-none" />

      <div className="relative z-10 flex min-h-screen">
        <Sidebar
          isMobileOpen={isMobileOpen}
          isCollapsed={isCollapsed}
          onToggleMobile={() => setIsMobileOpen((p) => !p)}
          onToggleCollapse={() => setIsCollapsed((p) => !p)}
        />

        <main className="flex-grow min-w-0 pt-14 md:pt-0">
          {children}
        </main>
      </div>
    </div>
  );
};

export default MainLayout;
