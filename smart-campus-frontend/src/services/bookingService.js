import api from './api';

const bookingService = {
  // ===== USER ACTIONS =====

  // Create new booking
  createBooking: async (data) => {
    const response = await api.post('/v1/bookings', data);
    return response.data;
  },

  // Get current user's bookings
  getMyBookings: async () => {
    const response = await api.get('/v1/bookings/me');
    return response.data;
  },

  // Get single booking
  getBookingById: async (id) => {
    const response = await api.get(`/v1/bookings/${id}`);
    return response.data;
  },

  // Update booking
  updateBooking: async (id, data) => {
    const response = await api.put(`/v1/bookings/${id}`, data);
    return response.data;
  },

  // Cancel booking
  cancelBooking: async (id, reason = null) => {
    const response = await api.patch(`/v1/bookings/${id}/cancel`, {
      reason,
    });
    return response.data;
  },

  // ===== ADMIN ACTIONS =====

  getAllBookings: async (status = null) => {
    const params = status ? { status } : {};
    const response = await api.get('/v1/bookings', { params });
    return response.data;
  },

  approveBooking: async (id, reason = null) => {
    const response = await api.patch(`/v1/bookings/${id}/approve`, {
      reason,
    });
    return response.data;
  },

  rejectBooking: async (id, reason) => {
    const response = await api.patch(`/v1/bookings/${id}/reject`, {
      reason,
    });
    return response.data;
  },

  deleteBooking: async (id) => {
    await api.delete(`/v1/bookings/${id}`);
  },
};

export default bookingService;