import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { saveToken, updateMyRole } from '../services/auth'

function RoleSelectionPage({ userRole, onRoleChange }) {
    const [saving, setSaving] = useState(false)
    const [error, setError] = useState('')
    const navigate = useNavigate()

    const roleRouteMap = {
        ADMIN: '/dashboard/admin',
        TECHNICIAN: '/dashboard/technician',
        USER: '/dashboard/student',
    }

    const selectRole = async (role) => {
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

        const code = window.prompt(
            role === 'ADMIN'
                ? 'Enter administrator code'
                : 'Enter technician code',
        )

        if (!code) {
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

    return (
        <div className="relative flex min-h-screen items-center justify-center overflow-hidden px-4 py-10">
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_15%_15%,rgba(34,197,94,0.15),transparent_30%),radial-gradient(circle_at_80%_25%,rgba(6,182,212,0.17),transparent_30%),radial-gradient(circle_at_50%_100%,rgba(30,64,175,0.14),transparent_35%)]" />
            <div className="relative w-full max-w-2xl rounded-3xl border border-white/20 bg-white/85 p-8 shadow-[0_30px_80px_-35px_rgba(8,47,73,0.45)] backdrop-blur-xl">
                <p className="text-xs font-semibold uppercase tracking-[0.26em] text-cyan-700">Profile Setup</p>
                <h1 className="mt-3 text-3xl font-extrabold tracking-tight text-slate-900">Who are you?</h1>
                <p className="mt-2 text-sm text-slate-600">Select your role. Admin and Technician will require an access code.</p>

                <div className="mt-6 grid gap-3 sm:grid-cols-3">
                    <button
                        onClick={() => selectRole('USER')}
                        disabled={saving}
                        className="rounded-2xl border border-slate-300 bg-white px-4 py-4 text-left transition hover:border-cyan-300 hover:shadow-sm disabled:cursor-not-allowed disabled:opacity-60"
                    >
                        <span className="block text-sm font-semibold text-slate-900">I&apos;m Student</span>
                        <span className="mt-1 block text-xs text-slate-500">Standard user access</span>
                    </button>
                    <button
                        onClick={() => selectRole('ADMIN')}
                        disabled={saving}
                        className="rounded-2xl border border-slate-300 bg-white px-4 py-4 text-left transition hover:border-cyan-300 hover:shadow-sm disabled:cursor-not-allowed disabled:opacity-60"
                    >
                        <span className="block text-sm font-semibold text-slate-900">I&apos;m Administrator</span>
                        <span className="mt-1 block text-xs text-slate-500">System management access</span>
                    </button>
                    <button
                        onClick={() => selectRole('TECHNICIAN')}
                        disabled={saving}
                        className="rounded-2xl border border-slate-300 bg-white px-4 py-4 text-left transition hover:border-cyan-300 hover:shadow-sm disabled:cursor-not-allowed disabled:opacity-60"
                    >
                        <span className="block text-sm font-semibold text-slate-900">I&apos;m Technician</span>
                        <span className="mt-1 block text-xs text-slate-500">Maintenance and support tools</span>
                    </button>
                </div>

                <p className="mt-5 rounded-xl bg-slate-900/5 px-3 py-2 text-xs text-slate-600">Codes: Administrator = Admin03, Technician = Tech03</p>

                <p className="mt-3 text-sm text-slate-700">Current role: <span className="font-semibold">{userRole || 'Not selected'}</span></p>
                {error ? (
                    <div className="mt-3 rounded-xl border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-700">
                        {error}
                    </div>
                ) : null}
            </div>
        </div>
    )
}

export default RoleSelectionPage
