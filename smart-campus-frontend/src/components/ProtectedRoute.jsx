import { Navigate, Outlet } from 'react-router-dom'
import { getToken } from '../services/auth'

function ProtectedRoute({ allowedRoles, userRole }) {
    const token = getToken()

    if (!token) {
        return <Navigate to="/auth" replace />
    }

    if (allowedRoles && allowedRoles.length > 0 && !allowedRoles.includes(userRole)) {
        return <Navigate to="/auth" replace />
    }

    return <Outlet />
}

export default ProtectedRoute
