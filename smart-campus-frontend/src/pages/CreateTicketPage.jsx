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

  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState("");

  const validateForm = () => {
    const newErrors = {};

    if (!form.title.trim()) {
      newErrors.title = "Title is required.";
    } else if (form.title.trim().length < 3) {
      newErrors.title = "Title must be at least 3 characters.";
    }

    if (!form.resourceOrLocation.trim()) {
      newErrors.resourceOrLocation = "Resource or location is required.";
    }

    if (!form.description.trim()) {
      newErrors.description = "Description is required.";
    } else if (form.description.trim().length < 10) {
      newErrors.description = "Description must be at least 10 characters.";
    }

    if (!form.preferredContact.trim()) {
      newErrors.preferredContact = "Preferred contact is required.";
    } else if (!/^[0-9+\-\s]{7,15}$/.test(form.preferredContact.trim())) {
      newErrors.preferredContact = "Enter a valid phone number.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" });
    setMessage("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

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
      setErrors({});
    } catch (error) {
      setMessage("Failed to create ticket. Please check backend connection.");
      console.error(error);
    }
  };

  return (
    <div className="page">
      <h1>Create Incident Ticket</h1>

      <form className="ticket-form" onSubmit={handleSubmit}>
        <input
          name="title"
          placeholder="Ticket title"
          value={form.title}
          onChange={handleChange}
        />
        {errors.title && <p className="error-text">{errors.title}</p>}

        <input
          name="resourceOrLocation"
          placeholder="Resource or location"
          value={form.resourceOrLocation}
          onChange={handleChange}
        />
        {errors.resourceOrLocation && (
          <p className="error-text">{errors.resourceOrLocation}</p>
        )}

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

        <textarea
          name="description"
          placeholder="Describe the issue clearly"
          value={form.description}
          onChange={handleChange}
        />
        {errors.description && (
          <p className="error-text">{errors.description}</p>
        )}

        <input
          name="preferredContact"
          placeholder="Preferred contact number"
          value={form.preferredContact}
          onChange={handleChange}
        />
        {errors.preferredContact && (
          <p className="error-text">{errors.preferredContact}</p>
        )}

        <button type="submit">Submit Ticket</button>
      </form>

      {message && (
        <p className={message.includes("successfully") ? "success-text" : "fail-text"}>
          {message}
        </p>
      )}
    </div>
  );
}

export default CreateTicketPage;