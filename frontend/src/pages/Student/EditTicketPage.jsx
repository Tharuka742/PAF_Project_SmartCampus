import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { clearToken, getMe } from '../../services/auth'
import { updateMyTicket, getTicketById, CATEGORY_LABELS, PRIORITY_LABELS } from '../../services/ticket'

const CATEGORIES = Object.keys(CATEGORY_LABELS)
const PRIORITIES = Object.keys(PRIORITY_LABELS)

function validate(form) {
    const errors = {}
    if (!form.title.trim() || form.title.trim().length < 5)
        errors.title = 'Title must be at least 5 characters'
    if (!form.resourceLocation.trim())
        errors.resourceLocation = 'Resource or location is required'
    if (!form.category)
        errors.category = 'Please select a category'
    if (!form.priority)
        errors.priority = 'Please select a priority'
    if (!form.description.trim() || form.description.trim().length < 10)
        errors.description = 'Description must be at least 10 characters'
    if (!form.contactNumber.trim())
        errors.contactNumber = 'Contact number is required'
    else if (!/^[0-9+\-\s()]{7,20}$/.test(form.contactNumber.trim()))
        errors.contactNumber = 'Enter a valid contact number'
    return errors
}

function Sidebar({ user, navigate }) {
    const logout = () => { clearToken(); navigate('/auth') }
    return (
        <aside className="flex flex-col border-r border-slate-800 bg-[#0c1f44] text-slate-200">
            <div className="border-b border-white/10 px-5 py-6">
                <div className="flex items-center gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-500">
                        <svg className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>
                    </div>
                    <div>
                        <p className="text-sm font-bold text-white">Smart Campus</p>
                        <p className="text-xs text-slate-400">Incident Ticketing</p>
                    </div>
                </div>
            </div>
            <nav className="flex-1 px-3 py-4 space-y-1">
                <p className="px-2 pt-2 text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-400">Navigation</p>
                <button onClick={() => navigate('/tickets')} className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm text-slate-300 hover:bg-white/10">
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" /><rect x="14" y="14" width="7" height="7" /><rect x="3" y="14" width="7" height="7" /></svg>
                    Dashboard
                </button>
                <button onClick={() => navigate('/tickets/my')} className="flex w-full items-center gap-2 rounded-lg bg-blue-600/30 px-3 py-2 text-left text-sm font-semibold text-white">
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" /></svg>
                    My Tickets
                </button>
            </nav>
            <div className="mt-auto border-t border-white/10 px-4 py-4 space-y-2">
                {user && <p className="text-xs text-slate-400 px-1">Signed in as <span className="text-white">{user.username}</span></p>}
                <button onClick={() => navigate('/dashboard/student')} className="w-full rounded-lg border border-slate-600/50 bg-slate-700/30 px-3 py-2 text-sm text-slate-300 hover:bg-slate-700/50 transition">← Back to Dashboard</button>
                <button onClick={logout} className="w-full rounded-lg border border-rose-400/25 bg-rose-500/10 px-3 py-2 text-sm font-semibold text-rose-200">Logout</button>
            </div>
        </aside>
    )
}

