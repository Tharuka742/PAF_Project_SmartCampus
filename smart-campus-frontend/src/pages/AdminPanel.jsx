import { useState, useEffect } from 'react';
import {
  ShieldCheck,
  Filter,
  CheckCircle2,
  XCircle,
  CalendarDays,
  Clock,
  FileText,
  Users,
  UserCircle,
  Loader2,
  AlertTriangle,
  Ban,
  Sparkles,
  Search,
  RefreshCw,
  CalendarCheck,
  AlertCircle,
} from 'lucide-react';
import toast from 'react-hot-toast';
import bookingService from '../services/bookingService';

const STATUS_CONFIG = {
  PENDING: {
    bg: 'bg-amber-100',
    text: 'text-amber-700',
    border: 'border-amber-200',
    gradient: 'from-amber-500 to-orange-500',
    soft: 'bg-amber-50',
    iconText: 'text-amber-600',
    icon: AlertCircle,
  },
  APPROVED: {
    bg: 'bg-emerald-100',
    text: 'text-emerald-700',
    border: 'border-emerald-200',
    gradient: 'from-emerald-500 to-teal-500',
    soft: 'bg-emerald-50',
    iconText: 'text-emerald-600',
    icon: CheckCircle2,
  },
  REJECTED: {
    bg: 'bg-rose-100',
    text: 'text-rose-700',
    border: 'border-rose-200',
    gradient: 'from-rose-500 to-pink-500',
    soft: 'bg-rose-50',
    iconText: 'text-rose-600',
    icon: XCircle,
  },
  CANCELLED: {
    bg: 'bg-slate-100',
    text: 'text-slate-600',
    border: 'border-slate-200',
    gradient: 'from-slate-500 to-slate-600',
    soft: 'bg-slate-50',
    iconText: 'text-slate-500',
    icon: Ban,
  },
};

