import { useEffect, useMemo, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import {
  Activity,
  ArrowLeft,
  Building2,
  CalendarClock,
  CircleCheckBig,
  Compass,
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
import {
  MAIN_DASHBOARD_ROUTE,
  RESOURCE_CATALOGUE_ROUTE,
} from '../config/navigation';

const CHART_COLORS = ['#22d3ee', '#6366f1', '#a78bfa', '#34d399', '#f59e0b', '#fb7185'];

const STATUS_THEME = {
  active: {
    label: 'active',
    iconWrap: 'bg-cyan-500/10 text-cyan-300',
  },
  maintenance: {
    label: 'pending review',
    iconWrap: 'bg-amber-500/10 text-amber-300',
  },
  outOfService: {
    label: 'need attention',
    iconWrap: 'bg-rose-500/10 text-rose-300',
  },
  total: {
    label: 'overview',
    iconWrap: 'bg-cyan-500/10 text-cyan-300',
  },
};

function normalizeStatus(status) {
  const value = String(status || '').trim().toLowerCase();

  if (
    value === 'active' ||
    value === 'available' ||
    value === 'operational' ||
    value === 'in use'
  ) {
    return 'active';
  }

  if (
    value === 'maintenance' ||
    value === 'under maintenance' ||
    value === 'pending maintenance'
  ) {
    return 'maintenance';
  }

  if (
    value === 'out of service' ||
    value === 'out-of-service' ||
    value === 'unavailable' ||
    value === 'inactive' ||
    value === 'disabled'
  ) {
    return 'outOfService';
  }

  return 'unknown';
}

function StatCard({ title, value, subtitle, badgeText, icon, iconWrapClass = '' }) {
  return (
    <div className="glass-card relative overflow-hidden rounded-3xl p-5">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(34,211,238,0.08),transparent_40%)]" />

      <div className="relative flex items-start justify-between gap-4">
        <div className={`rounded-2xl p-3 ${iconWrapClass}`}>
          {icon}
        </div>

        {badgeText ? (
          <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-medium tracking-wide text-slate-200">
            {badgeText}
          </span>
        ) : null}
      </div>

      <div className="relative mt-6">
        <h3 className="text-5xl font-black leading-none text-cyan-300">{value}</h3>
        <p className="mt-3 text-2xl font-semibold text-slate-100">{title}</p>
        {subtitle ? <p className="mt-2 text-sm text-slate-400">{subtitle}</p> : null}
      </div>
    </div>
  );
}

function CustomTooltip({ active, payload, label }) {
  if (!active || !payload || !payload.length) return null;

  return (
    <div className="rounded-2xl border border-white/10 bg-slate-950/90 px-4 py-3 shadow-xl">
      {label ? <p className="mb-1 text-sm font-semibold text-white">{label}</p> : null}
      {payload.map((entry, index) => (
        <p key={index} className="text-sm text-slate-300">
          {entry.name}: <span className="font-semibold text-white">{entry.value}</span>
        </p>
      ))}
    </div>
  );
}

