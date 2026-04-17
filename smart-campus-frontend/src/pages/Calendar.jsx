import { useState, useEffect, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar as BigCalendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import {
  ChevronLeft,
  ChevronRight,
  CalendarDays,
  Clock,
  MapPin,
  FileText,
  Users,
  X,
  Loader2,
} from 'lucide-react';
import toast from 'react-hot-toast';
import bookingService from '../services/bookingService';

// Setup moment localizer for react-big-calendar
const localizer = momentLocalizer(moment);

// ===== COLOR MAP — unique color per resource name =====
const RESOURCE_COLORS = {
  'Lab': { bg: '#3b82f6', dot: '#3b82f6', light: '#eff6ff' },    // blue
  'Lecture Hall': { bg: '#8b5cf6', dot: '#8b5cf6', light: '#f5f3ff' },    // purple
  'Meeting Room': { bg: '#10b981', dot: '#10b981', light: '#ecfdf5' },    // green
  'Auditorium':{ bg: '#f59e0b', dot: '#f59e0b', light: '#fffbeb' },    // amber
  'Library Space': { bg: '#64748b', dot: '#64748b', light: '#f1f5f9'},
  'Equipment':{ bg: '#ef4444', dot: '#ef4444', light: '#fef2f2' },    // red
  'Open Area teater': { bg: '#a855f7', dot: '#a855f7', light: '#faf5ff' },    // violet
  'Sports Complex':  { bg: '#ec4899', dot: '#ec4899', light: '#fdf2f8' },    // pink
};

// Fallback color for unknown resources
const DEFAULT_COLOR = { bg: '#6366f1', dot: '#6366f1', light: '#eef2ff' };

const getResourceColor = (name) => {
  return RESOURCE_COLORS[name] || DEFAULT_COLOR;
};

function CalendarPage() {
  const navigate = useNavigate();

  // State
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [currentView, setCurrentView] = useState('month'); // 'month' or 'week'

  // Detail popup state
  const [selectedEvent, setSelectedEvent] = useState(null);

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      // Try admin endpoint first → if not admin, fallback to user's bookings
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
      toast.error('Failed to load calendar data');
    } finally {
      setLoading(false);
    }
  };

  // ===== CONVERT BOOKINGS → CALENDAR EVENTS =====
  // Only APPROVED bookings shown on calendar
  const events = useMemo(() => {
    return bookings
      .filter((b) => b.status === 'APPROVED')
      .map((b) => ({
        id: b.id,
        title: b.resourceName || 'Booking',
        start: new Date(b.startTime),
        end: new Date(b.endTime),
        resource: b,
        color: getResourceColor(b.resourceName),
      }));
  }, [bookings]);

  // ===== UNIQUE RESOURCES FOR LEGEND =====
  const legendItems = useMemo(() => {
    const seen = new Set();
    return events
      .filter((e) => {
        if (seen.has(e.resource.resourceName)) return false;
        seen.add(e.resource.resourceName);
        return true;
      })
      .map((e) => ({
        name: e.resource.resourceName,
        color: e.color,
      }))
      .sort((a, b) => a.name.localeCompare(b.name));
  }, [events]);

  // Also add resources that exist in color map but have no events
  const allLegendItems = useMemo(() => {
    const fromEvents = legendItems.map((l) => l.name);
    const allNames = Object.keys(RESOURCE_COLORS);
    const combined = [...legendItems];
    allNames.forEach((name) => {
      if (!fromEvents.includes(name)) {
        combined.push({ name, color: RESOURCE_COLORS[name] });
      }
    });
    return combined.sort((a, b) => a.name.localeCompare(b.name));
  }, [legendItems]);

  // ===== CUSTOM EVENT STYLING =====
  const eventStyleGetter = useCallback((event) => {
    return {
      style: {
        backgroundColor: event.color.bg,
        borderRadius: '6px',
        color: 'white',
        border: 'none',
        padding: '2px 6px',
        fontSize: '12px',
        fontWeight: '500',
        cursor: 'pointer',
      },
    };
  }, []);

  // ===== CLICK HANDLERS =====

  // Click a booking pill → show detail popup
  const handleSelectEvent = useCallback((event) => {
    setSelectedEvent(event.resource);
  }, []);

  // Click an empty day → navigate to booking form with date pre-filled
  const handleSelectSlot = useCallback(
    ({ start }) => {
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      // Ignore past dates
      if (start < today) {
        toast.error('Cannot create bookings in the past');
        return;
      }

      const dateStr = moment(start).format('YYYY-MM-DD');
      navigate(`/new-booking?date=${dateStr}`);
    },
    [navigate]
  );

  // ===== NAVIGATION HANDLERS =====
  const goToToday = () => setCurrentDate(new Date());

  const goBack = () => {
    setCurrentDate((prev) => {
      const d = new Date(prev);
      if (currentView === 'month') {
        d.setMonth(d.getMonth() - 1);
      } else {
        d.setDate(d.getDate() - 7);
      }
      return d;
    });
  };

  const goForward = () => {
    setCurrentDate((prev) => {
      const d = new Date(prev);
      if (currentView === 'month') {
        d.setMonth(d.getMonth() + 1);
      } else {
        d.setDate(d.getDate() + 7);
      }
      return d;
    });
  };

  // ===== FORMAT HELPERS =====
  const formatTime = (dateStr) => {
    if (!dateStr) return '--:--';
    const d = new Date(dateStr);
    return d.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    });
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    return moment(dateStr).format('YYYY-MM-DD');
  };

  // Title text
  const headerTitle = moment(currentDate).format(
    currentView === 'month' ? 'MMMM YYYY' : '[Week of] MMM D, YYYY'
  );

  // ===== LOADING STATE =====
  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-sm text-slate-500">Loading calendar...</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Page header */}
      <div className="mb-4">
        <h1 className="text-2xl font-bold text-slate-900">Booking Calendar</h1>
        <p className="text-slate-500 text-sm mt-1">
          View approved bookings on a calendar
        </p>
      </div>

      {/* Calendar container */}
      <div className="bg-white rounded-xl border border-slate-200 p-4 sm:p-6">
        {/* ===== CUSTOM TOOLBAR ===== */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-4">
          {/* Month/Year title */}
          <div className="flex items-center gap-2">
            <CalendarDays className="w-5 h-5 text-blue-600" />
            <h2 className="text-lg font-bold text-slate-800">{headerTitle}</h2>
          </div>

          {/* Controls */}
          <div className="flex items-center gap-2">
            {/* Today button */}
            <button
              onClick={goToToday}
              className="px-3 py-1.5 border border-slate-300 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors"
            >
              Today
            </button>

            {/* Nav arrows */}
            <button
              onClick={goBack}
              className="p-1.5 border border-slate-300 rounded-lg text-slate-500 hover:bg-slate-50 transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={goForward}
              className="p-1.5 border border-slate-300 rounded-lg text-slate-500 hover:bg-slate-50 transition-colors"
            >
              <ChevronRight className="w-4 h-4" />
            </button>

            {/* View toggle */}
            <div className="flex rounded-lg border border-slate-300 overflow-hidden ml-2">
              <button
                onClick={() => setCurrentView('month')}
                className={`px-3 py-1.5 text-sm font-medium transition-colors ${
                  currentView === 'month'
                    ? 'bg-blue-600 text-white'
                    : 'bg-white text-slate-600 hover:bg-slate-50'
                }`}
              >
                Month
              </button>
              <button
                onClick={() => setCurrentView('week')}
                className={`px-3 py-1.5 text-sm font-medium transition-colors ${
                  currentView === 'week'
                    ? 'bg-blue-600 text-white'
                    : 'bg-white text-slate-600 hover:bg-slate-50'
                }`}
              >
                Week
              </button>
            </div>
          </div>
        </div>

        {/* ===== CALENDAR GRID ===== */}
        <div
          style={{ height: currentView === 'month' ? 600 : 500 }}
          className="rbc-calendar-wrapper"
        >
          <BigCalendar
            localizer={localizer}
            events={events}
            view={currentView}
            date={currentDate}
            onNavigate={setCurrentDate}
            onView={setCurrentView}
            views={['month', 'week']}
            selectable
            onSelectEvent={handleSelectEvent}
            onSelectSlot={handleSelectSlot}
            eventPropGetter={eventStyleGetter}
            toolbar={false} // We use our custom toolbar above
            popup
            formats={{
              timeGutterFormat: (date) => moment(date).format('HH:mm'),
              eventTimeRangeFormat: ({ start, end }) =>
                `${moment(start).format('HH:mm')}–${moment(end).format('HH:mm')}`,
              dayHeaderFormat: (date) => moment(date).format('ddd'),
              dayRangeHeaderFormat: ({ start, end }) =>
                `${moment(start).format('MMM D')} – ${moment(end).format('MMM D, YYYY')}`,
            }}
          />
        </div>

        {/* ===== COLOR LEGEND ===== */}
        <div className="mt-4 pt-4 border-t border-slate-100">
          <div className="flex flex-wrap gap-x-5 gap-y-2">
            {allLegendItems.map((item) => (
              <div key={item.name} className="flex items-center gap-1.5">
                <span
                  className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                  style={{ backgroundColor: item.color.dot }}
                />
                <span className="text-xs text-slate-500">{item.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ===== BOOKING DETAIL POPUP ===== */}
      {selectedEvent && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div
            className="bg-white rounded-xl w-full max-w-md shadow-2xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Colored header bar */}
            <div
              className="h-2"
              style={{
                backgroundColor: getResourceColor(selectedEvent.resourceName).bg,
              }}
            />

            <div className="p-6">
              {/* Close button */}
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-lg font-bold text-slate-900">
                    {selectedEvent.resourceName || 'Booking Details'}
                  </h3>
                  <span className="inline-block mt-1 px-2.5 py-0.5 bg-green-100 text-green-700 text-xs font-semibold rounded-full">
                    APPROVED
                  </span>
                </div>
                <button
                  onClick={() => setSelectedEvent(null)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Details */}
              <div className="space-y-3 text-sm">
                <div className="flex items-center gap-3 text-slate-600">
                  <CalendarDays className="w-4 h-4 text-slate-400 flex-shrink-0" />
                  <span>{formatDate(selectedEvent.startTime)}</span>
                </div>
                <div className="flex items-center gap-3 text-slate-600">
                  <Clock className="w-4 h-4 text-slate-400 flex-shrink-0" />
                  <span>
                    {formatTime(selectedEvent.startTime)} –{' '}
                    {formatTime(selectedEvent.endTime)}
                  </span>
                </div>
                {selectedEvent.purpose && (
                  <div className="flex items-start gap-3 text-slate-600">
                    <FileText className="w-4 h-4 text-slate-400 flex-shrink-0 mt-0.5" />
                    <span>{selectedEvent.purpose}</span>
                  </div>
                )}
                {selectedEvent.expectedAttendees && (
                  <div className="flex items-center gap-3 text-slate-600">
                    <Users className="w-4 h-4 text-slate-400 flex-shrink-0" />
                    <span>{selectedEvent.expectedAttendees} attendees</span>
                  </div>
                )}
                {selectedEvent.userName && (
                  <div className="flex items-center gap-3 text-slate-600">
                    <MapPin className="w-4 h-4 text-slate-400 flex-shrink-0" />
                    <span>Booked by {selectedEvent.userName}</span>
                  </div>
                )}
              </div>

              {/* Resource type badge */}
              {selectedEvent.resourceType && (
                <div className="mt-4">
                  <span
                    className="inline-block px-3 py-1 text-xs font-medium rounded-full"
                    style={{
                      backgroundColor: getResourceColor(selectedEvent.resourceName).light,
                      color: getResourceColor(selectedEvent.resourceName).bg,
                    }}
                  >
                    {selectedEvent.resourceType.replace(/_/g, ' ')}
                  </span>
                </div>
              )}

              {/* Close button */}
              <button
                onClick={() => setSelectedEvent(null)}
                className="mt-5 w-full py-2.5 border border-slate-300 text-slate-600 rounded-lg text-sm font-medium hover:bg-slate-50 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default CalendarPage;