import { Link } from 'react-router-dom'

const moduleCards = [
    {
        title: 'Facilities And Assets',
        description: 'Track lecture halls, labs, rooms, and equipment with live availability and metadata.',
    },
    {
        title: 'Booking Workflow',
        description: 'Request, approve, and monitor bookings with conflict-free scheduling and status tracking.',
    },
    {
        title: 'Maintenance Tickets',
        description: 'Log incidents with attachments, assign technicians, and follow resolution progress end to end.',
    },
    {
        title: 'Live Notifications',
        description: 'Receive updates for booking decisions, ticket changes, and comments in a single stream.',
    },
]

const roleCards = [
    {
        role: 'Student',
        details: 'Book resources, report issues, and follow requests in a personalized workspace.',
    },
    {
        role: 'Administrator',
        details: 'Approve bookings, govern access, and keep campus operations reliable and auditable.',
    },
    {
        role: 'Technician',
        details: 'Manage incidents, update progress, and close tasks with clear resolution notes.',
    },
]

const stats = [
    { label: 'Active Spaces', value: '128' },
    { label: 'Open Requests', value: '16' },
    { label: 'Live Alerts', value: '07' },
    { label: 'Resolved This Week', value: '41' },
]

const workflowSteps = [
    'Log in with local account or Google',
    'Create bookings and report campus issues',
    'Track approvals, alerts, and resolution updates',
]

