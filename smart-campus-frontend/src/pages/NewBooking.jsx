import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { CalendarPlus, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';
import bookingService from '../services/bookingService';

function NewBooking() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  // Form state
  const [formData, setFormData] = useState({
    resourceName: '',
    resourceType: '',
    location: '',
    date: searchParams.get('date') || '',
    startTime: '',
    endTime: '',
    purpose: '',
    expectedAttendees: '',
  });

  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState({});
  // State for suggested time slots
  const [suggestions, setSuggestions] = useState([]);

  // Handle input changes
  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: null }));
    }
  };
  // Fetch suggestions based on location and date
  const fetchSuggestions = async () => {
    if (!formData.location || !formData.date) return;

    try {
      const res = await fetch(
        `http://localhost:8081/api/v1/bookings/suggest-slots?location=${formData.location}&date=${formData.date}`
      );

      const data = await res.json();
      setSuggestions(data);
    } catch (err) {
      console.error(err);
    }
  };

  // AUTO TRIGGER
  useEffect(() => {
    fetchSuggestions();
  }, [formData.location, formData.date]);

  // Validate form
  const validate = () => {
    const newErrors = {};

    if (!formData.resourceName) {
      newErrors.resourceName = 'Please enter resource name';
    }
    if (!formData.resourceType) {
      newErrors.resourceType = 'Please select type';
    }
    if (!formData.location) {
      newErrors.location = 'Please enter location';
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

    if (
      formData.expectedAttendees &&
      parseInt(formData.expectedAttendees) < 1
    ) {
      newErrors.expectedAttendees = 'Must be at least 1';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) {
      toast.error('Please fix the errors in the form');
      return;
    }

    setSubmitting(true);

    try {
      const bookingData = {
        resourceName: formData.resourceName,
        resourceType: formData.resourceType,
        location: formData.location.trim().toLowerCase(),
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
      const message =
        err.response?.data?.message || 'Failed to create booking';
      toast.error(message);
    } finally {
      setSubmitting(false);
    }
  };

  // Reset
  const handleReset = () => {
    setFormData({
      resourceName: '',
      resourceType: '',
      location: '',
      date: '',
      startTime: '',
      endTime: '',
      purpose: '',
      expectedAttendees: '',
    });
    setErrors({});
  };

  const today = new Date().toISOString().split('T')[0];

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-100 via-blue-50 to-indigo-100 p-6">
      <div className="w-full max-w-2xl">
        <div className="mb-6 text-center">
          <h1 className="text-2xl font-bold text-slate-900">New Booking</h1>
          <p className="text-slate-500 text-sm mt-1">
            Request a campus resource booking
          </p>
        </div>

        <div className="relative backdrop-blur-xl bg-white/70 border border-white/40 rounded-2xl shadow-2xl p-6 sm:p-8 transition-all duration-300 hover:shadow-blue-200/50">
          <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-blue-200/20 to-indigo-200/20 blur-xl opacity-40"></div>
          <div className="relative z-10">

            <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-100">
              <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
                <CalendarPlus className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <h2 className="font-semibold text-slate-900">
                  Booking Request Form
                </h2>
                <p className="text-xs text-slate-400">
                  Fill in the details below to request a booking
                </p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">

              {/* RESOURCE NAME */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  Resource Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.resourceName}
                  onChange={(e) => handleChange('resourceName', e.target.value)}
                  placeholder="e.g. Innovation Lab 4B"
                  className={`w-full px-4 py-3 rounded-xl text-sm bg-white/80 backdrop-blur border transition-all duration-200 focus:ring-2 focus:ring-blue-400 focus:outline-none ${
                    errors.resourceName ? 'border-red-300 bg-red-50' : 'border-slate-300 hover:border-blue-300'
                  }`}
                />
                {errors.resourceName && (
                  <p className="mt-1 text-xs text-red-500">{errors.resourceName}</p>
                )}
              </div>

              {/* TYPE */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  Type <span className="text-red-500">*</span>
                </label>
                <select
                  value={formData.resourceType}
                  onChange={(e) => handleChange('resourceType', e.target.value)}
                  className={`w-full px-4 py-3 rounded-xl text-sm bg-white/80 backdrop-blur border transition-all duration-200 focus:ring-2 focus:ring-blue-400 focus:outline-none ${
                    errors.resourceType ? 'border-red-300 bg-red-50' : 'border-slate-300 hover:border-blue-300'
                  }`}
                >
                  <option value="">Select Type</option>
                  <option value="LAB">Lab</option>
                  <option value="LECTURE_HALL">Lecture Hall</option>
                  <option value="MEETING_ROOM">Meeting Room</option>
                  <option value="AUDITORIUM">Auditorium</option>
                  <option value="LIBRARY_SPACE">Library Space</option>
                  <option value="EQUIPMENT">Equipment</option>
                  <option value="OPEN_AREA_THEATER">Open Area Theater</option>
                  <option value="SPORTS_COMPLEX">Sports Complex</option>
                </select>
                {errors.resourceType && (
                  <p className="mt-1 text-xs text-red-500">{errors.resourceType}</p>
                )}
              </div>

              {/* LOCATION */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  Location <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.location}
                  onChange={(e) => handleChange('location', e.target.value)}
                  placeholder="e.g. Building A, Floor 2"
                  className={`w-full px-4 py-3 rounded-xl text-sm bg-white/80 backdrop-blur border transition-all duration-200 focus:ring-2 focus:ring-blue-400 focus:outline-none ${
                    errors.location ? 'border-red-300 bg-red-50' : 'border-slate-300 hover:border-blue-300'
                  }`}
                />
                {errors.location && (
                  <p className="mt-1 text-xs text-red-500">{errors.location}</p>
                )}
              </div>

              {/* Date */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  Date <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  min={today}
                  value={formData.date}
                  onChange={(e) => handleChange('date', e.target.value)}
                  className={`w-full px-4 py-3 rounded-xl text-sm bg-white/80 backdrop-blur border transition-all duration-200 focus:ring-2 focus:ring-blue-400 focus:outline-none ${
                    errors.date ? 'border-red-300 bg-red-50' : 'border-slate-300 hover:border-blue-300'
                  }`}
                />
                {errors.date && (
                  <p className="mt-1 text-xs text-red-500">{errors.date}</p>
                )}
              </div>

              {/* Times */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">
                    Start Time <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="time"
                    min="06:00"
                    max="22:00"
                    value={formData.startTime}
                    onChange={(e) => handleChange('startTime', e.target.value)}
                    className={`w-full px-4 py-3 rounded-xl text-sm bg-white/80 backdrop-blur border transition-all duration-200 focus:ring-2 focus:ring-blue-400 focus:outline-none ${
                      errors.startTime ? 'border-red-300 bg-red-50' : 'border-slate-300 hover:border-blue-300'
                    }`}
                  />
                  {errors.startTime && (
                    <p className="mt-1 text-xs text-red-500">{errors.startTime}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">
                    End Time <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="time"
                    min="06:00"
                    max="22:00"
                    value={formData.endTime}
                    onChange={(e) => handleChange('endTime', e.target.value)}
                    className={`w-full px-4 py-3 rounded-xl text-sm bg-white/80 backdrop-blur border transition-all duration-200 focus:ring-2 focus:ring-blue-400 focus:outline-none ${
                      errors.endTime ? 'border-red-300 bg-red-50' : 'border-slate-300 hover:border-blue-300'
                    }`}
                  />
                  {errors.endTime && (
                    <p className="mt-1 text-xs text-red-500">{errors.endTime}</p>
                  )}
                </div>
              </div>

              <p className="text-xs text-slate-400 -mt-2">
                Campus operating hours: 06:00 – 22:00
              </p>

              {/* SUGGESTIONS UI */}
              {suggestions.length > 0 && (
                <div className="mt-3">
                  <p className="text-sm text-slate-500">Suggested free slots:</p>

                  <ul className="text-sm text-green-600 mt-1 space-y-1">
                    {suggestions.map((s, i) => (
                      <li key={i}>✔ {s}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Purpose */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  Purpose <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={formData.purpose}
                  onChange={(e) => handleChange('purpose', e.target.value)}
                  placeholder="e.g. Guest lecture on AI"
                  rows={3}
                  className={`w-full px-4 py-3 rounded-xl text-sm bg-white/80 backdrop-blur border transition-all duration-200 focus:ring-2 focus:ring-blue-400 focus:outline-none resize-none ${
                    errors.purpose ? 'border-red-300 bg-red-50' : 'border-slate-300 hover:border-blue-300'
                  }`}
                />
                {errors.purpose && (
                  <p className="mt-1 text-xs text-red-500">{errors.purpose}</p>
                )}
                <p className="mt-1 text-xs text-slate-400">
                  Briefly describe the reason for your booking (minimum 5 characters)
                </p>
              </div>

              {/* Attendees */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  Expected Attendees
                </label>
                <input
                  type="number"
                  min="1"
                  value={formData.expectedAttendees}
                  onChange={(e) =>
                    handleChange('expectedAttendees', e.target.value)
                  }
                  placeholder="e.g. 30"
                  className={`w-full px-4 py-3 rounded-xl text-sm bg-white/80 backdrop-blur border transition-all duration-200 focus:ring-2 focus:ring-blue-400 focus:outline-none ${
                    errors.expectedAttendees ? 'border-red-300 bg-red-50' : 'border-slate-300 hover:border-blue-300'
                  }`}
                />
                {errors.expectedAttendees && (
                  <p className="mt-1 text-xs text-red-500">{errors.expectedAttendees}</p>
                )}
                <p className="mt-1 text-xs text-slate-400">
                  Optional — estimated number of people attending
                </p>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl shadow-lg hover:scale-[1.02] active:scale-95 transition-all duration-200 flex items-center justify-center gap-2"
                >
                  {submitting && <Loader2 className="w-4 h-4 animate-spin" />}
                  Submit Booking Request
                </button>
                <button
                  type="button"
                  onClick={handleReset}
                  className="px-6 py-3 border border-slate-300 rounded-xl hover:bg-slate-100 transition-all"
                >
                  Reset
                </button>
              </div>

            </form>

          </div>
        </div>
      </div>
    </div>
  );
}

export default NewBooking;