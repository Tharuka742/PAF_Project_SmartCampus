import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { saveToken, updateMyRole } from '../services/auth'

function RoleSelectionPage({ userRole, onRoleChange }) {
    const [saving, setSaving] = useState(false)
    const [error, setError] = useState('')
    const [selectedRole, setSelectedRole] = useState('USER')
    const [accessCode, setAccessCode] = useState('')
    const navigate = useNavigate()

    const roleRouteMap = {
        ADMIN: '/dashboard/admin',
        TECHNICIAN: '/dashboard/technician',
        USER: '/dashboard/student',
    }

    const applyRole = async (role, code = '') => {
        if (role === 'USER') {
            setSaving(true)
            setError('')

            try {
                const data = await updateMyRole('USER')
                saveToken(data.token)
                onRoleChange(data.role)
                navigate('/dashboard/student')
            } catch (apiError) {
                setError(apiError?.response?.data?.message || 'Unable to update role right now.')
            } finally {
                setSaving(false)
            }
            return
        }

        setSaving(true)
        setError('')

        try {
            const data = await updateMyRole(role, code)
            saveToken(data.token)
            onRoleChange(data.role)
            navigate(roleRouteMap[data.role] || '/dashboard/student')
        } catch (apiError) {
            setError(apiError?.response?.data?.message || 'Unable to update role right now.')
        } finally {
            setSaving(false)
        }
    }

    const handleRolePick = (role) => {
        setError('')
        setSelectedRole(role)
        setAccessCode('')

        if (role === 'USER') {
            applyRole('USER')
        }
    }

    const confirmPrivilegedRole = async () => {
        const roleLabel = selectedRole === 'ADMIN' ? 'administrator' : 'technician'
        if (!accessCode.trim()) {
            setError(`Please enter the ${roleLabel} access code.`)
            return
        }

        await applyRole(selectedRole, accessCode)
    }

    return (
        <div className="relative min-h-screen overflow-hidden bg-slate-950 px-4 py-10 text-slate-100">
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_14%_18%,rgba(16,185,129,0.22),transparent_28%),radial-gradient(circle_at_85%_14%,rgba(14,165,233,0.22),transparent_30%),radial-gradient(circle_at_50%_115%,rgba(59,130,246,0.16),transparent_34%)]" />
            <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_bottom,rgba(15,23,42,0.15),rgba(15,23,42,0.88))]" />

            <div className="relative mx-auto flex min-h-[calc(100vh-5rem)] w-full max-w-4xl items-center justify-center">
                <div className="w-full rounded-[2rem] border border-white/10 bg-slate-900/80 p-6 shadow-[0_40px_120px_-50px_rgba(14,165,233,0.45)] backdrop-blur-xl sm:p-8">
                    <p className="text-xs font-semibold uppercase tracking-[0.28em] text-emerald-300">Profile Setup</p>
                    <h1 className="mt-3 text-3xl font-extrabold tracking-tight text-white">Choose your workspace</h1>
                    <p className="mt-2 text-sm leading-6 text-slate-300">
                        Students go straight to the student dashboard. Administrators and technicians must enter their access code before activation.
                    </p>

                    <div className="mt-6 grid gap-3 sm:grid-cols-3">
                        <button
                            type="button"
                            onClick={() => handleRolePick('USER')}
                            disabled={saving}
                            className={`rounded-2xl border p-4 text-left transition disabled:cursor-not-allowed disabled:opacity-60 ${selectedRole === 'USER'
                                ? 'border-emerald-300/40 bg-emerald-400/10'
                                : 'border-white/10 bg-white/5 hover:border-white/20 hover:bg-white/10'
                                }`}
                        >
                            <span className="block text-sm font-semibold text-white">Student</span>
                            <span className="mt-1 block text-xs text-slate-300">Direct access to the student dashboard</span>
                        </button>
                        <button
                            type="button"
                            onClick={() => handleRolePick('ADMIN')}
                            disabled={saving}
                            className={`rounded-2xl border p-4 text-left transition disabled:cursor-not-allowed disabled:opacity-60 ${selectedRole === 'ADMIN'
                                ? 'border-cyan-300/40 bg-cyan-400/10'
                                : 'border-white/10 bg-white/5 hover:border-white/20 hover:bg-white/10'
                                }`}
                        >
                            <span className="block text-sm font-semibold text-white">Administrator</span>
                            <span className="mt-1 block text-xs text-slate-300">Enter access code to unlock admin tools</span>
                        </button>
                        <button
                            type="button"
                            onClick={() => handleRolePick('TECHNICIAN')}
                            disabled={saving}
                            className={`rounded-2xl border p-4 text-left transition disabled:cursor-not-allowed disabled:opacity-60 ${selectedRole === 'TECHNICIAN'
                                ? 'border-indigo-300/40 bg-indigo-400/10'
                                : 'border-white/10 bg-white/5 hover:border-white/20 hover:bg-white/10'
                                }`}
                        >
                            <span className="block text-sm font-semibold text-white">Technician</span>
                            <span className="mt-1 block text-xs text-slate-300">Enter access code to unlock maintenance tools</span>
                        </button>
                    </div>

                    <div className="mt-6 rounded-2xl border border-white/10 bg-white/5 p-5">
                        {selectedRole === 'USER' ? (
                            <div>
                                <p className="text-sm font-semibold text-white">Student dashboard selected</p>
                                <p className="mt-1 text-sm text-slate-300">You will be redirected immediately after registration or when you press Continue.</p>
                                <div className="mt-4 flex flex-wrap gap-3">
                                    <button
                                        type="button"
                                        onClick={() => applyRole('USER')}
                                        disabled={saving}
                                        className="rounded-xl bg-gradient-to-r from-emerald-400 to-cyan-500 px-4 py-2.5 text-sm font-semibold text-slate-950 transition hover:from-emerald-300 hover:to-cyan-400 disabled:cursor-not-allowed disabled:opacity-60"
                                    >
                                        Continue to Student Dashboard
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <div className="grid gap-4 sm:grid-cols-[1fr_auto] sm:items-end">
                                <div>
                                    <p className="text-sm font-semibold text-white">
                                        {selectedRole === 'ADMIN' ? 'Administrator access code' : 'Technician access code'}
                                    </p>
                                    <input
                                        value={accessCode}
                                        onChange={(event) => setAccessCode(event.target.value)}
                                        type="password"
                                        placeholder="Enter access code"
                                        className="mt-3 w-full rounded-xl border border-white/10 bg-slate-950/60 px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-500 focus:border-cyan-300/50 focus:ring-4 focus:ring-cyan-400/10"
                                    />
                                </div>
                                <button
                                    type="button"
                                    onClick={confirmPrivilegedRole}
                                    disabled={saving}
                                    className="rounded-xl bg-gradient-to-r from-emerald-400 to-cyan-500 px-4 py-3 text-sm font-semibold text-slate-950 transition hover:from-emerald-300 hover:to-cyan-400 disabled:cursor-not-allowed disabled:opacity-60"
                                >
                                    {saving ? 'Please wait...' : 'Confirm Role'}
                                </button>
                            </div>
                        )}
                    </div>

                    <p className="mt-5 text-sm text-slate-300">
                        Current role: <span className="font-semibold text-white">{userRole || 'Not selected'}</span>
                    </p>

                    {error ? (
                        <div className="mt-3 rounded-xl border border-rose-400/20 bg-rose-500/10 px-3 py-2 text-sm text-rose-200">
                            {error}
                        </div>
                    ) : null}
                </div>
            </div>
        </div>
    )
}

export default RoleSelectionPage
