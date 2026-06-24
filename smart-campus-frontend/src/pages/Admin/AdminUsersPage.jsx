import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
    LayoutDashboard,
    Building2,
    CalendarCheck,
    Ticket,
    Users,
    BarChart3,
    LogOut,
    Sparkles,
    ChevronRight,
    GraduationCap,
    ShieldCheck,
    AlertTriangle,
    Save,
    Trash2,
    Mail,
    UserCircle,
    Globe,
    Loader2,
    Inbox,
} from 'lucide-react'
import { clearToken, deleteAdminUser, getAdminUsers, getMe, updateAdminUserRole } from '../../services/auth'

const menuItems = [
    { label: 'Resources', icon: Building2 },
    { label: 'Bookings', icon: CalendarCheck },
    { label: 'Tickets', icon: Ticket },
    { label: 'Users', icon: Users },
    { label: 'Analytics', icon: BarChart3 },
]
const roleOptions = ['USER', 'ADMIN', 'TECHNICIAN']

const ROLE_STYLES = {
    USER: { bg: 'bg-blue-100', text: 'text-blue-700', ring: 'ring-blue-200', gradient: 'from-blue-500 to-indigo-500' },
    ADMIN: { bg: 'bg-cyan-100', text: 'text-cyan-700', ring: 'ring-cyan-200', gradient: 'from-cyan-500 to-blue-500' },
    TECHNICIAN: { bg: 'bg-violet-100', text: 'text-violet-700', ring: 'ring-violet-200', gradient: 'from-violet-500 to-fuchsia-500' },
}

