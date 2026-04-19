import { useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { saveToken } from '../services/auth'

function OAuth2SuccessPage({ onAuthSuccess }) {
    const [params] = useSearchParams()
    const navigate = useNavigate()

    const redirectByRole = (role) => {
        if (role === 'ADMIN') {
            return '/dashboard/admin'
        }

        if (role === 'TECHNICIAN') {
            return '/dashboard/technician'
        }

        return '/dashboard/student'
    }

    useEffect(() => {
        const token = params.get('token')
        const role = params.get('role')

        if (!token) {
            navigate('/auth', { replace: true })
            return
        }

        saveToken(token)
        const finalRole = role || 'USER'
        onAuthSuccess(finalRole)
        navigate(redirectByRole(finalRole), { replace: true })
    }, [navigate, onAuthSuccess, params])

    return (
        <div className="relative flex min-h-screen items-center justify-center overflow-hidden px-4 py-8">
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(20,184,166,0.2),transparent_30%),radial-gradient(circle_at_80%_35%,rgba(6,182,212,0.2),transparent_33%),radial-gradient(circle_at_55%_95%,rgba(14,116,144,0.2),transparent_35%)]" />
            <div className="relative w-full max-w-lg rounded-3xl border border-white/20 bg-white/85 p-10 text-center shadow-[0_30px_80px_-35px_rgba(14,116,144,0.5)] backdrop-blur-xl">
                <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-cyan-200 border-t-cyan-600" />
                <h1 className="mt-5 text-2xl font-bold text-slate-900">Signing you in...</h1>
                <p className="mt-2 text-sm text-slate-600">Please wait while we complete your Google login.</p>
            </div>
        </div>
    )
}

export default OAuth2SuccessPage
