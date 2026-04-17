import { BrowserRouter, Routes, Route, NavLink } from "react-router-dom";
import { useState } from "react";
import {
  LayoutDashboard,
  PlusCircle,
  Ticket,
  ClipboardList,
  ShieldCheck,
  UserCheck,
  Bell,
  ChevronLeft,
  ChevronRight,
  Wrench,
} from "lucide-react";

import DashboardPage from "./pages/DashboardPage";
import CreateTicketPage from "./pages/CreateTicketPage";
import MyTicketsPage from "./pages/MyTicketsPage";
import AllTicketsPage from "./pages/AllTicketsPage";
import AdminDashboardPage from "./pages/AdminDashboardPage";
import TicketDetailsPage from "./pages/TicketDetailsPage";
import AdminTicketsPage from "./pages/AdminTicketsPage";
import TechnicianTicketsPage from "./pages/TechnicianTicketsPage";
import "./App.css";

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const navClass = ({ isActive }) =>
    isActive ? "nav-link active" : "nav-link";

  return (
    <BrowserRouter>
      <div className={`layout ${sidebarOpen ? "" : "sidebar-collapsed"}`}>
        <aside className="sidebar">
          <button
            className="toggle-btn"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            aria-label={sidebarOpen ? "Collapse sidebar" : "Expand sidebar"}
          >
            {sidebarOpen ? <ChevronLeft className="toggle-icon" /> : <ChevronRight className="toggle-icon" />}
          </button>

          {sidebarOpen && (
            <>
              <div className="brand-box">
                <div className="brand-icon">
                  <Wrench size={22} />
                </div>
                <div>
                  <h3>Smart Campus</h3>
                  <p>Incident Ticketing</p>
                </div>
              </div>

              <p className="section-title">Navigation</p>

              <NavLink end to="/" className={navClass}>
                <span className="nav-left"><LayoutDashboard size={18} />Dashboard</span>
              </NavLink>

              <NavLink end to="/tickets/create" className={navClass}>
                <span className="nav-left"><PlusCircle size={18} />Create Ticket</span>
              </NavLink>

              <NavLink end to="/tickets/my" className={navClass}>
                <span className="nav-left"><Ticket size={18} />My Tickets</span>
              </NavLink>

              <p className="section-title">Management</p>

              <NavLink end to="/tickets" className={navClass}>
                <span className="nav-left"><ClipboardList size={18} />All Tickets</span>
              </NavLink>

              <NavLink end to="/admin/dashboard" className={navClass}>
                <span className="nav-left"><ShieldCheck size={18} />Admin Dashboard</span>
              </NavLink>

              <NavLink end to="/admin/tickets" className={navClass}>
                <span className="nav-left"><ShieldCheck size={18} />Admin Review</span>
              </NavLink>

              <NavLink end to="/technician/tickets" className={navClass}>
                <span className="nav-left"><UserCheck size={18} />Assigned Tickets</span>
              </NavLink>

              <p className="section-title">Updates</p>

              <div className="other-link">
                <span className="nav-left"><Bell size={18} />Notifications</span>
              </div>
            </>
          )}
        </aside>

        <main className="content">
          <Routes>
            <Route path="/" element={<DashboardPage />} />
            <Route path="/tickets" element={<AllTicketsPage />} />
            <Route path="/tickets/create" element={<CreateTicketPage />} />
            <Route path="/tickets/my" element={<MyTicketsPage />} />
            <Route path="/tickets/:id" element={<TicketDetailsPage />} />
            <Route path="/admin/dashboard" element={<AdminDashboardPage />} />
            <Route path="/admin/tickets" element={<AdminTicketsPage />} />
            <Route path="/technician/tickets" element={<TechnicianTicketsPage />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;