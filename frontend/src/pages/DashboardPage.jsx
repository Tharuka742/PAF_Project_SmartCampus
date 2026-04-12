import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { clearToken, deleteMyProfile, getDashboardByRole } from '../services/auth'

const roleTheme = {
    USER: {
        badge: 'Student Workspace',
        accent: 'text-emerald-700',
        panel: 'from-emerald-500/15 to-cyan-500/10',
        cards: [
            { label: 'My Upcoming Bookings', value: '05' },
            { label: 'Active Tickets', value: '02' },
            { label: 'Unread Notifications', value: '04' },
        ],
        actions: ['Book A Resource', 'Create Incident Ticket', 'View My Notifications'],
    },
    ADMIN: {
        badge: 'Admin Control Center',
        accent: 'text-cyan-700',
        panel: 'from-cyan-500/15 to-blue-500/10',
        cards: [
            { label: 'Pending Booking Reviews', value: '16' },
            { label: 'Open Incident Tickets', value: '07' },
            { label: 'SLA Breach Risk', value: '03' },
        ],
        actions: ['Review Booking Requests', 'Assign Technician', 'Audit Activity Logs'],
    },
    TECHNICIAN: {
        badge: 'Technician Operations',
        accent: 'text-indigo-700',
        panel: 'from-indigo-500/15 to-sky-500/10',
        cards: [
            { label: 'Assigned Tickets', value: '09' },
            { label: 'In Progress', value: '04' },
            { label: 'Resolved Today', value: '06' },
        ],
        actions: ['Update Ticket Progress', 'Add Resolution Notes', 'Close Completed Tasks'],
    },
}

function DashboardPage({ role, title }) {
    const [data, setData] = useState(null)
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(true)
    const [deleting, setDeleting] = useState(false)
    const navigate = useNavigate()
    const current = roleTheme[role] || roleTheme.USER

    useEffect(() => {
        const load = async () => {
            setLoading(true)
            setError('')
            try {
                const dashboard = await getDashboardByRole(role)
                setData(dashboard)
            } catch (apiError) {
                setError(apiError?.response?.data?.message || 'Failed to load dashboard')
            } finally {
                setLoading(false)
            }
        }

        load()
    }, [role])

    const logout = () => {
        clearToken()
        navigate('/auth')
    }

    const handleDeleteProfile = async () => {
        const confirmed = window.confirm('Are you sure you want to permanently delete your profile?')
        if (!confirmed) {
            return
        }

        setDeleting(true)
        setError('')

        try {
            await deleteMyProfile()
            clearToken()
            navigate('/auth')
        } catch (apiError) {
            setError(apiError?.response?.data?.message || 'Failed to delete profile')
        } finally {
            setDeleting(false)
        }
    }

    return (
        <div className="relative min-h-screen overflow-hidden px-4 py-10">
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_10%_18%,rgba(34,197,94,0.15),transparent_28%),radial-gradient(circle_at_90%_12%,rgba(14,165,233,0.2),transparent_30%),radial-gradient(circle_at_50%_100%,rgba(30,64,175,0.16),transparent_40%)]" />

            <div className="relative mx-auto w-full max-w-6xl rounded-3xl border border-white/25 bg-white/85 p-6 shadow-[0_35px_90px_-40px_rgba(15,23,42,0.45)] backdrop-blur-xl sm:p-8">
                <div className={`rounded-2xl bg-gradient-to-r p-6 ${current.panel}`}>
                    <p className={`text-xs font-semibold uppercase tracking-[0.28em] ${current.accent}`}>{current.badge}</p>
                    <h1 className="mt-3 text-3xl font-extrabold tracking-tight text-slate-900">{title}</h1>
                    <p className="mt-2 text-sm leading-relaxed text-slate-600">
                        Monitor your operations, manage workflow actions, and keep campus services reliable.
                    </p>
                </div>

                {error ? (
                    <div className="mt-5 rounded-xl border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-700">
                        {error}
                    </div>
                ) : null}

                <div className="mt-6 grid gap-4 md:grid-cols-3">
                    {current.cards.map((card) => (
                        <article key={card.label} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                            <p className="text-xs uppercase tracking-[0.2em] text-slate-500">{card.label}</p>
                            <p className="mt-3 text-3xl font-bold text-slate-900">{card.value}</p>
                        </article>
                    ))}
                </div>

                <div className="mt-6 grid gap-4 lg:grid-cols-2">
                    <section className="rounded-2xl border border-slate-200 bg-white p-6">
                        <h2 className="text-lg font-bold text-slate-900">Workspace Feed</h2>
                        {data ? (
                            <div className="mt-3 space-y-2 text-sm text-slate-600">
                                <p>{data.message}</p>
                                <p>
                                    API dashboard: <span className="font-semibold text-slate-800">{data.dashboard}</span>
                                </p>
                            </div>
                        ) : loading ? (
                            <p className="mt-3 text-sm text-slate-600">Loading dashboard...</p>
                        ) : (
                            <p className="mt-3 text-sm text-slate-600">No data available right now.</p>
                        )}
                    </section>

                    <section className="rounded-2xl border border-slate-200 bg-white p-6">
                        <h2 className="text-lg font-bold text-slate-900">Recommended Actions</h2>
                        <ul className="mt-3 space-y-2 text-sm text-slate-600">
                            {current.actions.map((action) => (
                                <li key={action} className="rounded-xl bg-slate-50 px-3 py-2">{action}</li>
                            ))}
                        </ul>
                    </section>
                </div>

                <div className="mt-7 flex flex-wrap gap-3">
                    {role !== 'USER' ? (
                        <button
                            onClick={() => navigate('/select-role')}
                            className="rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:border-cyan-300 hover:text-cyan-700"
                        >
                            Change Role
                        </button>
                    ) : null}
                    <button
                        className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-2.5 text-sm font-semibold text-rose-700 transition hover:bg-rose-100 disabled:cursor-not-allowed disabled:opacity-60"
                        onClick={handleDeleteProfile}
                        disabled={deleting}
                    >
                        {deleting ? 'Deleting...' : 'Delete Profile'}
                    </button>
                    <button
                        className="rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800"
                        onClick={logout}
                    >
                        Logout
                    </button>
                </div>
            </div>
        </div>
    )
}

export default DashboardPage
