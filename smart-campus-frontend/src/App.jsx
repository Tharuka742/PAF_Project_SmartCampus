import { useEffect, useState } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import ProtectedRoute from './components/ProtectedRoute'
import AuthPage from './pages/AuthPage'
import AdminAnalyticsPage from './pages/Admin/AdminAnalyticsPage'
import AdminDashboard from './pages/Admin/AdminDashboard'
import AdminUsersPage from './pages/Admin/AdminUsersPage'
import AdminTicketDashboard from './pages/Admin/AdminTicketDashboard'
import Home from './pages/Home'
import OAuth2SuccessPage from './pages/OAuth2SuccessPage'
import RoleSelectionPage from './pages/RoleSelectionPage'
import StudentDashboard from './pages/Student/StudentDashboard'
import TicketDashboard from './pages/Student/TicketDashboard'
import CreateTicketPage from './pages/Student/CreateTicketPage'
import EditTicketPage from './pages/Student/EditTicketPage'
import MyTicketsPage from './pages/Student/MyTicketsPage'
import TechnicianDashboard from './pages/Technician/TechnicianDashboard'
import TicketDetailsPage from './pages/TicketDetailsPage'
import { getMe, getToken } from './services/auth'


function App() {
    const [userRole, setUserRole] = useState(null)
    const [ready, setReady] = useState(false)

    useEffect(() => {
        const bootstrap = async () => {
            if (!getToken()) {
                setReady(true)
                return
            }

            try {
                const me = await getMe()
                setUserRole(me.role)
            } catch {
                localStorage.removeItem('token')
                setUserRole(null)
            } finally {
                setReady(true)
            }
        }

        bootstrap()
    }, [])

    if (!ready) {
        return (
            <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-slate-950 px-6">
                <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_12%_20%,rgba(6,182,212,0.23),transparent_35%),radial-gradient(circle_at_80%_25%,rgba(16,185,129,0.19),transparent_35%),radial-gradient(circle_at_50%_90%,rgba(59,130,246,0.16),transparent_30%)]" />
                <div className="relative rounded-2xl border border-white/10 bg-white/5 px-7 py-5 text-center shadow-2xl shadow-cyan-900/30 backdrop-blur-md">
                    <p className="text-xs uppercase tracking-[0.32em] text-cyan-300">PAF Platform</p>
                    <p className="mt-2 text-lg font-semibold text-slate-100">Loading your experience...</p>
                </div>
            </div>
        )
    }

    return (
        <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/auth" element={<AuthPage onAuthSuccess={setUserRole} />} />
            <Route path="/oauth2/success" element={<OAuth2SuccessPage onAuthSuccess={setUserRole} />} />

            <Route element={<ProtectedRoute userRole={userRole} />}>
                <Route
                    path="/select-role"
                    element={<RoleSelectionPage userRole={userRole} onRoleChange={setUserRole} />}
                />
            </Route>

            {/* ── USER routes ─────────────────────────────────────── */}
            <Route element={<ProtectedRoute userRole={userRole} allowedRoles={['USER']} />}>
                <Route path="/dashboard/student" element={<StudentDashboard />} />
                <Route path="/tickets" element={<TicketDashboard />} />
                <Route path="/tickets/create" element={<CreateTicketPage />} />
                <Route path="/tickets/my" element={<MyTicketsPage />} />
                <Route path="/tickets/:id/edit" element={<EditTicketPage />} />
            </Route>

            {/* ── ADMIN routes ─────────────────────────────────────── */}
            <Route element={<ProtectedRoute userRole={userRole} allowedRoles={['ADMIN']} />}>
                <Route path="/dashboard/admin" element={<AdminDashboard />} />
                <Route path="/dashboard/admin/users" element={<AdminUsersPage />} />
                <Route path="/dashboard/admin/analytics" element={<AdminAnalyticsPage />} />
                <Route path="/admin/tickets" element={<AdminTicketDashboard />} />
            </Route>

            {/* ── TECHNICIAN routes ─────────────────────────────────── */}
            <Route element={<ProtectedRoute userRole={userRole} allowedRoles={['TECHNICIAN']} />}>
                <Route path="/dashboard/technician" element={<TechnicianDashboard />} />
                <Route path="/technician/tickets" element={<TechnicianDashboard />} />
            </Route>

            {/* ── Shared ticket detail (all authenticated roles) ────── */}
            <Route element={<ProtectedRoute userRole={userRole} />}>
                <Route path="/tickets/:id" element={<TicketDetailsPage />} />
            </Route>

            <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
    )
}

export default App

