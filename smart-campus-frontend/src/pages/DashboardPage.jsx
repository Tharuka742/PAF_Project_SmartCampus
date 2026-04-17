import { useEffect, useMemo, useState } from "react";
import {
  ClipboardList,
  Clock,
  CheckCircle,
  AlertTriangle,
  PlusCircle,
  Ticket,
} from "lucide-react";
import { Link } from "react-router-dom";
import { getAllTickets } from "../services/ticketService";

function DashboardPage() {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getAllTickets()
      .then((data) => setTickets(data))
      .catch((error) => console.error("Failed to load ticket dashboard:", error))
      .finally(() => setLoading(false));
  }, []);

  const stats = useMemo(() => {
    return {
      total: tickets.length,
      open: tickets.filter((ticket) => ticket.status === "OPEN").length,
      inProgress: tickets.filter((ticket) => ticket.status === "IN_PROGRESS").length,
      resolved: tickets.filter((ticket) => ticket.status === "RESOLVED").length,
      urgent: tickets.filter((ticket) => ticket.priority === "URGENT").length,
    };
  }, [tickets]);

  return (
    <div className="page fade-in-up">
      <div className="page-header">
        <div>
          <p className="eyebrow">Module C</p>
          <h1>Incident Ticketing Dashboard</h1>
          <p>Overview of campus maintenance and incident tickets.</p>
        </div>

        <Link to="/tickets/create" className="header-action">
          <PlusCircle size={18} />
          Create Ticket
        </Link>
      </div>

      {loading ? (
        <div className="empty-state">
          <h3>Loading</h3>
          <p>Loading ticket summary...</p>
        </div>
      ) : (
        <>
          <div className="stat-grid">
            <div className="stat-card">
              <div className="stat-icon blue-soft">
                <ClipboardList size={22} />
              </div>
              <span>Total Tickets</span>
              <strong>{stats.total}</strong>
            </div>

            <div className="stat-card">
              <div className="stat-icon yellow-soft">
                <Clock size={22} />
              </div>
              <span>Open</span>
              <strong>{stats.open}</strong>
            </div>

            <div className="stat-card">
              <div className="stat-icon purple-soft">
                <Ticket size={22} />
              </div>
              <span>In Progress</span>
              <strong>{stats.inProgress}</strong>
            </div>

            <div className="stat-card">
              <div className="stat-icon green-soft">
                <CheckCircle size={22} />
              </div>
              <span>Resolved</span>
              <strong>{stats.resolved}</strong>
            </div>

            <div className="stat-card danger">
              <div className="stat-icon red-soft">
                <AlertTriangle size={22} />
              </div>
              <span>Urgent</span>
              <strong>{stats.urgent}</strong>
            </div>
          </div>

          <div className="quick-actions">
            <Link to="/tickets/create" className="quick-card">
              <PlusCircle size={22} />
              <div>
                <h3>Create New Ticket</h3>
                <p>Report a campus issue with location and priority.</p>
              </div>
            </Link>

            <Link to="/tickets/my" className="quick-card">
              <Ticket size={22} />
              <div>
                <h3>My Tickets</h3>
                <p>View submitted tickets and their current status.</p>
              </div>
            </Link>

            <Link to="/tickets" className="quick-card">
              <ClipboardList size={22} />
              <div>
                <h3>All Tickets</h3>
                <p>Admin and staff can monitor all reported issues.</p>
              </div>
            </Link>
          </div>
        </>
      )}
    </div>
  );
}

export default DashboardPage;