import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, Filter, AlertCircle, RefreshCw, Building2, PlusCircle, ArrowLeft } from 'lucide-react';
import ResourceCard from '../components/resources/ResourceCard';
import ResourceForm from '../components/resources/ResourceForm';
import {
  getAllResources,
  createResource,
  updateResource,
  deleteResource,
} from '../services/resourceService';
import { useRole } from '../context/RoleContext';
import { RESOURCE_DASHBOARD_ROUTE } from '../config/navigation';

function ResourcesPage() {
  const { role, isAdmin } = useRole();
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingResource, setEditingResource] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');

  const fetchResources = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getAllResources(role);
      setResources(data);
    } catch (e) {
      console.error('Error fetching resources:', e);
      setError('Failed to load resources. Ensure the backend is running.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchResources();
  }, [role]);

  const types = ['All', ...new Set(resources.map((r) => r.type).filter(Boolean))];
  const statuses = ['All', 'Active', 'Maintenance', 'Out of Service'];

  const filtered = resources.filter((r) => {
    const q = search.trim().toLowerCase();
    const matchSearch =
      !q ||
      r.name?.toLowerCase().includes(q) ||
      r.location?.toLowerCase().includes(q) ||
      r.type?.toLowerCase().includes(q);
    const matchType = typeFilter === 'All' || r.type === typeFilter;
    const matchStatus = statusFilter === 'All' || r.status === statusFilter;
    return matchSearch && matchType && matchStatus;
  });

  const handleSaveResource = async (resourceData) => {
    try {
      if (editingResource) {
        await updateResource(editingResource.id, resourceData, role);
        setEditingResource(null);
      } else {
        await createResource(resourceData, role);
      }
      setShowForm(false);
      await fetchResources();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (e) {
      console.error('Error saving resource:', e);
      alert(e.response?.status === 403 ? 'Students cannot create or edit resources.' : 'Could not save resource.');
    }
  };

  const handleEditResource = (resource) => {
    setEditingResource(resource);
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCancelEdit = () => {
    setEditingResource(null);
    setShowForm(false);
  };

  const handleDeleteResource = async (id) => {
    if (!window.confirm('Are you sure you want to permanently delete this resource?')) return;
    try {
      await deleteResource(id, role);
      await fetchResources();
      if (editingResource?.id === id) setEditingResource(null);
    } catch (e) {
      console.error('Error deleting resource:', e);
      alert(e.response?.status === 403 ? 'Students cannot delete resources.' : 'Could not delete resource.');
    }
  };

  return (
    <div className="text-white px-6 py-10 animate-in fade-in zoom-in duration-500 flex-grow relative overflow-hidden">
      <div className="absolute top-40 left-[-20%] w-[60%] h-[60%] rounded-full bg-violet-600/5 blur-[150px] -z-10 pointer-events-none" />
      <div className="absolute bottom-20 right-[-10%] w-[50%] h-[50%] rounded-full bg-cyan-600/5 blur-[150px] -z-10 pointer-events-none" />

      <div className="max-w-7xl mx-auto">
        <header className="mb-10 text-center md:text-left flex flex-col md:flex-row justify-between items-end gap-4">
          <div>
            <h1 className="text-4xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-indigo-500 tracking-tight mb-3">
              Facilities & assets catalogue
            </h1>
            <p className="text-slate-400 text-lg max-w-2xl">
              Resource catalogue management with CRUD for admins and read-only access for students.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Link
              to={RESOURCE_DASHBOARD_ROUTE}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-900/80 border border-white/10 text-slate-200 hover:bg-slate-800"
            >
              <ArrowLeft size={16} />
              Back to Resource Dashboard
            </Link>
            {isAdmin && (
              <button
                type="button"
                onClick={() => {
                  if (showForm) {
                    setShowForm(false);
                    setEditingResource(null);
                  } else {
                    setShowForm(true);
                    setEditingResource(null);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }
                }}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl border text-sm font-semibold transition-all ${
                  showForm
                    ? 'bg-slate-700/70 border-white/10 text-slate-200'
                    : 'bg-cyan-500/20 border-cyan-500/40 text-cyan-300 hover:bg-cyan-500/30'
                }`}
              >
                <PlusCircle size={16} />
                {showForm ? 'Close Form' : 'Create Resource'}
              </button>
            )}
            <button
              type="button"
              onClick={fetchResources}
              className="p-2 rounded-xl bg-slate-800/60 border border-white/10 text-slate-400 hover:text-white transition-colors"
              title="Refresh"
            >
              <RefreshCw size={18} className={loading ? 'animate-spin' : ''} />
            </button>
            <div className="px-4 py-2 bg-slate-800/50 rounded-lg border border-slate-700/50">
              <span className="text-sm font-medium text-slate-300">
                Role <strong className="text-white uppercase">{role}</strong>
              </span>
            </div>
          </div>
        </header>

        {error && (
          <div className="glass-card p-4 mb-6 border-rose-500/30 bg-rose-500/10 flex items-center gap-3">
            <AlertCircle size={20} className="text-rose-400 shrink-0" />
            <p className="text-rose-300 text-sm flex-grow">{error}</p>
            <button
              type="button"
              onClick={fetchResources}
              className="text-rose-400 hover:text-rose-300 text-sm font-medium underline"
            >
              Retry
            </button>
          </div>
        )}

        {!isAdmin && (
          <div className="glass-card p-4 mb-6 border-amber-500/30 bg-amber-500/10">
            <p className="text-amber-200 text-sm">Student mode is read-only. Create, edit, and delete actions are disabled.</p>
          </div>
        )}

        <div className="glass-card p-4 mb-8 flex flex-col lg:flex-row gap-4 border border-white/10">
          <div className="flex-1 flex items-center gap-2 rounded-xl bg-slate-900/50 border border-white/10 px-3">
            <Search size={18} className="text-slate-500 shrink-0" />
            <input
              type="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name, location, or type..."
              className="w-full bg-transparent py-3 text-sm text-white placeholder:text-slate-500 outline-none"
            />
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2 text-slate-400 text-xs uppercase tracking-wider">
              <Filter size={14} />
              Filters
            </div>
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="rounded-xl bg-slate-900/80 border border-white/10 text-sm text-white px-3 py-2.5 outline-none"
            >
              {types.map((t) => (
                <option key={t} value={t}>
                  {t === 'All' ? 'All types' : t}
                </option>
              ))}
            </select>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="rounded-xl bg-slate-900/80 border border-white/10 text-sm text-white px-3 py-2.5 outline-none"
            >
              {statuses.map((s) => (
                <option key={s} value={s}>
                  {s === 'All' ? 'All statuses' : s}
                </option>
              ))}
            </select>
          </div>
        </div>

        {isAdmin && showForm && (
          <div className="mb-10">
            <ResourceForm
              onSaveResource={handleSaveResource}
              editingResource={editingResource}
              onCancelEdit={handleCancelEdit}
            />
          </div>
        )}

        {!loading && !error && resources.length === 0 ? (
          <div className="glass-card p-12 text-center flex flex-col items-center justify-center min-h-[300px] border-dashed border-2 border-slate-700/50">
            <div className="w-16 h-16 rounded-full bg-slate-800/50 flex items-center justify-center mb-4 text-slate-500">
              <Building2 size={28} aria-hidden />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">No resources in the catalogue</h3>
            <p className="text-slate-400 max-w-md">
              {isAdmin
                ? 'Use Create Resource to add facilities or equipment.'
                : 'An admin user can add entries to the catalogue.'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 animate-in slide-in-from-bottom-8 duration-700">
            {filtered.map((resource) => (
              <ResourceCard
                key={resource.id}
                resource={resource}
                onDelete={handleDeleteResource}
                onEdit={handleEditResource}
                canManage={isAdmin}
              />
            ))}
          </div>
        )}

        {!loading && resources.length > 0 && filtered.length === 0 && (
          <p className="text-center text-slate-500 text-sm py-12">No resources match your search and filters.</p>
        )}
      </div>
    </div>
  );
}

export default ResourcesPage;