function Home() {
    return (
        <div className="relative overflow-hidden bg-slate-950 text-slate-100">
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_14%_18%,rgba(16,185,129,0.22),transparent_28%),radial-gradient(circle_at_85%_14%,rgba(14,165,233,0.22),transparent_30%),radial-gradient(circle_at_50%_115%,rgba(59,130,246,0.16),transparent_34%)]" />
            <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_bottom,rgba(15,23,42,0.2),rgba(15,23,42,0.8))]" />

            <header className="sticky top-0 z-30 border-b border-white/10 bg-slate-950/70 backdrop-blur-xl">
                <nav className="flex items-center justify-between w-full px-4 py-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <Link to="/" className="flex items-center gap-3">
                        <div className="grid text-sm font-bold border shadow-lg h-11 w-11 place-items-center rounded-2xl border-emerald-400/30 bg-emerald-400/10 text-emerald-300 shadow-emerald-500/10">
                            SC
                        </div>
                        <div>
                            <p className="text-xs font-semibold uppercase tracking-[0.34em] text-emerald-300/90">Smart Campus</p>
                            <p className="text-sm font-semibold text-slate-200">Operations Hub</p>
                        </div>
                    </Link>

                    <div className="items-center hidden gap-8 text-sm font-medium text-slate-300 md:flex">
                        <a href="#overview" className="transition hover:text-white">Overview</a>
                        <a href="#modules" className="transition hover:text-white">Modules</a>
                        <a href="#workflow" className="transition hover:text-white">Workflow</a>
                        <a href="#roles" className="transition hover:text-white">Roles</a>
                    </div>

                    <div className="flex items-center gap-2 sm:gap-3">
                        <Link
                            to="/auth?mode=login"
                            className="px-4 py-2 text-sm font-semibold transition border rounded-xl border-white/15 bg-white/5 text-slate-200 hover:border-white/25 hover:bg-white/10"
                        >
                            Login
                        </Link>
                        <Link
                            to="/auth?mode=register"
                            className="px-4 py-2 text-sm font-semibold transition shadow-lg rounded-xl bg-gradient-to-r from-emerald-400 to-cyan-500 text-slate-950 shadow-cyan-500/20 hover:from-emerald-300 hover:to-cyan-400"
                        >
                            Register
                        </Link>
                    </div>
                </nav>
            </header>

            <main className="relative">
                <section id="overview" className="mx-auto grid w-full max-w-7xl gap-10 px-4 pb-12 pt-14 sm:px-6 lg:grid-cols-[1.1fr_0.9fr] lg:px-8 lg:pb-20 lg:pt-20">
                    <div className="max-w-2xl fade-in-up">
                        <p className="inline-flex items-center gap-2 rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.3em] text-emerald-200">
                            <span className="w-2 h-2 rounded-full bg-emerald-300" />
                            Unified Campus Control
                        </p>
                        <h1 className="mt-6 text-4xl font-extrabold leading-tight tracking-tight text-white sm:text-5xl lg:text-6xl">
                            Manage campus operations with a cleaner, faster control center.
                        </h1>
                        <p className="max-w-xl mt-5 text-base leading-7 text-slate-300 sm:text-lg">
                            Handle bookings, maintenance, notifications, and role-based access in one place. The platform keeps every action traceable,
                            responsive, and easy to use for students, administrators, and technicians.
                        </p>

                        <div className="flex flex-wrap gap-3 mt-8">
                            <Link
                                to="/auth?mode=register"
                                className="px-5 py-3 text-sm font-semibold transition bg-white rounded-xl text-slate-950 hover:bg-slate-100"
                            >
                                Create Account
                            </Link>
                            <Link
                                to="/auth?mode=login"
                                className="px-5 py-3 text-sm font-semibold text-white transition border rounded-xl border-white/15 bg-white/5 hover:border-white/25 hover:bg-white/10"
                            >
                                Access Portal
                            </Link>
                        </div>

                        <div className="grid gap-3 mt-10 sm:grid-cols-3">
                            <div className="p-4 border rounded-2xl border-white/10 bg-white/5 backdrop-blur">
                                <p className="text-xs uppercase tracking-[0.22em] text-slate-400">Secure Login</p>
                                <p className="mt-2 text-sm font-semibold text-white">Local + Google authentication</p>
                            </div>
                            <div className="p-4 border rounded-2xl border-white/10 bg-white/5 backdrop-blur">
                                <p className="text-xs uppercase tracking-[0.22em] text-slate-400">Live Tracking</p>
                                <p className="mt-2 text-sm font-semibold text-white">Bookings and tickets in sync</p>
                            </div>
                            <div className="p-4 border rounded-2xl border-white/10 bg-white/5 backdrop-blur">
                                <p className="text-xs uppercase tracking-[0.22em] text-slate-400">Role Driven</p>
                                <p className="mt-2 text-sm font-semibold text-white">Student, admin, and technician views</p>
                            </div>
                        </div>
                    </div>

                    <div className="relative fade-in-up">
                        <div className="absolute w-24 h-24 rounded-full -left-6 top-10 bg-emerald-400/20 blur-3xl" />
                        <div className="absolute top-0 right-0 rounded-full h-28 w-28 bg-cyan-400/20 blur-3xl" />

                        <div className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-slate-900/80 p-5 shadow-[0_40px_120px_-50px_rgba(14,165,233,0.45)] backdrop-blur-xl sm:p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-xs font-semibold uppercase tracking-[0.24em] text-cyan-300">Control Panel</p>
                                    <h2 className="mt-1 text-xl font-bold text-white">Today at a glance</h2>
                                </div>
                                <span className="px-3 py-1 text-xs font-semibold border rounded-full border-emerald-400/20 bg-emerald-400/10 text-emerald-200">
                                    Live
                                </span>
                            </div>

                            <div className="grid gap-3 mt-6 sm:grid-cols-2">
                                {stats.map((item) => (
                                    <article key={item.label} className="p-4 border rounded-2xl border-white/10 bg-white/5">
                                        <p className="text-xs uppercase tracking-[0.22em] text-slate-400">{item.label}</p>
                                        <p className="mt-2 text-3xl font-extrabold text-white">{item.value}</p>
                                    </article>
                                ))}
                            </div>

                            <div className="p-4 mt-4 border rounded-2xl border-white/10 bg-gradient-to-br from-white/8 to-white/4">
                                <div className="flex items-center justify-between gap-4">
                                    <div>
                                        <p className="text-sm font-semibold text-white">Workflow snapshot</p>
                                        <p className="mt-1 text-sm text-slate-400">A simple path from login to completion.</p>
                                    </div>
                                    <div className="w-10 h-10 border rounded-full border-cyan-300/25 bg-cyan-400/10" />
                                </div>

                                <ol className="mt-4 space-y-3">
                                    {workflowSteps.map((step, index) => (
                                        <li key={step} className="flex items-start gap-3 p-3 border rounded-xl border-white/8 bg-slate-950/40">
                                            <span className="grid text-xs font-bold rounded-full h-7 w-7 shrink-0 place-items-center bg-gradient-to-r from-emerald-400 to-cyan-400 text-slate-950">
                                                {index + 1}
                                            </span>
                                            <p className="pt-0.5 text-sm text-slate-200">{step}</p>
                                        </li>
                                    ))}
                                </ol>
                            </div>
                        </div>
                    </div>
                </section>

                <section className="w-full px-4 pb-12 mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="rounded-[2rem] border border-white/10 bg-white/5 p-6 backdrop-blur-xl sm:p-8">
                        <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
                            <div>
                                <p className="text-xs font-semibold uppercase tracking-[0.32em] text-cyan-300">About The Platform</p>
                                <h2 className="mt-2 text-2xl font-bold text-white sm:text-3xl">Designed for structure, speed, and accountability.</h2>
                            </div>
                            <p className="max-w-2xl text-sm leading-6 text-slate-300">
                                The platform keeps campus operations in a single streamlined workflow so each role sees the right information at the right time.
                            </p>
                        </div>
                    </div>
                </section>

                <section id="modules" className="w-full px-4 pb-12 mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="flex items-end justify-between gap-4">
                        <div>
                            <p className="text-xs font-semibold uppercase tracking-[0.32em] text-emerald-300">Modules</p>
                            <h2 className="mt-2 text-2xl font-bold text-white sm:text-3xl">Everything you need in one place</h2>
                        </div>
                    </div>

                    <div className="grid gap-4 mt-6 md:grid-cols-2">
                        {moduleCards.map((item) => (
                            <article
                                key={item.title}
                                className="p-6 transition duration-300 border group rounded-3xl border-white/10 bg-slate-900/70 hover:-translate-y-1 hover:border-cyan-300/30 hover:bg-slate-900/90"
                            >
                                <div className="flex items-center justify-between">
                                    <div className="h-11 w-11 rounded-2xl bg-gradient-to-br from-emerald-400/20 to-cyan-400/20 ring-1 ring-white/10" />
                                    <span className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-400">Core</span>
                                </div>
                                <h3 className="mt-5 text-xl font-bold text-white">{item.title}</h3>
                                <p className="mt-3 text-sm leading-6 text-slate-300">{item.description}</p>
                            </article>
                        ))}
                    </div>
                </section>

                <section id="roles" className="w-full px-4 pb-16 mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="flex items-end justify-between gap-4">
                        <div>
                            <p className="text-xs font-semibold uppercase tracking-[0.32em] text-cyan-300">Roles</p>
                            <h2 className="mt-2 text-2xl font-bold text-white sm:text-3xl">Role-based spaces with different priorities</h2>
                        </div>
                    </div>

                    <div className="grid gap-4 mt-6 md:grid-cols-3">
                        {roleCards.map((item) => (
                            <article key={item.role} className="p-6 border rounded-3xl border-white/10 bg-white/5 backdrop-blur-xl">
                                <div className="flex items-center justify-between">
                                    <h3 className="text-lg font-bold text-white">{item.role}</h3>
                                    <span className="px-3 py-1 text-xs font-semibold border rounded-full border-white/10 bg-white/5 text-slate-300">
                                        Role
                                    </span>
                                </div>
                                <p className="mt-3 text-sm leading-6 text-slate-300">{item.details}</p>
                            </article>
                        ))}
                    </div>
                </section>
            </main>

            <footer className="border-t border-white/10 bg-slate-950/95 text-slate-300">
                <div className="flex flex-col w-full gap-4 px-4 py-8 mx-auto text-sm max-w-7xl sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
                    <div>
                        <p className="font-semibold text-white">Smart Campus Operations Hub</p>
                        <p className="mt-1 text-slate-400">Faculty of Computing - SLIIT</p>
                    </div>
                    <div className="flex flex-wrap gap-5 text-slate-400">
                        <a href="#overview" className="transition hover:text-white">Overview</a>
                        <a href="#modules" className="transition hover:text-white">Modules</a>
                        <a href="#roles" className="transition hover:text-white">Roles</a>
                    </div>
                </div>
            </footer>
        </div>
    )
}

export default Home
