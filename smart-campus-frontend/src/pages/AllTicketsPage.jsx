import { useEffect, useState } from "react";
import { getAllTickets } from "../services/ticketService";
import TicketCard from "../components/TicketCard";

function AllTicketsPage() {
  const [tickets, setTickets] = useState([]);

  useEffect(() => {
    getAllTickets().then(setTickets).catch(console.error);
  }, []);

  return (
    <div className="page">
      <h1>All Tickets</h1>
      <div className="ticket-grid">
        {tickets.map((ticket) => (
          <TicketCard key={ticket.id} ticket={ticket} />
        ))}
      </div>
    </div>
  );
}

export default AllTicketsPage;