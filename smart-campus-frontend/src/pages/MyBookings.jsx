import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  CalendarDays,
  Clock,
  FileText,
  Users,
  XCircle,
  Loader2,
  Plus,
  AlertTriangle,
  CheckCircle2,
  AlertCircle,
  Ban,
  Sparkles,
  Filter,
  CalendarCheck,
} from 'lucide-react';
import toast from 'react-hot-toast';
import bookingService from '../services/bookingService';

const STATUS_CONFIG = {
  PENDING: {
    bg: 'bg-amber-100',
    text: 'text-amber-700',
    border: 'border-amber-200',
    cardBorder: 'border-l-amber-400',
    gradient: 'from-amber-500 to-orange-500',
    soft: 'bg-amber-50',
    icon: AlertCircle,
    iconText: 'text-amber-600',
  },
  APPROVED: {
    bg: 'bg-emerald-100',
    text: 'text-emerald-700',
    border: 'border-emerald-200',
    cardBorder: 'border-l-emerald-400',
    gradient: 'from-emerald-500 to-teal-500',
    soft: 'bg-emerald-50',
    icon: CheckCircle2,
    iconText: 'text-emerald-600',
  },
  REJECTED: {
    bg: 'bg-rose-100',
    text: 'text-rose-700',
    border: 'border-rose-200',
    cardBorder: 'border-l-rose-400',
    gradient: 'from-rose-500 to-pink-500',
    soft: 'bg-rose-50',
    icon: XCircle,
    iconText: 'text-rose-600',
  },
  CANCELLED: {
    bg: 'bg-slate-100',
    text: 'text-slate-600',
    border: 'border-slate-200',
    cardBorder: 'border-l-slate-400',
    gradient: 'from-slate-500 to-slate-600',
    soft: 'bg-slate-50',
    icon: Ban,
    iconText: 'text-slate-500',
  },
};

