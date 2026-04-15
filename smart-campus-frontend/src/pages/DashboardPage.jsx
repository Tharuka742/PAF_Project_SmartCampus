import { Link } from "react-router-dom";

function DashboardPage() {
  return (
    <div className="page">
      <h1>Module C — Incident Ticketing</h1>
      <p>Manage campus maintenance and incident reports.</p>

      <div className="cards">
        <Link to="/tickets" className="card">All Tickets</Link>
        <Link to="/tickets/create" className="card">Create Ticket</Link>
        <Link to="/tickets/my" className="card">My Tickets</Link>
      </div>
    </div>
  );
}

export default DashboardPage;