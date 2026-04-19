import { useEffect, useState } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import ProtectedRoute from './components/ProtectedRoute'
import Layout from './components/Layout'
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
import BookingDashboard from './pages/BookingDashboard'
import NewBooking from './pages/NewBooking'
import MyBookings from './pages/MyBookings'
import Calendar from './pages/Calendar'
import AdminPanel from './pages/AdminPanel'
import ResourceDashboard from './pages/ResourceDashboard'
import ResourcesPage from './pages/ResourcesPage'
import NotFoundPage from './pages/NotFoundPage'
import {
    RESOURCE_CATALOGUE_ROUTE,
    RESOURCE_DASHBOARD_ROUTE,
} from './config/navigation'
import { getMe, getToken } from './services/auth'
import { useRole } from './context/RoleContext'

function App() {
    const [userRole, setUserRole] = useState(null)
    const [ready, setReady] = useState(false)
    const { setRole } = useRole()

    const handleAuthSuccess = (role) => {
        setUserRole(role)
        setRole(role)
    }

    useEffect(() => {
        const bootstrap = async () => {
            if (!getToken()) {
                setReady(true)
                return
            }

            try {
                const me = await getMe()
                setUserRole(me.role)
                setRole(me.role)
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
            <Route path="/auth" element={<AuthPage onAuthSuccess={handleAuthSuccess} />} />
            <Route path="/oauth2/success" element={<OAuth2SuccessPage onAuthSuccess={handleAuthSuccess} />} />

            <Route element={<ProtectedRoute userRole={userRole} />}>
                <Route
                    path="/select-role"
                    element={<RoleSelectionPage userRole={userRole} onRoleChange={handleAuthSuccess} />}
                />
            </Route>

            {/* ── STUDENT (USER) routes ───────────────────────────── */}
            <Route element={<ProtectedRoute userRole={userRole} allowedRoles={['USER']} />}>
                <Route path="/dashboard/student" element={<StudentDashboard />} />
                <Route path="/tickets" element={<TicketDashboard />} />
                <Route path="/tickets/create" element={<CreateTicketPage />} />
                <Route path="/tickets/my" element={<MyTicketsPage />} />
                <Route path="/tickets/:id/edit" element={<EditTicketPage />} />
            </Route>

            {/* ── ADMIN-only routes ───────────────────────────────── */}
            <Route element={<ProtectedRoute userRole={userRole} allowedRoles={['ADMIN']} />}>
                <Route path="/dashboard/admin" element={<AdminDashboard />} />
                <Route path="/dashboard/admin/users" element={<AdminUsersPage />} />
                <Route path="/dashboard/admin/analytics" element={<AdminAnalyticsPage />} />
                <Route path="/admin/tickets" element={<AdminTicketDashboard />} />
            </Route>

            {/* ── TECHNICIAN routes ───────────────────────────────── */}
            <Route element={<ProtectedRoute userRole={userRole} allowedRoles={['TECHNICIAN']} />}>
                <Route path="/dashboard/technician" element={<TechnicianDashboard />} />
                <Route path="/technician/tickets" element={<TechnicianDashboard />} />
            </Route>

            {/* ── Shared ticket detail ────────────────────────────── */}
            <Route element={<ProtectedRoute userRole={userRole} />}>
                <Route path="/tickets/:id" element={<TicketDetailsPage />} />
            </Route>

            {/* ── Booking + Resources (STUDENT + ADMIN) ───────────── */}
            <Route element={<ProtectedRoute userRole={userRole} allowedRoles={['USER', 'ADMIN']} />}>
                <Route element={<Layout />}>
                    <Route path="/dashboard" element={<BookingDashboard />} />
                    <Route path="/new-booking" element={<NewBooking />} />
                    <Route path="/my-bookings" element={<MyBookings />} />
                    <Route path="/calendar" element={<Calendar />} />
                    <Route
                        path={RESOURCE_DASHBOARD_ROUTE.replace(/^\//, '')}
                        element={<ResourceDashboard />}
                    />
                    <Route
                        path={RESOURCE_CATALOGUE_ROUTE.replace(/^\//, '')}
                        element={<ResourcesPage />}
                    />
                </Route>
            </Route>

            {/* ── Admin-only booking management ───────────────────── */}
            <Route element={<ProtectedRoute userRole={userRole} allowedRoles={['ADMIN']} />}>
                <Route element={<Layout />}>
                    <Route path="/admin" element={<AdminPanel />} />
                </Route>
            </Route>

            <Route path="/404" element={<NotFoundPage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
    )
}

export default App