function MyBookings() {
  const navigate = useNavigate();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [showCancelModal, setShowCancelModal] = useState(false);
  const [cancelBookingId, setCancelBookingId] = useState(null);
  const [cancelReason, setCancelReason] = useState('');
  const [cancelling, setCancelling] = useState(false);

  const [statusFilter, setStatusFilter] = useState('ALL');

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await bookingService.getMyBookings();
      if (response.success) {
        setBookings(response.data || []);
      }
    } catch (err) {
      console.error('Failed to fetch bookings:', err);
      setError('Failed to load your bookings');
      toast.error('Failed to load bookings');
    } finally {
      setLoading(false);
    }
  };

  const openCancelModal = (bookingId) => {
    setCancelBookingId(bookingId);
    setCancelReason('');
    setShowCancelModal(true);
  };

  const handleCancel = async () => {
    if (!cancelBookingId) return;

    setCancelling(true);
    try {
      const response = await bookingService.cancelBooking(
        cancelBookingId,
        cancelReason || null
      );
      if (response.success) {
        toast.success('Booking cancelled successfully');
        setShowCancelModal(false);
        setBookings((prev) =>
          prev.map((b) =>
            b.id === cancelBookingId
              ? { ...b, status: 'CANCELLED', decisionReason: cancelReason }
              : b
          )
        );
      }
    } catch (err) {
      console.error('Cancel failed:', err);
      const msg = err.response?.data?.message || 'Failed to cancel booking';
      toast.error(msg);
    } finally {
      setCancelling(false);
    }
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    return dateStr.split('T')[0];
  };

  const formatTime = (dateStr) => {
    if (!dateStr) return '--:--';
    const d = new Date(dateStr);
    return d.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    });
  };

  const filteredBookings =
    statusFilter === 'ALL'
      ? bookings
      : bookings.filter((b) => b.status === statusFilter);

  const sortedBookings = [...filteredBookings].sort((a, b) => {
    if (a.status === 'PENDING' && b.status !== 'PENDING') return -1;
    if (b.status === 'PENDING' && a.status !== 'PENDING') return 1;
    return new Date(b.startTime) - new Date(a.startTime);
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="flex flex-col items-center gap-4">
          <div className="relative">
            <div className="w-12 h-12 border-4 border-blue-100 rounded-full" />
            <div className="absolute inset-0 w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
          </div>
          <p className="text-sm font-medium text-slate-500">Loading your bookings...</p>
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
            My Activity
          </div>
          <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-900">My Bookings</h1>
          <p className="mt-1 text-sm text-slate-500">View and track your booking requests</p>
        </div>
        <button
          onClick={() => navigate('/new-booking')}
          className="inline-flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-md shadow-blue-900/20 transition hover:from-blue-700 hover:to-indigo-700"
        >
          <Plus className="w-4 h-4" />
          New Booking
        </button>
      </div>

      {/* ── Filter tabs ─────────────────────────────────────────── */}
      <div className="mb-6 rounded-2xl border border-slate-200 bg-white p-3 shadow-sm">
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-1.5 px-2 text-xs font-semibold text-slate-500">
            <Filter className="w-3.5 h-3.5" />
            Filter
          </div>
          {['ALL', 'PENDING', 'APPROVED', 'REJECTED', 'CANCELLED'].map((status) => {
            const count =
              status === 'ALL'
                ? bookings.length
                : bookings.filter((b) => b.status === status).length;
            const isActive = statusFilter === status;
            const style = status !== 'ALL' ? STATUS_CONFIG[status] : null;
            const Icon = style?.icon;
            return (
              <button
                key={status}
                onClick={() => setStatusFilter(status)}
                className={`inline-flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-semibold transition ${
                  isActive
                    ? status === 'ALL'
                      ? 'bg-gradient-to-r from-slate-800 to-slate-900 text-white shadow-md'
                      : `bg-gradient-to-r ${style.gradient} text-white shadow-md`
                    : 'bg-slate-50 text-slate-600 hover:bg-slate-100'
                }`}
              >
                {Icon && <Icon className="w-3 h-3" />}
                {status === 'ALL' ? 'All' : status.charAt(0) + status.slice(1).toLowerCase()}
                <span
                  className={`rounded-full px-1.5 py-0.5 text-[10px] font-bold ${
                    isActive ? 'bg-white/20 text-white' : 'bg-white text-slate-600 ring-1 ring-slate-200'
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* ── Empty state ─────────────────────────────────────────── */}
      {sortedBookings.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-200 bg-white py-16 text-center shadow-sm">
          <div className="grid h-16 w-16 mx-auto place-items-center rounded-2xl bg-gradient-to-br from-blue-50 to-indigo-50 ring-4 ring-blue-50">
            <CalendarDays className="w-8 h-8 text-blue-400" />
          </div>
          <h3 className="mt-4 text-lg font-bold text-slate-800">
            {statusFilter === 'ALL' ? 'No bookings yet' : `No ${statusFilter.toLowerCase()} bookings`}
          </h3>
          <p className="mt-1 text-sm text-slate-500">
            {statusFilter === 'ALL'
              ? 'Create your first booking to get started!'
              : 'Try changing the filter above.'}
          </p>
          {statusFilter === 'ALL' && (
            <button
              onClick={() => navigate('/new-booking')}
              className="mt-5 inline-flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-5 py-2.5 text-sm font-semibold text-white shadow-md shadow-blue-900/20 transition hover:from-blue-700 hover:to-indigo-700"
            >
              <Plus className="w-4 h-4" />
              Create First Booking
            </button>
          )}
        </div>
      ) : (
        /* ── Booking cards grid ───────────────────────────────── */
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
          {sortedBookings.map((booking) => {
            const config = STATUS_CONFIG[booking.status] || STATUS_CONFIG.CANCELLED;
            const StatusIcon = config.icon;
            const canCancel =
              booking.status === 'PENDING' || booking.status === 'APPROVED';

            return (
              <div
                key={booking.id}
                className={`group relative overflow-hidden rounded-2xl border border-slate-200 border-l-4 ${config.cardBorder} bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-lg`}
              >
                <div
                  className={`pointer-events-none absolute -right-8 -top-8 h-24 w-24 rounded-full bg-gradient-to-br ${config.gradient} opacity-[0.06] blur-2xl transition group-hover:opacity-[0.14]`}
                />

                {/* Top row */}
                <div className="mb-3 flex items-start justify-between gap-3">
                  <div className="flex min-w-0 items-start gap-3">
                    <div className={`grid h-10 w-10 flex-shrink-0 place-items-center rounded-xl ${config.soft} ring-1 ring-slate-200`}>
                      <CalendarCheck className={`w-5 h-5 ${config.iconText}`} />
                    </div>
                    <div className="min-w-0">
                      <h3 className="truncate text-sm font-bold leading-tight text-slate-900">
                        {booking.resourceName || 'Resource'}
                      </h3>
                      <p className="mt-0.5 text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                        Booking #{String(booking.id).slice(0, 8)}
                      </p>
                    </div>
                  </div>
                  <span
                    className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider ${config.bg} ${config.text} ring-1 ${config.border}`}
                  >
                    <StatusIcon className="w-3 h-3" />
                    {booking.status}
                  </span>
                </div>

                {/* Details */}
                <div className="space-y-2 text-sm text-slate-600">
                  <div className="flex items-center gap-2">
                    <CalendarDays className="w-3.5 h-3.5 flex-shrink-0 text-slate-400" />
                    <span>{formatDate(booking.startTime)}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-3.5 h-3.5 flex-shrink-0 text-slate-400" />
                    <span>
                      {formatTime(booking.startTime)} – {formatTime(booking.endTime)}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <FileText className="w-3.5 h-3.5 flex-shrink-0 text-slate-400" />
                    <span className="truncate">{booking.purpose}</span>
                  </div>
                  {booking.expectedAttendees && (
                    <div className="flex items-center gap-2">
                      <Users className="w-3.5 h-3.5 flex-shrink-0 text-slate-400" />
                      <span>{booking.expectedAttendees} attendees</span>
                    </div>
                  )}
                </div>

                {/* Decision reason */}
                {booking.decisionReason &&
                  (booking.status === 'REJECTED' || booking.status === 'CANCELLED') && (
                    <div className="mt-3 rounded-xl border border-rose-100 bg-rose-50/70 px-3 py-2">
                      <p className="text-[10px] font-bold uppercase tracking-wider text-rose-500">
                        Reason
                      </p>
                      <p className="mt-0.5 text-xs text-rose-700">{booking.decisionReason}</p>
                    </div>
                  )}

                {/* Cancel button */}
                {canCancel && (
                  <button
                    onClick={() => openCancelModal(booking.id)}
                    className="mt-4 flex w-full items-center justify-center gap-1.5 rounded-xl border border-slate-200 bg-white py-2 text-sm font-semibold text-slate-600 transition hover:border-rose-200 hover:bg-rose-50 hover:text-rose-600"
                  >
                    <XCircle className="w-3.5 h-3.5" />
                    Cancel Booking
                  </button>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* ── Cancel modal ────────────────────────────────────────── */}
      {showCancelModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-sm"
          onClick={() => !cancelling && setShowCancelModal(false)}
        >
          <div
            className="w-full max-w-md overflow-hidden rounded-3xl bg-white shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative bg-gradient-to-r from-rose-500 to-pink-500 px-6 py-5 text-white">
              <div className="pointer-events-none absolute -right-8 -top-8 h-28 w-28 rounded-full bg-white/15 blur-2xl" />
              <div className="relative flex items-center gap-3">
                <div className="grid h-11 w-11 place-items-center rounded-xl bg-white/15 backdrop-blur ring-1 ring-white/25">
                  <AlertTriangle className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold">Cancel Booking</h3>
                  <p className="text-xs text-rose-100">This action cannot be undone</p>
                </div>
              </div>
            </div>

            <div className="p-6">
              <label className="mb-1.5 block text-sm font-semibold text-slate-700">
                Reason for cancellation <span className="text-slate-400">(optional)</span>
              </label>
              <textarea
                rows={3}
                value={cancelReason}
                onChange={(e) => setCancelReason(e.target.value)}
                placeholder="e.g. Schedule changed, no longer needed"
                className="w-full resize-none rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none transition hover:border-rose-200 focus:border-rose-400 focus:ring-4 focus:ring-rose-100"
              />

              <div className="mt-5 flex gap-3">
                <button
                  onClick={() => setShowCancelModal(false)}
                  disabled={cancelling}
                  className="flex-1 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:opacity-50"
                >
                  Keep Booking
                </button>
                <button
                  onClick={handleCancel}
                  disabled={cancelling}
                  className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-rose-500 to-pink-500 px-4 py-2.5 text-sm font-semibold text-white shadow-md shadow-rose-900/20 transition hover:from-rose-600 hover:to-pink-600 disabled:opacity-50"
                >
                  {cancelling ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Cancelling...
                    </>
                  ) : (
                    <>
                      <XCircle className="w-4 h-4" />
                      Yes, Cancel
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default MyBookings;
