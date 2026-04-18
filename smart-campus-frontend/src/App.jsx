import { Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import NewBooking from './pages/NewBooking';
import MyBookings from './pages/MyBookings';
import Calendar from './pages/Calendar';
import AdminPanel from './pages/AdminPanel';
import ResourceDashboard from './pages/ResourceDashboard';
import ResourcesPage from './pages/ResourcesPage';
import NotFoundPage from './pages/NotFoundPage';
import {
  RESOURCE_CATALOGUE_ROUTE,
  RESOURCE_DASHBOARD_ROUTE,
} from './config/navigation';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Navigate to="/dashboard" replace />} />

        {/* Booking module (Member 2) */}
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="new-booking" element={<NewBooking />} />
        <Route path="my-bookings" element={<MyBookings />} />
        <Route path="calendar" element={<Calendar />} />
        <Route path="admin" element={<AdminPanel />} />

        {/* Facilities module (Member 1) */}
        <Route
          path={RESOURCE_DASHBOARD_ROUTE.replace(/^\//, '')}
          element={<ResourceDashboard />}
        />
        <Route
          path={RESOURCE_CATALOGUE_ROUTE.replace(/^\//, '')}
          element={<ResourcesPage />}
        />

        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
}

export default App;
