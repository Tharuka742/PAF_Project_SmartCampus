import api from "./api";

export const createTicket = async (ticketData) => {
  const response = await api.post("/tickets", ticketData);
  return response.data;
};

export const getAllTickets = async () => {
  const response = await api.get("/tickets");
  return response.data;
};

export const getMyTickets = async () => {
  const response = await api.get("/tickets/my");
  return response.data;
};

export const getTicketById = async (id) => {
  const response = await api.get(`/tickets/${id}`);
  return response.data;
};

export const getAssignedTickets = async (technicianId) => {
  const response = await api.get(`/tickets/assigned/${technicianId}`);
  return response.data;
};

export const assignTechnician = async (ticketId, technicianId) => {
  const response = await api.patch(`/tickets/${ticketId}/assign`, {
    technicianId,
  });
  return response.data;
};

export const updateTicketStatus = async (ticketId, statusData) => {
  const response = await api.patch(`/tickets/${ticketId}/status`, statusData);
  return response.data;
};