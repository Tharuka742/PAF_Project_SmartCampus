import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import DashboardPage from "./pages/DashboardPage";
import CreateTicketPage from "./pages/CreateTicketPage";
import MyTicketsPage from "./pages/MyTicketsPage";
import AllTicketsPage from "./pages/AllTicketsPage";
import "./App.css";

function App() {
  return (
    <BrowserRouter>
      <div className="layout">
        <aside className="sidebar">
          <h2>Module C</h2>
          <Link to="/tickets">All Tickets</Link>
          <Link to="/tickets/create">Create Ticket</Link>
          <Link to="/tickets/my">My Tickets</Link>
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