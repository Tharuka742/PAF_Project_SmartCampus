import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  CalendarDays,
  CheckCircle2,
  AlertCircle,
  XCircle,
  Clock,
  TrendingUp,
} from 'lucide-react';
import toast from 'react-hot-toast';
import bookingService from '../services/bookingService';

// Status badge colors
const STATUS_STYLES = {
  PENDING: 'bg-yellow-100 text-yellow-700',
  APPROVED: 'bg-green-100 text-green-700',
  REJECTED: 'bg-red-100 text-red-700',
  CANCELLED: 'bg-gray-100 text-gray-600',
};

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

      // Try admin endpoint first (gets ALL bookings)
      // If user is not admin, backend returns 403 → fall back to /me
      let response;
      try {
        response = await bookingService.getAllBookings();
      } catch (err) {
        // Not admin — use user's own bookings
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

  // ===== CALCULATE STATS =====
  const stats = {
    total: bookings.length,
    approved: bookings.filter((b) => b.status === 'APPROVED').length,
    pending: bookings.filter((b) => b.status === 'PENDING').length,
    rejected: bookings.filter((b) => b.status === 'REJECTED').length,
  };

  // ===== RECENT BOOKINGS (latest 5) =====
  const recentBookings = [...bookings]
    .sort((a, b) => new Date(b.createdAt || b.startTime) - new Date(a.createdAt || a.startTime))
    .slice(0, 5);

  // ===== RESOURCE UTILIZATION =====
  const resourceCounts = {};
  bookings.forEach((b) => {
    const type = b.resourceType || 'Unknown';
    // Convert type like LECTURE_HALL → Lecture Hall
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

  // ===== FORMAT HELPERS =====
  const formatTime = (dateStr) => {
    if (!dateStr) return '--:--';
    const d = new Date(dateStr);
    return d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false });
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    return dateStr.split('T')[0]; // "2026-04-07"
  };

  // ===== LOADING STATE =====
  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-sm text-slate-500">Loading dashboard...</p>
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
        <h1 className="text-2xl font-bold text-slate-900">Dashboard</h1>
        <p className="text-slate-500 text-sm mt-1">Overview of campus resource bookings</p>
      </div>

      {/* ===== STAT CARDS ===== */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {/* Total Bookings */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
                Total Bookings
              </p>
              <p className="text-3xl font-bold text-slate-900 mt-1">{stats.total}</p>
            </div>
            <div className="w-11 h-11 bg-blue-50 rounded-xl flex items-center justify-center">
              <CalendarDays className="w-6 h-6 text-blue-500" />
            </div>
          </div>
        </div>

        {/* Approved */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
                Approved
              </p>
              <p className="text-3xl font-bold text-slate-900 mt-1">{stats.approved}</p>
            </div>
            <div className="w-11 h-11 bg-green-50 rounded-xl flex items-center justify-center">
              <CheckCircle2 className="w-6 h-6 text-green-500" />
            </div>
          </div>
        </div>

        {/* Pending */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
                Pending
              </p>
              <p className="text-3xl font-bold text-slate-900 mt-1">{stats.pending}</p>
            </div>
            <div className="w-11 h-11 bg-yellow-50 rounded-xl flex items-center justify-center">
              <AlertCircle className="w-6 h-6 text-yellow-500" />
            </div>
          </div>
        </div>

        {/* Rejected */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
                Rejected
              </p>
              <p className="text-3xl font-bold text-slate-900 mt-1">{stats.rejected}</p>
            </div>
            <div className="w-11 h-11 bg-red-50 rounded-xl flex items-center justify-center">
              <XCircle className="w-6 h-6 text-red-500" />
            </div>
          </div>
        </div>
      </div>

      {/* ===== BOTTOM SECTION: Recent Bookings + Resource Utilization ===== */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Recent Bookings — 3 columns */}
        <div className="lg:col-span-3 bg-white rounded-xl border border-slate-200 p-5">
          <div className="flex items-center gap-2 mb-4">
            <Clock className="w-5 h-5 text-slate-400" />
            <h3 className="font-semibold text-slate-900">Recent Bookings</h3>
          </div>

          {recentBookings.length === 0 ? (
            <div className="text-center py-8">
              <CalendarDays className="w-10 h-10 text-slate-300 mx-auto mb-2" />
              <p className="text-sm text-slate-400">No bookings yet</p>
              <button
                onClick={() => navigate('/new-booking')}
                className="mt-3 text-sm text-blue-600 hover:text-blue-700 font-medium"
              >
                Create your first booking →
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {recentBookings.map((booking) => (
                <div
                  key={booking.id}
                  className="flex items-center justify-between py-3 border-b border-slate-100 last:border-0"
                >
                  <div className="min-w-0">
                    <p className="font-medium text-slate-800 text-sm truncate">
                      {booking.resourceName || 'Resource'}
                    </p>
                    <p className="text-xs text-slate-400 mt-0.5">
                      {formatDate(booking.startTime)} · {formatTime(booking.startTime)}–
                      {formatTime(booking.endTime)}
                    </p>
                  </div>
                  <span
                    className={`px-2.5 py-1 text-xs font-semibold rounded-full flex-shrink-0 ml-3 ${
                      STATUS_STYLES[booking.status] || 'bg-gray-100 text-gray-600'
                    }`}
                  >
                    {booking.status}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Resource Utilization — 2 columns */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 p-5">
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp className="w-5 h-5 text-slate-400" />
            <h3 className="font-semibold text-slate-900">Resource Utilization</h3>
          </div>

          {resourceData.length === 0 ? (
            <div className="text-center py-8">
              <TrendingUp className="w-10 h-10 text-slate-300 mx-auto mb-2" />
              <p className="text-sm text-slate-400">No data available</p>
            </div>
          ) : (
            <div className="space-y-4">
              {resourceData.map((resource) => (
                <div key={resource.name}>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-sm text-slate-700">{resource.name}</span>
                    <span className="text-xs text-slate-400">
                      {resource.count} booking{resource.count !== 1 ? 's' : ''} ({resource.percent}%)
                    </span>
                  </div>
                  <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-blue-500 rounded-full transition-all duration-500"
                      style={{ width: `${Math.max(resource.percent, 3)}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;