import api from './api';

const bookingService = {
  // ===== USER ACTIONS =====

  // Create new booking
  createBooking: async (data) => {
    const response = await api.post('/bookings', data);
    return response.data;
  },

  

  // Update booking
  updateBooking: async (id, data) => {
    const response = await api.put(`/bookings/${id}`, data);
    return response.data;
  },

  // Cancel booking
  cancelBooking: async (id, reason = null) => {
    const response = await api.patch(`/bookings/${id}/cancel`, {
      reason,
    });
    return response.data;
  },

  // ===== ADMIN ACTIONS =====

  getAllBookings: async (status = null) => {
    const params = status ? { status } : {};
    const response = await api.get('/bookings', { params });
    return response.data;
  },

  approveBooking: async (id, reason = null) => {
    const response = await api.patch(`/bookings/${id}/approve`, {
      reason,
    });
    return response.data;
  },

  rejectBooking: async (id, reason) => {
    const response = await api.patch(`/bookings/${id}/reject`, {
      reason,
    });
    return response.data;
  },

  deleteBooking: async (id) => {
    await api.delete(`/bookings/${id}`);
  },
};

export default bookingService;