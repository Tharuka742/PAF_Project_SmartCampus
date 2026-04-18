import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { clearToken, getMe } from '../services/auth'
import {
    getTicketById, getComments, addComment, editComment, deleteComment,
    updateTicketStatus, assignTechnician, getTechnicians,
    STATUS_LABELS, CATEGORY_LABELS, PRIORITY_LABELS, statusColor, priorityColor
} from '../services/ticket'

const STATUS_FLOW = ['OPEN', 'IN_PROGRESS', 'RESOLVED', 'CLOSED', 'REJECTED']

function StatusBadge({ status }) {
    return <span className={`rounded-full px-3 py-1 text-xs font-bold ${statusColor(status)}`}>{STATUS_LABELS[status]}</span>
}

function PriorityBadge({ priority }) {
    return <span className={`rounded-full px-3 py-1 text-xs font-bold ${priorityColor(priority)}`}>{PRIORITY_LABELS[priority]}</span>
}

export default function TicketDetailsPage() {
    const { id } = useParams()
    const navigate = useNavigate()
    const [user, setUser] = useState(null)
    const [ticket, setTicket] = useState(null)
    const [comments, setComments] = useState([])
    const [technicians, setTechnicians] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')

    // Comment state
    const [newComment, setNewComment] = useState('')
    const [submittingComment, setSubmittingComment] = useState(false)
    const [editingId, setEditingId] = useState(null)
    const [editContent, setEditContent] = useState('')

    // Status update state
    const [updatingStatus, setUpdatingStatus] = useState(false)
    const [statusReason, setStatusReason] = useState('')
    const [showStatusForm, setShowStatusForm] = useState(false)
    const [targetStatus, setTargetStatus] = useState('')

    // Assign state
    const [assigning, setAssigning] = useState(false)
    const [selectedTech, setSelectedTech] = useState('')
    const [showAssignForm, setShowAssignForm] = useState(false)

    const [actionError, setActionError] = useState('')
    const [actionSuccess, setActionSuccess] = useState('')

    useEffect(() => {
        const load = async () => {
            try {
                const [me, t, c] = await Promise.all([getMe(), getTicketById(id), getComments(id)])
                setUser(me)
                setTicket(t)
                setComments(c)
                if (me.role === 'ADMIN') {
                    const techs = await getTechnicians()
                    setTechnicians(techs)
                }
            } catch {
                setError('Failed to load ticket details.')
            } finally {
                setLoading(false)
            }
        }
        load()
    }, [id])

    // ─── Comments ─────────────────────────────────────────────────────────────
    const handleAddComment = async (e) => {
        e.preventDefault()
        if (!newComment.trim()) return
        setSubmittingComment(true)
        try {
            const c = await addComment(id, newComment.trim())
            setComments(prev => [...prev, c])
            setNewComment('')
        } catch { setActionError('Failed to add comment') }
        finally { setSubmittingComment(false) }
    }

    const handleEditComment = async (commentId) => {
        try {
            const updated = await editComment(commentId, editContent)
            setComments(prev => prev.map(c => c.id === commentId ? updated : c))
            setEditingId(null)
        } catch { setActionError('Failed to update comment') }
    }

    const handleDeleteComment = async (commentId) => {
        if (!window.confirm('Delete this comment?')) return
        try {
            await deleteComment(commentId)
            setComments(prev => prev.filter(c => c.id !== commentId))
        } catch { setActionError('Failed to delete comment') }
    }

    // ─── Status Update ────────────────────────────────────────────────────────
    const openStatusForm = (status) => {
        setTargetStatus(status)
        setStatusReason('')
        setShowStatusForm(true)
        setActionError('')
    }

    const handleStatusUpdate = async (e) => {
        e.preventDefault()
        if (targetStatus === 'REJECTED' && !statusReason.trim()) {
            setActionError('Please provide a reason for rejection.'); return
        }
        setUpdatingStatus(true)
        setActionError('')
        try {
            const updated = await updateTicketStatus(id, targetStatus, statusReason)
            setTicket(updated)
            setShowStatusForm(false)
            setActionSuccess(`Status updated to ${STATUS_LABELS[targetStatus]}`)
            setTimeout(() => setActionSuccess(''), 3000)
        } catch (err) {
            setActionError(err?.response?.data?.message || 'Status update failed')
        } finally { setUpdatingStatus(false) }
    }

    // ─── Assign ───────────────────────────────────────────────────────────────
    const handleAssign = async (e) => {
        e.preventDefault()
        if (!selectedTech) { setActionError('Please select a technician'); return }
        setAssigning(true)
        setActionError('')
        try {
            const updated = await assignTechnician(id, selectedTech)
            setTicket(updated)
            setShowAssignForm(false)
            setActionSuccess('Ticket assigned successfully')
            setTimeout(() => setActionSuccess(''), 3000)
        } catch (err) {
            setActionError(err?.response?.data?.message || 'Assignment failed')
        } finally { setAssigning(false) }
    }

    const backPath = user?.role === 'ADMIN' ? '/admin/tickets' :
        user?.role === 'TECHNICIAN' ? '/technician/tickets' : '/tickets/my'

    if (loading) return (
        <div className="flex min-h-screen items-center justify-center bg-slate-100">
            <p className="text-slate-500 text-sm">Loading ticket details...</p>
        </div>
    )
    if (error) return (
        <div className="flex min-h-screen items-center justify-center bg-slate-100">
            <div className="rounded-2xl bg-white p-8 border border-rose-200 text-rose-700 text-sm">{error}</div>
        </div>
    )

    return (
        <div className="min-h-screen bg-slate-100">
            {/* Top bar */}
            <header className="sticky top-0 z-10 border-b border-slate-200 bg-white px-6 py-3 flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <button onClick={() => navigate(backPath)} className="flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-800 transition">
                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
                        Back
                    </button>
                    <div className="h-5 w-px bg-slate-300" />
                    <p className="text-xs text-slate-500">Ticket #{id.slice(-8).toUpperCase()}</p>
                </div>
                <div className="flex items-center gap-2">
                    {ticket && <StatusBadge status={ticket.status} />}
                    <button onClick={() => { clearToken(); navigate('/auth') }} className="rounded-lg border border-rose-200 bg-rose-50 px-3 py-1.5 text-xs font-semibold text-rose-600 hover:bg-rose-100 transition">Logout</button>
                </div>
            </header>

            <div className="mx-auto max-w-5xl p-4 sm:p-6 grid gap-6 lg:grid-cols-[1fr_320px]">
                {/* Main Content */}
                <div className="space-y-5">
                    {/* Ticket Header */}
                    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                        <div className="flex flex-wrap items-center gap-2 mb-3">
                            <PriorityBadge priority={ticket.priority} />
                            <span className="text-sm text-slate-500">{CATEGORY_LABELS[ticket.category]}</span>
                        </div>
                        <h1 className="text-2xl font-bold text-slate-900">{ticket.title}</h1>
                        <p className="mt-1 text-sm text-slate-500">📍 {ticket.resourceLocation}</p>
                        <p className="mt-4 text-sm text-slate-700 leading-relaxed">{ticket.description}</p>

                        {ticket.rejectionReason && (
                            <div className="mt-4 rounded-xl border border-rose-200 bg-rose-50 p-3">
                                <p className="text-xs font-bold text-rose-700 uppercase tracking-wide">Rejection Reason</p>
                                <p className="mt-1 text-sm text-rose-800">{ticket.rejectionReason}</p>
                            </div>
                        )}
                        {ticket.resolutionNotes && (
                            <div className="mt-4 rounded-xl border border-emerald-200 bg-emerald-50 p-3">
                                <p className="text-xs font-bold text-emerald-700 uppercase tracking-wide">Resolution Notes</p>
                                <p className="mt-1 text-sm text-emerald-800">{ticket.resolutionNotes}</p>
                            </div>
                        )}

                        {/* Attachments */}
                        {ticket.attachmentUrls && ticket.attachmentUrls.length > 0 && (
                            <div className="mt-5">
                                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500 mb-2">Attachments</p>
                                <div className="flex flex-wrap gap-3">
                                    {ticket.attachmentUrls.map((url, i) => (
                                        <a key={i} href={url} target="_blank" rel="noopener noreferrer">
                                            <img src={url} alt={`attachment-${i}`} className="h-24 w-24 rounded-xl border border-slate-200 object-cover hover:opacity-80 transition" />
                                        </a>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Actions (status update / assign) */}
                    {actionSuccess && <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-700">{actionSuccess}</div>}
                    {actionError && <div className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">{actionError}</div>}

                    {/* Admin: Assign technician */}
                    {user?.role === 'ADMIN' && (
                        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                            <div className="flex items-center justify-between mb-3">
                                <h2 className="text-sm font-bold text-slate-800">Technician Assignment</h2>
                                <button onClick={() => setShowAssignForm(f => !f)} className="text-xs font-semibold text-blue-600 hover:underline">
                                    {showAssignForm ? 'Cancel' : '+ Assign'}
                                </button>
                            </div>
                            {ticket.assignedTechnicianName ? (
                                <p className="text-sm text-slate-700">Currently assigned to <span className="font-semibold text-blue-700">{ticket.assignedTechnicianName}</span></p>
                            ) : (
                                <p className="text-sm text-slate-500">No technician assigned yet.</p>
                            )}
                            {showAssignForm && (
                                <form onSubmit={handleAssign} className="mt-3 flex gap-2">
                                    <select
                                        value={selectedTech}
                                        onChange={e => setSelectedTech(e.target.value)}
                                        className="flex-1 rounded-xl border border-slate-300 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-400"
                                    >
                                        <option value="">Select technician</option>
                                        {technicians.map(t => (
                                            <option key={t.id} value={t.id}>{t.username} ({t.email})</option>
                                        ))}
                                    </select>
                                    <button type="submit" disabled={assigning} className="rounded-xl bg-blue-600 px-4 py-2 text-sm font-bold text-white hover:bg-blue-700 disabled:opacity-60 transition">
                                        {assigning ? '...' : 'Assign'}
                                    </button>
                                </form>
                            )}
                        </div>
                    )}

                    {/* Admin: Status control */}
                    {user?.role === 'ADMIN' && (
                        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                            <h2 className="text-sm font-bold text-slate-800 mb-3">Update Status</h2>
                            <div className="flex flex-wrap gap-2">
                                {STATUS_FLOW.filter(s => s !== ticket.status).map(s => (
                                    <button
                                        key={s}
                                        onClick={() => openStatusForm(s)}
                                        className="rounded-xl border border-slate-300 bg-slate-50 px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-100 transition"
                                    >
                                        → {STATUS_LABELS[s]}
                                    </button>
                                ))}
                            </div>
                            {showStatusForm && (
                                <form onSubmit={handleStatusUpdate} className="mt-3 space-y-2">
                                    <input
                                        placeholder={targetStatus === 'REJECTED' ? 'Rejection reason (required)' : 'Add a note (optional)'}
                                        value={statusReason}
                                        onChange={e => setStatusReason(e.target.value)}
                                        className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-400"
                                    />
                                    <div className="flex gap-2">
                                        <button type="submit" disabled={updatingStatus} className="rounded-xl bg-blue-600 px-4 py-2 text-sm font-bold text-white hover:bg-blue-700 disabled:opacity-60">
                                            {updatingStatus ? 'Updating...' : `Set ${STATUS_LABELS[targetStatus]}`}
                                        </button>
                                        <button type="button" onClick={() => setShowStatusForm(false)} className="rounded-xl border border-slate-300 px-4 py-2 text-sm text-slate-600">Cancel</button>
                                    </div>
                                </form>
                            )}
                        </div>
                    )}

                    {/* Technician: Status control */}
                    {user?.role === 'TECHNICIAN' && ticket.assignedTechnicianId === user.id && (
                        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                            <h2 className="text-sm font-bold text-slate-800 mb-3">Update Status</h2>
                            <div className="flex gap-2">
                                {['IN_PROGRESS', 'RESOLVED'].filter(s => s !== ticket.status).map(s => (
                                    <button key={s} onClick={() => openStatusForm(s)} className="rounded-xl border border-slate-300 bg-slate-50 px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-100 transition">
                                        → {STATUS_LABELS[s]}
                                    </button>
                                ))}
                            </div>
                            {showStatusForm && (
                                <form onSubmit={handleStatusUpdate} className="mt-3 space-y-2">
                                    <input
                                        placeholder="Add resolution notes (optional)"
                                        value={statusReason}
                                        onChange={e => setStatusReason(e.target.value)}
                                        className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-400"
                                    />
                                    <div className="flex gap-2">
                                        <button type="submit" disabled={updatingStatus} className="rounded-xl bg-blue-600 px-4 py-2 text-sm font-bold text-white hover:bg-blue-700 disabled:opacity-60">
                                            {updatingStatus ? 'Updating...' : `Set ${STATUS_LABELS[targetStatus]}`}
                                        </button>
                                        <button type="button" onClick={() => setShowStatusForm(false)} className="rounded-xl border border-slate-300 px-4 py-2 text-sm text-slate-600">Cancel</button>
                                    </div>
                                </form>
                            )}
                        </div>
                    )}

                    {/* Comments */}
                    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                        <h2 className="text-lg font-bold text-slate-900 mb-4">Comments ({comments.length})</h2>

                        <div className="space-y-4 mb-5">
                            {comments.length === 0 && (
                                <p className="text-sm text-slate-400 text-center py-4">No comments yet. Be the first to add one.</p>
                            )}
                            {comments.map(c => (
                                <div key={c.id} className="flex items-start gap-3">
                                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-blue-600 text-xs font-bold text-white">
                                        {c.authorName?.charAt(0)?.toUpperCase()}
                                    </div>
                                    <div className="flex-1 rounded-2xl border border-slate-100 bg-slate-50 px-4 py-3">
                                        <div className="flex items-center justify-between">
                                            <p className="text-xs font-semibold text-slate-700">{c.authorName}</p>
                                            <p className="text-xs text-slate-400">{new Date(c.createdAt).toLocaleString()}</p>
                                        </div>
                                        {editingId === c.id ? (
                                            <div className="mt-2 flex gap-2">
                                                <input
                                                    className="flex-1 rounded-lg border border-slate-300 px-3 py-1.5 text-sm outline-none focus:ring-2 focus:ring-blue-400"
                                                    value={editContent}
                                                    onChange={e => setEditContent(e.target.value)}
                                                />
                                                <button onClick={() => handleEditComment(c.id)} className="rounded-lg bg-blue-600 px-3 py-1.5 text-xs font-bold text-white">Save</button>
                                                <button onClick={() => setEditingId(null)} className="rounded-lg border border-slate-300 px-3 py-1.5 text-xs text-slate-600">Cancel</button>
                                            </div>
                                        ) : (
                                            <p className="mt-1 text-sm text-slate-700">{c.content}</p>
                                        )}
                                        {user && (c.authorId === user.id || user.role === 'ADMIN') && editingId !== c.id && (
                                            <div className="mt-2 flex gap-2">
                                                {c.authorId === user.id && (
                                                    <button onClick={() => { setEditingId(c.id); setEditContent(c.content) }} className="text-xs text-blue-600 hover:underline">Edit</button>
                                                )}
                                                <button onClick={() => handleDeleteComment(c.id)} className="text-xs text-rose-600 hover:underline">Delete</button>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Add comment form */}
                        <form onSubmit={handleAddComment} className="flex gap-2">
                            <input
                                value={newComment}
                                onChange={e => setNewComment(e.target.value)}
                                placeholder="Add a comment..."
                                className="flex-1 rounded-xl border border-slate-300 px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-blue-400"
                            />
                            <button
                                type="submit"
                                disabled={submittingComment || !newComment.trim()}
                                className="rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-bold text-white hover:bg-blue-700 disabled:opacity-50 transition"
                            >
                                {submittingComment ? '...' : 'Post'}
                            </button>
                        </form>
                    </div>
                </div>

                {/* Sidebar Info */}
                <aside className="space-y-5">
                    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                        <h3 className="text-xs font-semibold uppercase tracking-wide text-slate-500 mb-4">Ticket Details</h3>
                        <dl className="space-y-3 text-sm">
                            <div><dt className="text-xs text-slate-400">Status</dt><dd className="mt-0.5"><StatusBadge status={ticket.status} /></dd></div>
                            <div><dt className="text-xs text-slate-400">Priority</dt><dd className="mt-0.5"><PriorityBadge priority={ticket.priority} /></dd></div>
                            <div><dt className="text-xs text-slate-400">Category</dt><dd className="mt-0.5 font-medium text-slate-800">{CATEGORY_LABELS[ticket.category]}</dd></div>
                            <div><dt className="text-xs text-slate-400">Location</dt><dd className="mt-0.5 font-medium text-slate-800">{ticket.resourceLocation}</dd></div>
                            <div><dt className="text-xs text-slate-400">Reported By</dt><dd className="mt-0.5 font-medium text-slate-800">{ticket.reporterName}</dd></div>
                            <div><dt className="text-xs text-slate-400">Contact</dt><dd className="mt-0.5 font-medium text-slate-800">{ticket.contactNumber}</dd></div>
                            <div><dt className="text-xs text-slate-400">Assigned To</dt><dd className="mt-0.5 font-medium text-blue-700">{ticket.assignedTechnicianName || '—'}</dd></div>
                            <div><dt className="text-xs text-slate-400">Created</dt><dd className="mt-0.5 text-slate-800">{new Date(ticket.createdAt).toLocaleString()}</dd></div>
                            <div><dt className="text-xs text-slate-400">Last Updated</dt><dd className="mt-0.5 text-slate-800">{new Date(ticket.updatedAt).toLocaleString()}</dd></div>
                        </dl>
                    </div>
                </aside>
            </div>
        </div>
    )
}
