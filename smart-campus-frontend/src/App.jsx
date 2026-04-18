import { Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import NewBooking from './pages/NewBooking';
import MyBookings from './pages/MyBookings';
import Calendar from './pages/Calendar';
import AdminPanel from './pages/AdminPanel';

function App() {
  return (
    <Routes>
      {/* All pages wrapped in Layout (sidebar + header) */}
      <Route path="/" element={<Layout />}>
        <Route index element={<Navigate to="/dashboard" />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="new-booking" element={<NewBooking />} />
        <Route path="my-bookings" element={<MyBookings />} />
        <Route path="calendar" element={<Calendar />} />
        <Route path="admin" element={<AdminPanel />} />
      </Route>

      {/* Catch-all → redirect to dashboard */}
      <Route path="*" element={<Navigate to="/dashboard" />} />
    </Routes>
  );
}

export default App;
import { BrowserRouter as Router, Navigate, Route, Routes } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import ResourceDashboard from './pages/ResourceDashboard';
import ResourcesPage from './pages/ResourcesPage';
import NotFoundPage from './pages/NotFoundPage';
import { RESOURCE_CATALOGUE_ROUTE, RESOURCE_DASHBOARD_ROUTE } from './config/navigation';

function App() {
  return (
    <Router>
      <MainLayout>
        <div className="flex min-h-full w-full flex-1">
          <Routes>
            <Route path="/" element={<Navigate to={RESOURCE_DASHBOARD_ROUTE} replace />} />
            <Route path={RESOURCE_DASHBOARD_ROUTE} element={<ResourceDashboard />} />
            <Route path={RESOURCE_CATALOGUE_ROUTE} element={<ResourcesPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </div>
      </MainLayout>
    </Router>
  );
}

export default App;
