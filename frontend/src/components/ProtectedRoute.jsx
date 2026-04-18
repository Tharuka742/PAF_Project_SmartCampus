import { Navigate, Outlet } from 'react-router-dom'
import { getToken } from '../services/auth'

function ProtectedRoute({ allowedRoles, userRole }) {
    const token = getToken()

    if (!token) {
        return <Navigate to="/auth" replace />
    }

    if (allowedRoles && !allowedRoles.includes(userRole)) {
        return <Navigate to="/select-role" replace />
    }

    return <Outlet />
}

export default ProtectedRoute
