import { Link } from 'react-router-dom'

const moduleCards = [
    {
        title: 'Facilities And Assets',
        description: 'Discover lecture halls, labs, rooms, and equipment with clear availability and metadata.',
    },
    {
        title: 'Booking Workflow',
        description: 'Request, approve, and monitor bookings with conflict-free scheduling and status tracking.',
    },
    {
        title: 'Maintenance Tickets',
        description: 'Report incidents with attachments, assign technicians, and monitor full resolution timelines.',
    },
    {
        title: 'Live Notifications',
        description: 'Get updates for booking decisions, ticket status changes, and comments in one panel.',
    },
]

const roleCards = [
    {
        role: 'Student',
        details: 'Book resources, report issues, and follow your requests in a simple personalized workspace.',
    },
    {
        role: 'Administrator',
        details: 'Approve bookings, govern access, and keep campus operations reliable and auditable.',
    },
    {
        role: 'Technician',
        details: 'Manage assigned incidents, update progress, and close tasks with clear resolution notes.',
    },
]

function Home() {
    return (
        <div className="relative overflow-hidden">
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_8%_18%,rgba(34,197,94,0.16),transparent_30%),radial-gradient(circle_at_88%_12%,rgba(14,165,233,0.2),transparent_30%),radial-gradient(circle_at_50%_100%,rgba(30,64,175,0.16),transparent_38%)]" />

            <header className="sticky top-0 z-20 border-b border-white/25 bg-white/70 backdrop-blur-xl">
                <nav className="mx-auto flex w-full max-w-6xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
                    <div>
                        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-cyan-700">Smart Campus</p>
                        <p className="text-sm font-semibold text-slate-800">Operations Hub</p>
                    </div>

                    <div className="hidden items-center gap-8 text-sm font-medium text-slate-600 md:flex">
                        <a href="#about" className="transition hover:text-cyan-700">About</a>
                        <a href="#modules" className="transition hover:text-cyan-700">Modules</a>
                        <a href="#roles" className="transition hover:text-cyan-700">Roles</a>
                    </div>

                    <div className="flex items-center gap-2 sm:gap-3">
                        <Link
                            to="/auth?mode=login"
                            className="rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-cyan-300 hover:text-cyan-700"
                        >
                            Login
                        </Link>
                        <Link
                            to="/auth?mode=register"
                            className="rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-800"
                        >
                            Register
                        </Link>
                    </div>
                </nav>
            </header>

            <main className="relative">
                <section className="mx-auto grid w-full max-w-6xl gap-10 px-4 pb-16 pt-14 sm:px-6 md:grid-cols-2 lg:px-8 lg:pt-20">
                    <div className="fade-in-up">
                        <p className="text-xs font-semibold uppercase tracking-[0.32em] text-cyan-700">Unified Platform</p>
                        <h1 className="mt-4 text-4xl font-extrabold leading-tight tracking-tight text-slate-900 sm:text-5xl">
                            Campus Operations,
                            <span className="block text-cyan-700">One Intelligent Hub</span>
                        </h1>
                        <p className="mt-5 max-w-xl text-base leading-relaxed text-slate-600">
                            Manage resources, bookings, maintenance tickets, and role-based operations through a secure and user-friendly campus portal.
                        </p>

                        <div className="mt-8 flex flex-wrap gap-3">
                            <Link
                                to="/auth?mode=register"
                                className="rounded-xl bg-gradient-to-r from-cyan-600 to-emerald-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-cyan-600/30 transition hover:from-cyan-500 hover:to-emerald-500"
                            >
                                Create Account
                            </Link>
                            <Link
                                to="/auth?mode=login"
                                className="rounded-xl border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:border-cyan-300 hover:text-cyan-700"
                            >
                                Access Portal
                            </Link>
                        </div>
                    </div>

                    <div className="fade-in-up rounded-3xl border border-white/30 bg-white/80 p-6 shadow-[0_35px_80px_-38px_rgba(15,23,42,0.45)] backdrop-blur-xl">
                        <p className="text-sm font-semibold text-slate-800">Today At A Glance</p>
                        <div className="mt-5 grid gap-3 sm:grid-cols-2">
                            <div className="rounded-2xl border border-slate-200 bg-white p-4">
                                <p className="text-xs uppercase tracking-[0.22em] text-slate-500">Resource Health</p>
                                <p className="mt-2 text-2xl font-bold text-slate-900">98.4%</p>
                            </div>
                            <div className="rounded-2xl border border-slate-200 bg-white p-4">
                                <p className="text-xs uppercase tracking-[0.22em] text-slate-500">Pending Bookings</p>
                                <p className="mt-2 text-2xl font-bold text-slate-900">16</p>
                            </div>
                            <div className="rounded-2xl border border-slate-200 bg-white p-4">
                                <p className="text-xs uppercase tracking-[0.22em] text-slate-500">Open Incidents</p>
                                <p className="mt-2 text-2xl font-bold text-slate-900">07</p>
                            </div>
                            <div className="rounded-2xl border border-slate-200 bg-white p-4">
                                <p className="text-xs uppercase tracking-[0.22em] text-slate-500">Resolved This Week</p>
                                <p className="mt-2 text-2xl font-bold text-slate-900">41</p>
                            </div>
                        </div>
                    </div>
                </section>

                <section id="about" className="mx-auto w-full max-w-6xl px-4 pb-12 sm:px-6 lg:px-8">
                    <div className="rounded-3xl border border-white/30 bg-white/80 p-8 backdrop-blur-xl">
                        <h2 className="text-2xl font-bold text-slate-900">About The Platform</h2>
                        <p className="mt-3 text-sm leading-relaxed text-slate-600">
                            Smart Campus Operations Hub is designed for transparent workflows, role-driven accountability, and reliable audit trails.
                            From room bookings to incident resolution, every action is structured, trackable, and secure.
                        </p>
                    </div>
                </section>

                <section id="modules" className="mx-auto w-full max-w-6xl px-4 pb-12 sm:px-6 lg:px-8">
                    <h2 className="text-2xl font-bold text-slate-900">What You Can Do</h2>
                    <div className="mt-5 grid gap-4 md:grid-cols-2">
                        {moduleCards.map((item) => (
                            <article key={item.title} className="rounded-2xl border border-white/25 bg-white/80 p-6 shadow-sm backdrop-blur-lg">
                                <h3 className="text-lg font-bold text-slate-900">{item.title}</h3>
                                <p className="mt-2 text-sm leading-relaxed text-slate-600">{item.description}</p>
                            </article>
                        ))}
                    </div>
                </section>

                <section id="roles" className="mx-auto w-full max-w-6xl px-4 pb-16 sm:px-6 lg:px-8">
                    <h2 className="text-2xl font-bold text-slate-900">Role-Based Experience</h2>
                    <div className="mt-5 grid gap-4 md:grid-cols-3">
                        {roleCards.map((item) => (
                            <article key={item.role} className="rounded-2xl border border-white/25 bg-white/80 p-6 shadow-sm backdrop-blur-lg">
                                <h3 className="text-lg font-bold text-cyan-700">{item.role}</h3>
                                <p className="mt-2 text-sm leading-relaxed text-slate-600">{item.details}</p>
                            </article>
                        ))}
                    </div>
                </section>
            </main>

            <footer className="border-t border-white/30 bg-slate-950 text-slate-300">
                <div className="mx-auto flex w-full max-w-6xl flex-col gap-4 px-4 py-8 text-sm sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
                    <div>
                        <p className="font-semibold text-white">Smart Campus Operations Hub</p>
                        <p className="mt-1 text-slate-400">Faculty of Computing - SLIIT</p>
                    </div>
                    <div className="flex flex-wrap gap-5 text-slate-400">
                        <a href="#about" className="transition hover:text-cyan-300">About</a>
                        <a href="#modules" className="transition hover:text-cyan-300">Modules</a>
                        <a href="#roles" className="transition hover:text-cyan-300">Roles</a>
                    </div>
                </div>
            </footer>
        </div>
    )
}

export default Home