export default function ResourceDashboard() {
  const { role } = useRole();
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadResources = useCallback(async () => {
    setLoading(true);
    setError('');

    try {
      const response = await getAllResources(role);
      const safeData = Array.isArray(response)
        ? response
        : Array.isArray(response?.data)
        ? response.data
        : [];

      setResources(safeData);
    } catch (err) {
      console.error('Dashboard load failed:', err);
      setResources([]);
      setError('Unable to load resource analytics. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [role]);

  useEffect(() => {
    loadResources();
  }, [loadResources]);

  const stats = useMemo(() => {
    const safeResources = Array.isArray(resources) ? resources : [];

    const total = safeResources.length;
    let active = 0;
    let maintenance = 0;
    let outOfService = 0;

    const typeMap = {};

    safeResources.forEach((resource) => {
      const status = normalizeStatus(resource?.status);
      const type = resource?.type?.trim() || 'Other';

      if (status === 'active') active += 1;
      if (status === 'maintenance') maintenance += 1;
      if (status === 'outOfService') outOfService += 1;

      typeMap[type] = (typeMap[type] || 0) + 1;
    });

    const statusData = [
      { name: 'Active', value: active },
      { name: 'Maintenance', value: maintenance },
      { name: 'Out of Service', value: outOfService },
    ].filter((item) => item.value > 0);

    const typeData = Object.entries(typeMap)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value);

    const topCapacity = [...safeResources]
      .sort((a, b) => (Number(b?.capacity) || 0) - (Number(a?.capacity) || 0))
      .slice(0, 6)
      .map((resource) => ({
        name: resource?.name || 'Unnamed',
        capacity: Number(resource?.capacity) || 0,
      }));

    return {
      total,
      active,
      maintenance,
      outOfService,
      statusData,
      typeData,
      topCapacity,
    };
  }, [resources]);

  return (
    <div className="relative w-full min-h-full px-6 py-8 text-white">
      <div className="pointer-events-none absolute top-20 -left-24 h-[32rem] w-[32rem] rounded-full bg-cyan-700/10 blur-[140px]" />
      <div className="pointer-events-none absolute right-[-6rem] bottom-[-4rem] h-[30rem] w-[30rem] rounded-full bg-indigo-700/10 blur-[150px]" />

      <div className="relative mx-auto max-w-7xl space-y-6 pb-12">
        <header className="glass-card rounded-3xl p-6">
          <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-center">
            <div>
              <p className="text-xs uppercase tracking-[0.25em] text-cyan-300">
                Resource Intelligence
              </p>

              <h1 className="mt-2 bg-gradient-to-r from-cyan-400 via-sky-300 to-indigo-400 bg-clip-text text-4xl font-black text-transparent md:text-5xl">
                Resource Dashboard
              </h1>

              <p className="mt-3 max-w-2xl text-slate-300">
                Live overview of campus facilities and assets, designed for quick decisions and
                user-friendly monitoring.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <span className="rounded-xl border border-white/10 bg-slate-900/80 px-3 py-2 text-sm text-slate-200">
                Current role: <strong className="uppercase">{role}</strong>
              </span>

              <button
                type="button"
                onClick={loadResources}
                className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-slate-900/80 px-4 py-2 text-slate-200 transition-colors hover:bg-slate-800"
              >
                <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
                Refresh
              </button>

              <Link
                to={RESOURCE_CATALOGUE_ROUTE}
                className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-500 px-4 py-2 font-semibold text-white hover:opacity-90"
              >
                <Compass size={16} />
                Open Catalogue
              </Link>

              <Link
                to={MAIN_DASHBOARD_ROUTE}
                className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-slate-900/80 px-4 py-2 text-slate-200 hover:bg-slate-800"
              >
                <ArrowLeft size={16} />
                Back to Main Dashboard
              </Link>
            </div>
          </div>

          {error ? <p className="mt-4 text-sm text-rose-300">{error}</p> : null}
        </header>

        <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard
            title="Total Resources"
            value={stats.total}
            subtitle="All registered facilities/assets"
            badgeText={STATUS_THEME.total.label}
            icon={<Building2 size={20} />}
            iconWrapClass={STATUS_THEME.total.iconWrap}
          />

          <StatCard
            title="Active Facilities"
            value={stats.active}
            subtitle="Ready for utilization"
            badgeText={STATUS_THEME.active.label}
            icon={<CircleCheckBig size={20} />}
            iconWrapClass={STATUS_THEME.active.iconWrap}
          />

          <StatCard
            title="Under Maintenance"
            value={stats.maintenance}
            subtitle="Temporarily limited"
            badgeText={STATUS_THEME.maintenance.label}
            icon={<Wrench size={20} />}
            iconWrapClass={STATUS_THEME.maintenance.iconWrap}
          />

          <StatCard
            title="Out of Service"
            value={stats.outOfService}
            subtitle="Currently unavailable"
            badgeText={STATUS_THEME.outOfService.label}
            icon={<XCircle size={20} />}
            iconWrapClass={STATUS_THEME.outOfService.iconWrap}
          />
        </section>

        <section className="grid grid-cols-1 gap-4 xl:grid-cols-3">
          <div className="glass-card rounded-3xl p-5 xl:col-span-2">
            <h2 className="text-xl font-bold">Top Resources by Capacity</h2>
            <p className="mb-4 text-sm text-slate-400">High-impact spaces at a glance</p>

            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={stats.topCapacity}>
                  <XAxis
                    dataKey="name"
                    tick={{ fill: '#94a3b8', fontSize: 11 }}
                    interval={0}
                    angle={-12}
                    height={50}
                  />
                  <YAxis tick={{ fill: '#94a3b8', fontSize: 11 }} />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="capacity" radius={[10, 10, 0, 0]}>
                    {stats.topCapacity.map((_, index) => (
                      <Cell
                        key={`capacity-${index}`}
                        fill={CHART_COLORS[index % CHART_COLORS.length]}
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="glass-card rounded-3xl p-5">
            <h2 className="text-xl font-bold">Resource Health</h2>
            <p className="mb-4 text-sm text-slate-400">Operational status distribution</p>

            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={stats.statusData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={95}
                    label
                  >
                    {stats.statusData.map((_, index) => (
                      <Cell
                        key={`status-${index}`}
                        fill={CHART_COLORS[index % CHART_COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </section>

        <section className="grid grid-cols-1 gap-4 xl:grid-cols-3">
          <div className="glass-card rounded-3xl p-5 xl:col-span-2">
            <h2 className="text-xl font-bold">Resources by Type</h2>
            <p className="mb-4 text-sm text-slate-400">Category distribution for planning</p>

            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={stats.typeData}>
                  <XAxis dataKey="name" tick={{ fill: '#94a3b8', fontSize: 11 }} />
                  <YAxis tick={{ fill: '#94a3b8', fontSize: 11 }} />
                  <Tooltip content={<CustomTooltip />} />
                  <Area
                    type="monotone"
                    dataKey="value"
                    stroke="#22d3ee"
                    fill="#22d3ee33"
                    strokeWidth={2}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="glass-card rounded-3xl p-5">
            <h2 className="text-xl font-bold">Quick Insights</h2>

            <div className="mt-4 space-y-3 text-sm">
              <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 p-3">
                <Activity size={16} className="text-emerald-300" />
                <span>{stats.active} resources are active and available now.</span>
              </div>

              <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 p-3">
                <CalendarClock size={16} className="text-amber-300" />
                <span>{stats.maintenance} resources are under maintenance review.</span>
              </div>

              <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 p-3">
                <XCircle size={16} className="text-rose-300" />
                <span>{stats.outOfService} resources are currently out of service.</span>
              </div>
            </div>

            <Link
              to={RESOURCE_CATALOGUE_ROUTE}
              className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-xl border border-indigo-400/30 bg-indigo-500/20 px-4 py-2 text-indigo-200 transition-colors hover:bg-indigo-500/30"
            >
              Manage Resources
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}