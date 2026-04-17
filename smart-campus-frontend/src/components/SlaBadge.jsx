function SlaBadge({ ticket }) {
  if (!ticket?.createdAt) {
    return <span className="sla-badge sla-normal">On Track</span>;
  }

  if (ticket.status === "RESOLVED" || ticket.status === "CLOSED") {
    return <span className="sla-badge sla-resolved">Resolved</span>;
  }

  const createdTime = new Date(ticket.createdAt).getTime();
  const now = Date.now();
  const hoursOpen = (now - createdTime) / (1000 * 60 * 60);

  const limits = {
    URGENT: 4,
    HIGH: 12,
    MEDIUM: 24,
    LOW: 48,
  };

  const limit = limits[ticket.priority] || 24;
  const isOverdue = hoursOpen > limit;

  return (
    <span className={isOverdue ? "sla-badge sla-overdue" : "sla-badge sla-normal"}>
      {isOverdue ? "Overdue" : "On Track"}
    </span>
  );
}

export default SlaBadge;