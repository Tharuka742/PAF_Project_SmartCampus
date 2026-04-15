function TicketCard({ ticket }) {
  return (
    <div className="ticket-card">
      <h3>{ticket.title}</h3>
      <p><b>Location:</b> {ticket.resourceOrLocation}</p>
      <p><b>Category:</b> {ticket.category}</p>
      <p><b>Priority:</b> {ticket.priority}</p>
      <p><b>Status:</b> {ticket.status}</p>
    </div>
  );
}

export default TicketCard;