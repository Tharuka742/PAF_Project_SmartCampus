import api from './api'

const TOKEN_KEY = 'token'

export function saveToken(token) {
    localStorage.setItem(TOKEN_KEY, token)
}

export function getToken() {
    return localStorage.getItem(TOKEN_KEY)
}

export function clearToken() {
    localStorage.removeItem(TOKEN_KEY)
}

export async function register(payload) {
    const response = await api.post('/auth/register', payload)
    return response.data
}

export async function login(payload) {
    const response = await api.post('/auth/login', payload)
    return response.data
}

export async function getMe() {
    const response = await api.get('/auth/me')
    return response.data
}

export async function updateMyRole(role, code = '') {
    const response = await api.patch('/auth/me/role', { role, code })
    return response.data
}

export async function deleteMyProfile() {
    const response = await api.delete('/auth/me')
    return response.data
}

export async function getDashboardByRole(role) {
    if (role === 'ADMIN') {
        return (await api.get('/admin/dashboard')).data
    }

    if (role === 'TECHNICIAN') {
        return (await api.get('/technician/dashboard')).data
    }

    return (await api.get('/student/dashboard')).data
}

export async function getAdminUsers() {
    const response = await api.get('/admin/users')
    return response.data
}

export async function updateAdminUserRole(userId, role) {
    const response = await api.patch(`/admin/users/${userId}/role`, { role })
    return response.data
}

export async function deleteAdminUser(userId) {
    const response = await api.delete(`/admin/users/${userId}`)
    return response.data
}