function AdminPanel() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [accessDenied, setAccessDenied] = useState(false);

  const [statusFilter, setStatusFilter] = useState('');
  const [resourceFilter, setResourceFilter] = useState('');
  const [dateFilter, setDateFilter] = useState('');

  const [showApproveModal, setShowApproveModal] = useState(false);
  const [approveBookingId, setApproveBookingId] = useState(null);
  const [approving, setApproving] = useState(false);

  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectBookingId, setRejectBookingId] = useState(null);
  const [rejectReason, setRejectReason] = useState('');
  const [rejecting, setRejecting] = useState(false);

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      setError(null);
      setAccessDenied(false);
      const response = await bookingService.getAllBookings();
      if (response.success) {
        setBookings(response.data || []);
      }
    } catch (err) {
      console.error('Failed to fetch bookings:', err);
      if (err.response?.status === 403) {
        setAccessDenied(true);
      } else {
        setError('Failed to load bookings');
        toast.error('Failed to load admin data');
      }
    } finally {
      setLoading(false);
    }
  };

  const openApproveModal = (bookingId) => {
    setApproveBookingId(bookingId);
    setShowApproveModal(true);
  };

  const handleApprove = async () => {
    if (!approveBookingId) return;
    setApproving(true);
    try {
      const response = await bookingService.approveBooking(approveBookingId);
      if (response.success) {
        toast.success('Booking approved successfully');
        setShowApproveModal(false);
        setBookings((prev) =>
          prev.map((b) =>
            b.id === approveBookingId ? { ...b, status: 'APPROVED' } : b
          )
        );
      }
    } catch (err) {
      console.error('Approve failed:', err);
      const msg = err.response?.data?.message || 'Failed to approve booking';
      toast.error(msg);
    } finally {
      setApproving(false);
    }
  };

  const openRejectModal = (bookingId) => {
    setRejectBookingId(bookingId);
    setRejectReason('');
    setShowRejectModal(true);
  };

  const handleReject = async () => {
    if (!rejectBookingId) return;
    if (!rejectReason.trim()) {
      toast.error('A reason is required when rejecting');
      return;
    }
    setRejecting(true);
    try {
      const response = await bookingService.rejectBooking(
        rejectBookingId,
        rejectReason.trim()
      );
      if (response.success) {
        toast.success('Booking rejected');
        setShowRejectModal(false);
        setBookings((prev) =>
          prev.map((b) =>
            b.id === rejectBookingId
              ? { ...b, status: 'REJECTED', decisionReason: rejectReason.trim() }
              : b
          )
        );
      }
    } catch (err) {
      console.error('Reject failed:', err);
      const msg = err.response?.data?.message || 'Failed to reject booking';
      toast.error(msg);
    } finally {
      setRejecting(false);
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

  const resourceNames = [...new Set(bookings.map((b) => b.resourceName).filter(Boolean))].sort();

  const filteredBookings = bookings.filter((b) => {
    if (statusFilter && b.status !== statusFilter) return false;
    if (resourceFilter && b.resourceName !== resourceFilter) return false;
    if (dateFilter) {
      const bookingDate = formatDate(b.startTime);
      if (bookingDate !== dateFilter) return false;
    }
    return true;
  });

  const sortedBookings = [...filteredBookings].sort((a, b) => {
    if (a.status === 'PENDING' && b.status !== 'PENDING') return -1;
    if (b.status === 'PENDING' && a.status !== 'PENDING') return 1;
    return new Date(b.startTime) - new Date(a.startTime);
  });

  if (accessDenied) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="rounded-2xl border border-rose-200 bg-rose-50/50 p-8 text-center max-w-md">
          <div className="grid h-16 w-16 mx-auto place-items-center rounded-2xl bg-white ring-4 ring-rose-100">
            <Ban className="w-8 h-8 text-rose-500" />
          </div>
          <h2 className="mt-4 text-xl font-bold text-slate-800">Access Denied</h2>
          <p className="mt-2 text-sm text-slate-500">
            You don't have admin privileges to view this page. Only administrators can manage all bookings.
          </p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="flex flex-col items-center gap-4">
          <div className="relative">
            <div className="w-12 h-12 border-4 border-blue-100 rounded-full" />
            <div className="absolute inset-0 w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
          </div>
          <p className="text-sm font-medium text-slate-500">Loading all bookings...</p>
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

  const pendingCount = bookings.filter((b) => b.status === 'PENDING').length;

  return (
    <div>
      {/* ── Page header ─────────────────────────────────────────── */}
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <div className="inline-flex items-center gap-1.5 rounded-full border border-cyan-200 bg-cyan-50 px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.18em] text-cyan-700">
            <ShieldCheck className="w-3 h-3" />
            Admin Panel
          </div>
          <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-900">Booking Approvals</h1>
          <p className="mt-1 text-sm text-slate-500">Manage and review all booking requests</p>
        </div>
        <div className="flex items-center gap-2">
          {pendingCount > 0 && (
            <span className="inline-flex items-center gap-1.5 rounded-xl border border-amber-200 bg-amber-50 px-3 py-2 text-xs font-bold text-amber-700">
              <AlertCircle className="w-3.5 h-3.5" />
              {pendingCount} pending
            </span>
          )}
          <button
            onClick={fetchBookings}
            className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50"
          >
            <RefreshCw className="w-4 h-4" />
            Refresh
          </button>
        </div>
      </div>

      {/* ── Filters ─────────────────────────────────────────────── */}
      <div className="mb-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="mb-4 flex items-center gap-2">
          <div className="grid h-8 w-8 place-items-center rounded-lg bg-blue-50 text-blue-600">
            <Filter className="w-4 h-4" />
          </div>
          <h3 className="text-sm font-bold text-slate-800">Filters</h3>
          {(statusFilter || resourceFilter || dateFilter) && (
            <button
              onClick={() => {
                setStatusFilter('');
                setResourceFilter('');
                setDateFilter('');
              }}
              className="ml-auto inline-flex items-center gap-1 rounded-lg bg-blue-50 px-2.5 py-1 text-xs font-semibold text-blue-700 transition hover:bg-blue-100"
            >
              <XCircle className="w-3 h-3" />
              Clear all
            </button>
          )}
        </div>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          <div className="relative">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full appearance-none rounded-xl border border-slate-200 bg-white px-4 py-2.5 pr-9 text-sm outline-none transition hover:border-blue-300 focus:border-blue-400 focus:ring-4 focus:ring-blue-100"
            >
              <option value="">All Statuses</option>
              <option value="PENDING">Pending</option>
              <option value="APPROVED">Approved</option>
              <option value="REJECTED">Rejected</option>
              <option value="CANCELLED">Cancelled</option>
            </select>
            <Search className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          </div>
          <div className="relative">
            <select
              value={resourceFilter}
              onChange={(e) => setResourceFilter(e.target.value)}
              className="w-full appearance-none rounded-xl border border-slate-200 bg-white px-4 py-2.5 pr-9 text-sm outline-none transition hover:border-blue-300 focus:border-blue-400 focus:ring-4 focus:ring-blue-100"
            >
              <option value="">All Resources</option>
              {resourceNames.map((name) => (
                <option key={name} value={name}>{name}</option>
              ))}
            </select>
            <Search className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          </div>
          <input
            type="date"
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
            className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm outline-none transition hover:border-blue-300 focus:border-blue-400 focus:ring-4 focus:ring-blue-100"
          />
        </div>
      </div>

      <p className="mb-3 flex items-center gap-1.5 text-xs text-slate-500">
        <Sparkles className="w-3 h-3 text-blue-500" />
        Showing <span className="font-bold text-slate-700">{sortedBookings.length}</span> of{' '}
        <span className="font-bold text-slate-700">{bookings.length}</span> bookings
      </p>

      {/* ── Empty state ─────────────────────────────────────────── */}
      {sortedBookings.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-200 bg-white py-16 text-center shadow-sm">
          <div className="grid h-16 w-16 mx-auto place-items-center rounded-2xl bg-gradient-to-br from-blue-50 to-indigo-50 ring-4 ring-blue-50">
            <ShieldCheck className="w-8 h-8 text-blue-400" />
          </div>
          <h3 className="mt-4 text-lg font-bold text-slate-800">No bookings found</h3>
          <p className="mt-1 text-sm text-slate-500">
            {statusFilter || resourceFilter || dateFilter
              ? 'Try adjusting your filters.'
              : 'No booking requests have been submitted yet.'}
          </p>
        </div>
      ) : (
        /* ── Booking list ─────────────────────────────────────── */
        <div className="space-y-3">
          {sortedBookings.map((booking) => {
            const config = STATUS_CONFIG[booking.status] || STATUS_CONFIG.CANCELLED;
            const StatusIcon = config.icon;
            const isPending = booking.status === 'PENDING';

            return (
              <div
                key={booking.id}
                className={`group relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md ${
                  isPending ? 'border-l-4 border-l-amber-400' : ''
                }`}
              >
                <div className={`pointer-events-none absolute -right-8 -top-8 h-24 w-24 rounded-full bg-gradient-to-br ${config.gradient} opacity-[0.06] blur-2xl transition group-hover:opacity-[0.14]`} />

                <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
                  {/* Left side */}
                  <div className="flex min-w-0 flex-1 items-start gap-3">
                    <div className={`grid h-11 w-11 flex-shrink-0 place-items-center rounded-xl ${config.soft} ring-1 ring-slate-200`}>
                      <CalendarCheck className={`w-5 h-5 ${config.iconText}`} />
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="text-sm font-bold text-slate-900">{booking.resourceName || 'Resource'}</h3>
                        <span
                          className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider ${config.bg} ${config.text} ring-1 ${config.border}`}
                        >
                          <StatusIcon className="w-3 h-3" />
                          {booking.status}
                        </span>
                      </div>

                      <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-500">
                        <span className="inline-flex items-center gap-1">
                          <UserCircle className="w-3.5 h-3.5 text-slate-400" />
                          {booking.userName || booking.userEmail || 'User'}
                        </span>
                        <span className="inline-flex items-center gap-1">
                          <CalendarDays className="w-3.5 h-3.5 text-slate-400" />
                          {formatDate(booking.startTime)}
                        </span>
                        <span className="inline-flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5 text-slate-400" />
                          {formatTime(booking.startTime)}–{formatTime(booking.endTime)}
                        </span>
                        {booking.expectedAttendees && (
                          <span className="inline-flex items-center gap-1">
                            <Users className="w-3.5 h-3.5 text-slate-400" />
                            {booking.expectedAttendees}
                          </span>
                        )}
                      </div>

                      <div className="mt-2 flex items-start gap-1.5 rounded-xl border border-slate-100 bg-slate-50/50 px-3 py-2 text-xs text-slate-600">
                        <FileText className="mt-0.5 h-3.5 w-3.5 flex-shrink-0 text-slate-400" />
                        <span><span className="font-semibold text-slate-700">Purpose:</span> {booking.purpose}</span>
                      </div>

                      {booking.decisionReason &&
                        (booking.status === 'REJECTED' || booking.status === 'CANCELLED') && (
                          <div className="mt-2 rounded-xl border border-rose-100 bg-rose-50/70 px-3 py-2">
                            <p className="text-[10px] font-bold uppercase tracking-wider text-rose-500">Reason</p>
                            <p className="mt-0.5 text-xs text-rose-700">{booking.decisionReason}</p>
                          </div>
                        )}

                      {booking.decidedBy && booking.status === 'APPROVED' && (
                        <div className="mt-2 inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-1 text-[10px] font-semibold text-emerald-700 ring-1 ring-emerald-100">
                          <CheckCircle2 className="w-3 h-3" />
                          Approved{booking.decidedAt && ` on ${formatDate(booking.decidedAt)}`}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Right side */}
                  {isPending && (
                    <div className="flex flex-shrink-0 items-center gap-2">
                      <button
                        onClick={() => openApproveModal(booking.id)}
                        className="inline-flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 px-4 py-2 text-sm font-semibold text-white shadow-md shadow-emerald-900/20 transition hover:from-emerald-600 hover:to-teal-600"
                      >
                        <CheckCircle2 className="w-4 h-4" />
                        Approve
                      </button>
                      <button
                        onClick={() => openRejectModal(booking.id)}
                        className="inline-flex items-center gap-1.5 rounded-xl border border-rose-200 bg-white px-4 py-2 text-sm font-semibold text-rose-600 transition hover:border-rose-300 hover:bg-rose-50"
                      >
                        <XCircle className="w-4 h-4" />
                        Reject
                      </button>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ── Approve modal ───────────────────────────────────────── */}
      {showApproveModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-sm"
          onClick={() => !approving && setShowApproveModal(false)}
        >
          <div
            className="w-full max-w-md overflow-hidden rounded-3xl bg-white shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative bg-gradient-to-r from-emerald-500 to-teal-500 px-6 py-5 text-white">
              <div className="pointer-events-none absolute -right-8 -top-8 h-28 w-28 rounded-full bg-white/15 blur-2xl" />
              <div className="relative flex items-center gap-3">
                <div className="grid h-11 w-11 place-items-center rounded-xl bg-white/15 backdrop-blur ring-1 ring-white/25">
                  <CheckCircle2 className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold">Approve Booking</h3>
                  <p className="text-xs text-emerald-100">This will confirm the resource reservation</p>
                </div>
              </div>
            </div>

            <div className="p-6">
              <p className="text-sm text-slate-600">
                Are you sure you want to approve this booking request? The user will be notified that their booking has been confirmed.
              </p>

              <div className="mt-5 flex gap-3">
                <button
                  onClick={() => setShowApproveModal(false)}
                  disabled={approving}
                  className="flex-1 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleApprove}
                  disabled={approving}
                  className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 px-4 py-2.5 text-sm font-semibold text-white shadow-md shadow-emerald-900/20 transition hover:from-emerald-600 hover:to-teal-600 disabled:opacity-50"
                >
                  {approving ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Approving...
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="w-4 h-4" />
                      Yes, Approve
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── Reject modal ────────────────────────────────────────── */}
      {showRejectModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-sm"
          onClick={() => !rejecting && setShowRejectModal(false)}
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
                  <h3 className="text-base font-bold">Reject Booking</h3>
                  <p className="text-xs text-rose-100">A reason is required when rejecting</p>
                </div>
              </div>
            </div>

            <div className="p-6">
              <label className="mb-1.5 block text-sm font-semibold text-slate-700">
                Rejection Reason <span className="text-rose-500">*</span>
              </label>
              <textarea
                rows={3}
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                placeholder="e.g. Conflicting event already scheduled, resource under maintenance"
                className="w-full resize-none rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none transition hover:border-rose-200 focus:border-rose-400 focus:ring-4 focus:ring-rose-100"
                autoFocus
              />
              {rejectReason.length > 0 && rejectReason.length < 3 && (
                <p className="mt-1 text-xs font-medium text-rose-600">Reason must be meaningful</p>
              )}
              <p className="mt-1 text-xs text-slate-500">
                This reason will be visible to the user who made the booking.
              </p>

              <div className="mt-5 flex gap-3">
                <button
                  onClick={() => setShowRejectModal(false)}
                  disabled={rejecting}
                  className="flex-1 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleReject}
                  disabled={rejecting || !rejectReason.trim()}
                  className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-rose-500 to-pink-500 px-4 py-2.5 text-sm font-semibold text-white shadow-md shadow-rose-900/20 transition hover:from-rose-600 hover:to-pink-600 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {rejecting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Rejecting...
                    </>
                  ) : (
                    <>
                      <XCircle className="w-4 h-4" />
                      Confirm Reject
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

export default AdminPanel;
