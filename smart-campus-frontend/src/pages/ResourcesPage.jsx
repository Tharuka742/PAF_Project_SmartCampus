import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  Search,
  Filter,
  AlertCircle,
  RefreshCw,
  Building2,
  PlusCircle,
  ArrowLeft,
} from "lucide-react";
import ResourceCard from "../components/resources/ResourceCard";
import ResourceForm from "../components/resources/ResourceForm";
import {
  getResources,
  createResource,
  updateResource,
  deleteResource,
} from "../services/resourceService";
import { useRole } from "../context/RoleContext";
import { RESOURCE_DASHBOARD_ROUTE } from "../config/navigation";

function ResourcesPage() {
  const { role, isAdmin } = useRole();

  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [editingResource, setEditingResource] = useState(null);
  const [showForm, setShowForm] = useState(false);

  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [capacityFilter, setCapacityFilter] = useState("");

  const fetchResources = async () => {
    setLoading(true);
    setError(null);

    try {
      const data = await getResources(
        {
          type: typeFilter !== "All" ? typeFilter : "",
          status: statusFilter !== "All" ? statusFilter : "",
          capacity: capacityFilter || "",
        },
        role
      );

      setResources(Array.isArray(data) ? data : []);
    } catch (e) {
      console.error("Error fetching resources:", e);
      setError("Failed to load resources. Ensure the backend is running.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchResources();
  }, [role, typeFilter, statusFilter, capacityFilter]);

  const types = useMemo(
    () => ["All", ...new Set(resources.map((r) => r.type).filter(Boolean))],
    [resources]
  );

  const statuses = ["All", "ACTIVE", "OUT_OF_SERVICE"];

  const filteredResources = useMemo(() => {
    const q = search.trim().toLowerCase();

    if (!q) return resources;

    return resources.filter((r) => {
      return (
        r.name?.toLowerCase().includes(q) ||
        r.location?.toLowerCase().includes(q) ||
        r.type?.toLowerCase().includes(q) ||
        r.description?.toLowerCase().includes(q)
      );
    });
  }, [resources, search]);

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
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (e) {
      console.error("Error saving resource:", e);
      alert(
        e.response?.status === 403
          ? "Students cannot create or edit resources."
          : "Could not save resource."
      );
    }
  };

  const handleEditResource = (resource) => {
    setEditingResource(resource);
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleCancelEdit = () => {
    setEditingResource(null);
    setShowForm(false);
  };

  const handleDeleteResource = async (id) => {
    if (!window.confirm("Are you sure you want to permanently delete this resource?")) {
      return;
    }

    try {
      await deleteResource(id, role);
      await fetchResources();

      if (editingResource?.id === id) {
        setEditingResource(null);
      }
    } catch (e) {
      console.error("Error deleting resource:", e);
      alert(
        e.response?.status === 403
          ? "Students cannot delete resources."
          : "Could not delete resource."
      );
    }
  };

  return (
    <div className="relative min-h-full flex-grow px-6 py-10 text-white animate-in fade-in duration-500">
      <div className="absolute top-40 left-[-20%] h-[60%] w-[60%] rounded-full bg-violet-600/5 blur-[150px] pointer-events-none -z-10" />
      <div className="absolute bottom-20 right-[-10%] h-[50%] w-[50%] rounded-full bg-cyan-600/5 blur-[150px] pointer-events-none -z-10" />

      <div className="mx-auto max-w-7xl">
        <header className="mb-8 rounded-3xl border border-slate-200/80 bg-white/80 p-6 shadow-sm backdrop-blur-sm md:p-7">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-2xl">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-cyan-700">
                Resource Management
              </p>

              <h1 className="mt-2 bg-gradient-to-r from-cyan-500 to-indigo-600 bg-clip-text text-4xl font-black tracking-tight text-transparent md:text-5xl">
                Facilities &amp; assets catalogue
              </h1>

              <p className="mt-3 text-base leading-relaxed text-slate-600 md:text-lg">
                Manage all campus facilities and assets in one place. Use search and
                filters to quickly find entries, then create, edit, or review details
                based on your role.
              </p>
            </div>

            <div className="flex w-full flex-col gap-3 sm:w-auto sm:min-w-[23rem]">
              <div className="flex flex-wrap items-center gap-2 sm:justify-end">
                <Link
                  to={RESOURCE_DASHBOARD_ROUTE}
                  className="inline-flex items-center gap-2 rounded-xl border border-slate-300 bg-slate-900 px-4 py-2.5 text-sm font-medium text-slate-100 transition-colors hover:bg-slate-800"
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
                        window.scrollTo({ top: 0, behavior: "smooth" });
                      }
                    }}
                    className={`inline-flex items-center gap-2 rounded-xl border px-4 py-2.5 text-sm font-semibold transition-all ${
                      showForm
                        ? "border-slate-500 bg-slate-700/90 text-slate-100"
                        : "border-cyan-500/40 bg-cyan-500/15 text-cyan-700 hover:bg-cyan-500/25"
                    }`}
                  >
                    <PlusCircle size={16} />
                    {showForm ? "Close Form" : "Create Resource"}
                  </button>
                )}
              </div>

              <div className="flex flex-wrap items-center gap-2 sm:justify-end">
                <button
                  type="button"
                  onClick={fetchResources}
                  className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-slate-300 bg-white text-slate-600 transition-colors hover:bg-slate-100 hover:text-slate-900"
                  title="Refresh"
                >
                  <RefreshCw size={18} className={loading ? "animate-spin" : ""} />
                </button>

                <div className="inline-flex items-center gap-2 rounded-xl border border-indigo-200 bg-indigo-50 px-4 py-2.5">
                  <span className="text-xs font-semibold uppercase tracking-wider text-indigo-500">
                    Role
                  </span>
                  <strong className="text-sm uppercase text-indigo-700">{role}</strong>
                </div>
              </div>
            </div>
          </div>
        </header>

        {error && (
          <div className="mb-6 flex items-center gap-3 rounded-xl border border-rose-300 bg-rose-50 p-4 shadow-sm">
            <AlertCircle size={20} className="shrink-0 text-rose-600" />
            <p className="flex-grow text-sm text-rose-700">{error}</p>
            <button
              type="button"
              onClick={fetchResources}
              className="text-sm font-medium text-rose-700 underline hover:text-rose-900"
            >
              Retry
            </button>
          </div>
        )}

        {!isAdmin && (
          <div className="mb-6 rounded-xl border border-amber-400 bg-amber-100 px-4 py-3 shadow-sm">
            <p className="text-sm font-semibold text-amber-900">
              ⚠️ Student mode is read-only. Create, edit, and delete actions are disabled.
            </p>
          </div>
        )}

        <section className="mb-8 rounded-2xl border border-slate-200 bg-white/80 p-4 shadow-sm backdrop-blur-sm md:p-5">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center">
            <div className="flex min-w-0 flex-1 items-center gap-3 rounded-xl border border-slate-300 bg-white px-3.5 shadow-sm">
              <Search size={18} className="shrink-0 text-slate-400" />
              <input
                type="search"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by name, location, type, or description..."
                className="w-full bg-transparent py-3 text-sm text-slate-700 placeholder:text-slate-400 outline-none"
              />
            </div>

            <div className="flex flex-wrap items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 p-2 lg:justify-end">
              <div className="flex items-center gap-2 px-2 text-xs uppercase tracking-wider text-slate-500">
                <Filter size={14} />
                Filters
              </div>

              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                className="rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-700 outline-none focus:border-cyan-400"
              >
                {types.map((t) => (
                  <option key={t} value={t}>
                    {t === "All" ? "All types" : t}
                  </option>
                ))}
              </select>

              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-700 outline-none focus:border-cyan-400"
              >
                {statuses.map((s) => (
                  <option key={s} value={s}>
                    {s === "All" ? "All statuses" : s}
                  </option>
                ))}
              </select>

              <input
                type="number"
                min="1"
                value={capacityFilter}
                onChange={(e) => setCapacityFilter(e.target.value)}
                placeholder="Min capacity"
                className="w-32 rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-700 outline-none focus:border-cyan-400"
              />
            </div>
          </div>
        </section>

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
          <div className="glass-card flex min-h-[300px] flex-col items-center justify-center border-2 border-dashed border-slate-700/50 p-12 text-center">
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-slate-800/50 text-slate-500">
              <Building2 size={28} aria-hidden />
            </div>

            <h3 className="mb-2 text-xl font-bold text-white">
              No resources in the catalogue
            </h3>

            <p className="max-w-md text-slate-400">
              {isAdmin
                ? "Use Create Resource to add facilities or equipment."
                : "An admin user can add entries to the catalogue."}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 animate-in slide-in-from-bottom-8 duration-700 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filteredResources.map((resource) => (
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

        {!loading && resources.length > 0 && filteredResources.length === 0 && (
          <p className="py-12 text-center text-sm text-slate-500">
            No resources match your search and filters.
          </p>
        )}
      </div>
    </div>
  );
}

export default ResourcesPage;