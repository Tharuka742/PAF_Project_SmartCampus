import api from './api'

// ─── CREATE TICKET (multipart) ────────────────────────────────────────────────
export async function createTicket({ title, resourceLocation, category, priority, description, contactNumber, files }) {
    const form = new FormData()
    form.append('title', title)
    form.append('resourceLocation', resourceLocation)
    form.append('category', category)
    form.append('priority', priority)
    form.append('description', description)
    form.append('contactNumber', contactNumber)
    if (files && files.length > 0) {
        files.forEach(f => form.append('files', f))
    }
    const response = await api.post('/tickets', form, {
        headers: { 'Content-Type': 'multipart/form-data' },
    })
    return response.data
}

// ─── GET MY TICKETS ───────────────────────────────────────────────────────────
export async function getMyTickets() {
    const response = await api.get('/tickets/my')
    return response.data
}

// ─── GET ASSIGNED TICKETS (TECHNICIAN) ───────────────────────────────────────
export async function getAssignedTickets() {
    const response = await api.get('/tickets/assigned')
    return response.data
}

// ─── GET ALL TICKETS (ADMIN) ──────────────────────────────────────────────────
export async function getAllTickets() {
    const response = await api.get('/tickets/all')
    return response.data
}

// ─── GET TICKET BY ID ─────────────────────────────────────────────────────────
export async function getTicketById(id) {
    const response = await api.get(`/tickets/${id}`)
    return response.data
}

// ─── UPDATE TICKET (STUDENT) ──────────────────────────────────────────────────
export async function updateMyTicket(id, data) {
    const response = await api.put(`/tickets/${id}`, data)
    return response.data
}

// ─── DELETE TICKET (STUDENT) ──────────────────────────────────────────────────
export async function deleteMyTicket(id) {
    const response = await api.delete(`/tickets/${id}`)
    return response.data
}

// ─── UPDATE STATUS ────────────────────────────────────────────────────────────
export async function updateTicketStatus(id, status, reason = '') {
    const response = await api.patch(`/tickets/${id}/status`, { status, reason })
    return response.data
}

// ─── ASSIGN TECHNICIAN ────────────────────────────────────────────────────────
export async function assignTechnician(ticketId, technicianId) {
    const response = await api.patch(`/tickets/${ticketId}/assign`, { technicianId })
    return response.data
}

// ─── COMMENTS ─────────────────────────────────────────────────────────────────
export async function getComments(ticketId) {
    const response = await api.get(`/tickets/${ticketId}/comments`)
    return response.data
}

export async function addComment(ticketId, content) {
    const response = await api.post(`/tickets/${ticketId}/comments`, { content })
    return response.data
}

export async function editComment(commentId, content) {
    const response = await api.put(`/tickets/comments/${commentId}`, { content })
    return response.data
}

export async function deleteComment(commentId) {
    const response = await api.delete(`/tickets/comments/${commentId}`)
    return response.data
}

// ─── STATS ────────────────────────────────────────────────────────────────────
export async function getMyTicketStats() {
    const response = await api.get('/tickets/stats/my')
    return response.data
}

export async function getAllTicketStats() {
    const response = await api.get('/tickets/stats/all')
    return response.data
}

export async function getTechnicianTicketStats() {
    const response = await api.get('/tickets/stats/technician')
    return response.data
}

// ─── GET TECHNICIANS LIST ─────────────────────────────────────────────────────
export async function getTechnicians() {
    const response = await api.get('/tickets/technicians')
    return response.data
}

// ─── HELPERS ─────────────────────────────────────────────────────────────────
export const STATUS_LABELS = {
    OPEN: 'Open',
    IN_PROGRESS: 'In Progress',
    RESOLVED: 'Resolved',
    CLOSED: 'Closed',
    REJECTED: 'Rejected',
}

export const PRIORITY_LABELS = {
    LOW: 'Low',
    MEDIUM: 'Medium',
    HIGH: 'High',
    URGENT: 'Urgent',
}

export const CATEGORY_LABELS = {
    AV_EQUIPMENT: 'AV Equipment',
    ELECTRICAL: 'Electrical',
    HVAC: 'HVAC',
    AIR_CONDITIONING: 'Air Conditioning',
    NETWORK_IT: 'Network / IT',
    FURNITURE: 'Furniture',
    PLUMBING: 'Plumbing',
    SECURITY: 'Security',
    PROJECTOR: 'Projector',
    OTHER: 'Other',
}

export function statusColor(status) {
    return {
        OPEN: 'bg-amber-100 text-amber-700',
        IN_PROGRESS: 'bg-blue-100 text-blue-700',
        RESOLVED: 'bg-emerald-100 text-emerald-700',
        CLOSED: 'bg-slate-100 text-slate-600',
        REJECTED: 'bg-rose-100 text-rose-700',
    }[status] ?? 'bg-slate-100 text-slate-600'
}

export function priorityColor(priority) {
    return {
        LOW: 'bg-slate-100 text-slate-600',
        MEDIUM: 'bg-blue-100 text-blue-700',
        HIGH: 'bg-amber-100 text-amber-700',
        URGENT: 'bg-rose-100 text-rose-700',
    }[priority] ?? 'bg-slate-100 text-slate-600'
}
