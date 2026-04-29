import { Link } from 'react-router-dom';
import { MapPin, ArrowRight } from 'lucide-react';
import { RESOURCE_DASHBOARD_ROUTE } from '../config/navigation';

export default function NotFoundPage() {
  return (
    <div className="flex-grow flex flex-col items-center justify-center p-8 text-center relative overflow-hidden">
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-indigo-700/20 blur-[120px]" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full bg-cyan-700/15 blur-[100px]" />
      </div>

      <div className="animate-in fade-in zoom-in duration-700">
        <div className="text-[10rem] md:text-[14rem] font-black leading-none tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-white/20 to-white/5 select-none mb-4">
          404
        </div>

        <div className="glass-card p-10 max-w-lg mx-auto -mt-12 relative">
          <div className="w-16 h-16 rounded-2xl bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center mx-auto mb-6">
            <MapPin size={32} className="text-cyan-400" />
          </div>

          <h1 className="text-3xl font-black text-white mb-3">Page Not Found</h1>
          <p className="text-slate-400 leading-relaxed mb-8">
            The requested page is unavailable. Continue from the resource dashboard.
          </p>

          <Link
            to={RESOURCE_DASHBOARD_ROUTE}
            className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-500 text-white font-bold hover:from-cyan-400 hover:to-indigo-400 transition-all hover:-translate-y-1 shadow-[0_0_20px_rgba(6,182,212,0.3)]"
          >
            Go to Resource Dashboard <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </div>
  );
}
