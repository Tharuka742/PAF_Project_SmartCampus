import { Edit, Trash2, MapPin, Users, Info, Box } from "lucide-react";

function ResourceCard({ resource, onDelete, onEdit, canManage = true }) {
  // Determine badge colors based on status
  const getStatusColor = (status) => {
    switch(status?.toLowerCase()) {
      case 'active': return 'bg-emerald-500/15 text-emerald-300 border-emerald-400/30';
      case 'maintenance': return 'bg-amber-500/15 text-amber-300 border-amber-400/30';
      case 'out of service': return 'bg-rose-500/15 text-rose-300 border-rose-400/30';
      default: return 'bg-slate-500/15 text-slate-300 border-slate-400/30';
    }
  };

  return (
    <article className="glass-card group relative flex h-full flex-col overflow-hidden rounded-2xl border border-slate-700/70 bg-slate-900/95 shadow-[0_10px_28px_rgba(2,6,23,0.28)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_18px_36px_rgba(2,6,23,0.34)]">
      <div className="relative h-44 w-full overflow-hidden border-b border-slate-700/70 bg-slate-800">
        {resource.imageUrl ? (
          <img
            src={resource.imageUrl}
            alt={resource.name}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
            onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=800'; }}
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-slate-800 to-slate-900">
            <span className="text-5xl font-black uppercase tracking-tighter text-slate-500/70">{resource.type?.substring(0,3)}</span>
          </div>
        )}

        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-slate-950/65 via-slate-950/20 to-transparent" />

        <div className={`absolute right-3 top-3 rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-wide ${getStatusColor(resource.status)}`}>
          {resource.status || 'Unknown'}
        </div>
      </div>

      <div className="flex flex-grow flex-col p-6">
        <div className="mb-4">
          <h3 className="line-clamp-2 text-xl font-bold leading-tight text-slate-100 transition-colors duration-300 group-hover:text-cyan-300">
            {resource.name}
          </h3>
          <p className="mt-1 text-xs font-semibold uppercase tracking-[0.18em] text-cyan-300/85">
            {resource.type || 'General'}
          </p>
        </div>

        <div className="flex flex-grow flex-col space-y-3 text-sm">
          <div className="flex items-center gap-3 rounded-xl border border-slate-700/70 bg-slate-800/55 px-3 py-2.5 text-slate-200">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-cyan-500/15 text-cyan-300">
              <Users size={16} />
            </div>
            <span className="leading-tight">
              <span className="text-slate-400">Capacity</span>{' '}
              <strong className="font-semibold text-slate-100">{resource.capacity}</strong> people
            </span>
          </div>

          <div className="flex items-center gap-3 rounded-xl border border-slate-700/70 bg-slate-800/55 px-3 py-2.5 text-slate-200">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-indigo-500/15 text-indigo-300">
              <MapPin size={16} />
            </div>
            <span className="line-clamp-2 leading-tight">
              <span className="text-slate-400">Location</span>{' '}
              <strong className="font-medium text-slate-100">{resource.location || 'Not specified'}</strong>
            </span>
          </div>

          {(resource.amenities || resource.description) && (
            <div className="mt-1 space-y-2 border-t border-slate-700/70 pt-3">
              {resource.amenities && (
                <div className="flex items-start gap-2.5 text-slate-300">
                  <Box size={14} className="mt-0.5 shrink-0 text-violet-300"/>
                  <span className="line-clamp-2 text-xs leading-relaxed">
                    <span className="font-semibold text-slate-200">Amenities:</span> {resource.amenities}
                  </span>
                </div>
              )}
              {resource.description && (
                <div className="flex items-start gap-2.5 text-slate-300">
                  <Info size={14} className="mt-0.5 shrink-0 text-slate-400"/>
                  <p className="line-clamp-2 text-xs leading-relaxed">
                    <span className="font-semibold text-slate-200">Details:</span> {resource.description}
                  </p>
                </div>
              )}
            </div>
          )}
        </div>

        {canManage && (
          <div className="mt-5 flex gap-3 border-t border-slate-700/70 pt-4">
            <button
              type="button"
              onClick={() => onEdit(resource)}
              className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl border border-indigo-400/35 bg-indigo-500/18 px-4 py-2.5 text-sm font-semibold text-indigo-200 transition-all hover:border-indigo-300/60 hover:bg-indigo-500/30 hover:text-white"
            >
              <Edit size={16} /> Edit
            </button>
            <button
              type="button"
              onClick={() => onDelete(resource.id)}
              className="inline-flex w-12 items-center justify-center rounded-xl border border-rose-400/40 bg-rose-500/12 text-rose-200 transition-all hover:border-rose-300/70 hover:bg-rose-500/25 hover:text-white"
              title="Delete Resource"
            >
              <Trash2 size={16} />
            </button>
          </div>
        )}
      </div>
    </article>
  );
}

export default ResourceCard;