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