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
} from 'lucide-react';
import toast from 'react-hot-toast';
import bookingService from '../services/bookingService';

// Status badge styles
const STATUS_CONFIG = {
  PENDING: {
    bg: 'bg-yellow-100',
    text: 'text-yellow-700',
    border: 'border-yellow-200',
    cardBorder: 'border-l-yellow-400',
  },
  APPROVED: {
    bg: 'bg-green-100',
    text: 'text-green-700',
    border: 'border-green-200',
    cardBorder: 'border-l-green-400',
  },
  REJECTED: {
    bg: 'bg-red-100',
    text: 'text-red-700',
    border: 'border-red-200',
    cardBorder: 'border-l-red-400',
  },
  CANCELLED: {
    bg: 'bg-gray-100',
    text: 'text-gray-600',
    border: 'border-gray-200',
    cardBorder: 'border-l-gray-400',
  },
};

function MyBookings() {
  const navigate = useNavigate();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Cancel modal state
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [cancelBookingId, setCancelBookingId] = useState(null);
  const [cancelReason, setCancelReason] = useState('');
  const [cancelling, setCancelling] = useState(false);

  // Filter state
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

  // ===== CANCEL BOOKING =====
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
        // Update the booking in state without re-fetching
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

  // ===== FILTER =====
  const filteredBookings =
    statusFilter === 'ALL'
      ? bookings
      : bookings.filter((b) => b.status === statusFilter);

  // Sort: PENDING first, then by date descending
  const sortedBookings = [...filteredBookings].sort((a, b) => {
    // PENDING always on top
    if (a.status === 'PENDING' && b.status !== 'PENDING') return -1;
    if (b.status === 'PENDING' && a.status !== 'PENDING') return 1;
    // Then by startTime descending
    return new Date(b.startTime) - new Date(a.startTime);
  });

  // ===== LOADING STATE =====
  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-sm text-slate-500">Loading your bookings...</p>
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
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">My Bookings</h1>
          <p className="text-slate-500 text-sm mt-1">
            View and track your booking requests
          </p>
        </div>
        <button
          onClick={() => navigate('/new-booking')}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-4 h-4" />
          New Booking
        </button>
      </div>

      {/* Status filter tabs */}
      <div className="flex flex-wrap gap-2 mb-6">
        {['ALL', 'PENDING', 'APPROVED', 'REJECTED', 'CANCELLED'].map(
          (status) => {
            const count =
              status === 'ALL'
                ? bookings.length
                : bookings.filter((b) => b.status === status).length;
            const isActive = statusFilter === status;
            const style =
              status !== 'ALL' ? STATUS_CONFIG[status] : null;
            return (
              <button
                key={status}
                onClick={() => setStatusFilter(status)}
                className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${
                  isActive
                    ? status === 'ALL'
                      ? 'bg-slate-800 text-white'
                      : `${style.bg} ${style.text}`
                    : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
                }`}
              >
                {status === 'ALL' ? 'All' : status.charAt(0) + status.slice(1).toLowerCase()}{' '}
                ({count})
              </button>
            );
          }
        )}
      </div>

      {/* ===== EMPTY STATE ===== */}
      {sortedBookings.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-xl border border-slate-200">
          <CalendarDays className="w-16 h-16 text-slate-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-slate-700 mb-1">
            {statusFilter === 'ALL'
              ? 'No bookings yet'
              : `No ${statusFilter.toLowerCase()} bookings`}
          </h3>
          <p className="text-sm text-slate-400 mb-6">
            {statusFilter === 'ALL'
              ? 'Create your first booking to get started!'
              : 'Try changing the filter above.'}
          </p>
          {statusFilter === 'ALL' && (
            <button
              onClick={() => navigate('/new-booking')}
              className="px-5 py-2.5 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
            >
              Create First Booking
            </button>
          )}
        </div>
      ) : (
        /* ===== BOOKING CARDS GRID ===== */
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {sortedBookings.map((booking) => {
            const config = STATUS_CONFIG[booking.status] || STATUS_CONFIG.CANCELLED;
            const canCancel =
              booking.status === 'PENDING' || booking.status === 'APPROVED';

            return (
              <div
                key={booking.id}
                className={`bg-white rounded-xl border border-slate-200 border-l-4 ${config.cardBorder} p-5 hover:shadow-md transition-shadow`}
              >
                {/* Top row: resource name + status badge */}
                <div className="flex items-start justify-between mb-3">
                  <h3 className="font-semibold text-slate-900 text-sm leading-tight">
                    {booking.resourceName || 'Resource'}
                  </h3>
                  <span
                    className={`px-2.5 py-1 text-xs font-semibold rounded-full flex-shrink-0 ml-2 ${config.bg} ${config.text}`}
                  >
                    {booking.status}
                  </span>
                </div>

                {/* Booking details */}
                <div className="space-y-1.5 text-sm text-slate-500">
                  <div className="flex items-center gap-2">
                    <CalendarDays className="w-3.5 h-3.5 flex-shrink-0" />
                    <span>{formatDate(booking.startTime)}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-3.5 h-3.5 flex-shrink-0" />
                    <span>
                      {formatTime(booking.startTime)} –{' '}
                      {formatTime(booking.endTime)}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <FileText className="w-3.5 h-3.5 flex-shrink-0" />
                    <span className="truncate">{booking.purpose}</span>
                  </div>
                  {booking.expectedAttendees && (
                    <div className="flex items-center gap-2">
                      <Users className="w-3.5 h-3.5 flex-shrink-0" />
                      <span>{booking.expectedAttendees} attendees</span>
                    </div>
                  )}
                </div>

                {/* ===== REJECTION/CANCELLATION REASON ===== */}
                {booking.decisionReason &&
                  (booking.status === 'REJECTED' ||
                    booking.status === 'CANCELLED') && (
                    <div className="mt-3 px-3 py-2 bg-red-50 border border-red-100 rounded-lg">
                      <p className="text-xs text-red-600">
                        <span className="font-semibold">Reason:</span>{' '}
                        {booking.decisionReason}
                      </p>
                    </div>
                  )}

                {/* ===== CANCEL BUTTON ===== */}
                {canCancel && (
                  <button
                    onClick={() => openCancelModal(booking.id)}
                    className="mt-4 w-full flex items-center justify-center gap-1.5 py-2 text-sm text-slate-500 border border-slate-300 rounded-lg hover:bg-red-50 hover:text-red-600 hover:border-red-200 transition-colors"
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

      {/* ===== CANCEL CONFIRMATION MODAL ===== */}
      {showCancelModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl w-full max-w-md p-6 shadow-2xl">
            {/* Header */}
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                <AlertTriangle className="w-5 h-5 text-red-600" />
              </div>
              <div>
                <h3 className="font-semibold text-slate-900">
                  Cancel Booking
                </h3>
                <p className="text-xs text-slate-400">
                  This action cannot be undone
                </p>
              </div>
            </div>

            {/* Reason (optional) */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-slate-700 mb-1.5">
                Reason for cancellation (optional)
              </label>
              <textarea
                rows={3}
                value={cancelReason}
                onChange={(e) => setCancelReason(e.target.value)}
                placeholder="e.g. Schedule changed, no longer needed"
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm resize-none focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none"
              />
            </div>

            {/* Buttons */}
            <div className="flex gap-3">
              <button
                onClick={() => setShowCancelModal(false)}
                disabled={cancelling}
                className="flex-1 px-4 py-2.5 border border-slate-300 text-slate-600 rounded-lg text-sm font-medium hover:bg-slate-50 disabled:opacity-50 transition-colors"
              >
                Keep Booking
              </button>
              <button
                onClick={handleCancel}
                disabled={cancelling}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700 disabled:opacity-50 transition-colors"
              >
                {cancelling ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Cancelling...
                  </>
                ) : (
                  'Yes, Cancel'
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default MyBookings;