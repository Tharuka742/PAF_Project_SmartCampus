import { Link } from "react-router-dom";
import StatusBadge from "./StatusBadge";
import PriorityBadge from "./PriorityBadge";
import SlaBadge from "./SlaBadge";

const BACKEND_BASE_URL = "http://localhost:8081";

function TicketCard({ ticket }) {
  const firstImage =
    ticket.attachments && ticket.attachments.length > 0
      ? `${BACKEND_BASE_URL}${ticket.attachments[0].fileUrl}`
      : null;

  return (
    <Link to={`/tickets/${ticket.id}`} className="ticket-card">
      {firstImage && (
        <div className="ticket-card-image-wrap">
          <img
            src={firstImage}
            alt={ticket.title}
            className="ticket-card-image"
          />
          {ticket.attachments.length > 1 && (
            <span className="image-count-badge">
              +{ticket.attachments.length - 1}
            </span>
          )}
        </div>
      )}

      <h3>{ticket.title}</h3>
      <p><b>Location:</b> {ticket.resourceOrLocation}</p>
      <p><b>Status:</b> <StatusBadge status={ticket.status} /></p>
      <p><b>Priority:</b> <PriorityBadge priority={ticket.priority} /></p>
      <p><b>SLA:</b> <SlaBadge ticket={ticket} /></p>
    </Link>
  );
}

export default TicketCard;