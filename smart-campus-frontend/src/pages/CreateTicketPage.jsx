import { useState } from "react";
import { createTicket } from "../services/ticketService";

function CreateTicketPage() {
  const [form, setForm] = useState({
    title: "",
    resourceOrLocation: "",
    category: "PROJECTOR",
    description: "",
    priority: "MEDIUM",
    preferredContact: "",
  });

  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await createTicket(form);
      setMessage("Ticket created successfully!");
      setForm({
        title: "",
        resourceOrLocation: "",
        category: "PROJECTOR",
        description: "",
        priority: "MEDIUM",
        preferredContact: "",
      });
    } catch (error) {
      setMessage("Failed to create ticket.");
      console.error(error);
    }
  };

  return (
    <div className="page">
      <h1>Create Incident Ticket</h1>

      <form className="ticket-form" onSubmit={handleSubmit}>
        <input name="title" placeholder="Ticket title" value={form.title} onChange={handleChange} required />
        <input name="resourceOrLocation" placeholder="Resource or location" value={form.resourceOrLocation} onChange={handleChange} required />

        <select name="category" value={form.category} onChange={handleChange}>
          <option value="PROJECTOR">Projector</option>
          <option value="NETWORK">Network</option>
          <option value="ELECTRICAL">Electrical</option>
          <option value="AIR_CONDITIONING">Air Conditioning</option>
          <option value="FURNITURE">Furniture</option>
          <option value="CLEANING">Cleaning</option>
          <option value="OTHER">Other</option>
        </select>

        <select name="priority" value={form.priority} onChange={handleChange}>
          <option value="LOW">Low</option>
          <option value="MEDIUM">Medium</option>
          <option value="HIGH">High</option>
          <option value="URGENT">Urgent</option>
        </select>

        <textarea name="description" placeholder="Describe the issue" value={form.description} onChange={handleChange} required />
        <input name="preferredContact" placeholder="Preferred contact" value={form.preferredContact} onChange={handleChange} required />

        <button type="submit">Submit Ticket</button>
      </form>

      {message && <p>{message}</p>}
    </div>
  );
}

export default CreateTicketPage;