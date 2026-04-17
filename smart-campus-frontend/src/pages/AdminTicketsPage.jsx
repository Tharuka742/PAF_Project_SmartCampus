import { useEffect, useState } from "react";
import {
  assignTechnician,
  getAllTickets,
  updateTicketStatus,
} from "../services/ticketService";
import StatusBadge from "../components/StatusBadge";
import PriorityBadge from "../components/PriorityBadge";

function AdminTicketsPage() {
  const [tickets, setTickets] = useState([]);
  const [technicianId, setTechnicianId] = useState("");
  const [message, setMessage] = useState("");

  const loadTickets = () => {
    getAllTickets()
      .then(setTickets)
      .catch((error) => console.error(error));
  };

  useEffect(() => {
    loadTickets();
  }, []);

  const handleAssign = async (ticketId) => {
    if (!technicianId.trim()) {
      setMessage("Enter technician ID first.");
      return;
    }

    try {
      await assignTechnician(ticketId, technicianId);
      setMessage("Technician assigned successfully.");
      setTechnicianId("");
      loadTickets();
    } catch (error) {
      setMessage("Failed to assign technician.");
      console.error(error);
    }
  };

  const handleReject = async (ticketId) => {
    try {
      await updateTicketStatus(ticketId, {
        status: "REJECTED",
        rejectedReason: "Rejected by admin",
      });
      setMessage("Ticket rejected.");
      loadTickets();
    } catch (error) {
      setMessage("Failed to reject ticket.");
      console.error(error);
    }
  };

  const handleClose = async (ticketId) => {
    try {
      await updateTicketStatus(ticketId, {
        status: "CLOSED",
      });
      setMessage("Ticket closed.");
      loadTickets();
    } catch (error) {
      setMessage("Failed to close ticket.");
      console.error(error);
    }
  };

  return (
    <div className="page">
      <p className="eyebrow">Admin Review</p>
      <h1>Admin Tickets</h1>

      <div className="ticket-form">
        <input
          type="text"
          placeholder="Enter technician ID"
          value={technicianId}
          onChange={(e) => setTechnicianId(e.target.value)}
        />
      </div>

      {message && <p className="success-text">{message}</p>}

      <div className="ticket-grid">
        {tickets.map((ticket) => (
          <div className="ticket-card" key={ticket.id}>
            <h3>{ticket.title}</h3>
            <p><b>Location:</b> {ticket.resourceOrLocation}</p>
            <p><b>Status:</b> <StatusBadge status={ticket.status} /></p>
            <p><b>Priority:</b> <PriorityBadge priority={ticket.priority} /></p>
            <p><b>Assigned:</b> {ticket.assignedTechnicianId || "Not assigned"}</p>

            <div className="dashboard-actions">
              <button onClick={() => handleAssign(ticket.id)}>Assign</button>
              <button onClick={() => handleReject(ticket.id)} className="danger">Reject</button>
              <button onClick={() => handleClose(ticket.id)}>Close</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default AdminTicketsPage;