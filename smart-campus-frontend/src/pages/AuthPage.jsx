import { useEffect, useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { login, register, saveToken } from '../services/auth'

const BACKEND_URL = 'http://localhost:8080'

const highlights = [
    'Secure local registration and login',
    'Continue with Google when you want faster access',
    'Role-aware routing after authentication',
]

function AuthPage({ onAuthSuccess }) {
    const [params] = useSearchParams()
    const [mode, setMode] = useState('login')
    const [form, setForm] = useState({ username: '', email: '', password: '', usernameOrEmail: '' })
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')
    const navigate = useNavigate()

    useEffect(() => {
        const requestedMode = params.get('mode')
        if (requestedMode === 'login' || requestedMode === 'register') {
            setMode(requestedMode)
        }

        const oauthError = params.get('error')
        if (oauthError === 'oauth2') {
            const reason = params.get('reason')
            setError(
                reason
                    ? `Google login failed: ${reason}`
                    : 'Google login failed. Set GOOGLE_CLIENT_SECRET and add redirect URI http://localhost:8080/login/oauth2/code/google in Google Cloud Console.',
            )
        }
    }, [params])

    const redirectByRole = (role) => {
        if (role === 'ADMIN') {
            navigate('/dashboard/admin')
            return
        }

        if (role === 'TECHNICIAN') {
            navigate('/dashboard/technician')
            return
        }

        navigate('/dashboard/student')
    }

    const onChange = (event) => {
        setForm((prev) => ({ ...prev, [event.target.name]: event.target.value }))
    }

    const submit = async (event) => {
        event.preventDefault()
        setError('')
        setLoading(true)

        try {
            let data
            if (mode === 'register') {
                data = await register({
                    username: form.username,
                    email: form.email,
                    password: form.password,
                })
            } else {
                data = await login({
                    usernameOrEmail: form.usernameOrEmail,
                    password: form.password,
                })
            }

            saveToken(data.token)
            onAuthSuccess(data.role)
            if (mode === 'register') {
                navigate('/select-role')
            } else {
                redirectByRole(data.role)
            }
        } catch (apiError) {
            const message =
                apiError?.response?.data?.message ||
                'Authentication failed. Please check your details and try again.'
            setError(message)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="relative min-h-screen overflow-hidden bg-slate-950 text-slate-100">
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_14%_18%,rgba(16,185,129,0.22),transparent_28%),radial-gradient(circle_at_85%_14%,rgba(14,165,233,0.22),transparent_30%),radial-gradient(circle_at_50%_115%,rgba(59,130,246,0.16),transparent_34%)]" />
            <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_bottom,rgba(15,23,42,0.2),rgba(15,23,42,0.88))]" />

            <header className="relative z-10 border-b border-white/10 bg-slate-950/65 backdrop-blur-xl">
                <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
                    <Link to="/" className="flex items-center gap-3">
                        <div className="grid h-11 w-11 place-items-center rounded-2xl border border-emerald-400/30 bg-emerald-400/10 text-sm font-bold text-emerald-300 shadow-lg shadow-emerald-500/10">
                            SC
                        </div>
                        <div>
                            <p className="text-xs font-semibold uppercase tracking-[0.34em] text-emerald-300/90">Smart Campus</p>
                            <p className="text-sm font-semibold text-slate-200">Secure Access</p>
                        </div>
                    </Link>

                    <Link
                        to="/"
                        className="rounded-xl border border-white/15 bg-white/5 px-4 py-2 text-sm font-semibold text-slate-200 transition hover:border-white/25 hover:bg-white/10"
                    >
                        Back To Home
                    </Link>
                </div>
            </header>

            <main className="relative z-10">
                <section className="mx-auto grid min-h-[calc(100vh-73px)] w-full max-w-7xl gap-10 px-4 py-10 sm:px-6 lg:grid-cols-[0.95fr_1.05fr] lg:px-8 lg:py-14">
                    <div className="flex items-center">
                        <div className="max-w-2xl fade-in-up">
                            <p className="inline-flex items-center gap-2 rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.3em] text-emerald-200">
                                <span className="h-2 w-2 rounded-full bg-emerald-300" />
                                PAF Secure Access
                            </p>
                            <h1 className="mt-6 text-4xl font-extrabold leading-tight tracking-tight text-white sm:text-5xl lg:text-6xl">
                                {mode === 'login' ? 'Welcome back to campus portal.' : 'Create your campus account.'}
                            </h1>
                            <p className="mt-5 max-w-xl text-base leading-7 text-slate-300 sm:text-lg">
                                {mode === 'login'
                                    ? 'Use your username or email to continue with bookings, tickets, and campus operations.'
                                    : 'Register with your username, email, and password, or continue with Google for a faster start.'}
                            </p>

                            <div className="mt-8 grid gap-3 sm:grid-cols-3">
                                {highlights.map((item) => (
                                    <div key={item} className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur">
                                        <p className="text-sm font-semibold text-white">{item}</p>
                                    </div>
                                ))}
                            </div>

                            <div className="mt-8 flex flex-wrap gap-3">
                                <span className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs font-semibold uppercase tracking-[0.22em] text-slate-300">
                                    Local access
                                </span>
                                <span className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs font-semibold uppercase tracking-[0.22em] text-slate-300">
                                    Google sign-in
                                </span>
                                <span className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs font-semibold uppercase tracking-[0.22em] text-slate-300">
                                    Role-based routing
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center justify-center">
                        <div className="w-full max-w-xl rounded-[2rem] border border-white/10 bg-slate-900/80 p-5 shadow-[0_40px_120px_-50px_rgba(14,165,233,0.45)] backdrop-blur-xl sm:p-6">
                            <div className="flex items-center justify-between gap-4">
                                <div>
                                    <p className="text-xs font-semibold uppercase tracking-[0.24em] text-cyan-300">Authentication</p>
                                    <h2 className="mt-1 text-xl font-bold text-white">Choose your access method</h2>
                                </div>
                                <span className="rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3 py-1 text-xs font-semibold text-emerald-200">
                                    Secure
                                </span>
                            </div>

                            <div className="mt-6 grid grid-cols-2 gap-2 rounded-2xl border border-white/10 bg-white/5 p-1">
                                <button
                                    type="button"
                                    className={`rounded-xl px-4 py-2.5 text-sm font-semibold transition ${mode === 'login'
                                        ? 'bg-white text-slate-950 shadow-lg shadow-white/10'
                                        : 'text-slate-300 hover:bg-white/10'
                                        }`}
                                    onClick={() => setMode('login')}
                                >
                                    Login
                                </button>
                                <button
                                    type="button"
                                    className={`rounded-xl px-4 py-2.5 text-sm font-semibold transition ${mode === 'register'
                                        ? 'bg-white text-slate-950 shadow-lg shadow-white/10'
                                        : 'text-slate-300 hover:bg-white/10'
                                        }`}
                                    onClick={() => setMode('register')}
                                >
                                    Register
                                </button>
                            </div>

                            <form onSubmit={submit} className="mt-6 space-y-3">
                                {mode === 'register' ? (
                                    <>
                                        <input
                                            name="username"
                                            value={form.username}
                                            onChange={onChange}
                                            placeholder="Username"
                                            required
                                            className="w-full rounded-xl border border-white/10 bg-slate-950/60 px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-500 focus:border-cyan-300/50 focus:ring-4 focus:ring-cyan-400/10"
                                        />
                                        <input
                                            type="email"
                                            name="email"
                                            value={form.email}
                                            onChange={onChange}
                                            placeholder="Email"
                                            required
                                            className="w-full rounded-xl border border-white/10 bg-slate-950/60 px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-500 focus:border-cyan-300/50 focus:ring-4 focus:ring-cyan-400/10"
                                        />
                                    </>
                                ) : (
                                    <input
                                        name="usernameOrEmail"
                                        value={form.usernameOrEmail}
                                        onChange={onChange}
                                        placeholder="Username or email"
                                        required
                                        className="w-full rounded-xl border border-white/10 bg-slate-950/60 px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-500 focus:border-cyan-300/50 focus:ring-4 focus:ring-cyan-400/10"
                                    />
                                )}

                                <input
                                    type="password"
                                    name="password"
                                    value={form.password}
                                    onChange={onChange}
                                    placeholder="Password"
                                    required
                                    className="w-full rounded-xl border border-white/10 bg-slate-950/60 px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-500 focus:border-cyan-300/50 focus:ring-4 focus:ring-cyan-400/10"
                                />

                                {error ? (
                                    <div className="rounded-xl border border-rose-400/20 bg-rose-500/10 px-3 py-2 text-sm text-rose-200">
                                        {error}
                                    </div>
                                ) : null}

                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="inline-flex w-full items-center justify-center rounded-xl bg-gradient-to-r from-emerald-400 to-cyan-500 px-4 py-3 text-sm font-semibold text-slate-950 shadow-lg shadow-cyan-500/20 transition hover:from-emerald-300 hover:to-cyan-400 disabled:cursor-not-allowed disabled:opacity-60"
                                >
                                    {loading ? 'Please wait...' : mode === 'register' ? 'Create Account' : 'Login'}
                                </button>
                            </form>

                            <div className="my-6 flex items-center gap-3 text-xs font-medium uppercase tracking-[0.18em] text-slate-400">
                                <span className="h-px flex-1 bg-white/10" />
                                or
                                <span className="h-px flex-1 bg-white/10" />
                            </div>

                            <a
                                className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-semibold text-slate-200 transition hover:border-white/20 hover:bg-white/10 hover:text-white"
                                href={`${BACKEND_URL}/oauth2/authorization/google`}
                            >
                                <svg viewBox="0 0 24 24" aria-hidden="true" className="h-5 w-5">
                                    <path
                                        fill="#EA4335"
                                        d="M12 10.2v3.96h5.5c-.24 1.28-.97 2.37-2.06 3.1l3.33 2.58c1.94-1.79 3.06-4.42 3.06-7.56 0-.73-.06-1.43-.19-2.1H12z"
                                    />
                                    <path
                                        fill="#34A853"
                                        d="M12 22c2.76 0 5.07-.91 6.76-2.47l-3.33-2.58c-.92.62-2.1.99-3.43.99-2.64 0-4.88-1.78-5.68-4.18l-3.44 2.66C4.56 19.74 8 22 12 22z"
                                    />
                                    <path
                                        fill="#4A90E2"
                                        d="M6.32 13.76A5.95 5.95 0 016 12c0-.61.11-1.2.32-1.76L2.88 7.58A10.02 10.02 0 002 12c0 1.61.39 3.14 1.08 4.42l3.24-2.66z"
                                    />
                                    <path
                                        fill="#FBBC05"
                                        d="M12 6.02c1.5 0 2.84.52 3.9 1.55l2.92-2.92C17.06 2.97 14.75 2 12 2 8 2 4.56 4.26 3.08 7.58l3.24 2.66C7.12 7.8 9.36 6.02 12 6.02z"
                                    />
                                </svg>
                                <span>Continue with Google</span>
                            </a>
                        </div>
                    </div>
                </section>
            </main>
        </div>
    )
}

export default AuthPage
