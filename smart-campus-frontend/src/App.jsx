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
