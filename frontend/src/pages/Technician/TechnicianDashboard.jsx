import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { clearToken, getDashboardByRole } from '../../services/auth'

const moduleLinks = ['Resources', 'Bookings', 'Tickets', 'Notifications']

function TechnicianDashboard() {
    const navigate = useNavigate()
    const [dashboard, setDashboard] = useState(null)
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(true)

    const logout = () => {
        clearToken()
        navigate('/auth')
    }

    useEffect(() => {
        const load = async () => {
            setLoading(true)
            setError('')
            try {
                const data = await getDashboardByRole('TECHNICIAN')
                setDashboard(data)
            } catch (apiError) {
                setError(apiError?.response?.data?.message || 'Failed to load technician dashboard')
            } finally {
                setLoading(false)
            }
        }

        load()
    }, [])

    return (
        <div className="min-h-screen bg-slate-100 text-slate-900">
            <div className="grid min-h-screen lg:grid-cols-[250px_1fr]">
                <aside className="flex flex-col border-r border-slate-800 bg-[#0c1f44] text-slate-200">
                    <div className="border-b border-white/10 px-5 py-6">
                        <p className="text-xl font-bold text-white">SmartCampus</p>
                        <p className="text-xs text-slate-400">Technician Portal</p>
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
                                <button key={item} className="w-full rounded-lg px-3 py-2 text-left text-sm text-slate-300 hover:bg-white/10">
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
                    <header className="rounded-2xl border border-slate-200 bg-white px-4 py-3">
                        <p className="text-xs text-slate-500">SmartCampus &gt; Technician &gt; Dashboard</p>
                        <h1 className="mt-1 text-2xl font-bold text-slate-900">Maintenance Dashboard</h1>
                    </header>

                    {error ? (
                        <div className="mt-4 rounded-xl border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-700">{error}</div>
                    ) : null}

                    <section className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
                        <article className="rounded-2xl border border-slate-200 bg-white p-4">
                            <p className="text-xs font-semibold uppercase text-slate-500">Total Ticket</p>
                            <p className="mt-2 text-4xl font-bold text-slate-900">48</p>
                        </article>
                        <article className="rounded-2xl border border-slate-200 bg-white p-4">
                            <p className="text-xs font-semibold uppercase text-slate-500">Open</p>
                            <p className="mt-2 text-4xl font-bold text-slate-900">8</p>
                        </article>
                        <article className="rounded-2xl border border-slate-200 bg-white p-4">
                            <p className="text-xs font-semibold uppercase text-slate-500">In Progress</p>
                            <p className="mt-2 text-4xl font-bold text-slate-900">4</p>
                        </article>
                        <article className="rounded-2xl border border-slate-200 bg-white p-4">
                            <p className="text-xs font-semibold uppercase text-slate-500">Critical</p>
                            <p className="mt-2 text-4xl font-bold text-rose-600">2</p>
                        </article>
                        <article className="rounded-2xl border border-slate-200 bg-white p-4">
                            <p className="text-xs font-semibold uppercase text-slate-500">Resolved</p>
                            <p className="mt-2 text-4xl font-bold text-emerald-600">3</p>
                        </article>
                    </section>

                    <section className="mt-4 grid gap-4 lg:grid-cols-[1.8fr_1fr]">
                        <div className="rounded-2xl border border-slate-200 bg-white p-4">
                            <h2 className="text-lg font-bold text-slate-900">Recent Tickets</h2>
                            {loading ? (
                                <p className="mt-3 text-sm text-slate-500">Loading dashboard...</p>
                            ) : (
                                <ul className="mt-3 space-y-3 text-sm">
                                    <li className="rounded-xl bg-slate-50 px-3 py-2">Projector not displaying output - In Progress</li>
                                    <li className="rounded-xl bg-slate-50 px-3 py-2">AC unit making loud noise - Open</li>
                                    <li className="rounded-xl bg-slate-50 px-3 py-2">Network connectivity drops intermittently - In Progress</li>
                                    <li className="rounded-xl bg-slate-50 px-3 py-2">API: {dashboard?.dashboard || 'N/A'}</li>
                                </ul>
                            )}
                        </div>

                        <div className="space-y-4">
                            <div className="rounded-2xl border border-slate-200 bg-white p-4">
                                <h3 className="text-lg font-bold text-slate-900">Priority Breakdown</h3>
                                <ul className="mt-3 space-y-2 text-sm text-slate-700">
                                    <li>Critical - 2</li>
                                    <li>High - 5</li>
                                    <li>Medium - 9</li>
                                    <li>Low - 32</li>
                                </ul>
                            </div>

                            <div className="rounded-2xl border border-slate-200 bg-white p-4">
                                <h3 className="text-lg font-bold text-slate-900">By Category</h3>
                                <ul className="mt-3 space-y-2 text-sm text-slate-700">
                                    <li>AV Equipment - 14</li>
                                    <li>Electrical - 10</li>
                                    <li>HVAC - 9</li>
                                    <li>Network / IT - 7</li>
                                    <li>Furniture - 5</li>
                                </ul>
                            </div>
                        </div>
                    </section>
                </main>
            </div>
        </div>
    )
}

export default TechnicianDashboard
