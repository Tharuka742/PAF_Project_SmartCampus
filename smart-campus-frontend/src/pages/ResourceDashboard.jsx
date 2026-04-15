import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Activity,
  ArrowLeft,
  Building2,
  CircleCheckBig,
  Compass,
  Gauge,
  RefreshCw,
  Wrench,
  XCircle,
} from 'lucide-react';
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { getAllResources } from '../services/resourceService';
import { useRole } from '../context/RoleContext';
import { MAIN_DASHBOARD_ROUTE, RESOURCE_CATALOGUE_ROUTE } from '../config/navigation';

const COLORS = ['#22d3ee', '#6366f1', '#a78bfa', '#34d399', '#f59e0b', '#fb7185'];

function Card({ title, value, hint, icon }) {
  return (
    <div className="glass-card p-5 border border-white/10">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs uppercase tracking-wider text-slate-400">{title}</p>
          <p className="text-3xl font-black text-white mt-2">{value}</p>
          {hint ? <p className="text-sm text-slate-400 mt-2">{hint}</p> : null}
        </div>
        <div className="p-2 rounded-xl bg-white/5 text-cyan-300">{icon}</div>
      </div>
    </div>
  );
}

export default function ResourceDashboard() {
  const { role } = useRole();
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadResources = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await getAllResources(role);
      setResources(data);
    } catch (e) {
      console.error('Dashboard load failed', e);
      setError('Unable to load resource analytics. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadResources();
  }, [role]);

  const stats = useMemo(() => {
    const total = resources.length;
    const active = resources.filter((r) => (r.status || '').toLowerCase() === 'active').length;
    const maintenance = resources.filter((r) => (r.status || '').toLowerCase() === 'maintenance').length;
    const outOfService = resources.filter((r) => (r.status || '').toLowerCase() === 'out of service').length;
    const avgCapacity = total ? Math.round(resources.reduce((s, r) => s + (r.capacity || 0), 0) / total) : 0;

    const typeMap = resources.reduce((acc, r) => {
      const key = r.type || 'Other';
      acc[key] = (acc[key] || 0) + 1;
      return acc;
    }, {});

    const statusData = [
      { name: 'Active', value: active },
      { name: 'Maintenance', value: maintenance },
      { name: 'Out of Service', value: outOfService },
    ];

    const typeData = Object.entries(typeMap)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value);

    const topCapacity = [...resources]
      .sort((a, b) => (b.capacity || 0) - (a.capacity || 0))
      .slice(0, 6)
      .map((r) => ({ name: r.name, capacity: r.capacity || 0 }));

    return { total, active, maintenance, outOfService, avgCapacity, statusData, typeData, topCapacity };
  }, [resources]);

  return (
    <div className="flex-grow px-6 py-8 text-white relative overflow-hidden">
      <div className="absolute top-20 -left-24 w-[32rem] h-[32rem] rounded-full bg-cyan-700/10 blur-[140px] -z-10" />
      <div className="absolute bottom-0 -right-24 w-[28rem] h-[28rem] rounded-full bg-indigo-700/10 blur-[140px] -z-10" />

      <div className="max-w-7xl mx-auto space-y-6">
        <header className="glass-card p-6 border border-white/10">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-cyan-300">Resource Intelligence</p>
              <h1 className="text-4xl md:text-5xl font-black mt-2 bg-gradient-to-r from-cyan-400 via-sky-300 to-indigo-400 text-transparent bg-clip-text">
                Resource Dashboard
              </h1>
              <p className="text-slate-300 mt-3 max-w-2xl">
                Live overview of campus facilities and assets, designed for quick decisions and user-friendly monitoring.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <span className="px-3 py-2 rounded-xl bg-slate-900/80 border border-white/10 text-sm text-slate-200">
                Current role: <strong className="uppercase">{role}</strong>
              </span>
              <button
                type="button"
                onClick={loadResources}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-900/80 border border-white/10 text-slate-200 hover:bg-slate-800 transition-colors"
              >
                <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
                Refresh
              </button>
              <Link
                to={RESOURCE_CATALOGUE_ROUTE}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-500 text-white font-semibold hover:opacity-90"
              >
                <Compass size={16} />
                Open Catalogue
              </Link>
              <Link
                to={MAIN_DASHBOARD_ROUTE}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-900/80 border border-white/10 text-slate-200 hover:bg-slate-800"
              >
                <ArrowLeft size={16} />
                Back to Main Dashboard
              </Link>
            </div>
          </div>
          {error ? <p className="mt-4 text-rose-300 text-sm">{error}</p> : null}
        </header>

        <section className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
          <Card title="Total Resources" value={stats.total} hint="All registered facilities/assets" icon={<Building2 size={18} />} />
          <Card title="Active" value={stats.active} hint="Ready for utilization" icon={<CircleCheckBig size={18} />} />
          <Card title="Maintenance" value={stats.maintenance} hint="Temporarily limited" icon={<Wrench size={18} />} />
          <Card title="Avg Capacity" value={stats.avgCapacity} hint="Average seats/persons" icon={<Gauge size={18} />} />
        </section>

        <section className="grid grid-cols-1 xl:grid-cols-3 gap-4">
          <div className="glass-card p-5 xl:col-span-2 border border-white/10">
            <h2 className="text-xl font-bold">Top Resources by Capacity</h2>
            <p className="text-sm text-slate-400 mb-4">High-impact spaces at a glance</p>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={stats.topCapacity}>
                  <XAxis dataKey="name" tick={{ fill: '#94a3b8', fontSize: 11 }} interval={0} angle={-15} height={50} />
                  <YAxis tick={{ fill: '#94a3b8', fontSize: 11 }} />
                  <Tooltip />
                  <Bar dataKey="capacity" radius={[8, 8, 0, 0]}>
                    {stats.topCapacity.map((_, idx) => (
                      <Cell key={`cap-${idx}`} fill={COLORS[idx % COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="glass-card p-5 border border-white/10">
            <h2 className="text-xl font-bold">Resource Health</h2>
            <p className="text-sm text-slate-400 mb-4">Operational status distribution</p>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={stats.statusData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={95} label>
                    {stats.statusData.map((_, idx) => (
                      <Cell key={`status-${idx}`} fill={COLORS[idx]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </section>

        <section className="grid grid-cols-1 xl:grid-cols-3 gap-4">
          <div className="glass-card p-5 xl:col-span-2 border border-white/10">
            <h2 className="text-xl font-bold">Resources by Type</h2>
            <p className="text-sm text-slate-400 mb-4">Category distribution for planning</p>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={stats.typeData}>
                  <XAxis dataKey="name" tick={{ fill: '#94a3b8', fontSize: 11 }} />
                  <YAxis tick={{ fill: '#94a3b8', fontSize: 11 }} />
                  <Tooltip />
                  <Area type="monotone" dataKey="value" stroke="#22d3ee" fill="#22d3ee33" strokeWidth={2} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="glass-card p-5 border border-white/10">
            <h2 className="text-xl font-bold">Quick Insights</h2>
            <div className="space-y-3 mt-4 text-sm">
              <div className="p-3 rounded-xl bg-white/5 border border-white/10 flex items-center gap-3">
                <Activity size={16} className="text-emerald-300" />
                <span>{stats.active} resources are active and available now.</span>
              </div>
              <div className="p-3 rounded-xl bg-white/5 border border-white/10 flex items-center gap-3">
                <Wrench size={16} className="text-amber-300" />
                <span>{stats.maintenance} resources need maintenance follow-up.</span>
              </div>
              <div className="p-3 rounded-xl bg-white/5 border border-white/10 flex items-center gap-3">
                <XCircle size={16} className="text-rose-300" />
                <span>{stats.outOfService} resources are currently out of service.</span>
              </div>
            </div>
            <Link
              to={RESOURCE_CATALOGUE_ROUTE}
              className="mt-6 inline-flex w-full justify-center items-center gap-2 px-4 py-2 rounded-xl bg-indigo-500/20 border border-indigo-400/30 text-indigo-200 hover:bg-indigo-500/30 transition-colors"
            >
              Manage Resources
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}
