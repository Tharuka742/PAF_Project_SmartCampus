import { useState, useEffect } from "react";
import { Save, X, AlertCircle } from "lucide-react";

function ResourceForm({ onSaveResource, editingResource, onCancelEdit }) {
  const [formData, setFormData] = useState({
    name: "",
    type: "",
    capacity: "",
    location: "",
    status: "Active",
    description: "",
    imageUrl: "",
    amenities: "",
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (editingResource) {
      setFormData({
        ...editingResource,
        capacity: editingResource.capacity || "",
        imageUrl: editingResource.imageUrl || "",
        amenities: editingResource.amenities || "",
      });
    } else {
      resetForm();
    }
  }, [editingResource]);

  const resetForm = () => {
    setFormData({
      name: "",
      type: "",
      capacity: "",
      location: "",
      status: "Active",
      description: "",
      imageUrl: "",
      amenities: "",
    });
    setErrors({});
  };

  const validate = () => {
    let newErrors = {};
    if (!formData.name.trim()) newErrors.name = "Name is required";
    if (!formData.type.trim()) newErrors.type = "Type is required";
    if (!formData.capacity || isNaN(formData.capacity) || Number(formData.capacity) <= 0) {
      newErrors.capacity = "Valid capacity (>0) required";
    }
    if (!formData.location.trim()) newErrors.location = "Location is required";
    if (!formData.status.trim()) newErrors.status = "Status is required";
    
    // Optional basic URL validation
    if (formData.imageUrl && !formData.imageUrl.startsWith("http")) {
      newErrors.imageUrl = "Image URL should start with http/https";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    if (errors[e.target.name]) {
      setErrors({ ...errors, [e.target.name]: null }); // clear error on type
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    const resourcePayload = {
      ...formData,
      capacity: Number(formData.capacity),
    };

    onSaveResource(resourcePayload);
    if (!editingResource) {
      resetForm();
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className={`glass-card p-6 md:p-8 mb-10 transition-all duration-500 relative overflow-hidden ${
        editingResource ? "ring-2 ring-indigo-500 shadow-[0_0_30px_rgba(99,102,241,0.2)]" : "border-white/10"
      }`}
    >
      <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-cyan-500/10 to-indigo-500/10 rounded-full blur-3xl -mr-20 -mt-20"></div>
      
      <div className="flex justify-between items-center mb-6 relative">
        <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-indigo-400 flex items-center gap-2">
          {editingResource ? (
            <>Edit Resource: <span className="text-white">{editingResource.name}</span></>
          ) : (
            "Create New Resource"
          )}
        </h2>
        {editingResource && (
          <button 
            type="button" 
            onClick={onCancelEdit}
            className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-full transition-colors border border-white/10"
          >
            <X size={20} />
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-5 relative">
        {/* Row 1 */}
        <div className="md:col-span-4">
          <label className="block text-xs font-medium text-slate-400 mb-1 ml-1 uppercase tracking-wider">Resource Name *</label>
          <input
            type="text"
            name="name"
            placeholder="e.g. Innovation Lab 4B"
            value={formData.name}
            onChange={handleChange}
            className={`w-full p-3 rounded-xl bg-slate-900/50 text-white border transition-colors focus:ring-2 focus:ring-cyan-500 outline-none ${errors.name ? 'border-red-500/50' : 'border-white/10'}`}
          />
          {errors.name && <p className="text-red-400 text-xs mt-1 flex items-center gap-1"><AlertCircle size={12}/>{errors.name}</p>}
        </div>

        <div className="md:col-span-4">
          <label className="block text-xs font-medium text-slate-400 mb-1 ml-1 uppercase tracking-wider">Type *</label>
          <select 
            name="type" 
            value={formData.type} 
            onChange={handleChange}
            className={`w-full p-3 rounded-xl bg-slate-900/50 text-white border transition-colors focus:ring-2 focus:ring-cyan-500 outline-none ${errors.type ? 'border-red-500/50' : 'border-white/10'}`}
          >
            <option value="" disabled>Select Type</option>
            <option value="Lab">Lab</option>
            <option value="Lecture Hall">Lecture Hall</option>
            <option value="Meeting Room">Meeting Room</option>
            <option value="Auditorium">Auditorium</option>
            <option value="Equipment">Equipment</option>
          </select>
          {errors.type && <p className="text-red-400 text-xs mt-1 flex items-center gap-1"><AlertCircle size={12}/>{errors.type}</p>}
        </div>

        <div className="md:col-span-4">
          <label className="block text-xs font-medium text-slate-400 mb-1 ml-1 uppercase tracking-wider">Capacity *</label>
          <input
            type="number"
            name="capacity"
            placeholder="Max Persons"
            value={formData.capacity}
            onChange={handleChange}
            className={`w-full p-3 rounded-xl bg-slate-900/50 text-white border transition-colors focus:ring-2 focus:ring-cyan-500 outline-none ${errors.capacity ? 'border-red-500/50' : 'border-white/10'}`}
          />
          {errors.capacity && <p className="text-red-400 text-xs mt-1 flex items-center gap-1"><AlertCircle size={12}/>{errors.capacity}</p>}
        </div>

        {/* Row 2 */}
        <div className="md:col-span-4">
          <label className="block text-xs font-medium text-slate-400 mb-1 ml-1 uppercase tracking-wider">Location *</label>
          <input
            type="text"
            name="location"
            placeholder="e.g. Building A, Floor 2"
            value={formData.location}
            onChange={handleChange}
            className={`w-full p-3 rounded-xl bg-slate-900/50 text-white border transition-colors focus:ring-2 focus:ring-cyan-500 outline-none ${errors.location ? 'border-red-500/50' : 'border-white/10'}`}
          />
          {errors.location && <p className="text-red-400 text-xs mt-1 flex items-center gap-1"><AlertCircle size={12}/>{errors.location}</p>}
        </div>

        <div className="md:col-span-4">
          <label className="block text-xs font-medium text-slate-400 mb-1 ml-1 uppercase tracking-wider">Status *</label>
          <select 
            name="status" 
            value={formData.status} 
            onChange={handleChange}
            className={`w-full p-3 rounded-xl bg-slate-900/50 text-white border transition-colors focus:ring-2 focus:ring-cyan-500 outline-none ${errors.status ? 'border-red-500/50' : 'border-white/10'}`}
          >
            <option value="Active">Active</option>
            <option value="Maintenance">Maintenance</option>
            <option value="Out of Service">Out of Service</option>
          </select>
          {errors.status && <p className="text-red-400 text-xs mt-1 flex items-center gap-1"><AlertCircle size={12}/>{errors.status}</p>}
        </div>

        <div className="md:col-span-4">
          <label className="block text-xs font-medium text-slate-400 mb-1 ml-1 uppercase tracking-wider">Image URL</label>
          <input
            type="text"
            name="imageUrl"
            placeholder="https://..."
            value={formData.imageUrl}
            onChange={handleChange}
            className={`w-full p-3 rounded-xl bg-slate-900/50 text-white border transition-colors focus:ring-2 focus:ring-cyan-500 outline-none ${errors.imageUrl ? 'border-red-500/50' : 'border-white/10'}`}
          />
           {errors.imageUrl && <p className="text-red-400 text-xs mt-1 flex items-center gap-1"><AlertCircle size={12}/>{errors.imageUrl}</p>}
        </div>

        {/* Row 3 */}
        <div className="md:col-span-6">
          <label className="block text-xs font-medium text-slate-400 mb-1 ml-1 uppercase tracking-wider">Amenities (Comma separated)</label>
          <input
            type="text"
            name="amenities"
            placeholder="e.g. Projector, Whiteboard, 5G WiFi"
            value={formData.amenities}
            onChange={handleChange}
            className="w-full p-3 rounded-xl bg-slate-900/50 text-white border border-white/10 transition-colors focus:ring-2 focus:ring-cyan-500 outline-none"
          />
        </div>

        <div className="md:col-span-6">
          <label className="block text-xs font-medium text-slate-400 mb-1 ml-1 uppercase tracking-wider">Description</label>
          <input
            type="text"
            name="description"
            placeholder="Additional details..."
            value={formData.description}
            onChange={handleChange}
            className="w-full p-3 rounded-xl bg-slate-900/50 text-white border border-white/10 transition-colors focus:ring-2 focus:ring-cyan-500 outline-none"
          />
        </div>
      </div>

      <div className="mt-6 flex justify-end gap-3 relative">
        {editingResource && (
          <button
            type="button"
            onClick={onCancelEdit}
            className="px-6 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold transition-colors border border-white/5"
          >
            Cancel
          </button>
        )}
        <button
          type="submit"
          className="px-6 py-3 flex items-center gap-2 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-500 hover:from-cyan-400 hover:to-indigo-400 text-white font-bold shadow-lg hover:shadow-[0_0_20px_rgba(6,182,212,0.4)] transition-all hover:-translate-y-1"
        >
          <Save size={18} />
          {editingResource ? "Update Resource" : "Add Resource"}
        </button>
      </div>
    </form>
  );
}

export default ResourceForm;