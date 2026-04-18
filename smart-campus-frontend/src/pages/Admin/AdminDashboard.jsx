import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
    clearToken,
    getDashboardByRole,
} from '../../services/auth'

const moduleLinks = ['Resources', 'Bookings', 'Tickets', 'Users', 'Analytics']

const summaryCards = [
    { label: 'Total Resources', value: '34', subtext: '+2 added this month', accent: 'border-blue-200' },
    { label: 'Active Resources', value: '28', subtext: '82% of total resources', accent: 'border-emerald-200' },
    { label: 'Total Bookings', value: '218', subtext: '+14 this week', accent: 'border-amber-200' },
    { label: 'Utilization Rate', value: '67%', subtext: '+4% vs last month', accent: 'border-violet-200' },
]

const quickStats = [
    { label: 'Lab Utilization', value: '78%', color: 'bg-blue-500', width: 'w-[78%]' },
    { label: 'Hall Utilization', value: '54%', color: 'bg-emerald-500', width: 'w-[54%]' },
    { label: 'Equipment', value: '42%', color: 'bg-amber-500', width: 'w-[42%]' },
    { label: 'Meeting Rooms', value: '91%', color: 'bg-violet-500', width: 'w-[91%]' },
]

const mostUsedResources = [
    { label: 'Computer Lab B-204', value: 48 },
    { label: 'Lecture Hall A-101', value: 41 },
    { label: 'Meeting Room C-305', value: 36 },
    { label: 'Media Studio E-202', value: 27 },
    { label: 'Lab D-110', value: 19 },
]

const resourcesByType = [
    { label: 'Computer Labs', value: '35%', color: 'bg-blue-500' },
    { label: 'Lecture Halls', value: '25%', color: 'bg-emerald-500' },
    { label: 'Meeting Rooms', value: '18%', color: 'bg-violet-500' },
    { label: 'Equipment', value: '14%', color: 'bg-amber-500' },
    { label: 'Studios & Other', value: '8%', color: 'bg-rose-500' },
]

const bookingsByLocation = [
    { label: 'Block A', value: 38 },
    { label: 'Block B', value: 29 },
    { label: 'Block C', value: 21 },
    { label: 'Block D', value: 16 },
    { label: 'Block E / F', value: 11 },
]