export default function EditTicketPage() {
    const navigate = useNavigate()
    const { id } = useParams()
    const [user, setUser] = useState(null)
    const [form, setForm] = useState({
        title: '',
        resourceLocation: '',
        category: '',
        priority: 'MEDIUM',
        description: '',
        contactNumber: '',
    })
    const [errors, setErrors] = useState({})
    const [submitting, setSubmitting] = useState(false)
    const [loadingData, setLoadingData] = useState(true)
    const [success, setSuccess] = useState('')
    const [apiError, setApiError] = useState('')

    useEffect(() => {
        getMe().then(setUser).catch(() => {})
        getTicketById(id)
            .then(ticket => {
                if (ticket.status !== 'OPEN' || ticket.assignedTechnicianId) {
                    navigate('/tickets/my')
                    return
                }
                setForm({
                    title: ticket.title,
                    resourceLocation: ticket.resourceLocation,
                    category: ticket.category,
                    priority: ticket.priority,
                    description: ticket.description,
                    contactNumber: ticket.contactNumber,
                })
            })
            .catch(() => setApiError('Could not load ticket data...'))
            .finally(() => setLoadingData(false))
    }, [id, navigate])

    const handleChange = (e) => {
        setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))
        setErrors(prev => ({ ...prev, [e.target.name]: '' }))
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        const errs = validate(form)
        if (Object.keys(errs).length > 0) { setErrors(errs); return }

        setSubmitting(true)
        setApiError('')
        setSuccess('')
        try {
            await updateMyTicket(id, form)
            setSuccess('Ticket updated successfully!')
            setTimeout(() => navigate('/tickets/my'), 1500)
        } catch (err) {
            setApiError(err?.response?.data?.message || 'Failed to update ticket.')
        } finally {
            setSubmitting(false)
        }
    }

    if (loadingData) {
        return <div className="min-h-screen bg-slate-100 p-10 text-center text-slate-500">Loading ticket...</div>
    }

    return (
        <div className="min-h-screen bg-slate-100 text-slate-900">
            <div className="grid min-h-screen lg:grid-cols-[250px_1fr]">
                <Sidebar user={user} navigate={navigate} />

                <main className="p-4 sm:p-8">
                    <div className="mb-6">
                        <p className="text-xs text-slate-500">MODULE C</p>
                        <h1 className="mt-1 text-3xl font-bold text-slate-900">Edit Incident Ticket</h1>
                        <p className="mt-1 text-sm text-slate-500">Update the details of your ticket.</p>
                    </div>

                    {success && (
                        <div className="mb-4 flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-700">
                            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                            {success}
                        </div>
                    )}
                    {apiError && (
                        <div className="mb-4 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">{apiError}</div>
                    )}

                    <form onSubmit={handleSubmit} className="max-w-2xl rounded-2xl border border-slate-200 bg-white p-6 shadow-sm space-y-5">
                        {/* Title */}
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-1">Ticket Title <span className="text-rose-500">*</span></label>
                            <input
                                id="title"
                                name="title"
                                value={form.title}
                                onChange={handleChange}
                                placeholder="e.g. Projector not working in Room B-204"
                                className={`w-full rounded-xl border px-4 py-2.5 text-sm outline-none transition focus:ring-2 focus:ring-blue-400 ${errors.title ? 'border-rose-400 bg-rose-50' : 'border-slate-300 bg-white'}`}
                            />
                            {errors.title && <p className="mt-1 text-xs text-rose-600">{errors.title}</p>}
                        </div>

                        {/* Resource / Location */}
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-1">Resource or Location <span className="text-rose-500">*</span></label>
                            <input
                                id="resourceLocation"
                                name="resourceLocation"
                                value={form.resourceLocation}
                                onChange={handleChange}
                                placeholder="e.g. Computer Lab B-204, Block B"
                                className={`w-full rounded-xl border px-4 py-2.5 text-sm outline-none transition focus:ring-2 focus:ring-blue-400 ${errors.resourceLocation ? 'border-rose-400 bg-rose-50' : 'border-slate-300 bg-white'}`}
                            />
                            {errors.resourceLocation && <p className="mt-1 text-xs text-rose-600">{errors.resourceLocation}</p>}
                        </div>

                        {/* Category + Priority */}
                        <div className="grid gap-4 sm:grid-cols-2">
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-1">Category <span className="text-rose-500">*</span></label>
                                <select
                                    id="category"
                                    name="category"
                                    value={form.category}
                                    onChange={handleChange}
                                    className={`w-full rounded-xl border px-4 py-2.5 text-sm outline-none transition focus:ring-2 focus:ring-blue-400 ${errors.category ? 'border-rose-400 bg-rose-50' : 'border-slate-300 bg-white'}`}
                                >
                                    <option value="">Select category</option>
                                    {CATEGORIES.map(c => (
                                        <option key={c} value={c}>{CATEGORY_LABELS[c]}</option>
                                    ))}
                                </select>
                                {errors.category && <p className="mt-1 text-xs text-rose-600">{errors.category}</p>}
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-1">Priority <span className="text-rose-500">*</span></label>
                                <select
                                    id="priority"
                                    name="priority"
                                    value={form.priority}
                                    onChange={handleChange}
                                    className={`w-full rounded-xl border px-4 py-2.5 text-sm outline-none transition focus:ring-2 focus:ring-blue-400 ${errors.priority ? 'border-rose-400 bg-rose-50' : 'border-slate-300 bg-white'}`}
                                >
                                    {PRIORITIES.map(p => (
                                        <option key={p} value={p}>{PRIORITY_LABELS[p]}</option>
                                    ))}
                                </select>
                                {errors.priority && <p className="mt-1 text-xs text-rose-600">{errors.priority}</p>}
                            </div>
                        </div>

                        {/* Description */}
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-1">Description <span className="text-rose-500">*</span></label>
                            <textarea
                                id="description"
                                name="description"
                                rows={4}
                                value={form.description}
                                onChange={handleChange}
                                placeholder="Describe the issue clearly — what happened, when it occurred, and any error messages."
                                className={`w-full resize-none rounded-xl border px-4 py-2.5 text-sm outline-none transition focus:ring-2 focus:ring-blue-400 ${errors.description ? 'border-rose-400 bg-rose-50' : 'border-slate-300 bg-white'}`}
                            />
                            <div className="flex items-center justify-between mt-1">
                                {errors.description
                                    ? <p className="text-xs text-rose-600">{errors.description}</p>
                                    : <p className="text-xs text-slate-400">Minimum 10 characters</p>}
                                <p className="text-xs text-slate-400">{form.description.length}/1000</p>
                            </div>
                        </div>

                        {/* Contact Number */}
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-1">Preferred Contact Number <span className="text-rose-500">*</span></label>
                            <input
                                id="contactNumber"
                                name="contactNumber"
                                value={form.contactNumber}
                                onChange={handleChange}
                                placeholder="e.g. +94 77 123 4567"
                                className={`w-full rounded-xl border px-4 py-2.5 text-sm outline-none transition focus:ring-2 focus:ring-blue-400 ${errors.contactNumber ? 'border-rose-400 bg-rose-50' : 'border-slate-300 bg-white'}`}
                            />
                            {errors.contactNumber && <p className="mt-1 text-xs text-rose-600">{errors.contactNumber}</p>}
                        </div>

                        <div className="flex gap-3 pt-2">
                            <button
                                type="button"
                                onClick={() => navigate(-1)}
                                className="flex-1 rounded-xl border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                id="submit-ticket-btn"
                                disabled={submitting}
                                className="flex-1 rounded-xl bg-blue-600 px-5 py-3 text-sm font-bold text-white hover:bg-blue-700 disabled:opacity-60 transition"
                            >
                                {submitting ? 'Updating...' : 'Save Updates'}
                            </button>
                        </div>
                    </form>
                </main>
            </div>
        </div>
    )
}
