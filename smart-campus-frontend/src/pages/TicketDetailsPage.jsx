import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getTicketById } from "../services/ticketService";
import StatusBadge from "../components/StatusBadge";
import PriorityBadge from "../components/PriorityBadge";
import SlaBadge from "../components/SlaBadge";

const BACKEND_BASE_URL = "http://localhost:8081";

function TicketDetailsPage() {
  const { id } = useParams();
  const [ticket, setTicket] = useState(null);
  const [loading, setLoading] = useState(true);
  const BACKEND_BASE_URL = "http://localhost:8081";

  useEffect(() => {
    getTicketById(id)
      .then((data) => setTicket(data))
      .catch((error) => console.error("Failed to load ticket:", error))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="page">
        <div className="empty-state">
          <h3>Loading</h3>
          <p>Loading ticket details...</p>
        </div>
      </div>
    );
  }

  if (!ticket) {
    return (
      <div className="page">
        <div className="empty-state">
          <h3>Not Found</h3>
          <p>Ticket not found.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="page">
      <p className="eyebrow">Ticket Details</p>
      <h1>{ticket.title}</h1>

      <div className="ticket-grid">
        <div className="ticket-card">
          <p><b>Location:</b> {ticket.resourceOrLocation}</p>
          <p><b>Category:</b> {ticket.category}</p>
          <p><b>Preferred Contact:</b> {ticket.preferredContact}</p>
          <p><b>Description:</b> {ticket.description}</p>
        </div>

        <div className="ticket-card">
          <p><b>Status:</b> <StatusBadge status={ticket.status} /></p>
          <p><b>Priority:</b> <PriorityBadge priority={ticket.priority} /></p>
          <p><b>SLA:</b> <SlaBadge ticket={ticket} /></p>
          <p><b>Assigned Technician:</b> {ticket.assignedTechnicianId || "Not assigned"}</p>
          <p><b>Resolution Notes:</b> {ticket.resolutionNotes || "No notes yet"}</p>
          <p><b>Rejected Reason:</b> {ticket.rejectedReason || "Not rejected"}</p>
        </div>
      </div>

      <div className="attachments-section">
        <h2>Attachments</h2>
        {!ticket.attachments || ticket.attachments.length === 0 ? (
          <p>No attachments uploaded.</p>
        ) : (
          <div className="attachment-grid">
            {ticket.attachments.map((file, index) => (
              <a
                key={index}
                href={`${BACKEND_BASE_URL}${file.fileUrl}`}
                target="_blank"
                rel="noreferrer"
                className="attachment-card"
              >
                    <img
                      src={`${BACKEND_BASE_URL}${file.fileUrl}`}
                      alt={file.originalFileName}
                    />
                <span>{file.originalFileName}</span>
              </a>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default TicketDetailsPage;