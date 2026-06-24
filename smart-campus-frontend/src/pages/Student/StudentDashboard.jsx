import { useEffect, useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import {
    LayoutDashboard,
    Building2,
    CalendarCheck,
    Ticket,
    Bell,
    Search,
    LogOut,
    UserCog,
    Trash2,
    Plus,
    CalendarDays,
    Clock,
    MapPin,
    Users,
    CheckCircle2,
    AlertCircle,
    ChevronRight,
    Sparkles,
    GraduationCap,
} from 'lucide-react'
import { clearToken, deleteMyProfile, getDashboardByRole, getMe } from '../../services/auth'
import { getResources } from '../../services/resourceService'
import bookingService from '../../services/bookingService'

const moduleLinks = [
    { label: 'Resources', to: '/resources', icon: Building2 },
    { label: 'Bookings', to: '/dashboard', icon: CalendarCheck },
    { label: 'Tickets', to: '/tickets', icon: Ticket },
    { label: 'Notifications', to: '/tickets', icon: Bell },
]

const SUMMARY_META = {
    bookings: {
        gradient: 'from-blue-500 to-blue-600',
        bg: 'bg-blue-50',
        text: 'text-blue-600',
        ring: 'ring-blue-100',
        icon: CalendarDays,
    },
    pending: {
        gradient: 'from-amber-500 to-orange-500',
        bg: 'bg-amber-50',
        text: 'text-amber-600',
        ring: 'ring-amber-100',
        icon: Clock,
    },
    approved: {
        gradient: 'from-emerald-500 to-teal-500',
        bg: 'bg-emerald-50',
        text: 'text-emerald-600',
        ring: 'ring-emerald-100',
        icon: CheckCircle2,
    },
    notifications: {
        gradient: 'from-violet-500 to-purple-500',
        bg: 'bg-violet-50',
        text: 'text-violet-600',
        ring: 'ring-violet-100',
        icon: Bell,
    },
}

const RESOURCE_ICONS = {
    LAB: '💻',
    LECTURE_HALL: '🎓',
    MEETING_ROOM: '🪑',
    AUDITORIUM: '🎤',
    LIBRARY_SPACE: '📚',
    EQUIPMENT: '🛠️',
    OPEN_AREA_THEATER: '🎭',
    SPORTS_COMPLEX: '🏟️',
}

const RESOURCE_GRADIENTS = {
    LAB: 'from-blue-100 via-blue-50 to-indigo-100',
    LECTURE_HALL: 'from-emerald-100 via-teal-50 to-cyan-100',
    MEETING_ROOM: 'from-amber-100 via-orange-50 to-rose-100',
    AUDITORIUM: 'from-violet-100 via-fuchsia-50 to-pink-100',
    LIBRARY_SPACE: 'from-rose-100 via-pink-50 to-fuchsia-100',
    EQUIPMENT: 'from-slate-100 via-zinc-50 to-stone-100',
    OPEN_AREA_THEATER: 'from-purple-100 via-violet-50 to-indigo-100',
    SPORTS_COMPLEX: 'from-lime-100 via-green-50 to-emerald-100',
}

const prettyType = (type) => {
    if (!type) return 'Resource'
    return String(type)
        .replace(/_/g, ' ')
        .toLowerCase()
        .replace(/\b\w/g, (c) => c.toUpperCase())
}

const formatBookingTime = (start, end) => {
    if (!start) return ''
    const startDate = new Date(start)
    const endDate = end ? new Date(end) : null
    const datePart = startDate.toLocaleDateString('en-US', { day: 'numeric', month: 'short' })
    const timeOpts = { hour: 'numeric', minute: '2-digit', hour12: true }
    const startTime = startDate.toLocaleTimeString('en-US', timeOpts)
    const endTime = endDate ? endDate.toLocaleTimeString('en-US', timeOpts) : null
    return endTime ? `${datePart} · ${startTime} – ${endTime}` : `${datePart} · ${startTime}`
}

function StudentDashboard() {
    const navigate = useNavigate()
    const [me, setMe] = useState(null)
    const [dashboard, setDashboard] = useState(null)
    const [resources, setResources] = useState([])
    const [resourcesLoading, setResourcesLoading] = useState(true)
    const [allBookings, setAllBookings] = useState([])
    const [upcomingBookings, setUpcomingBookings] = useState([])
    const [bookingsLoading, setBookingsLoading] = useState(true)
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

    useEffect(() => {
        const loadResources = async () => {
            setResourcesLoading(true)
            try {
                const list = await getResources({}, 'student')
                const available = (Array.isArray(list) ? list : [])
                    .filter((r) => !r.status || r.status === 'ACTIVE')
                setResources(available)
            } catch {
                setResources([])
            } finally {
                setResourcesLoading(false)
            }
        }

        loadResources()
    }, [])

    useEffect(() => {
        const loadBookings = async () => {
            setBookingsLoading(true)
            try {
                const response = await bookingService.getMyBookings()
                const list = Array.isArray(response?.data) ? response.data : []
                setAllBookings(list)
                const now = Date.now()
                const upcoming = list
                    .filter((b) => b.status !== 'CANCELLED' && b.status !== 'REJECTED')
                    .filter((b) => b.startTime && new Date(b.startTime).getTime() >= now)
                    .sort((a, b) => new Date(a.startTime) - new Date(b.startTime))
                    .slice(0, 4)
                setUpcomingBookings(upcoming)
            } catch {
                setAllBookings([])
                setUpcomingBookings([])
            } finally {
                setBookingsLoading(false)
            }
        }

        loadBookings()
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

    const total = allBookings.length
    const pending = allBookings.filter((b) => b.status === 'PENDING').length
    const approved = allBookings.filter((b) => b.status === 'APPROVED').length
    const upcomingToday = upcomingBookings.filter((b) => {
        if (!b.startTime) return false
        const d = new Date(b.startTime)
        const today = new Date()
        return d.toDateString() === today.toDateString()
    }).length

    const summaryCards = [
        {
            key: 'bookings',
            label: 'My Bookings',
            value: bookingsLoading ? '...' : String(total),
            subtext: upcomingToday ? `${upcomingToday} upcoming today` : 'All time',
        },
        {
            key: 'pending',
            label: 'Pending',
            value: bookingsLoading ? '...' : String(pending),
            subtext: 'Awaiting approval',
        },
        {
            key: 'approved',
            label: 'Approved',
            value: bookingsLoading ? '...' : String(approved),
            subtext: 'Confirmed',
        },
        {
            key: 'notifications',
            label: 'Notifications',
            value: '0',
            subtext: 'Unread',
        },
    ]

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
                                <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-cyan-300/80">Student Portal</p>
                            </div>
                        </div>
                    </div>

                    <div className="relative px-3 py-5">
                        <p className="px-3 text-[10px] font-semibold uppercase tracking-[0.22em] text-slate-400">Overview</p>
                        <button className="mt-2 flex w-full items-center gap-3 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 px-3 py-2.5 text-left text-sm font-semibold text-white shadow-lg shadow-cyan-900/30">
                            <LayoutDashboard className="h-4 w-4" />
                            Dashboard
                        </button>
                    </div>

                    <div className="relative px-3 py-2">
                        <p className="px-3 text-[10px] font-semibold uppercase tracking-[0.22em] text-slate-400">Other Modules</p>
                        <div className="mt-2 space-y-1">
                            {moduleLinks.map((item) => {
                                const Icon = item.icon
                                return (
                                    <NavLink
                                        key={item.label}
                                        to={item.to}
                                        className="group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-slate-300 transition hover:bg-white/10 hover:text-white"
                                    >
                                        <Icon className="h-4 w-4 text-slate-400 transition group-hover:text-cyan-300" />
                                        <span className="flex-1">{item.label}</span>
                                        <ChevronRight className="h-3.5 w-3.5 opacity-0 transition group-hover:opacity-100" />
                                    </NavLink>
                                )
                            })}
                        </div>
                    </div>

                    <div className="relative mt-auto border-t border-white/10 px-4 py-4 space-y-2">
                        <button
                            type="button"
                            onClick={() => navigate('/select-role')}
                            className="flex w-full items-center justify-center gap-2 rounded-lg border border-cyan-400/25 bg-cyan-500/10 px-3 py-2 text-sm font-semibold text-cyan-200 transition hover:border-cyan-400/50 hover:bg-cyan-500/20"
                        >
                            <UserCog className="h-4 w-4" />
                            Change Role
                        </button>
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
                    {/* Top bar */}
                    <div className="flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white px-5 py-4 shadow-sm sm:flex-row sm:items-center sm:justify-between">
                        <div>
                            <h1 className="text-2xl font-bold tracking-tight text-slate-900">Home</h1>
                            <p className="mt-0.5 flex items-center gap-1.5 text-xs text-slate-500">
                                <span className="font-medium text-slate-600">SmartCampus</span>
                                <ChevronRight className="h-3 w-3" />
                                <span>Student Portal</span>
                            </p>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="relative hidden md:block">
                                <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                                <input
                                    type="text"
                                    placeholder="Search resources..."
                                    className="w-64 rounded-xl border border-slate-200 bg-slate-50 py-2 pl-9 pr-3 text-sm text-slate-700 placeholder-slate-400 outline-none transition focus:border-blue-300 focus:bg-white focus:ring-4 focus:ring-blue-100"
                                />
                            </div>
                            <button className="relative grid h-10 w-10 place-items-center rounded-xl border border-slate-200 bg-white text-slate-500 transition hover:bg-slate-50 hover:text-slate-700">
                                <Bell className="h-4 w-4" />
                                <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-rose-500 ring-2 ring-white" />
                            </button>
                            <div className="flex items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 px-3 py-1.5">
                                <div className="grid h-9 w-9 place-items-center rounded-full bg-gradient-to-br from-emerald-500 to-teal-500 text-sm font-bold text-white shadow-md">
                                    {me?.username?.charAt(0)?.toUpperCase() ?? 'U'}
                                </div>
                                <div className="pr-1">
                                    <p className="text-sm font-semibold leading-tight text-slate-900">{me?.username ?? 'Student'}</p>
                                    <p className="text-[11px] text-slate-500">Student</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {error ? (
                        <div className="mt-4 flex items-start gap-2 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
                            <AlertCircle className="mt-0.5 h-4 w-4 flex-shrink-0" />
                            <span>{error}</span>
                        </div>
                    ) : null}

                    {/* Welcome banner */}
                    <section className="relative mt-6 overflow-hidden rounded-3xl bg-gradient-to-br from-blue-700 via-blue-600 to-indigo-700 px-6 py-8 text-white shadow-xl shadow-blue-900/20 sm:px-8">
                        <div className="pointer-events-none absolute -right-12 -top-12 h-48 w-48 rounded-full bg-white/10 blur-3xl" />
                        <div className="pointer-events-none absolute -bottom-16 -left-10 h-56 w-56 rounded-full bg-cyan-300/15 blur-3xl" />
                        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(120deg,transparent_40%,rgba(255,255,255,0.06)_50%,transparent_60%)]" />

                        <div className="relative flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                            <div>
                                <span className="inline-flex items-center gap-1.5 rounded-full border border-white/25 bg-white/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-blue-100 backdrop-blur">
                                    <Sparkles className="h-3 w-3" />
                                    Welcome back
                                </span>
                                <p className="mt-3 text-3xl font-bold sm:text-4xl">
                                    Good morning, {me?.username ?? 'Student'} <span className="inline-block animate-pulse">👋</span>
                                </p>
                                <p className="mt-2 flex items-center gap-2 text-sm text-blue-100">
                                    <CalendarDays className="h-4 w-4" />
                                    {new Date().toLocaleDateString('en-US', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
                                </p>
                            </div>
                            <button
                                onClick={() => navigate('/tickets')}
                                className="group inline-flex items-center gap-2 self-start rounded-full border border-white/25 bg-white/15 px-5 py-2.5 text-sm font-semibold shadow-lg shadow-blue-900/20 backdrop-blur transition hover:bg-white/25 md:self-auto"
                            >
                                <Ticket className="h-4 w-4" />
                                My Tickets
                                <ChevronRight className="h-4 w-4 transition group-hover:translate-x-0.5" />
                            </button>
                        </div>
                    </section>

                    {/* Summary cards */}
                    <section className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                        {summaryCards.map((card) => {
                            const meta = SUMMARY_META[card.key]
                            const Icon = meta.icon
                            return (
                                <article
                                    key={card.label}
                                    className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
                                >
                                    <div className={`pointer-events-none absolute -right-6 -top-6 h-24 w-24 rounded-full bg-gradient-to-br ${meta.gradient} opacity-[0.08] blur-2xl transition group-hover:opacity-20`} />
                                    <div className="flex items-start justify-between">
                                        <div>
                                            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">{card.label}</p>
                                            <p className="mt-3 text-4xl font-bold tracking-tight text-slate-900">{card.value}</p>
                                            <p className="mt-2 text-xs text-slate-500">{card.subtext}</p>
                                        </div>
                                        <div className={`grid h-11 w-11 place-items-center rounded-xl ${meta.bg} ring-4 ${meta.ring}`}>
                                            <Icon className={`h-5 w-5 ${meta.text}`} />
                                        </div>
                                    </div>
                                    <div className={`mt-4 h-1 w-full rounded-full bg-gradient-to-r ${meta.gradient} opacity-80`} />
                                </article>
                            )
                        })}
                    </section>

                    {/* Resources + Upcoming */}
                    <section className="mt-6 grid gap-5 xl:grid-cols-[1.5fr_1fr]">
                        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                            <div className="flex items-center justify-between gap-3">
                                <div>
                                    <h2 className="flex items-center gap-2 text-lg font-bold text-slate-900">
                                        <Building2 className="h-5 w-5 text-blue-600" />
                                        Available Resources
                                    </h2>
                                    <p className="mt-0.5 text-xs text-slate-500">Browse and reserve campus facilities in seconds</p>
                                </div>
                                <button
                                    onClick={() => navigate('/new-booking')}
                                    className="inline-flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-md shadow-blue-900/20 transition hover:from-blue-700 hover:to-indigo-700"
                                >
                                    <Plus className="h-4 w-4" />
                                    Book Now
                                </button>
                            </div>

                            <div className="mt-5 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                                {resourcesLoading ? (
                                    <div className="col-span-full flex items-center justify-center py-12 text-sm text-slate-500">
                                        <div className="h-5 w-5 animate-spin rounded-full border-2 border-blue-200 border-t-blue-600" />
                                        <span className="ml-3">Loading resources...</span>
                                    </div>
                                ) : resources.length === 0 ? (
                                    <div className="col-span-full rounded-xl border border-dashed border-slate-200 bg-slate-50 py-12 text-center">
                                        <Building2 className="mx-auto h-8 w-8 text-slate-300" />
                                        <p className="mt-2 text-sm text-slate-500">No available resources right now.</p>
                                    </div>
                                ) : (
                                    resources.map((resource) => (
                                        <article
                                            key={resource.id}
                                            className="group overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-1 hover:border-blue-200 hover:shadow-lg"
                                        >
                                            <div className={`relative flex h-28 items-center justify-center bg-gradient-to-br ${RESOURCE_GRADIENTS[resource.type] ?? 'from-slate-100 to-slate-50'} text-5xl`}>
                                                <span className="drop-shadow-sm">{RESOURCE_ICONS[resource.type] ?? '📌'}</span>
                                                <span className="absolute right-3 top-3 inline-flex items-center gap-1 rounded-full bg-white/90 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-emerald-700 shadow-sm backdrop-blur">
                                                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                                                    Active
                                                </span>
                                            </div>
                                            <div className="p-4">
                                                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-blue-600">{prettyType(resource.type)}</p>
                                                <h3 className="mt-1 line-clamp-1 text-base font-bold text-slate-900">{resource.name}</h3>
                                                <div className="mt-3 space-y-1.5 text-xs text-slate-500">
                                                    {resource.location ? (
                                                        <p className="flex items-center gap-1.5">
                                                            <MapPin className="h-3.5 w-3.5 text-slate-400" />
                                                            <span className="line-clamp-1">{resource.location}</span>
                                                        </p>
                                                    ) : null}
                                                    {resource.capacity ? (
                                                        <p className="flex items-center gap-1.5">
                                                            <Users className="h-3.5 w-3.5 text-slate-400" />
                                                            <span>Capacity {resource.capacity}</span>
                                                        </p>
                                                    ) : null}
                                                </div>
                                                <button
                                                    onClick={() => navigate(`/new-booking?resourceId=${resource.id}`)}
                                                    className="mt-4 flex w-full items-center justify-center gap-1.5 rounded-xl bg-slate-900 px-3 py-2 text-sm font-semibold text-white transition hover:bg-blue-600"
                                                >
                                                    Book
                                                    <ChevronRight className="h-4 w-4 transition group-hover:translate-x-0.5" />
                                                </button>
                                            </div>
                                        </article>
                                    ))
                                )}
                            </div>
                        </div>

                        <aside className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                            <div className="flex items-center justify-between">
                                <h2 className="flex items-center gap-2 text-lg font-bold text-slate-900">
                                    <CalendarCheck className="h-5 w-5 text-indigo-600" />
                                    My Upcoming Bookings
                                </h2>
                                <button
                                    onClick={() => navigate('/my-bookings')}
                                    className="text-xs font-semibold text-blue-600 hover:text-blue-700"
                                >
                                    View all
                                </button>
                            </div>

                            <div className="mt-4 space-y-3">
                                {bookingsLoading ? (
                                    <div className="flex items-center justify-center py-10 text-sm text-slate-500">
                                        <div className="h-4 w-4 animate-spin rounded-full border-2 border-blue-200 border-t-blue-600" />
                                        <span className="ml-3">Loading bookings...</span>
                                    </div>
                                ) : upcomingBookings.length === 0 ? (
                                    <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50 py-10 text-center">
                                        <CalendarDays className="mx-auto h-8 w-8 text-slate-300" />
                                        <p className="mt-2 text-sm text-slate-500">No upcoming bookings.</p>
                                        <button
                                            onClick={() => navigate('/new-booking')}
                                            className="mt-3 text-xs font-semibold text-blue-600 hover:text-blue-700"
                                        >
                                            + Make your first booking
                                        </button>
                                    </div>
                                ) : (
                                    upcomingBookings.map((booking) => (
                                        <article
                                            key={booking.id}
                                            className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-gradient-to-br from-white to-slate-50 p-4 transition hover:border-blue-200 hover:shadow-md"
                                        >
                                            <div className="flex items-start justify-between gap-3">
                                                <div className="flex gap-3">
                                                    <div className="grid h-10 w-10 flex-shrink-0 place-items-center rounded-xl bg-blue-100 text-blue-600">
                                                        <CalendarCheck className="h-5 w-5" />
                                                    </div>
                                                    <div className="min-w-0">
                                                        <p className="line-clamp-1 font-semibold text-slate-900">{booking.resourceName || 'Resource'}</p>
                                                        <p className="mt-0.5 flex items-center gap-1.5 text-xs text-slate-500">
                                                            <Clock className="h-3 w-3" />
                                                            {formatBookingTime(booking.startTime, booking.endTime)}
                                                        </p>
                                                        {booking.purpose ? (
                                                            <p className="mt-1 line-clamp-1 text-xs text-slate-500">{booking.purpose}</p>
                                                        ) : null}
                                                    </div>
                                                </div>
                                                <span
                                                    className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider ${
                                                        booking.status === 'APPROVED'
                                                            ? 'bg-emerald-100 text-emerald-700'
                                                            : 'bg-amber-100 text-amber-700'
                                                    }`}
                                                >
                                                    {booking.status === 'APPROVED' ? (
                                                        <CheckCircle2 className="h-3 w-3" />
                                                    ) : (
                                                        <Clock className="h-3 w-3" />
                                                    )}
                                                    {booking.status}
                                                </span>
                                            </div>
                                        </article>
                                    ))
                                )}
                            </div>

                            <div className="mt-4 flex items-center gap-2 rounded-xl border border-slate-200 bg-gradient-to-r from-slate-50 to-blue-50/40 p-3 text-xs text-slate-600">
                                <span className="grid h-6 w-6 place-items-center rounded-md bg-white text-blue-600 ring-1 ring-slate-200">
                                    <Sparkles className="h-3 w-3" />
                                </span>
                                <span>
                                    <span className="font-semibold text-slate-700">API:</span>{' '}
                                    {loading ? 'Loading dashboard...' : dashboard?.dashboard || 'N/A'}
                                </span>
                            </div>
                        </aside>
                    </section>

                    {/* Danger zone */}
                    <div className="mt-8 flex justify-end">
                        <button
                            type="button"
                            onClick={handleDeleteProfile}
                            disabled={deleting}
                            className="inline-flex items-center gap-2 rounded-xl border border-rose-200 bg-white px-4 py-2.5 text-sm font-semibold text-rose-600 transition hover:border-rose-300 hover:bg-rose-50 disabled:opacity-60"
                        >
                            <Trash2 className="h-4 w-4" />
                            {deleting ? 'Deleting...' : 'Delete Profile'}
                        </button>
                    </div>
                </main>
            </div>
        </div>
    )
}

export default StudentDashboard
