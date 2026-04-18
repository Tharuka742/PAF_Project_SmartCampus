import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { clearToken, deleteMyProfile, getDashboardByRole, getMe } from '../../services/auth'

const moduleLinks = ['Resources', 'Bookings', 'Tickets', 'Notifications']

const summaryCards = [
    { label: 'My Bookings', value: '3', subtext: '1 upcoming today', accent: 'border-blue-200' },
    { label: 'Pending', value: '1', subtext: 'Awaiting approval', accent: 'border-amber-200' },
    { label: 'Approved', value: '2', subtext: 'This week', accent: 'border-emerald-200' },
    { label: 'Notifications', value: '2', subtext: 'Unread', accent: 'border-violet-200' },
]

const resources = [
    { title: 'Lecture Hall A-101', category: 'Lecture Hall', meta: 'Block A · 150', icon: '🎓' },
    { title: 'Computer Lab B-204', category: 'Computer Lab', meta: 'Block B · 30', icon: '💻' },
    { title: 'Meeting Room C-305', category: 'Meeting Room', meta: 'Block C · 12', icon: '🪑' },
    { title: 'Media Studio D-102', category: 'Media Studio', meta: 'Block D · 8', icon: '🎥' },
]

const upcomingBookings = [
    { title: 'Computer Lab B-204', time: '15 Apr · 9:00 – 11:00 AM', status: 'PENDING', project: 'React Workshop' },
    { title: 'Meeting Room C-305', time: '12 Apr · 2:00 – 3:30 PM', status: 'APPROVED', project: 'Sprint Review' },
    { title: 'Lecture Hall A-101', time: '10 Apr · 10:00 – 12:00', status: 'APPROVED', project: 'Guest Lecture' },
]

