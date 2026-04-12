import { useEffect, useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { login, register, saveToken } from '../services/auth'

const BACKEND_URL = 'http://localhost:8080'

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
        <div className="relative flex min-h-screen items-center justify-center overflow-hidden px-4 py-8">
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_10%_20%,rgba(34,197,94,0.14),transparent_34%),radial-gradient(circle_at_85%_30%,rgba(6,182,212,0.2),transparent_34%),radial-gradient(circle_at_50%_100%,rgba(2,132,199,0.18),transparent_30%)]" />
            <div className="relative w-full max-w-lg overflow-hidden rounded-3xl border border-white/20 bg-white/85 p-8 shadow-[0_30px_80px_-35px_rgba(3,105,161,0.45)] backdrop-blur-xl sm:p-10">
                <div className="mb-5">
                    <Link to="/" className="inline-flex items-center gap-1 text-xs font-semibold uppercase tracking-[0.2em] text-cyan-700 transition hover:text-cyan-600">
                        Back To Home
                    </Link>
                </div>
                <p className="text-xs font-semibold uppercase tracking-[0.28em] text-cyan-700">PAF Secure Access</p>
                <h1 className="mt-3 text-3xl font-extrabold tracking-tight text-slate-900">
                    {mode === 'login' ? 'Welcome back to campus portal' : 'Create your campus account'}
                </h1>
                <p className="mt-2 text-sm leading-relaxed text-slate-600">
                    {mode === 'login'
                        ? 'Login using your username or email to continue your operations.'
                        : 'Register with your username, email, and password to get started.'}
                </p>

                <div className="mt-7 grid grid-cols-2 gap-2 rounded-2xl bg-slate-900/5 p-1">
                    <button
                        type="button"
                        className={`rounded-xl px-4 py-2.5 text-sm font-semibold transition ${mode === 'login'
                            ? 'bg-slate-900 text-white shadow-lg shadow-slate-900/20'
                            : 'text-slate-600 hover:bg-white/80'
                            }`}
                        onClick={() => setMode('login')}
                    >
                        Login
                    </button>
                    <button
                        type="button"
                        className={`rounded-xl px-4 py-2.5 text-sm font-semibold transition ${mode === 'register'
                            ? 'bg-slate-900 text-white shadow-lg shadow-slate-900/20'
                            : 'text-slate-600 hover:bg-white/80'
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
                                className="w-full rounded-xl border border-slate-300 bg-white/80 px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-cyan-500 focus:ring-4 focus:ring-cyan-100"
                            />
                            <input
                                type="email"
                                name="email"
                                value={form.email}
                                onChange={onChange}
                                placeholder="Email"
                                required
                                className="w-full rounded-xl border border-slate-300 bg-white/80 px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-cyan-500 focus:ring-4 focus:ring-cyan-100"
                            />
                        </>
                    ) : (
                        <input
                            name="usernameOrEmail"
                            value={form.usernameOrEmail}
                            onChange={onChange}
                            placeholder="Username or email"
                            required
                            className="w-full rounded-xl border border-slate-300 bg-white/80 px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-cyan-500 focus:ring-4 focus:ring-cyan-100"
                        />
                    )}

                    <input
                        type="password"
                        name="password"
                        value={form.password}
                        onChange={onChange}
                        placeholder="Password"
                        required
                        className="w-full rounded-xl border border-slate-300 bg-white/80 px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-cyan-500 focus:ring-4 focus:ring-cyan-100"
                    />

                    {error ? (
                        <div className="rounded-xl border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-700">
                            {error}
                        </div>
                    ) : null}

                    <button
                        type="submit"
                        disabled={loading}
                        className="inline-flex w-full items-center justify-center rounded-xl bg-gradient-to-r from-cyan-600 to-emerald-600 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-cyan-600/25 transition hover:from-cyan-500 hover:to-emerald-500 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                        {loading ? 'Please wait...' : mode === 'register' ? 'Create Account' : 'Login'}
                    </button>
                </form>

                <div className="my-6 flex items-center gap-3 text-xs font-medium uppercase tracking-[0.18em] text-slate-400">
                    <span className="h-px flex-1 bg-slate-200" />
                    or
                    <span className="h-px flex-1 bg-slate-200" />
                </div>

                <a
                    className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm font-semibold text-slate-700 transition hover:border-cyan-300 hover:text-cyan-700"
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
    )
}

export default AuthPage
