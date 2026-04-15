import { useEffect, useState } from "react";
import { getMyTickets } from "../services/ticketService";
import TicketCard from "../components/TicketCard";

function MyTicketsPage() {
  const [tickets, setTickets] = useState([]);

  useEffect(() => {
    getMyTickets().then(setTickets).catch(console.error);
  }, []);

  return (
    <div className="page">
      <h1>My Tickets</h1>
      <div className="ticket-grid">
        {tickets.length === 0 ? <p>No tickets found.</p> : tickets.map((ticket) => (
          <TicketCard key={ticket.id} ticket={ticket} />
        ))}
      </div>
    </div>
  );
}

export default MyTicketsPage;