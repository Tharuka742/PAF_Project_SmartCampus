import { useEffect, useState } from "react";
import { getAssignedTickets, updateTicketStatus } from "../services/ticketService";
import StatusBadge from "../components/StatusBadge";
import PriorityBadge from "../components/PriorityBadge";
import SlaBadge from "../components/SlaBadge";

function TechnicianTicketsPage() {
  const [tickets, setTickets] = useState([]);
  const [message, setMessage] = useState("");

  const technicianId = "tech001";

  const loadTickets = () => {
    getAssignedTickets(technicianId)
      .then(setTickets)
      .catch((error) => console.error(error));
  };

  useEffect(() => {
    loadTickets();
  }, []);

  const startWork = async (ticketId) => {
    try {
      await updateTicketStatus(ticketId, { status: "IN_PROGRESS" });
      setMessage("Ticket marked as IN_PROGRESS.");
      loadTickets();
    } catch (error) {
      setMessage("Failed to update status.");
      console.error(error);
    }
  };

  const resolveTicket = async (ticketId) => {
    try {
      await updateTicketStatus(ticketId, {
        status: "RESOLVED",
        resolutionNotes: "Issue fixed by technician.",
      });
      setMessage("Ticket marked as RESOLVED.");
      loadTickets();
    } catch (error) {
      setMessage("Failed to resolve ticket.");
      console.error(error);
    }
  };

  return (
    <div className="page">
      <p className="eyebrow">Technician</p>
      <h1>Assigned Tickets</h1>

      {message && <p className="success-text">{message}</p>}

      <div className="ticket-grid">
        {tickets.map((ticket) => (
          <div className="ticket-card" key={ticket.id}>
            <h3>{ticket.title}</h3>
            <p><b>Location:</b> {ticket.resourceOrLocation}</p>
            <p><b>Status:</b> <StatusBadge status={ticket.status} /></p>
            <p><b>Priority:</b> <PriorityBadge priority={ticket.priority} /></p>
            <p><b>SLA:</b> <SlaBadge ticket={ticket} /></p>

            <div className="dashboard-actions">
              <button onClick={() => startWork(ticket.id)}>Start Work</button>
              <button onClick={() => resolveTicket(ticket.id)}>Resolve</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default TechnicianTicketsPage;