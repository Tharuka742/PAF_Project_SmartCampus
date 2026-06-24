import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  CalendarDays,
  CheckCircle2,
  AlertCircle,
  XCircle,
  Clock,
  TrendingUp,
  Plus,
  RefreshCw,
  ChevronRight,
  Sparkles,
  ArrowUpRight,
} from 'lucide-react';
import toast from 'react-hot-toast';
import bookingService from '../services/bookingService';

const STATUS_STYLES = {
  PENDING: 'bg-amber-100 text-amber-700 ring-amber-200',
  APPROVED: 'bg-emerald-100 text-emerald-700 ring-emerald-200',
  REJECTED: 'bg-rose-100 text-rose-700 ring-rose-200',
  CANCELLED: 'bg-slate-100 text-slate-600 ring-slate-200',
};

const STATUS_ICONS = {
  PENDING: AlertCircle,
  APPROVED: CheckCircle2,
  REJECTED: XCircle,
  CANCELLED: XCircle,
};

const STAT_META = {
  total: {
    label: 'Total Bookings',
    icon: CalendarDays,
    iconBg: 'bg-blue-50',
    iconText: 'text-blue-600',
    ring: 'ring-blue-100',
    bar: 'from-blue-500 to-indigo-500',
    glow: 'from-blue-400 to-indigo-500',
  },
  approved: {
    label: 'Approved',
    icon: CheckCircle2,
    iconBg: 'bg-emerald-50',
    iconText: 'text-emerald-600',
    ring: 'ring-emerald-100',
    bar: 'from-emerald-500 to-teal-500',
    glow: 'from-emerald-400 to-teal-500',
  },
  pending: {
    label: 'Pending',
    icon: AlertCircle,
    iconBg: 'bg-amber-50',
    iconText: 'text-amber-600',
    ring: 'ring-amber-100',
    bar: 'from-amber-500 to-orange-500',
    glow: 'from-amber-400 to-orange-500',
  },
  rejected: {
    label: 'Rejected',
    icon: XCircle,
    iconBg: 'bg-rose-50',
    iconText: 'text-rose-600',
    ring: 'ring-rose-100',
    bar: 'from-rose-500 to-pink-500',
    glow: 'from-rose-400 to-pink-500',
  },
};

const UTILIZATION_BARS = [
  'from-blue-500 to-indigo-500',
  'from-emerald-500 to-teal-500',
  'from-amber-500 to-orange-500',
  'from-violet-500 to-fuchsia-500',
  'from-rose-500 to-pink-500',
  'from-cyan-500 to-sky-500',
];

