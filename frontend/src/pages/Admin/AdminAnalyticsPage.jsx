import { useNavigate } from 'react-router-dom'
import { clearToken } from '../../services/auth'

const menuItems = ['Resources', 'Bookings', 'Tickets', 'Users', 'Analytics']

const statCards = [
    { label: 'Total Bookings', value: '892', subtext: '↑18% vs last semester', accent: 'border-blue-200' },
    { label: 'Avg Daily Bookings', value: '22.3', subtext: '↑4.1 from last month', accent: 'border-emerald-200' },
    { label: 'Peak Utilization', value: '94%', subtext: 'Tuesdays 10–12 PM', accent: 'border-amber-200' },
    { label: 'Cancellation Rate', value: '5.5%', subtext: '↑0.8% vs last month', accent: 'border-violet-200' },
]

const weeklyBars = [
    { day: 'Mon', value: 36 },
    { day: 'Tue', value: 50 },
    { day: 'Wed', value: 43 },
    { day: 'Thu', value: 52 },
    { day: 'Fri', value: 33 },
    { day: 'Sat', value: 14 },
    { day: 'Sun', value: 5 },
]

const monthlyBars = [
    { month: 'Jan', value: 220 },
    { month: 'Feb', value: 260 },
    { month: 'Mar', value: 305 },
    { month: 'Apr', value: 240 },
]

const topResources = [
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

const bookingSplit = [
    { label: 'Approved', value: '76%', color: 'bg-emerald-500', width: 'w-[76%]' },
    { label: 'Pending', value: '18%', color: 'bg-amber-500', width: 'w-[18%]' },
    { label: 'Cancelled', value: '6%', color: 'bg-rose-500', width: 'w-[6%]' },
]

function AdminAnalyticsPage() {
    const navigate = useNavigate()

    const logout = () => {
        clearToken()
        navigate('/auth')
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
                                    className={`w-full rounded-lg px-3 py-2 text-left text-sm ${item === 'Analytics'
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
                            <h1 className="text-2xl font-bold text-slate-900">Analytics Dashboard</h1>
                            <p className="text-xs text-slate-500">Utilization and booking trends for the current semester.</p>
                        </div>
                        <button className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700">
                            Export Report
                        </button>
                    </header>

                    <section className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                        {statCards.map((card) => (
                            <article key={card.label} className={`rounded-2xl border-t-4 ${card.accent} bg-white p-4 shadow-sm`}>
                                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">{card.label}</p>
                                <p className="mt-3 text-4xl font-bold text-slate-900">{card.value}</p>
                                <p className="mt-2 text-sm text-slate-500">{card.subtext}</p>
                            </article>
                        ))}
                    </section>

                    <section className="mt-4 grid gap-4 xl:grid-cols-2">
                        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                            <div className="flex items-center justify-between">
                                <h3 className="text-2xl font-bold text-slate-900">Bookings — This Week</h3>
                                <span className="text-sm text-slate-500">Daily breakdown</span>
                            </div>
                            <div className="mt-6 flex h-44 items-end gap-2">
                                {weeklyBars.map((item) => (
                                    <div key={item.day} className="flex flex-1 flex-col items-center gap-2">
                                        <div className="w-full rounded-t-md bg-blue-500/85" style={{ height: `${item.value * 2.2}px` }} />
                                        <span className="text-xs text-slate-500">{item.day}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                            <div className="flex items-center justify-between">
                                <h3 className="text-2xl font-bold text-slate-900">Monthly Booking Trend</h3>
                                <span className="text-sm text-slate-500">Jan – Apr 2026</span>
                            </div>
                            <div className="mt-6 flex h-44 items-end gap-3">
                                {monthlyBars.map((item) => (
                                    <div key={item.month} className="flex flex-1 flex-col items-center gap-2">
                                        <div className="w-full rounded-t-md bg-emerald-500/95" style={{ height: `${item.value * 0.45}px` }} />
                                        <span className="text-xs text-slate-500">{item.month}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </section>

                    <section className="mt-4 grid gap-4 xl:grid-cols-3">
                        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                            <h3 className="text-xl font-bold text-slate-900">Top Resources</h3>
                            <div className="mt-5 space-y-4 text-sm">
                                {topResources.map((item, index) => (
                                    <div key={item.label} className="flex items-center gap-3">
                                        <span className="w-5 text-base font-semibold text-slate-400">{index + 1}</span>
                                        <span className="flex-1 truncate text-slate-700">{item.label}</span>
                                        <div className="h-2 w-1/3 rounded-full bg-slate-100">
                                            <div className="h-2 rounded-full bg-blue-500" style={{ width: `${Math.min(item.value, 50) * 2}%` }} />
                                        </div>
                                        <span className="w-8 text-right text-base font-semibold text-slate-700">{item.value}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                            <h3 className="text-xl font-bold text-slate-900">By Resource Type</h3>
                            <div className="mt-5 space-y-4 text-sm">
                                {resourcesByType.map((item) => (
                                    <div key={item.label} className="flex items-center gap-3">
                                        <span className={`h-3 w-3 rounded-full ${item.color}`} />
                                        <span className="flex-1 text-slate-700">{item.label}</span>
                                        <div className="h-2 w-1/3 rounded-full bg-slate-100">
                                            <div className={`h-2 rounded-full ${item.color}`} style={{ width: item.value }} />
                                        </div>
                                        <span className="w-10 text-right text-base font-semibold text-slate-700">{item.value}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                            <h3 className="text-xl font-bold text-slate-900">Booking Status Split</h3>
                            <div className="mt-5 space-y-4 text-sm">
                                {bookingSplit.map((item) => (
                                    <div key={item.label}>
                                        <div className="flex items-center justify-between">
                                            <span className="text-slate-700">{item.label}</span>
                                            <span className="font-semibold text-slate-800">{item.value}</span>
                                        </div>
                                        <div className="mt-2 h-2 rounded-full bg-slate-100">
                                            <div className={`h-2 rounded-full ${item.color} ${item.width}`} />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </section>
                </main>
            </div>
        </div>
    )
}

export default AdminAnalyticsPage
