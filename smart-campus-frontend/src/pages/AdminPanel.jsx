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
} from 'lucide-react';
import toast from 'react-hot-toast';
import bookingService from '../services/bookingService';

// Status badge styles
const STATUS_CONFIG = {
  PENDING: { bg: 'bg-yellow-100', text: 'text-yellow-700' },
  APPROVED: { bg: 'bg-green-100', text: 'text-green-700' },
  REJECTED: { bg: 'bg-red-100', text: 'text-red-700' },
  CANCELLED: { bg: 'bg-gray-100', text: 'text-gray-600' },
};

function AdminPanel() {
  // Data state
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [accessDenied, setAccessDenied] = useState(false);

  // Filter state
  const [statusFilter, setStatusFilter] = useState('');
  const [resourceFilter, setResourceFilter] = useState('');
  const [dateFilter, setDateFilter] = useState('');

  // Approve modal state
  const [showApproveModal, setShowApproveModal] = useState(false);
  const [approveBookingId, setApproveBookingId] = useState(null);
  const [approving, setApproving] = useState(false);

  // Reject modal state
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

  // ===== APPROVE =====
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
        // Update in state
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

  // ===== REJECT =====
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
        // Update in state
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

  // ===== FORMAT HELPERS =====
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

  // ===== UNIQUE RESOURCE NAMES FOR FILTER DROPDOWN =====
  const resourceNames = [...new Set(bookings.map((b) => b.resourceName).filter(Boolean))].sort();

  // ===== APPLY FILTERS =====
  const filteredBookings = bookings.filter((b) => {
    // Status filter
    if (statusFilter && b.status !== statusFilter) return false;
    // Resource filter
    if (resourceFilter && b.resourceName !== resourceFilter) return false;
    // Date filter
    if (dateFilter) {
      const bookingDate = formatDate(b.startTime);
      if (bookingDate !== dateFilter) return false;
    }
    return true;
  });

  // Sort: PENDING first, then by date descending
  const sortedBookings = [...filteredBookings].sort((a, b) => {
    if (a.status === 'PENDING' && b.status !== 'PENDING') return -1;
    if (b.status === 'PENDING' && a.status !== 'PENDING') return 1;
    return new Date(b.startTime) - new Date(a.startTime);
  });

  // ===== ACCESS DENIED STATE =====
  if (accessDenied) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <Ban className="w-16 h-16 text-red-300 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-slate-700 mb-2">Access Denied</h2>
          <p className="text-sm text-slate-500 max-w-sm">
            You don't have admin privileges to view this page.
            Only administrators can manage all bookings.
          </p>
        </div>
      </div>
    );
  }

  // ===== LOADING STATE =====
  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-sm text-slate-500">Loading all bookings...</p>
        </div>
      </div>
    );
  }

  // ===== ERROR STATE =====
  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <XCircle className="w-12 h-12 text-red-400 mx-auto mb-3" />
          <p className="text-slate-600 mb-4">{error}</p>
          <button
            onClick={fetchBookings}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Page header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900">Admin Panel</h1>
        <p className="text-slate-500 text-sm mt-1">
          Manage and review all booking requests
        </p>
      </div>

      {/* ===== FILTERS ===== */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 mb-6">
        <div className="flex items-center gap-2 mb-4">
          <Filter className="w-4 h-4 text-slate-400" />
          <h3 className="font-semibold text-slate-700 text-sm">Filters</h3>
          {/* Clear filters button */}
          {(statusFilter || resourceFilter || dateFilter) && (
            <button
              onClick={() => {
                setStatusFilter('');
                setResourceFilter('');
                setDateFilter('');
              }}
              className="ml-auto text-xs text-blue-600 hover:text-blue-700 font-medium"
            >
              Clear all
            </button>
          )}
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {/* Status filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full px-3 py-2.5 border border-slate-300 rounded-lg text-sm bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
          >
            <option value="">All Statuses</option>
            <option value="PENDING">Pending</option>
            <option value="APPROVED">Approved</option>
            <option value="REJECTED">Rejected</option>
            <option value="CANCELLED">Cancelled</option>
          </select>

          {/* Resource filter */}
          <select
            value={resourceFilter}
            onChange={(e) => setResourceFilter(e.target.value)}
            className="w-full px-3 py-2.5 border border-slate-300 rounded-lg text-sm bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
          >
            <option value="">All Resources</option>
            {resourceNames.map((name) => (
              <option key={name} value={name}>
                {name}
              </option>
            ))}
          </select>

          {/* Date filter */}
          <input
            type="date"
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
            className="w-full px-3 py-2.5 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
          />
        </div>
      </div>

      {/* Results count */}
      <p className="text-xs text-slate-400 mb-3">
        Showing {sortedBookings.length} of {bookings.length} bookings
      </p>

      {/* ===== EMPTY STATE ===== */}
      {sortedBookings.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-xl border border-slate-200">
          <ShieldCheck className="w-16 h-16 text-slate-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-slate-700 mb-1">
            No bookings found
          </h3>
          <p className="text-sm text-slate-400">
            {statusFilter || resourceFilter || dateFilter
              ? 'Try adjusting your filters.'
              : 'No booking requests have been submitted yet.'}
          </p>
        </div>
      ) : (
        /* ===== BOOKING LIST ===== */
        <div className="space-y-3">
          {sortedBookings.map((booking) => {
            const config = STATUS_CONFIG[booking.status] || STATUS_CONFIG.CANCELLED;
            const isPending = booking.status === 'PENDING';

            return (
              <div
                key={booking.id}
                className="bg-white rounded-xl border border-slate-200 p-5 hover:shadow-md transition-shadow"
              >
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                  {/* Left side — booking info */}
                  <div className="flex-1 min-w-0">
                    {/* Resource name + status */}
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="font-semibold text-slate-900">
                        {booking.resourceName || 'Resource'}
                      </h3>
                      <span
                        className={`px-2.5 py-0.5 text-xs font-semibold rounded-full ${config.bg} ${config.text}`}
                      >
                        {booking.status}
                      </span>
                    </div>

                    {/* Details row */}
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-slate-500">
                      {/* User */}
                      <div className="flex items-center gap-1.5">
                        <UserCircle className="w-3.5 h-3.5" />
                        <span>{booking.userName || booking.userEmail || 'User'}</span>
                      </div>

                      {/* Date + Time */}
                      <div className="flex items-center gap-1.5">
                        <CalendarDays className="w-3.5 h-3.5" />
                        <span>
                          {formatDate(booking.startTime)} · {formatTime(booking.startTime)}–
                          {formatTime(booking.endTime)}
                        </span>
                      </div>

                      {/* Attendees */}
                      {booking.expectedAttendees && (
                        <div className="flex items-center gap-1.5">
                          <Users className="w-3.5 h-3.5" />
                          <span>{booking.expectedAttendees}</span>
                        </div>
                      )}
                    </div>

                    {/* Purpose */}
                    <div className="flex items-start gap-1.5 mt-1.5 text-sm text-slate-500">
                      <FileText className="w-3.5 h-3.5 mt-0.5 flex-shrink-0" />
                      <span>Purpose: {booking.purpose}</span>
                    </div>

                    {/* Rejection reason (if rejected) */}
                    {booking.decisionReason &&
                      (booking.status === 'REJECTED' ||
                        booking.status === 'CANCELLED') && (
                        <div className="mt-2 px-3 py-2 bg-red-50 border border-red-100 rounded-lg">
                          <p className="text-xs text-red-600">
                            <span className="font-semibold">Reason:</span>{' '}
                            {booking.decisionReason}
                          </p>
                        </div>
                      )}

                    {/* Approval info */}
                    {booking.decidedBy && booking.status === 'APPROVED' && (
                      <div className="mt-2 px-3 py-2 bg-green-50 border border-green-100 rounded-lg">
                        <p className="text-xs text-green-600">
                          <span className="font-semibold">Approved</span>
                          {booking.decidedAt && (
                            <span> on {formatDate(booking.decidedAt)}</span>
                          )}
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Right side — action buttons (only for PENDING) */}
                  {isPending && (
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <button
                        onClick={() => openApproveModal(booking.id)}
                        className="flex items-center gap-1.5 px-4 py-2 border-2 border-green-200 text-green-600 rounded-lg text-sm font-medium hover:bg-green-50 hover:border-green-300 transition-colors"
                      >
                        <CheckCircle2 className="w-4 h-4" />
                        Approve
                      </button>
                      <button
                        onClick={() => openRejectModal(booking.id)}
                        className="flex items-center gap-1.5 px-4 py-2 border-2 border-red-200 text-red-600 rounded-lg text-sm font-medium hover:bg-red-50 hover:border-red-300 transition-colors"
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

      {/* ===== APPROVE CONFIRMATION MODAL ===== */}
      {showApproveModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl w-full max-w-md p-6 shadow-2xl">
            {/* Header */}
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                <CheckCircle2 className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <h3 className="font-semibold text-slate-900">Approve Booking</h3>
                <p className="text-xs text-slate-400">
                  This will confirm the resource reservation
                </p>
              </div>
            </div>

            <p className="text-sm text-slate-600 mb-5">
              Are you sure you want to approve this booking request? The user
              will be notified that their booking has been confirmed.
            </p>

            {/* Buttons */}
            <div className="flex gap-3">
              <button
                onClick={() => setShowApproveModal(false)}
                disabled={approving}
                className="flex-1 px-4 py-2.5 border border-slate-300 text-slate-600 rounded-lg text-sm font-medium hover:bg-slate-50 disabled:opacity-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleApprove}
                disabled={approving}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700 disabled:opacity-50 transition-colors"
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
      )}

      {/* ===== REJECT REASON MODAL ===== */}
      {showRejectModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl w-full max-w-md p-6 shadow-2xl">
            {/* Header */}
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                <AlertTriangle className="w-5 h-5 text-red-600" />
              </div>
              <div>
                <h3 className="font-semibold text-slate-900">Reject Booking</h3>
                <p className="text-xs text-slate-400">
                  A reason is required when rejecting
                </p>
              </div>
            </div>

            {/* Reason textarea */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-slate-700 mb-1.5">
                Rejection Reason <span className="text-red-500">*</span>
              </label>
              <textarea
                rows={3}
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                placeholder="e.g. Conflicting event already scheduled, resource under maintenance"
                className="w-full px-3 py-2.5 border border-slate-300 rounded-lg text-sm resize-none focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none"
                autoFocus
              />
              {rejectReason.length > 0 && rejectReason.length < 3 && (
                <p className="mt-1 text-xs text-red-500">
                  Reason must be meaningful
                </p>
              )}
              <p className="mt-1 text-xs text-slate-400">
                This reason will be visible to the user who made the booking.
              </p>
            </div>

            {/* Buttons */}
            <div className="flex gap-3">
              <button
                onClick={() => setShowRejectModal(false)}
                disabled={rejecting}
                className="flex-1 px-4 py-2.5 border border-slate-300 text-slate-600 rounded-lg text-sm font-medium hover:bg-slate-50 disabled:opacity-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleReject}
                disabled={rejecting || !rejectReason.trim()}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
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
      )}
    </div>
  );
}

export default AdminPanel;