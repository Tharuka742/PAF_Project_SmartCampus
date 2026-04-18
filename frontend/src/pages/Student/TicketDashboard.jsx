import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { clearToken, getMe } from '../../services/auth'
import { getMyTickets, getMyTicketStats, STATUS_LABELS, CATEGORY_LABELS, PRIORITY_LABELS, statusColor, priorityColor } from '../../services/ticket'

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
                <button onClick={() => navigate('/tickets')} className="flex w-full items-center gap-2 rounded-lg bg-blue-600/30 px-3 py-2 text-left text-sm font-semibold text-white">
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" /><rect x="14" y="14" width="7" height="7" /><rect x="3" y="14" width="7" height="7" /></svg>
                    Dashboard
                </button>
                <button onClick={() => navigate('/tickets/create')} className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm text-slate-300 hover:bg-white/10">
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
                    Create Ticket
                </button>
                <button onClick={() => navigate('/tickets/my')} className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm text-slate-300 hover:bg-white/10">
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" /></svg>
                    My Tickets
                </button>
                <p className="px-2 pt-4 text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-400">Updates</p>
                <button className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm text-slate-300 hover:bg-white/10">
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6 6 0 10-12 0v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg>
                    Notifications
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

export default function TicketDashboard() {
    const navigate = useNavigate()
    const [user, setUser] = useState(null)
    const [stats, setStats] = useState({ total: 0, open: 0, inProgress: 0, resolved: 0, urgent: 0 })
    const [tickets, setTickets] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')

    useEffect(() => {
        Promise.all([getMe(), getMyTicketStats(), getMyTickets()])
            .then(([me, s, t]) => { setUser(me); setStats(s); setTickets(t) })
            .catch(() => setError('Failed to load data'))
            .finally(() => setLoading(false))
    }, [])

    const statCards = [
        { label: 'Total Tickets', value: stats.total ?? 0, icon: '📋', border: '' },
        { label: 'Open', value: stats.open ?? 0, icon: '⏰', border: '' },
        { label: 'In Progress', value: stats.inProgress ?? 0, icon: '🔧', border: '' },
        { label: 'Resolved', value: stats.resolved ?? 0, icon: '✅', border: '' },
        { label: 'Urgent', value: stats.urgent ?? 0, icon: '⚠️', border: 'border-l-4 border-l-rose-400' },
    ]

    return (
        <div className="min-h-screen bg-slate-100 text-slate-900">
            <div className="grid min-h-screen lg:grid-cols-[250px_1fr]">
                <Sidebar user={user} navigate={navigate} />

                <main className="p-4 sm:p-8">
                    <div className="flex items-start justify-between flex-wrap gap-4 mb-6">
                        <div>
                            <p className="text-xs font-semibold uppercase tracking-widest text-slate-500">MODULE C</p>
                            <h1 className="mt-1 text-3xl font-bold text-slate-900">Incident Ticketing Dashboard</h1>
                            <p className="mt-1 text-sm text-slate-500">Overview of campus maintenance and incident tickets.</p>
                        </div>
                        <button
                            id="create-ticket-btn"
                            onClick={() => navigate('/tickets/create')}
                            className="flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-bold text-white hover:bg-blue-700 transition shadow"
                        >
                            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
                            Create Ticket
                        </button>
                    </div>

                    {error && <div className="mb-4 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">{error}</div>}

                    {/* Stats Grid */}
                    <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5 mb-6">
                        {statCards.map(card => (
                            <article key={card.label} className={`rounded-2xl border border-slate-200 bg-white p-4 shadow-sm ${card.border}`}>
                                <div className="flex items-center justify-between">
                                    <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">{card.label}</p>
                                    <span className="text-xl">{card.icon}</span>
                                </div>
                                <p className="mt-3 text-4xl font-bold text-slate-900">{loading ? '–' : card.value}</p>
                            </article>
                        ))}
                    </section>

                    {/* Quick Links */}
                    <section className="grid gap-4 sm:grid-cols-3 mb-6">
                        <button onClick={() => navigate('/tickets/create')} className="flex items-start gap-4 rounded-2xl border border-slate-200 bg-white p-5 text-left shadow-sm hover:border-blue-300 hover:shadow-md transition">
                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-100 text-blue-600">
                                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
                            </div>
                            <div>
                                <p className="text-sm font-bold text-slate-900">Create New Ticket</p>
                                <p className="mt-1 text-xs text-slate-500">Report a campus issue with location and priority.</p>
                            </div>
                        </button>
                        <button onClick={() => navigate('/tickets/my')} className="flex items-start gap-4 rounded-2xl border border-slate-200 bg-white p-5 text-left shadow-sm hover:border-blue-300 hover:shadow-md transition">
                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-100 text-emerald-600">
                                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2" /></svg>
                            </div>
                            <div>
                                <p className="text-sm font-bold text-slate-900">My Tickets</p>
                                <p className="mt-1 text-xs text-slate-500">View submitted tickets and their current status.</p>
                            </div>
                        </button>
                        <button onClick={() => navigate('/dashboard/student')} className="flex items-start gap-4 rounded-2xl border border-slate-200 bg-white p-5 text-left shadow-sm hover:border-blue-300 hover:shadow-md transition">
                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-violet-100 text-violet-600">
                                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" /><rect x="14" y="14" width="7" height="7" /><rect x="3" y="14" width="7" height="7" /></svg>
                            </div>
                            <div>
                                <p className="text-sm font-bold text-slate-900">Student Dashboard</p>
                                <p className="mt-1 text-xs text-slate-500">Go back to the main student portal.</p>
                            </div>
                        </button>
                    </section>

                    {/* Recent Tickets */}
                    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-lg font-bold text-slate-900">Recent Tickets</h2>
                            <button onClick={() => navigate('/tickets/my')} className="text-sm font-semibold text-blue-600 hover:underline">View all →</button>
                        </div>
                        {loading ? (
                            <p className="text-sm text-slate-500 py-6 text-center">Loading tickets...</p>
                        ) : tickets.length === 0 ? (
                            <div className="py-12 text-center">
                                <p className="text-4xl">📋</p>
                                <p className="mt-3 text-sm font-semibold text-slate-700">No tickets yet</p>
                                <p className="mt-1 text-xs text-slate-500">Create your first incident report to get started.</p>
                                <button onClick={() => navigate('/tickets/create')} className="mt-4 rounded-xl bg-blue-600 px-5 py-2 text-sm font-bold text-white hover:bg-blue-700 transition">+ Create Ticket</button>
                            </div>
                        ) : (
                            <div className="space-y-3">
                                {tickets.slice(0, 5).map(ticket => (
                                    <button
                                        key={ticket.id}
                                        onClick={() => navigate(`/tickets/${ticket.id}`)}
                                        className="w-full flex items-center justify-between gap-4 rounded-xl border border-slate-100 p-4 text-left hover:border-blue-200 hover:bg-blue-50/50 transition"
                                    >
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-semibold text-slate-900 truncate">{ticket.title}</p>
                                            <p className="mt-0.5 text-xs text-slate-500">{ticket.resourceLocation} · {CATEGORY_LABELS[ticket.category]}</p>
                                        </div>
                                        <div className="flex shrink-0 items-center gap-2">
                                            <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${priorityColor(ticket.priority)}`}>{PRIORITY_LABELS[ticket.priority]}</span>
                                            <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${statusColor(ticket.status)}`}>{STATUS_LABELS[ticket.status]}</span>
                                        </div>
                                    </button>
                                ))}
                            </div>
                        )}
                    </section>
                </main>
            </div>
        </div>
    )
}
