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
  Sparkles,
  CheckCircle2,
  Tag,
  User,
} from 'lucide-react';
import toast from 'react-hot-toast';
import bookingService from '../services/bookingService';

const localizer = momentLocalizer(moment);

const RESOURCE_COLORS = {
  'Lab': { bg: '#3b82f6', dot: '#3b82f6', light: '#eff6ff' },
  'Lecture Hall': { bg: '#8b5cf6', dot: '#8b5cf6', light: '#f5f3ff' },
  'Meeting Room': { bg: '#10b981', dot: '#10b981', light: '#ecfdf5' },
  'Auditorium':{ bg: '#f59e0b', dot: '#f59e0b', light: '#fffbeb' },
  'Library Space': { bg: '#64748b', dot: '#64748b', light: '#f1f5f9'},
  'Equipment':{ bg: '#ef4444', dot: '#ef4444', light: '#fef2f2' },
  'Open Area teater': { bg: '#a855f7', dot: '#a855f7', light: '#faf5ff' },
  'Sports Complex':  { bg: '#ec4899', dot: '#ec4899', light: '#fdf2f8' },
};

const DEFAULT_COLOR = { bg: '#6366f1', dot: '#6366f1', light: '#eef2ff' };

const getResourceColor = (name) => {
  return RESOURCE_COLORS[name] || DEFAULT_COLOR;
};

