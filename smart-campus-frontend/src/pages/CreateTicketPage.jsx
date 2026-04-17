import { useEffect, useMemo, useState } from "react";
import { X } from "lucide-react";
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

  const [selectedFiles, setSelectedFiles] = useState([]);
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState("");

  const previewUrls = useMemo(() => {
    return selectedFiles.map((file) => ({
      file,
      url: URL.createObjectURL(file),
    }));
  }, [selectedFiles]);

  useEffect(() => {
    return () => {
      previewUrls.forEach((item) => URL.revokeObjectURL(item.url));
    };
  }, [previewUrls]);

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

    if (selectedFiles.length > 3) {
      newErrors.attachments = "Maximum 3 images allowed.";
    }

    for (const file of selectedFiles) {
      if (!file.type.startsWith("image/")) {
        newErrors.attachments = "Only image files are allowed.";
      }
      if (file.size > 5 * 1024 * 1024) {
        newErrors.attachments = "Each image must be 5MB or less.";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" });
    setMessage("");
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files || []);
    let fileError = "";

    if (files.length > 3) {
      fileError = "Maximum 3 images allowed. Only first 3 images were selected.";
    }

    const limitedFiles = files.slice(0, 3);

    for (const file of limitedFiles) {
      if (!file.type.startsWith("image/")) {
        fileError = "Only image files are allowed.";
        break;
      }
      if (file.size > 5 * 1024 * 1024) {
        fileError = "Each image must be 5MB or less.";
        break;
      }
    }

    setSelectedFiles(limitedFiles);
    setErrors((prev) => ({ ...prev, attachments: fileError }));
    setMessage("");
  };

  const removeSelectedFile = (indexToRemove) => {
    const updatedFiles = selectedFiles.filter((_, index) => index !== indexToRemove);
    setSelectedFiles(updatedFiles);
    setErrors((prev) => ({ ...prev, attachments: "" }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      const formData = new FormData();
      formData.append("title", form.title);
      formData.append("resourceOrLocation", form.resourceOrLocation);
      formData.append("category", form.category);
      formData.append("description", form.description);
      formData.append("priority", form.priority);
      formData.append("preferredContact", form.preferredContact);

      selectedFiles.forEach((file) => {
        formData.append("attachments", file);
      });

      await createTicket(formData);

      setMessage("Ticket created successfully!");
      setForm({
        title: "",
        resourceOrLocation: "",
        category: "PROJECTOR",
        description: "",
        priority: "MEDIUM",
        preferredContact: "",
      });
      setSelectedFiles([]);
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

        <label className="file-upload-label">
          Upload Images (Max 3, 5MB each)
        </label>

        <input
          type="file"
          accept="image/*"
          multiple
          onChange={handleFileChange}
        />

        {errors.attachments && (
          <p className="error-text">{errors.attachments}</p>
        )}

        {previewUrls.length > 0 && (
          <div className="image-preview-grid">
            {previewUrls.map((item, index) => (
              <div key={index} className="image-preview-card">
                <button
                  type="button"
                  className="remove-image-btn"
                  onClick={() => removeSelectedFile(index)}
                >
                  <X size={14} />
                </button>

                <img src={item.url} alt={item.file.name} />
                <div className="image-preview-meta">
                  <span>{item.file.name}</span>
                  <small>{(item.file.size / 1024 / 1024).toFixed(2)} MB</small>
                </div>
              </div>
            ))}
          </div>
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