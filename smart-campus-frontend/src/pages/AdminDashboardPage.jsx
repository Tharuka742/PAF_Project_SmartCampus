import { useEffect, useMemo, useState } from "react";
import {
  ClipboardList,
  Clock,
  CheckCircle,
  AlertTriangle,
  ShieldCheck,
} from "lucide-react";
import { getAllTickets } from "../services/ticketService";

function AdminDashboardPage() {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getAllTickets()
      .then((data) => setTickets(data))
      .catch((error) => console.error("Failed to load admin tickets:", error))
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
          <p className="eyebrow">Admin Panel</p>
          <h1>Admin Ticket Dashboard</h1>
          <p>Admin can monitor all incident tickets and staff workflow.</p>
        </div>

        <div className="module-pill">
          <ShieldCheck size={18} />
          Admin View
        </div>
      </div>

      {loading ? (
        <div className="empty-state">
          <h3>Loading</h3>
          <p>Loading admin summary...</p>
        </div>
      ) : (
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
              <ClipboardList size={22} />
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
      )}
    </div>
  );
}

export default AdminDashboardPage;