function AdminUsersPage() {
    const navigate = useNavigate()
    const [users, setUsers] = useState([])
    const [draftRoles, setDraftRoles] = useState({})
    const [savingUserId, setSavingUserId] = useState('')
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(true)
    const [currentUser, setCurrentUser] = useState(null)

    const logout = () => {
        clearToken()
        navigate('/auth')
    }

    const loadUsers = async () => {
        setLoading(true)
        setError('')
        try {
            const [me, allUsers] = await Promise.all([getMe(), getAdminUsers()])
            setCurrentUser(me)
            setUsers(allUsers)
            setDraftRoles(Object.fromEntries(allUsers.map((user) => [user.id, user.role])))
        } catch (apiError) {
            setError(apiError?.response?.data?.message || 'Failed to load users')
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        loadUsers()
    }, [])

    const handleSaveRole = async (userId) => {
        const role = draftRoles[userId]
        if (!role) {
            return
        }

        setSavingUserId(userId)
        setError('')
        try {
            await updateAdminUserRole(userId, role)
            await loadUsers()
        } catch (apiError) {
            setError(apiError?.response?.data?.message || 'Failed to update role')
        } finally {
            setSavingUserId('')
        }
    }

    const handleDeleteUser = async (userId) => {
        const confirmed = window.confirm('Delete this user permanently?')
        if (!confirmed) {
            return
        }

        setSavingUserId(userId)
        setError('')
        try {
            await deleteAdminUser(userId)
            await loadUsers()
        } catch (apiError) {
            setError(apiError?.response?.data?.message || 'Failed to delete user')
        } finally {
            setSavingUserId('')
        }
    }

    const handleMenuClick = (item) => {
        if (item === 'Users') {
            navigate('/dashboard/admin/users')
            return
        }

        if (item === 'Analytics') {
            navigate('/dashboard/admin/analytics')
            return
        }

        navigate('/dashboard/admin')
    }

    return (
        <div className="min-h-screen bg-slate-50 text-slate-900">
            <div className="grid min-h-screen lg:grid-cols-[260px_1fr]">
                {/* ── Sidebar ─────────────────────────────────────────── */}
                <aside className="relative flex flex-col bg-gradient-to-b from-[#0b1a3a] via-[#0c1f44] to-[#0a1730] text-slate-200">
                    <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(6,182,212,0.18),transparent_60%)]" />

                    <div className="relative border-b border-white/10 px-5 py-6">
                        <div className="flex items-center gap-3">
                            <div className="grid h-11 w-11 place-items-center rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 shadow-lg shadow-cyan-900/40">
                                <GraduationCap className="h-6 w-6 text-white" />
                            </div>
                            <div>
                                <p className="text-lg font-bold tracking-tight text-white">SmartCampus</p>
                                <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-cyan-300/80">Admin Portal</p>
                            </div>
                        </div>
                    </div>

                    <div className="relative px-3 py-5">
                        <p className="px-3 text-[10px] font-semibold uppercase tracking-[0.22em] text-slate-400">Main Menu</p>
                        <button
                            onClick={() => navigate('/dashboard/admin')}
                            className="mt-2 flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm text-slate-300 transition hover:bg-white/10 hover:text-white"
                        >
                            <LayoutDashboard className="h-4 w-4" />
                            Dashboard
                        </button>
                    </div>

                    <div className="relative px-3 py-2">
                        <p className="px-3 text-[10px] font-semibold uppercase tracking-[0.22em] text-slate-400">Other Modules</p>
                        <div className="mt-2 space-y-1">
                            {menuItems.map((item) => {
                                const Icon = item.icon
                                const isActive = item.label === 'Users'
                                return (
                                    <button
                                        key={item.label}
                                        onClick={() => handleMenuClick(item.label)}
                                        className={`group flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm transition ${
                                            isActive
                                                ? 'bg-gradient-to-r from-cyan-600 to-blue-600 font-semibold text-white shadow-lg shadow-cyan-900/30'
                                                : 'text-slate-300 hover:bg-white/10 hover:text-white'
                                        }`}
                                    >
                                        <Icon className="h-4 w-4" />
                                        <span className="flex-1">{item.label}</span>
                                        {!isActive && <ChevronRight className="h-3.5 w-3.5 opacity-0 transition group-hover:opacity-100" />}
                                    </button>
                                )
                            })}
                        </div>
                    </div>

                    <div className="relative mt-auto border-t border-white/10 px-4 py-4">
                        <button
                            type="button"
                            onClick={logout}
                            className="flex w-full items-center justify-center gap-2 rounded-lg border border-rose-400/25 bg-rose-500/10 px-3 py-2 text-sm font-semibold text-rose-200 transition hover:border-rose-400/50 hover:bg-rose-500/20"
                        >
                            <LogOut className="h-4 w-4" />
                            Logout
                        </button>
                    </div>
                </aside>

                {/* ── Main content ────────────────────────────────────── */}
                <main className="p-4 sm:p-6 lg:p-8">
                    {/* Header */}
                    <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                        <div>
                            <div className="inline-flex items-center gap-1.5 rounded-full border border-cyan-200 bg-cyan-50 px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.18em] text-cyan-700">
                                <ShieldCheck className="h-3 w-3" />
                                User Management
                            </div>
                            <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-900">Users Management</h1>
                            <p className="mt-1 text-sm text-slate-500">View users, update roles, and remove accounts.</p>
                        </div>
                        <div className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm shadow-sm">
                            <div className="grid h-7 w-7 place-items-center rounded-lg bg-cyan-50 text-cyan-600">
                                <Users className="h-3.5 w-3.5" />
                            </div>
                            <div>
                                <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Total</p>
                                <p className="text-sm font-bold text-slate-800">{users.length} users</p>
                            </div>
                        </div>
                    </div>

                    {error ? (
                        <div className="mb-4 flex items-start gap-2 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
                            <AlertTriangle className="mt-0.5 h-4 w-4 flex-shrink-0" />
                            <span>{error}</span>
                        </div>
                    ) : null}

                    {/* Users table */}
                    <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-slate-200 text-left text-sm">
                                <thead className="bg-gradient-to-r from-slate-50 to-cyan-50/30">
                                    <tr>
                                        <th className="px-5 py-3.5 text-[10px] font-bold uppercase tracking-[0.18em] text-slate-500">User</th>
                                        <th className="px-4 py-3.5 text-[10px] font-bold uppercase tracking-[0.18em] text-slate-500">Email</th>
                                        <th className="px-4 py-3.5 text-[10px] font-bold uppercase tracking-[0.18em] text-slate-500">Role</th>
                                        <th className="px-4 py-3.5 text-[10px] font-bold uppercase tracking-[0.18em] text-slate-500">Provider</th>
                                        <th className="px-4 py-3.5 text-right text-[10px] font-bold uppercase tracking-[0.18em] text-slate-500">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100 bg-white">
                                    {loading ? (
                                        <tr>
                                            <td colSpan={5} className="px-3 py-16 text-center">
                                                <div className="flex flex-col items-center gap-3">
                                                    <div className="relative">
                                                        <div className="h-10 w-10 rounded-full border-4 border-cyan-100" />
                                                        <div className="absolute inset-0 h-10 w-10 animate-spin rounded-full border-4 border-cyan-600 border-t-transparent" />
                                                    </div>
                                                    <p className="text-sm font-medium text-slate-500">Loading users...</p>
                                                </div>
                                            </td>
                                        </tr>
                                    ) : users.length === 0 ? (
                                        <tr>
                                            <td colSpan={5} className="px-3 py-16 text-center">
                                                <div className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-gradient-to-br from-cyan-50 to-blue-50 ring-4 ring-cyan-50">
                                                    <Inbox className="h-7 w-7 text-cyan-400" />
                                                </div>
                                                <p className="mt-3 text-sm font-bold text-slate-700">No users found</p>
                                            </td>
                                        </tr>
                                    ) : (
                                        users.map((user) => {
                                            const isSelf = currentUser?.id === user.id
                                            const currentRole = draftRoles[user.id] || user.role
                                            const roleStyle = ROLE_STYLES[currentRole] || ROLE_STYLES.USER
                                            return (
                                                <tr key={user.id} className="transition hover:bg-slate-50/70">
                                                    <td className="px-5 py-4">
                                                        <div className="flex items-center gap-3">
                                                            <div className={`grid h-10 w-10 flex-shrink-0 place-items-center rounded-full bg-gradient-to-br ${roleStyle.gradient} text-sm font-bold text-white shadow-md`}>
                                                                {user.username?.charAt(0)?.toUpperCase() ?? <UserCircle className="h-5 w-5" />}
                                                            </div>
                                                            <div className="min-w-0">
                                                                <p className="truncate text-sm font-bold text-slate-900">{user.username}</p>
                                                                {isSelf && (
                                                                    <span className="inline-flex items-center gap-1 rounded-full bg-blue-50 px-2 py-0.5 text-[10px] font-semibold text-blue-700 ring-1 ring-blue-200">
                                                                        You
                                                                    </span>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="px-4 py-4">
                                                        <div className="flex items-center gap-1.5 text-xs text-slate-600">
                                                            <Mail className="h-3.5 w-3.5 text-slate-400" />
                                                            <span className="truncate">{user.email}</span>
                                                        </div>
                                                    </td>
                                                    <td className="px-4 py-4">
                                                        <div className="relative inline-block">
                                                            <select
                                                                value={currentRole}
                                                                onChange={(event) =>
                                                                    setDraftRoles((prev) => ({
                                                                        ...prev,
                                                                        [user.id]: event.target.value,
                                                                    }))
                                                                }
                                                                className={`cursor-pointer appearance-none rounded-full border-0 px-3 py-1.5 pr-7 text-[10px] font-bold uppercase tracking-wider outline-none transition focus:ring-2 focus:ring-cyan-500/30 ${roleStyle.bg} ${roleStyle.text} ring-1 ${roleStyle.ring}`}
                                                            >
                                                                {roleOptions.map((option) => (
                                                                    <option key={option} value={option}>
                                                                        {option}
                                                                    </option>
                                                                ))}
                                                            </select>
                                                            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                                                                <svg className="h-3 w-3 fill-current opacity-70" viewBox="0 0 20 20">
                                                                    <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
                                                                </svg>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="px-4 py-4">
                                                        <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-600">
                                                            <Globe className="h-3 w-3" />
                                                            {user.provider}
                                                        </span>
                                                    </td>
                                                    <td className="px-4 py-4">
                                                        <div className="flex flex-wrap justify-end gap-2">
                                                            <button
                                                                type="button"
                                                                disabled={savingUserId === user.id || isSelf}
                                                                onClick={() => handleSaveRole(user.id)}
                                                                className="inline-flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-3 py-1.5 text-xs font-semibold text-white shadow-md shadow-blue-900/20 transition hover:from-blue-700 hover:to-indigo-700 disabled:cursor-not-allowed disabled:opacity-50"
                                                            >
                                                                {savingUserId === user.id ? (
                                                                    <>
                                                                        <Loader2 className="h-3.5 w-3.5 animate-spin" />
                                                                        Saving...
                                                                    </>
                                                                ) : (
                                                                    <>
                                                                        <Save className="h-3.5 w-3.5" />
                                                                        Save
                                                                    </>
                                                                )}
                                                            </button>
                                                            <button
                                                                type="button"
                                                                disabled={savingUserId === user.id || isSelf}
                                                                onClick={() => handleDeleteUser(user.id)}
                                                                className="inline-flex items-center gap-1.5 rounded-xl border border-rose-200 bg-white px-3 py-1.5 text-xs font-semibold text-rose-600 transition hover:border-rose-300 hover:bg-rose-50 disabled:cursor-not-allowed disabled:opacity-50"
                                                            >
                                                                <Trash2 className="h-3.5 w-3.5" />
                                                                Delete
                                                            </button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            )
                                        })
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </section>

                    <div className="mt-4 flex items-center gap-2 rounded-2xl border border-slate-200 bg-gradient-to-r from-slate-50 to-cyan-50/40 p-4 text-sm text-slate-600 shadow-sm">
                        <span className="grid h-7 w-7 place-items-center rounded-lg bg-white text-cyan-600 ring-1 ring-slate-200">
                            <Sparkles className="h-3.5 w-3.5" />
                        </span>
                        <span>
                            <span className="font-semibold text-slate-700">Tip:</span> You cannot modify or delete your own account.
                        </span>
                    </div>
                </main>
            </div>
        </div>
    )
}

export default AdminUsersPage
