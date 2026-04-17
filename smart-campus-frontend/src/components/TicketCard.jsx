import { Link } from "react-router-dom";
import StatusBadge from "./StatusBadge";
import PriorityBadge from "./PriorityBadge";
import SlaBadge from "./SlaBadge";

function TicketCard({ ticket }) {
  return (
    <Link to={`/tickets/${ticket.id}`} className="ticket-card">
      <h3>{ticket.title}</h3>
      <p><b>Location:</b> {ticket.resourceOrLocation}</p>
      <p><b>Status:</b> <StatusBadge status={ticket.status} /></p>
      <p><b>Priority:</b> <PriorityBadge priority={ticket.priority} /></p>
      <p><b>SLA:</b> <SlaBadge ticket={ticket} /></p>
    </Link>
  );
}

export default TicketCard;