import { BrowserRouter, Routes, Route, NavLink } from "react-router-dom";
import { useState } from "react";
import DashboardPage from "./pages/DashboardPage";
import CreateTicketPage from "./pages/CreateTicketPage";
import MyTicketsPage from "./pages/MyTicketsPage";
import AllTicketsPage from "./pages/AllTicketsPage";
import "./App.css";

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <BrowserRouter>
      <div className={`layout ${sidebarOpen ? "" : "sidebar-collapsed"} min-h-screen bg-slate-50`}>
        <aside className="sidebar">
          <button
            className="toggle-btn hover:bg-slate-700 focus:outline-none"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            aria-label={sidebarOpen ? "Collapse sidebar" : "Expand sidebar"}
          >
            {sidebarOpen ? (
              <svg viewBox="0 0 24 24" className="toggle-icon" aria-hidden="true">
                <path d="M15 18l-6-6 6-6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            ) : (
              <svg viewBox="0 0 24 24" className="toggle-icon" aria-hidden="true">
                <path d="M9 6l6 6-6 6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            )}
          </button>

          {sidebarOpen && (
            <>
              <p className="overview">Overview</p>
              <h2>Dashboard</h2>

              <p className="section-title">Tickets</p>

              <NavLink end to="/tickets" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>
                <span>All Tickets</span>
              </NavLink>

              <NavLink end to="/tickets/create" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>
                <span>Create Ticket</span>
              </NavLink>

              <NavLink end to="/tickets/my" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>
                <span>My Tickets</span>
              </NavLink>

            </>
          )}
        </aside>

        <main className="content">
          <Routes>
            <Route path="/" element={<DashboardPage />} />
            <Route path="/tickets" element={<AllTicketsPage />} />
            <Route path="/tickets/create" element={<CreateTicketPage />} />
            <Route path="/tickets/my" element={<MyTicketsPage />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;