function AdminDashboard() {
    const navigate = useNavigate()
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')
    const [dashboard, setDashboard] = useState(null)

    const logout = () => {
        clearToken()
        navigate('/auth')
    }

    const load = async () => {
        setLoading(true)
        setError('')
        try {
            const dashboardData = await getDashboardByRole('ADMIN')
            setDashboard(dashboardData)
        } catch (apiError) {
            setError(apiError?.response?.data?.message || 'Failed to load admin dashboard')
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        load()
    }, [])

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
                            className="mt-2 w-full rounded-xl bg-blue-600/30 px-3 py-2 text-left text-sm font-semibold text-white"
                        >
                            Dashboard
                        </button>
                    </div>

                    <div className="px-3 py-2">
                        <p className="px-2 text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-400">Other Modules</p>
                        <div className="mt-2 space-y-1">
                            {moduleLinks.map((item) => (
                                <button
                                    key={item}
                                    onClick={() => {
                                        if (item === 'Analytics') {
                                            navigate('/dashboard/admin/analytics')
                                        }
                                        if (item === 'Users') {
                                            navigate('/dashboard/admin/users')
                                        }
                                    }}
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
                    <header className="border-b border-slate-200 bg-white px-1 pb-4 sm:px-2">
                        <div>
                            <h1 className="text-2xl font-bold text-slate-900">Dashboard Overview</h1>
                            <p className="text-xs text-slate-500">SmartCampus &gt; Admin Portal</p>
                        </div>
                    </header>

                    {error ? (
                        <div className="mt-4 rounded-xl border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-700">{error}</div>
                    ) : null}

                    <section className="mt-4 rounded-[1.75rem] bg-gradient-to-r from-blue-700 to-blue-600 px-5 py-7 text-white shadow-lg">
                        <div className="flex flex-col gap-3">
                            <div>
                                <p className="text-3xl font-bold">Good morning, Kavinda 👋</p>
                                <p className="mt-2 text-sm text-blue-100">Wednesday, 8 April 2026 · All systems operational</p>
                            </div>
                        </div>
                    </section>

                    <section className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                        {summaryCards.map((card) => (
                            <article key={card.label} className={`rounded-2xl border-t-4 ${card.accent} bg-white p-4 shadow-sm`}>
                                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">{card.label}</p>
                                <p className="mt-3 text-4xl font-bold text-slate-900">{card.value}</p>
                                <p className="mt-2 text-sm text-slate-500">{card.subtext}</p>
                            </article>
                        ))}
                    </section>

                    <section className="mt-4 grid gap-4 xl:grid-cols-2">
                        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm min-h-[320px]">
                            <h3 className="text-2xl font-bold text-slate-900">Today&apos;s Quick Stats</h3>
                            <div className="mt-5 space-y-4 text-sm">
                                {quickStats.map((item) => (
                                    <div key={item.label}>
                                        <div className="flex items-center justify-between">
                                            <span className="text-slate-600">{item.label}</span>
                                            <span className="font-semibold text-slate-800">{item.value}</span>
                                        </div>
                                        <div className="mt-2 h-2 rounded-full bg-slate-100">
                                            <div className={`h-2 rounded-full ${item.color} ${item.width}`} />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm min-h-[320px]">
                            <h3 className="text-2xl font-bold text-slate-900">Bookings by Location</h3>
                            <div className="mt-5 space-y-4 text-sm">
                                {bookingsByLocation.map((item) => (
                                    <div key={item.label} className="flex items-center gap-3">
                                        <span className="w-20 text-slate-700">{item.label}</span>
                                        <div className="h-2 flex-1 rounded-full bg-slate-100">
                                            <div className="h-2 rounded-full bg-violet-500" style={{ width: `${Math.min(item.value, 40) * 2}%` }} />
                                        </div>
                                        <span className="w-8 text-right font-semibold text-slate-700">{item.value}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm min-h-[320px]">
                            <div className="flex items-center justify-between">
                                <h3 className="text-2xl font-bold text-slate-900">Most Used Resources</h3>
                                <span className="text-sm text-slate-500">This semester</span>
                            </div>
                            <div className="mt-5 space-y-4 text-sm">
                                {mostUsedResources.map((item, index) => (
                                    <div key={item.label} className="flex items-center gap-3">
                                        <span className="w-5 text-lg font-semibold text-slate-400">{index + 1}</span>
                                        <span className="flex-1 truncate text-slate-700">{item.label}</span>
                                        <div className="h-3 w-1/3 rounded-full bg-slate-100">
                                            <div className="h-3 rounded-full bg-blue-500" style={{ width: `${Math.min(item.value, 50) * 2}%` }} />
                                        </div>
                                        <span className="w-8 text-right text-lg font-semibold text-slate-700">{item.value}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm min-h-[320px]">
                            <h3 className="text-2xl font-bold text-slate-900">Resources by Type</h3>
                            <div className="mt-5 space-y-4 text-sm">
                                {resourcesByType.map((item) => (
                                    <div key={item.label} className="flex items-center gap-3">
                                        <span className={`h-3 w-3 rounded-full ${item.color}`} />
                                        <span className="flex-1 text-slate-700">{item.label}</span>
                                        <div className="h-3 w-1/3 rounded-full bg-slate-100">
                                            <div className={`h-3 rounded-full ${item.color}`} style={{ width: item.value }} />
                                        </div>
                                        <span className="w-12 text-right text-lg font-semibold text-slate-700">{item.value}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </section>

                    <div className="mt-4 rounded-2xl border border-slate-200 bg-white p-4 text-sm text-slate-500 shadow-sm">
                        {loading ? 'Loading dashboard...' : dashboard?.message || 'All systems operational.'}
                    </div>
                </main>
            </div>
        </div>
    )
}

export default AdminDashboard