function StudentDashboard() {
    const navigate = useNavigate()
    const [me, setMe] = useState(null)
    const [dashboard, setDashboard] = useState(null)
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(true)
    const [deleting, setDeleting] = useState(false)

    const logout = () => {
        clearToken()
        navigate('/auth')
    }

    useEffect(() => {
        const load = async () => {
            setLoading(true)
            setError('')
            try {
                const [data, user] = await Promise.all([getDashboardByRole('USER'), getMe()])
                setDashboard(data)
                setMe(user)
            } catch (apiError) {
                setError(apiError?.response?.data?.message || 'Failed to load student dashboard')
            } finally {
                setLoading(false)
            }
        }

        load()
    }, [])

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
        <div className="min-h-screen bg-slate-100 text-slate-900">
            <div className="grid min-h-screen lg:grid-cols-[250px_1fr]">
                <aside className="flex flex-col border-r border-slate-800 bg-[#0c1f44] text-slate-200">
                    <div className="border-b border-white/10 px-5 py-6">
                        <p className="text-xl font-bold text-white">SmartCampus</p>
                        <p className="text-xs text-slate-400">Student Portal</p>
                    </div>

                    <div className="px-3 py-5">
                        <p className="px-2 text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-400">Overview</p>
                        <button className="mt-2 w-full rounded-xl bg-blue-600/30 px-3 py-2 text-left text-sm font-semibold text-white">
                            Dashboard
                        </button>
                    </div>

                    <div className="px-3 py-2">
                        <p className="px-2 text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-400">Other Modules</p>
                        <div className="mt-2 space-y-1">
                            {moduleLinks.map((item) => (
                                <button
                                    key={item}
                                    onClick={() => item === 'Tickets' ? navigate('/tickets') : undefined}
                                    className="w-full rounded-lg px-3 py-2 text-left text-sm text-slate-300 hover:bg-white/10"
                                >
                                    {item}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="mt-auto border-t border-white/10 px-4 py-4 space-y-3">
                        <button
                            type="button"
                            onClick={() => navigate('/select-role')}
                            className="w-full rounded-lg border border-cyan-400/25 bg-cyan-500/10 px-3 py-2 text-sm font-semibold text-cyan-200 hover:border-cyan-400/50 hover:bg-cyan-500/20 transition"
                        >
                            Change Role
                        </button>
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
                    <div className="flex flex-col gap-3 border-b border-slate-200 bg-white px-1 pb-4 sm:flex-row sm:items-center sm:justify-between sm:px-2">
                        <div>
                            <h1 className="text-2xl font-bold text-slate-900">Home</h1>
                            <p className="text-xs text-slate-500">SmartCampus &gt; Student Portal</p>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="hidden rounded-2xl border border-slate-200 bg-slate-50 px-4 py-2 text-sm text-slate-400 md:block">
                                Search resources...
                            </div>
                            <div className="rounded-full bg-emerald-500 px-3 py-1 text-sm font-semibold text-white">{me?.username?.charAt(0)?.toUpperCase() ?? 'U'}</div>
                            <div>
                                <p className="text-sm font-semibold text-slate-900">{me?.username ?? 'Student'}</p>
                                <p className="text-xs text-slate-500">Student</p>
                            </div>
                        </div>
                    </div>

                    {error ? (
                        <div className="mt-4 rounded-xl border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-700">{error}</div>
                    ) : null}

                    <section className="mt-4 rounded-[1.75rem] bg-gradient-to-r from-blue-700 to-blue-600 px-5 py-7 text-white shadow-lg">
                        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                            <div>
                                <p className="text-3xl font-bold">Good morning, {me?.username ?? 'Student'} 👋</p>
                                <p className="mt-2 text-sm text-blue-100">
                                    {new Date().toLocaleDateString('en-US', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
                                </p>
                            </div>
                            <button
                                onClick={() => navigate('/tickets')}
                                className="rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm font-semibold hover:bg-white/20 transition"
                            >
                                🎫 My Tickets
                            </button>
                        </div>
                    </section>

                    <section className="mt-4 grid gap-4 xl:grid-cols-4">
                        {summaryCards.map((card) => (
                            <article
                                key={card.label}
                                className={`rounded-2xl border-t-4 ${card.accent} bg-white p-4 shadow-sm`}
                            >
                                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">{card.label}</p>
                                <p className="mt-3 text-4xl font-bold text-slate-900">{card.value}</p>
                                <p className="mt-2 text-sm text-slate-500">{card.subtext}</p>
                            </article>
                        ))}
                    </section>

                    <section className="mt-4 grid gap-4 xl:grid-cols-[1.4fr_0.9fr]">
                        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                            <div className="flex items-center justify-between gap-3">
                                <h2 className="text-lg font-bold text-slate-900">Available Resources</h2>
                                <button className="rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white">+ Book Now</button>
                            </div>

                            <div className="mt-4 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                                {resources.map((resource) => (
                                    <article key={resource.title} className="overflow-hidden rounded-2xl border border-slate-200 bg-slate-50">
                                        <div className="flex h-28 items-center justify-center bg-gradient-to-br from-blue-50 to-emerald-50 text-5xl">
                                            {resource.icon}
                                        </div>
                                        <div className="p-4">
                                            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-blue-600">{resource.category}</p>
                                            <h3 className="mt-1 text-base font-bold text-slate-900">{resource.title}</h3>
                                            <p className="mt-2 text-sm text-slate-500">{resource.meta}</p>
                                            <button className="mt-4 w-full rounded-xl bg-blue-600 px-3 py-2 text-sm font-semibold text-white">
                                                Book
                                            </button>
                                        </div>
                                    </article>
                                ))}
                            </div>
                        </div>

                        <aside className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                            <h2 className="text-lg font-bold text-slate-900">My Upcoming Bookings</h2>
                            <div className="mt-4 space-y-3">
                                {upcomingBookings.map((booking) => (
                                    <article key={booking.title} className="rounded-2xl border border-slate-200 p-4">
                                        <div className="flex items-start justify-between gap-3">
                                            <div>
                                                <p className="font-semibold text-slate-900">{booking.title}</p>
                                                <p className="mt-1 text-sm text-slate-500">{booking.time}</p>
                                                <p className="mt-1 text-sm text-slate-500">{booking.project}</p>
                                            </div>
                                            <span
                                                className={`rounded-full px-3 py-1 text-xs font-semibold ${booking.status === 'APPROVED'
                                                    ? 'bg-emerald-100 text-emerald-700'
                                                    : 'bg-amber-100 text-amber-700'
                                                    }`}
                                            >
                                                {booking.status}
                                            </span>
                                        </div>
                                    </article>
                                ))}
                            </div>

                            <div className="mt-4 rounded-2xl bg-slate-50 p-4 text-sm text-slate-600">
                                API: {loading ? 'Loading dashboard...' : dashboard?.dashboard || 'N/A'}
                            </div>
                        </aside>
                    </section>

                    <div className="mt-5 flex justify-end">
                        <button
                            type="button"
                            onClick={handleDeleteProfile}
                            disabled={deleting}
                            className="rounded-xl border border-rose-300 bg-rose-50 px-4 py-2.5 text-sm font-semibold text-rose-600 disabled:opacity-60"
                        >
                            {deleting ? 'Deleting...' : 'Delete Profile'}
                        </button>
                    </div>
                </main>
            </div>
        </div>
    )
}

export default StudentDashboard