function CalendarPage() {
  const navigate = useNavigate();

  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [currentView, setCurrentView] = useState('month');

  const [selectedEvent, setSelectedEvent] = useState(null);

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      setLoading(true);
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

  const eventStyleGetter = useCallback((event) => {
    return {
      style: {
        backgroundColor: event.color.bg,
        borderRadius: '8px',
        color: 'white',
        border: 'none',
        padding: '3px 8px',
        fontSize: '12px',
        fontWeight: '600',
        cursor: 'pointer',
        boxShadow: '0 2px 4px rgba(0,0,0,0.08)',
      },
    };
  }, []);

  const handleSelectEvent = useCallback((event) => {
    setSelectedEvent(event.resource);
  }, []);

  const handleSelectSlot = useCallback(
    ({ start }) => {
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      if (start < today) {
        toast.error('Cannot create bookings in the past');
        return;
      }

      const dateStr = moment(start).format('YYYY-MM-DD');
      navigate(`/new-booking?date=${dateStr}`);
    },
    [navigate]
  );

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

  const headerTitle = moment(currentDate).format(
    currentView === 'month' ? 'MMMM YYYY' : '[Week of] MMM D, YYYY'
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="flex flex-col items-center gap-4">
          <div className="relative">
            <div className="w-12 h-12 border-4 border-blue-100 rounded-full" />
            <div className="absolute inset-0 w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
          </div>
          <p className="text-sm font-medium text-slate-500">Loading calendar...</p>
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
            Schedule View
          </div>
          <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-900">Booking Calendar</h1>
          <p className="mt-1 text-sm text-slate-500">View approved bookings on a calendar</p>
        </div>
        <div className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs text-slate-600 shadow-sm">
          <span className="grid h-6 w-6 place-items-center rounded-md bg-emerald-50 text-emerald-600">
            <CheckCircle2 className="w-3.5 h-3.5" />
          </span>
          <span>
            <span className="font-bold text-slate-800">{events.length}</span> approved booking
            {events.length !== 1 ? 's' : ''}
          </span>
        </div>
      </div>

      {/* ── Calendar container ──────────────────────────────────── */}
      <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6">
        {/* ── Toolbar ──────────────────────────────────────────── */}
        <div className="mb-5 flex flex-col items-start justify-between gap-3 sm:flex-row sm:items-center">
          <div className="flex items-center gap-3">
            <div className="grid h-10 w-10 place-items-center rounded-xl bg-gradient-to-br from-blue-50 to-indigo-50 text-blue-600 ring-1 ring-blue-100">
              <CalendarDays className="w-5 h-5" />
            </div>
            <h2 className="text-lg font-bold tracking-tight text-slate-900">{headerTitle}</h2>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={goToToday}
              className="rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50"
            >
              Today
            </button>

            <div className="flex overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
              <button
                onClick={goBack}
                className="grid h-9 w-9 place-items-center border-r border-slate-200 text-slate-500 transition hover:bg-slate-50"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={goForward}
                className="grid h-9 w-9 place-items-center text-slate-500 transition hover:bg-slate-50"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            <div className="flex overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
              <button
                onClick={() => setCurrentView('month')}
                className={`px-3.5 py-2 text-sm font-semibold transition ${
                  currentView === 'month'
                    ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white'
                    : 'text-slate-600 hover:bg-slate-50'
                }`}
              >
                Month
              </button>
              <button
                onClick={() => setCurrentView('week')}
                className={`px-3.5 py-2 text-sm font-semibold transition ${
                  currentView === 'week'
                    ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white'
                    : 'text-slate-600 hover:bg-slate-50'
                }`}
              >
                Week
              </button>
            </div>
          </div>
        </div>

        {/* ── Calendar grid ────────────────────────────────────── */}
        <div
          style={{ height: currentView === 'month' ? 600 : 500 }}
          className="rbc-calendar-wrapper rounded-xl"
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
            toolbar={false}
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

        {/* ── Legend ───────────────────────────────────────────── */}
        <div className="mt-5 rounded-xl border border-slate-100 bg-gradient-to-r from-slate-50 to-blue-50/30 p-4">
          <div className="mb-2.5 flex items-center gap-1.5">
            <Tag className="w-3.5 h-3.5 text-slate-400" />
            <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-slate-500">Resource Legend</p>
          </div>
          <div className="flex flex-wrap gap-x-5 gap-y-2">
            {allLegendItems.map((item) => (
              <div key={item.name} className="flex items-center gap-1.5">
                <span
                  className="h-3 w-3 flex-shrink-0 rounded-md ring-2 ring-white shadow-sm"
                  style={{ backgroundColor: item.color.dot }}
                />
                <span className="text-xs font-medium text-slate-600">{item.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Booking detail popup ────────────────────────────────── */}
      {selectedEvent && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-sm"
          onClick={() => setSelectedEvent(null)}
        >
          <div
            className="w-full max-w-md overflow-hidden rounded-3xl bg-white shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div
              className="relative px-6 pt-6 pb-5 text-white"
              style={{
                background: `linear-gradient(135deg, ${getResourceColor(selectedEvent.resourceName).bg}, ${getResourceColor(selectedEvent.resourceName).bg}dd)`,
              }}
            >
              <div className="pointer-events-none absolute -right-8 -top-8 h-28 w-28 rounded-full bg-white/15 blur-2xl" />
              <div className="relative flex items-start justify-between">
                <div>
                  <div className="inline-flex items-center gap-1.5 rounded-full bg-white/20 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider backdrop-blur">
                    <CheckCircle2 className="w-3 h-3" />
                    Approved
                  </div>
                  <h3 className="mt-2 text-xl font-bold">
                    {selectedEvent.resourceName || 'Booking Details'}
                  </h3>
                </div>
                <button
                  onClick={() => setSelectedEvent(null)}
                  className="grid h-8 w-8 place-items-center rounded-lg bg-white/15 text-white transition hover:bg-white/25"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="p-6">
              <div className="space-y-3">
                <DetailRow icon={CalendarDays} label="Date" value={formatDate(selectedEvent.startTime)} />
                <DetailRow
                  icon={Clock}
                  label="Time"
                  value={`${formatTime(selectedEvent.startTime)} – ${formatTime(selectedEvent.endTime)}`}
                />
                {selectedEvent.purpose && (
                  <DetailRow icon={FileText} label="Purpose" value={selectedEvent.purpose} multiline />
                )}
                {selectedEvent.expectedAttendees && (
                  <DetailRow icon={Users} label="Attendees" value={`${selectedEvent.expectedAttendees} people`} />
                )}
                {selectedEvent.userName && (
                  <DetailRow icon={User} label="Booked by" value={selectedEvent.userName} />
                )}
              </div>

              {selectedEvent.resourceType && (
                <div className="mt-4 flex items-center gap-2">
                  <Tag className="w-3.5 h-3.5 text-slate-400" />
                  <span
                    className="inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ring-1"
                    style={{
                      backgroundColor: getResourceColor(selectedEvent.resourceName).light,
                      color: getResourceColor(selectedEvent.resourceName).bg,
                      borderColor: 'transparent',
                    }}
                  >
                    {selectedEvent.resourceType.replace(/_/g, ' ')}
                  </span>
                </div>
              )}

              <button
                onClick={() => setSelectedEvent(null)}
                className="mt-6 w-full rounded-xl border border-slate-200 bg-white py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
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

function DetailRow({ icon: Icon, label, value, multiline }) {
  return (
    <div className="flex items-start gap-3 rounded-xl border border-slate-100 bg-slate-50/50 p-3">
      <div className="grid h-8 w-8 flex-shrink-0 place-items-center rounded-lg bg-white text-slate-500 ring-1 ring-slate-200">
        <Icon className="w-3.5 h-3.5" />
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500">{label}</p>
        <p className={`mt-0.5 text-sm font-medium text-slate-800 ${multiline ? '' : 'truncate'}`}>{value}</p>
      </div>
    </div>
  );
}

export default CalendarPage;
