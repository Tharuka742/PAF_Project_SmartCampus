import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
    clearToken,
    deleteAdminUser,
    deleteMyProfile,
    getAdminUsers,
    getDashboardByRole,
    getMe,
    updateAdminUserRole,
} from '../services/auth'

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

const roleOptions = ['USER', 'ADMIN', 'TECHNICIAN']

function DashboardPage({ role, title }) {
    const [data, setData] = useState(null)
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(true)
    const [deleting, setDeleting] = useState(false)
    const [adminUsers, setAdminUsers] = useState([])
    const [userDraftRoles, setUserDraftRoles] = useState({})
    const [savingUserId, setSavingUserId] = useState('')
    const [currentUser, setCurrentUser] = useState(null)
    const navigate = useNavigate()
    const current = roleTheme[role] || roleTheme.USER

    useEffect(() => {
        const load = async () => {
            setLoading(true)
            setError('')
            try {
                const me = await getMe()
                setCurrentUser(me)
                const dashboard = await getDashboardByRole(role)
                setData(dashboard)

                if (role === 'ADMIN') {
                    const users = await getAdminUsers()
                    setAdminUsers(users)
                    setUserDraftRoles(
                        Object.fromEntries(users.map((user) => [user.id, user.role])),
                    )
                }
            } catch (apiError) {
                setError(apiError?.response?.data?.message || 'Failed to load dashboard')
            } finally {
                setLoading(false)
            }
        }

        load()
    }, [role])

    const refreshAdminUsers = async () => {
        const users = await getAdminUsers()
        setAdminUsers(users)
        setUserDraftRoles(Object.fromEntries(users.map((user) => [user.id, user.role])))
    }

    const handleAdminRoleChange = async (userId) => {
        const nextRole = userDraftRoles[userId]
        if (!nextRole) {
            return
        }

        setSavingUserId(userId)
        setError('')

        try {
            await updateAdminUserRole(userId, nextRole)
            await refreshAdminUsers()
        } catch (apiError) {
            setError(apiError?.response?.data?.message || 'Failed to update user role')
        } finally {
            setSavingUserId('')
        }
    }

    const handleAdminDelete = async (userId) => {
        const confirmed = window.confirm('Delete this user permanently?')
        if (!confirmed) {
            return
        }

        setSavingUserId(userId)
        setError('')

        try {
            await deleteAdminUser(userId)
            await refreshAdminUsers()
        } catch (apiError) {
            setError(apiError?.response?.data?.message || 'Failed to delete user')
        } finally {
            setSavingUserId('')
        }
    }

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
        <div className="relative min-h-screen overflow-hidden bg-slate-950 px-4 py-10 text-slate-100">
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_10%_18%,rgba(34,197,94,0.15),transparent_28%),radial-gradient(circle_at_90%_12%,rgba(14,165,233,0.2),transparent_30%),radial-gradient(circle_at_50%_100%,rgba(30,64,175,0.16),transparent_40%)]" />
            <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_bottom,rgba(15,23,42,0.18),rgba(15,23,42,0.86))]" />

            <div className="relative mx-auto w-full max-w-6xl rounded-[2rem] border border-white/10 bg-slate-900/80 p-6 shadow-[0_35px_90px_-40px_rgba(15,23,42,0.55)] backdrop-blur-xl sm:p-8">
                <div className={`rounded-2xl bg-gradient-to-r p-6 ${current.panel}`}>
                    <p className={`text-xs font-semibold uppercase tracking-[0.28em] ${current.accent}`}>{current.badge}</p>
                    <h1 className="mt-3 text-3xl font-extrabold tracking-tight text-white">{title}</h1>
                    <p className="mt-2 text-sm leading-relaxed text-slate-300">
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
                        <article key={card.label} className="rounded-2xl border border-white/10 bg-white/5 p-5 shadow-sm">
                            <p className="text-xs uppercase tracking-[0.2em] text-slate-400">{card.label}</p>
                            <p className="mt-3 text-3xl font-bold text-white">{card.value}</p>
                        </article>
                    ))}
                </div>

                <div className="mt-6 grid gap-4 lg:grid-cols-2">
                    <section className="rounded-2xl border border-white/10 bg-white/5 p-6">
                        <h2 className="text-lg font-bold text-white">Workspace Feed</h2>
                        {data ? (
                            <div className="mt-3 space-y-2 text-sm text-slate-300">
                                <p>{data.message}</p>
                                <p>
                                    API dashboard: <span className="font-semibold text-white">{data.dashboard}</span>
                                </p>
                            </div>
                        ) : loading ? (
                            <p className="mt-3 text-sm text-slate-300">Loading dashboard...</p>
                        ) : (
                            <p className="mt-3 text-sm text-slate-300">No data available right now.</p>
                        )}
                    </section>

                    <section className="rounded-2xl border border-white/10 bg-white/5 p-6">
                        <h2 className="text-lg font-bold text-white">Recommended Actions</h2>
                        <ul className="mt-3 space-y-2 text-sm text-slate-300">
                            {current.actions.map((action) => (
                                <li key={action} className="rounded-xl bg-slate-950/40 px-3 py-2">{action}</li>
                            ))}
                        </ul>
                    </section>
                </div>

                {role === 'ADMIN' ? (
                    <section className="mt-6 rounded-2xl border border-white/10 bg-white/5 p-6">
                        <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
                            <div>
                                <h2 className="text-lg font-bold text-white">Registered Users</h2>
                                <p className="mt-1 text-sm text-slate-300">View all registered users, update their roles, or remove accounts.</p>
                            </div>
                            <div className="text-xs uppercase tracking-[0.22em] text-slate-400">
                                {adminUsers.length} users
                            </div>
                        </div>

                        <div className="mt-4 overflow-x-auto rounded-2xl border border-white/10">
                            <table className="min-w-full divide-y divide-white/10 text-left text-sm">
                                <thead className="bg-slate-950/60 text-slate-300">
                                    <tr>
                                        <th className="px-4 py-3 font-semibold">ID</th>
                                        <th className="px-4 py-3 font-semibold">Username</th>
                                        <th className="px-4 py-3 font-semibold">Email</th>
                                        <th className="px-4 py-3 font-semibold">Role</th>
                                        <th className="px-4 py-3 font-semibold">Provider</th>
                                        <th className="px-4 py-3 font-semibold">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-white/10 bg-white/5 text-slate-200">
                                    {adminUsers.map((user) => {
                                        const isSelf = currentUser?.id === user.id
                                        return (
                                            <tr key={user.id} className="align-top">
                                                <td className="px-4 py-3 text-xs text-slate-400">{user.id}</td>
                                                <td className="px-4 py-3 font-medium text-white">{user.username}</td>
                                                <td className="px-4 py-3 text-slate-300">{user.email}</td>
                                                <td className="px-4 py-3">
                                                    <select
                                                        value={userDraftRoles[user.id] || user.role}
                                                        onChange={(event) => setUserDraftRoles((prev) => ({ ...prev, [user.id]: event.target.value }))}
                                                        className="rounded-xl border border-white/10 bg-slate-950/70 px-3 py-2 text-sm text-white outline-none"
                                                    >
                                                        {roleOptions.map((option) => (
                                                            <option key={option} value={option}>
                                                                {option}
                                                            </option>
                                                        ))}
                                                    </select>
                                                </td>
                                                <td className="px-4 py-3 text-slate-300">{user.provider}</td>
                                                <td className="px-4 py-3">
                                                    <div className="flex flex-wrap gap-2">
                                                        <button
                                                            type="button"
                                                            onClick={() => handleAdminRoleChange(user.id)}
                                                            disabled={savingUserId === user.id || isSelf}
                                                            className="rounded-xl bg-cyan-400 px-3 py-2 text-xs font-semibold text-slate-950 transition hover:bg-cyan-300 disabled:cursor-not-allowed disabled:opacity-50"
                                                        >
                                                            {savingUserId === user.id ? 'Saving...' : isSelf ? 'Current Admin' : 'Save Role'}
                                                        </button>
                                                        <button
                                                            type="button"
                                                            onClick={() => handleAdminDelete(user.id)}
                                                            disabled={savingUserId === user.id || isSelf}
                                                            className="rounded-xl border border-rose-400/20 bg-rose-500/10 px-3 py-2 text-xs font-semibold text-rose-200 transition hover:bg-rose-500/20 disabled:cursor-not-allowed disabled:opacity-50"
                                                        >
                                                            Delete
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        )
                                    })}
                                </tbody>
                            </table>
                        </div>
                    </section>
                ) : null}

                <div className="mt-7 flex flex-wrap gap-3">
                    {role !== 'USER' ? (
                        <button
                            onClick={() => navigate('/select-role')}
                            className="rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm font-semibold text-slate-200 transition hover:border-white/20 hover:bg-white/10"
                        >
                            Change Role
                        </button>
                    ) : null}
                    <button
                        className="rounded-xl border border-rose-400/20 bg-rose-500/10 px-4 py-2.5 text-sm font-semibold text-rose-200 transition hover:bg-rose-500/20 disabled:cursor-not-allowed disabled:opacity-60"
                        onClick={handleDeleteProfile}
                        disabled={deleting}
                    >
                        {deleting ? 'Deleting...' : 'Delete Profile'}
                    </button>
                    <button
                        className="rounded-xl bg-white px-4 py-2.5 text-sm font-semibold text-slate-950 transition hover:bg-slate-100"
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