function Dashboard() {
  const navigate = useNavigate();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      setError(null);

      let response;
      try {
        response = await bookingService.getAllBookings();
      } catch (err) {
        response = await bookingService.getMyBookings();
      }

      if (response.success) {
        setBookings(response.data || []);
      }
    } catch (err) {
      console.error('Failed to fetch bookings:', err);
      setError('Failed to load bookings');
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const stats = {
    total: bookings.length,
    approved: bookings.filter((b) => b.status === 'APPROVED').length,
    pending: bookings.filter((b) => b.status === 'PENDING').length,
    rejected: bookings.filter((b) => b.status === 'REJECTED').length,
  };

  const recentBookings = [...bookings]
    .sort((a, b) => new Date(b.createdAt || b.startTime) - new Date(a.createdAt || a.startTime))
    .slice(0, 5);

  const resourceCounts = {};
  bookings.forEach((b) => {
    const type = b.resourceType || 'Unknown';
    const label = type
      .replace(/_/g, ' ')
      .replace(/\b\w/g, (c) => c.toUpperCase())
      .replace(/\B\w+/g, (w) => w.toLowerCase());
    resourceCounts[label] = (resourceCounts[label] || 0) + 1;
  });

  const resourceData = Object.entries(resourceCounts)
    .map(([name, count]) => ({
      name,
      count,
      percent: stats.total > 0 ? Math.round((count / stats.total) * 100) : 0,
    }))
    .sort((a, b) => b.count - a.count);

  const formatTime = (dateStr) => {
    if (!dateStr) return '--:--';
    const d = new Date(dateStr);
    return d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false });
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    return dateStr.split('T')[0];
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="flex flex-col items-center gap-4">
          <div className="relative">
            <div className="w-12 h-12 border-4 border-blue-100 rounded-full" />
            <div className="absolute inset-0 w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
          </div>
          <p className="text-sm font-medium text-slate-500">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="rounded-2xl border border-rose-200 bg-rose-50/50 p-8 text-center max-w-sm">
          <div className="grid h-14 w-14 mx-auto place-items-center rounded-2xl bg-white ring-4 ring-rose-100">
            <XCircle className="w-7 h-7 text-rose-500" />
          </div>
          <p className="mt-4 font-semibold text-slate-800">Something went wrong</p>
          <p className="mt-1 text-sm text-slate-500">{error}</p>
          <button
            onClick={fetchBookings}
            className="mt-5 inline-flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-md shadow-blue-900/20 transition hover:from-blue-700 hover:to-indigo-700"
          >
            <RefreshCw className="w-4 h-4" />
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* ── Page header ─────────────────────────────────────────── */}
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <div className="inline-flex items-center gap-1.5 rounded-full border border-blue-200 bg-blue-50 px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.18em] text-blue-700">
            <Sparkles className="w-3 h-3" />
            Live Overview
          </div>
          <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-900">Dashboard</h1>
          <p className="mt-1 text-sm text-slate-500">Overview of campus resource bookings</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={fetchBookings}
            className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50"
          >
            <RefreshCw className="w-4 h-4" />
            Refresh
          </button>
          <button
            onClick={() => navigate('/new-booking')}
            className="inline-flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-md shadow-blue-900/20 transition hover:from-blue-700 hover:to-indigo-700"
          >
            <Plus className="w-4 h-4" />
            New Booking
          </button>
        </div>
      </div>

      {/* ── Stat cards ──────────────────────────────────────────── */}
      <div className="mb-8 grid grid-cols-2 gap-4 lg:grid-cols-4">
        {Object.keys(STAT_META).map((key) => {
          const meta = STAT_META[key];
          const Icon = meta.icon;
          return (
            <div
              key={key}
              className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
            >
              <div
                className={`pointer-events-none absolute -right-8 -top-8 h-28 w-28 rounded-full bg-gradient-to-br ${meta.glow} opacity-[0.08] blur-2xl transition group-hover:opacity-[0.18]`}
              />
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-slate-500">
                    {meta.label}
                  </p>
                  <p className="mt-3 text-4xl font-bold tracking-tight text-slate-900">
                    {stats[key]}
                  </p>
                </div>
                <div className={`grid h-11 w-11 place-items-center rounded-xl ${meta.iconBg} ring-4 ${meta.ring}`}>
                  <Icon className={`w-5 h-5 ${meta.iconText}`} />
                </div>
              </div>
              <div className={`mt-4 h-1 w-full rounded-full bg-gradient-to-r ${meta.bar} opacity-80`} />
            </div>
          );
        })}
      </div>

      {/* ── Bottom section ──────────────────────────────────────── */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-5">
        {/* Recent Bookings */}
        <div className="lg:col-span-3 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="mb-4 flex items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <div className="grid h-9 w-9 place-items-center rounded-xl bg-slate-100 text-slate-600">
                <Clock className="w-4.5 h-4.5" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900">Recent Bookings</h3>
                <p className="text-xs text-slate-500">Last 5 activity</p>
              </div>
            </div>
            <button
              onClick={() => navigate('/my-bookings')}
              className="inline-flex items-center gap-1 text-xs font-semibold text-blue-600 hover:text-blue-700"
            >
              View all
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {recentBookings.length === 0 ? (
            <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50/50 py-12 text-center">
              <div className="grid h-12 w-12 mx-auto place-items-center rounded-2xl bg-white ring-4 ring-slate-100">
                <CalendarDays className="w-6 h-6 text-slate-300" />
              </div>
              <p className="mt-3 text-sm font-medium text-slate-600">No bookings yet</p>
              <p className="mt-1 text-xs text-slate-400">Get started by creating your first one</p>
              <button
                onClick={() => navigate('/new-booking')}
                className="mt-4 inline-flex items-center gap-1 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-4 py-2 text-xs font-semibold text-white shadow-md shadow-blue-900/20 transition hover:from-blue-700 hover:to-indigo-700"
              >
                <Plus className="w-3.5 h-3.5" />
                Create booking
              </button>
            </div>
          ) : (
            <div className="space-y-2">
              {recentBookings.map((booking) => {
                const StatusIcon = STATUS_ICONS[booking.status] || AlertCircle;
                return (
                  <div
                    key={booking.id}
                    className="group flex items-center justify-between gap-3 rounded-xl border border-transparent px-3 py-3 transition hover:border-slate-200 hover:bg-slate-50"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="grid h-10 w-10 flex-shrink-0 place-items-center rounded-xl bg-gradient-to-br from-blue-50 to-indigo-50 text-blue-600 ring-1 ring-blue-100">
                        <CalendarDays className="w-5 h-5" />
                      </div>
                      <div className="min-w-0">
                        <p className="truncate text-sm font-semibold text-slate-800">
                          {booking.resourceName || 'Resource'}
                        </p>
                        <p className="mt-0.5 flex items-center gap-1.5 text-xs text-slate-500">
                          <Clock className="w-3 h-3" />
                          {formatDate(booking.startTime)} · {formatTime(booking.startTime)}–
                          {formatTime(booking.endTime)}
                        </p>
                      </div>
                    </div>
                    <span
                      className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider ring-1 ${
                        STATUS_STYLES[booking.status] || 'bg-slate-100 text-slate-600 ring-slate-200'
                      }`}
                    >
                      <StatusIcon className="w-3 h-3" />
                      {booking.status}
                    </span>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Resource Utilization */}
        <div className="lg:col-span-2 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="mb-4 flex items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <div className="grid h-9 w-9 place-items-center rounded-xl bg-emerald-50 text-emerald-600">
                <TrendingUp className="w-4.5 h-4.5" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900">Resource Utilization</h3>
                <p className="text-xs text-slate-500">By resource type</p>
              </div>
            </div>
          </div>

          {resourceData.length === 0 ? (
            <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50/50 py-12 text-center">
              <div className="grid h-12 w-12 mx-auto place-items-center rounded-2xl bg-white ring-4 ring-slate-100">
                <TrendingUp className="w-6 h-6 text-slate-300" />
              </div>
              <p className="mt-3 text-sm font-medium text-slate-600">No data available</p>
              <p className="mt-1 text-xs text-slate-400">Make a booking to see utilization</p>
            </div>
          ) : (
            <div className="space-y-4">
              {resourceData.map((resource, idx) => {
                const bar = UTILIZATION_BARS[idx % UTILIZATION_BARS.length];
                return (
                  <div key={resource.name}>
                    <div className="mb-1.5 flex items-center justify-between gap-2">
                      <span className="flex items-center gap-2 text-sm font-medium text-slate-700">
                        <span className={`h-2 w-2 rounded-full bg-gradient-to-r ${bar}`} />
                        {resource.name}
                      </span>
                      <span className="inline-flex items-center gap-1 text-xs text-slate-500">
                        <span className="font-semibold text-slate-700">{resource.count}</span>
                        <span>booking{resource.count !== 1 ? 's' : ''}</span>
                        <span className="rounded-full bg-slate-100 px-1.5 py-0.5 text-[10px] font-bold text-slate-600">
                          {resource.percent}%
                        </span>
                      </span>
                    </div>
                    <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100">
                      <div
                        className={`h-full rounded-full bg-gradient-to-r ${bar} shadow-sm transition-all duration-700 ease-out`}
                        style={{ width: `${Math.max(resource.percent, 3)}%` }}
                      />
                    </div>
                  </div>
                );
              })}

              <div className="mt-4 flex items-center gap-2 rounded-xl border border-slate-200 bg-gradient-to-r from-slate-50 to-blue-50/40 p-3">
                <span className="grid h-7 w-7 place-items-center rounded-lg bg-white text-blue-600 ring-1 ring-slate-200">
                  <ChevronRight className="w-3.5 h-3.5" />
                </span>
                <p className="text-xs text-slate-600">
                  Tracking <span className="font-semibold text-slate-800">{resourceData.length}</span>{' '}
                  resource type{resourceData.length !== 1 ? 's' : ''} across{' '}
                  <span className="font-semibold text-slate-800">{stats.total}</span> booking
                  {stats.total !== 1 ? 's' : ''}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
