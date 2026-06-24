import { useState, useEffect, useMemo } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import {
  CalendarPlus,
  Loader2,
  Building2,
  CalendarDays,
  Clock,
  FileText,
  Users,
  MapPin,
  Sparkles,
  CheckCircle2,
  RotateCcw,
  Send,
  Info,
} from 'lucide-react';
import toast from 'react-hot-toast';
import bookingService from '../services/bookingService';
import { getResources } from '../services/resourceService';
import { useRole } from '../context/RoleContext';

function NewBooking() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { role } = useRole();

  const [resources, setResources] = useState([]);
  const [loadingResources, setLoadingResources] = useState(true);

  const [formData, setFormData] = useState({
    resourceId: '',
    date: searchParams.get('date') || '',
    startTime: '',
    endTime: '',
    purpose: '',
    expectedAttendees: '',
  });

  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      setLoadingResources(true);
      try {
        const data = await getResources({}, role);
        if (cancelled) return;
        const list = Array.isArray(data) ? data : data?.data ?? [];
        const bookable = list.filter((r) => {
          const status = String(r?.status || '').toUpperCase();
          return status === '' || status === 'ACTIVE';
        });
        setResources(bookable);
      } catch (err) {
        console.error('Failed to load resources:', err);
        if (!cancelled) setResources([]);
      } finally {
        if (!cancelled) setLoadingResources(false);
      }
    };

    load();
    return () => {
      cancelled = true;
    };
  }, [role]);

  const selectedResource = useMemo(
    () => resources.find((r) => r.id === formData.resourceId),
    [resources, formData.resourceId]
  );

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: null }));
    }
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.resourceId) {
      newErrors.resourceId = 'Please pick a resource';
    }

    if (!formData.date) {
      newErrors.date = 'Please select a date';
    } else {
      const selectedDate = new Date(formData.date);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      if (selectedDate < today) {
        newErrors.date = 'Date cannot be in the past';
      }
    }

    if (!formData.startTime) {
      newErrors.startTime = 'Please select a start time';
    } else if (formData.startTime < '06:00') {
      newErrors.startTime = 'Start time cannot be before 06:00 (campus closed)';
    }

    if (!formData.endTime) {
      newErrors.endTime = 'Please select an end time';
    } else if (formData.endTime > '22:00') {
      newErrors.endTime = 'End time cannot be after 22:00 (campus closed)';
    }

    if (
      formData.startTime &&
      formData.endTime &&
      formData.startTime >= formData.endTime
    ) {
      newErrors.endTime = 'End time must be after start time';
    }

    if (!formData.purpose || formData.purpose.trim().length < 5) {
      newErrors.purpose = 'Purpose must be at least 5 characters';
    }

    if (formData.expectedAttendees && parseInt(formData.expectedAttendees) < 1) {
      newErrors.expectedAttendees = 'Must be at least 1';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) {
      toast.error('Please fix the errors in the form');
      return;
    }

    if (!selectedResource) {
      toast.error('Selected resource is no longer available');
      return;
    }

    setSubmitting(true);

    try {
      const bookingData = {
        resourceId: selectedResource.id,
        resourceName: selectedResource.name,
        resourceType: selectedResource.type,
        location: String(selectedResource.location || '').trim().toLowerCase(),
        startTime: `${formData.date}T${formData.startTime}:00`,
        endTime: `${formData.date}T${formData.endTime}:00`,
        purpose: formData.purpose.trim(),
        expectedAttendees: formData.expectedAttendees
          ? parseInt(formData.expectedAttendees)
          : null,
      };

      const response = await bookingService.createBooking(bookingData);

      if (response.success) {
        toast.success('Booking request submitted successfully!');
        navigate('/my-bookings');
      }
    } catch (err) {
      console.error('Booking creation failed:', err);
      const message = err.response?.data?.message || 'Failed to create booking';
      toast.error(message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleReset = () => {
    setFormData({
      resourceId: '',
      date: '',
      startTime: '',
      endTime: '',
      purpose: '',
      expectedAttendees: '',
    });
    setErrors({});
  };

  const today = new Date().toISOString().split('T')[0];

  const inputBase =
    'w-full px-4 py-3 rounded-xl text-sm bg-white border transition-all duration-200 outline-none focus:ring-4';
  const inputOk =
    'border-slate-200 hover:border-blue-300 focus:border-blue-400 focus:ring-blue-100';
  const inputBad =
    'border-rose-300 bg-rose-50/50 focus:border-rose-400 focus:ring-rose-100';

  return (
    <div className="min-h-full">
      {/* Page header */}
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <div className="inline-flex items-center gap-1.5 rounded-full border border-blue-200 bg-blue-50 px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.18em] text-blue-700">
            <Sparkles className="w-3 h-3" />
            New Request
          </div>
          <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-900">New Booking</h1>
          <p className="mt-1 text-sm text-slate-500">Request a campus resource booking</p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
        {/* ── Main form card ────────────────────────────────────── */}
        <div className="relative overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
          <div className="relative bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 px-6 py-5 text-white">
            <div className="pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full bg-white/15 blur-3xl" />
            <div className="pointer-events-none absolute -bottom-12 left-1/3 h-32 w-32 rounded-full bg-cyan-300/20 blur-3xl" />
            <div className="relative flex items-center gap-3">
              <div className="grid h-11 w-11 place-items-center rounded-xl bg-white/15 backdrop-blur ring-1 ring-white/25">
                <CalendarPlus className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-base font-bold">Booking Request Form</h2>
                <p className="text-xs text-blue-100">Pick a resource, choose a time, submit for approval.</p>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5 p-6 sm:p-8">
            {/* RESOURCE */}
            <div>
              <label className="mb-1.5 flex items-center gap-1.5 text-sm font-semibold text-slate-700">
                <Building2 className="w-3.5 h-3.5 text-blue-600" />
                Resource <span className="text-rose-500">*</span>
              </label>
              <select
                value={formData.resourceId}
                onChange={(e) => handleChange('resourceId', e.target.value)}
                disabled={loadingResources}
                className={`${inputBase} ${errors.resourceId ? inputBad : inputOk}`}
              >
                <option value="">
                  {loadingResources
                    ? 'Loading resources...'
                    : resources.length === 0
                    ? 'No bookable resources — ask an admin to add one'
                    : 'Select a resource'}
                </option>
                {resources.map((r) => (
                  <option key={r.id} value={r.id}>
                    {r.name} · {r.type} · {r.location}
                  </option>
                ))}
              </select>
              {errors.resourceId && (
                <p className="mt-1.5 flex items-center gap-1 text-xs font-medium text-rose-600">
                  <Info className="w-3 h-3" />
                  {errors.resourceId}
                </p>
              )}
            </div>

            {selectedResource && (
              <div className="relative overflow-hidden rounded-2xl border border-blue-100 bg-gradient-to-r from-blue-50 to-indigo-50/60 p-4">
                <div className="flex items-start gap-3">
                  <div className="grid h-10 w-10 flex-shrink-0 place-items-center rounded-xl bg-white text-blue-600 ring-1 ring-blue-100">
                    <CheckCircle2 className="w-5 h-5" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-bold text-slate-900">{selectedResource.name}</p>
                    <div className="mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-600">
                      <span className="inline-flex items-center gap-1">
                        <Building2 className="w-3 h-3 text-slate-400" />
                        {selectedResource.type}
                      </span>
                      {selectedResource.location && (
                        <span className="inline-flex items-center gap-1">
                          <MapPin className="w-3 h-3 text-slate-400" />
                          {selectedResource.location}
                        </span>
                      )}
                      {selectedResource.capacity && (
                        <span className="inline-flex items-center gap-1">
                          <Users className="w-3 h-3 text-slate-400" />
                          Capacity {selectedResource.capacity}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Date */}
            <div>
              <label className="mb-1.5 flex items-center gap-1.5 text-sm font-semibold text-slate-700">
                <CalendarDays className="w-3.5 h-3.5 text-blue-600" />
                Date <span className="text-rose-500">*</span>
              </label>
              <input
                type="date"
                min={today}
                value={formData.date}
                onChange={(e) => handleChange('date', e.target.value)}
                className={`${inputBase} ${errors.date ? inputBad : inputOk}`}
              />
              {errors.date && (
                <p className="mt-1.5 flex items-center gap-1 text-xs font-medium text-rose-600">
                  <Info className="w-3 h-3" />
                  {errors.date}
                </p>
              )}
            </div>

            {/* Times */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="mb-1.5 flex items-center gap-1.5 text-sm font-semibold text-slate-700">
                  <Clock className="w-3.5 h-3.5 text-blue-600" />
                  Start <span className="text-rose-500">*</span>
                </label>
                <input
                  type="time"
                  min="06:00"
                  max="22:00"
                  value={formData.startTime}
                  onChange={(e) => handleChange('startTime', e.target.value)}
                  className={`${inputBase} ${errors.startTime ? inputBad : inputOk}`}
                />
                {errors.startTime && (
                  <p className="mt-1.5 flex items-center gap-1 text-xs font-medium text-rose-600">
                    <Info className="w-3 h-3" />
                    {errors.startTime}
                  </p>
                )}
              </div>
              <div>
                <label className="mb-1.5 flex items-center gap-1.5 text-sm font-semibold text-slate-700">
                  <Clock className="w-3.5 h-3.5 text-blue-600" />
                  End <span className="text-rose-500">*</span>
                </label>
                <input
                  type="time"
                  min="06:00"
                  max="22:00"
                  value={formData.endTime}
                  onChange={(e) => handleChange('endTime', e.target.value)}
                  className={`${inputBase} ${errors.endTime ? inputBad : inputOk}`}
                />
                {errors.endTime && (
                  <p className="mt-1.5 flex items-center gap-1 text-xs font-medium text-rose-600">
                    <Info className="w-3 h-3" />
                    {errors.endTime}
                  </p>
                )}
              </div>
            </div>

            <div className="flex items-center gap-2 rounded-xl border border-amber-100 bg-amber-50/70 px-3 py-2 text-xs text-amber-800">
              <Info className="w-3.5 h-3.5 flex-shrink-0" />
              Campus operating hours: <span className="font-semibold">06:00 – 22:00</span>
            </div>

            {/* Purpose */}
            <div>
              <label className="mb-1.5 flex items-center gap-1.5 text-sm font-semibold text-slate-700">
                <FileText className="w-3.5 h-3.5 text-blue-600" />
                Purpose <span className="text-rose-500">*</span>
              </label>
              <textarea
                value={formData.purpose}
                onChange={(e) => handleChange('purpose', e.target.value)}
                placeholder="e.g. Guest lecture on AI"
                rows={3}
                className={`${inputBase} resize-none ${errors.purpose ? inputBad : inputOk}`}
              />
              {errors.purpose ? (
                <p className="mt-1.5 flex items-center gap-1 text-xs font-medium text-rose-600">
                  <Info className="w-3 h-3" />
                  {errors.purpose}
                </p>
              ) : (
                <p className="mt-1.5 text-xs text-slate-500">
                  Briefly describe the reason for your booking (minimum 5 characters)
                </p>
              )}
            </div>

            {/* Attendees */}
            <div>
              <label className="mb-1.5 flex items-center gap-1.5 text-sm font-semibold text-slate-700">
                <Users className="w-3.5 h-3.5 text-blue-600" />
                Expected Attendees
              </label>
              <input
                type="number"
                min="1"
                value={formData.expectedAttendees}
                onChange={(e) => handleChange('expectedAttendees', e.target.value)}
                placeholder="e.g. 30"
                className={`${inputBase} ${errors.expectedAttendees ? inputBad : inputOk}`}
              />
              {errors.expectedAttendees ? (
                <p className="mt-1.5 flex items-center gap-1 text-xs font-medium text-rose-600">
                  <Info className="w-3 h-3" />
                  {errors.expectedAttendees}
                </p>
              ) : (
                <p className="mt-1.5 text-xs text-slate-500">Optional — estimated number of people attending</p>
              )}
            </div>

            <div className="flex gap-3 pt-2">
              <button
                type="submit"
                disabled={submitting || loadingResources}
                className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-900/20 transition hover:from-blue-700 hover:to-indigo-700 hover:shadow-blue-900/30 active:scale-[0.98] disabled:opacity-60"
              >
                {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                Submit Booking Request
              </button>
              <button
                type="button"
                onClick={handleReset}
                className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
              >
                <RotateCcw className="w-4 h-4" />
                Reset
              </button>
            </div>
          </form>
        </div>

        {/* ── Side info panel ───────────────────────────────────── */}
        <aside className="space-y-4">
          <div className="rounded-2xl border border-slate-200 bg-gradient-to-br from-white to-slate-50 p-5 shadow-sm">
            <div className="flex items-center gap-2">
              <div className="grid h-8 w-8 place-items-center rounded-lg bg-blue-100 text-blue-600">
                <Info className="w-4 h-4" />
              </div>
              <h3 className="text-sm font-bold text-slate-900">How it works</h3>
            </div>
            <ol className="mt-4 space-y-3">
              {[
                'Pick an available resource from the catalogue',
                'Choose a date and time within operating hours',
                'Describe the purpose so admins can approve quickly',
                'Track approval in your bookings list',
              ].map((step, i) => (
                <li key={step} className="flex items-start gap-3">
                  <span className="grid h-6 w-6 flex-shrink-0 place-items-center rounded-full bg-gradient-to-br from-blue-600 to-indigo-600 text-[10px] font-bold text-white">
                    {i + 1}
                  </span>
                  <span className="text-xs leading-relaxed text-slate-600">{step}</span>
                </li>
              ))}
            </ol>
          </div>

          <div className="rounded-2xl border border-emerald-100 bg-gradient-to-br from-emerald-50 to-teal-50/60 p-5">
            <div className="flex items-center gap-2">
              <div className="grid h-8 w-8 place-items-center rounded-lg bg-white text-emerald-600 ring-1 ring-emerald-100">
                <Sparkles className="w-4 h-4" />
              </div>
              <h3 className="text-sm font-bold text-slate-900">Quick tip</h3>
            </div>
            <p className="mt-3 text-xs leading-relaxed text-slate-600">
              Bookings submitted earlier tend to get approved faster. Provide a clear purpose so reviewers don't have to follow up.
            </p>
          </div>
        </aside>
      </div>
    </div>
  );
}

export default NewBooking;
