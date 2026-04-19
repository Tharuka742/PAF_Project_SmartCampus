import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { clearToken, deleteAdminUser, getAdminUsers, getMe, updateAdminUserRole } from '../../services/auth'

const menuItems = ['Resources', 'Bookings', 'Tickets', 'Users', 'Analytics']
const roleOptions = ['USER', 'ADMIN', 'TECHNICIAN']

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
        <div className="min-h-screen bg-slate-100 text-slate-900">
            <div className="grid min-h-screen lg:grid-cols-[250px_1fr]">
                <aside className="flex flex-col border-r border-slate-800 bg-[#0c1f44] text-slate-200">
                    <div className="border-b border-white/10 px-5 py-6">
                        <p className="text-xl font-bold text-white">SmartCampus</p>
                        <p className="text-xs text-slate-400">Admin Portal</p>
                    </div>

                    <div className="px-3 py-5">
                        <p className="px-2 text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-400">Main Menu</p>
                        <button
                            onClick={() => navigate('/dashboard/admin')}
                            className="mt-2 w-full rounded-xl px-3 py-2 text-left text-sm font-semibold text-slate-300 hover:bg-white/10"
                        >
                            Dashboard
                        </button>
                    </div>

                    <div className="px-3 py-2">
                        <p className="px-2 text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-400">Other Modules</p>
                        <div className="mt-2 space-y-1">
                            {menuItems.map((item) => (
                                <button
                                    key={item}
                                    onClick={() => handleMenuClick(item)}
                                    className={`w-full rounded-lg px-3 py-2 text-left text-sm ${item === 'Users'
                                        ? 'bg-blue-600/30 font-semibold text-white'
                                        : 'text-slate-300 hover:bg-white/10'
                                        }`}
                                >
                                    {item}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="mt-auto border-t border-white/10 px-4 py-4">
                        <button
                            type="button"
                            onClick={logout}
                            className="w-full rounded-lg border border-rose-400/25 bg-rose-500/10 px-3 py-2 text-sm font-semibold text-rose-200"
                        >
                            Logout
                        </button>
                    </div>
                </aside>

                <main className="p-4 sm:p-6">
                    <header className="flex flex-col gap-3 border-b border-slate-200 bg-white px-1 pb-4 sm:flex-row sm:items-center sm:justify-between sm:px-2">
                        <div>
                            <h1 className="text-2xl font-bold text-slate-900">Users Management</h1>
                            <p className="text-xs text-slate-500">View users, update roles, and remove accounts.</p>
                        </div>
                        <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-2 text-sm text-slate-500">
                            {users.length} users
                        </div>
                    </header>

                    {error ? (
                        <div className="mt-4 rounded-xl border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-700">{error}</div>
                    ) : null}

                    <section className="mt-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                        <div className="overflow-x-auto rounded-xl border border-slate-200">
                            <table className="min-w-full divide-y divide-slate-200 text-left text-sm">
                                <thead className="bg-slate-50 text-slate-600">
                                    <tr>
                                        <th className="px-3 py-2">Username</th>
                                        <th className="px-3 py-2">Email</th>
                                        <th className="px-3 py-2">Role</th>
                                        <th className="px-3 py-2">Provider</th>
                                        <th className="px-3 py-2">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-200 bg-white">
                                    {loading ? (
                                        <tr>
                                            <td colSpan={5} className="px-3 py-8 text-center text-slate-500">Loading users...</td>
                                        </tr>
                                    ) : users.length === 0 ? (
                                        <tr>
                                            <td colSpan={5} className="px-3 py-8 text-center text-slate-500">No users found.</td>
                                        </tr>
                                    ) : (
                                        users.map((user) => {
                                            const isSelf = currentUser?.id === user.id
                                            return (
                                                <tr key={user.id}>
                                                    <td className="px-3 py-3 font-semibold text-slate-800">{user.username}</td>
                                                    <td className="px-3 py-3 text-slate-600">{user.email}</td>
                                                    <td className="px-3 py-3">
                                                        <select
                                                            value={draftRoles[user.id] || user.role}
                                                            onChange={(event) =>
                                                                setDraftRoles((prev) => ({
                                                                    ...prev,
                                                                    [user.id]: event.target.value,
                                                                }))
                                                            }
                                                            className="rounded-lg border border-slate-300 bg-white px-2 py-1"
                                                        >
                                                            {roleOptions.map((option) => (
                                                                <option key={option} value={option}>
                                                                    {option}
                                                                </option>
                                                            ))}
                                                        </select>
                                                    </td>
                                                    <td className="px-3 py-3 text-slate-600">{user.provider}</td>
                                                    <td className="px-3 py-3">
                                                        <div className="flex flex-wrap gap-2">
                                                            <button
                                                                type="button"
                                                                disabled={savingUserId === user.id || isSelf}
                                                                onClick={() => handleSaveRole(user.id)}
                                                                className="rounded-lg bg-blue-600 px-3 py-1.5 text-xs font-semibold text-white disabled:opacity-50"
                                                            >
                                                                {savingUserId === user.id ? 'Saving...' : 'Save'}
                                                            </button>
                                                            <button
                                                                type="button"
                                                                disabled={savingUserId === user.id || isSelf}
                                                                onClick={() => handleDeleteUser(user.id)}
                                                                className="rounded-lg border border-rose-300 bg-rose-50 px-3 py-1.5 text-xs font-semibold text-rose-600 disabled:opacity-50"
                                                            >
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
                </main>
            </div>
        </div>
    )
}

export default AdminUsersPage
