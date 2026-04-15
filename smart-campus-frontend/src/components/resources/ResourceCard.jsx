import { Edit, Trash2, MapPin, Users, Info, Box } from "lucide-react";

function ResourceCard({ resource, onDelete, onEdit, canManage = true }) {
  // Determine badge colors based on status
  const getStatusColor = (status) => {
    switch(status?.toLowerCase()) {
      case 'active': return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30';
      case 'maintenance': return 'bg-amber-500/20 text-amber-400 border-amber-500/30';
      case 'out of service': return 'bg-rose-500/20 text-rose-400 border-rose-500/30';
      default: return 'bg-slate-500/20 text-slate-400 border-slate-500/30';
    }
  };

  return (
    <div className="glass-card hover-scale group relative overflow-hidden flex flex-col h-full bg-slate-900/40">
      {/* Visual Image Header */}
      <div className="h-40 w-full overflow-hidden relative bg-slate-800">
        {resource.imageUrl ? (
          <img 
            src={resource.imageUrl} 
            alt={resource.name}
            className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity duration-500 group-hover:scale-105"
            onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=800'; }}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-indigo-900/50 to-slate-900">
            <span className="text-white/20 text-5xl font-black tracking-tighter uppercase">{resource.type?.substring(0,3)}</span>
          </div>
        )}
        
        {/* Status Badge overlay */}
        <div className={`absolute top-3 right-3 px-3 py-1 rounded-full text-xs font-bold border backdrop-blur-md ${getStatusColor(resource.status)}`}>
          {resource.status}
        </div>
      </div>

      <div className="p-5 flex flex-col flex-grow relative">
        <div className="flex justify-between items-start mb-2">
          <div>
            <h3 className="text-xl font-bold text-white group-hover:text-cyan-400 transition-colors duration-300">{resource.name}</h3>
            <span className="text-xs font-medium text-indigo-400 uppercase tracking-widest">{resource.type}</span>
          </div>
        </div>

        <div className="space-y-3 my-4 flex-grow text-sm">
          <div className="flex items-center gap-3 text-slate-300">
            <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-cyan-400 shrink-0">
              <Users size={16} />
            </div>
            <span>Capacity: <strong className="text-white">{resource.capacity}</strong> persons</span>
          </div>
          
          <div className="flex items-center gap-3 text-slate-300">
            <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-indigo-400 shrink-0">
              <MapPin size={16} />
            </div>
            <span>{resource.location}</span>
          </div>

          {(resource.amenities || resource.description) && (
            <div className="pt-3 border-t border-white/5">
              {resource.amenities && (
                <div className="flex items-start gap-3 text-slate-400 mb-2">
                  <Box size={14} className="mt-1 shrink-0 text-violet-400"/>
                  <span className="text-xs leading-relaxed">{resource.amenities}</span>
                </div>
              )}
              {resource.description && (
                <div className="flex items-start gap-3 text-slate-400">
                  <Info size={14} className="mt-1 shrink-0 text-slate-500"/>
                  <p className="text-xs leading-relaxed line-clamp-2">{resource.description}</p>
                </div>
              )}
            </div>
          )}
        </div>

        {canManage && (
          <div className="flex gap-2 mt-auto pt-4">
            <button
              type="button"
              onClick={() => onEdit(resource)}
              className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-indigo-500/20 hover:bg-indigo-500/40 text-indigo-300 border border-indigo-500/30 transition-colors text-sm font-semibold"
            >
              <Edit size={16} /> Edit
            </button>
            <button
              type="button"
              onClick={() => onDelete(resource.id)}
              className="flex-none flex items-center justify-center w-12 rounded-xl bg-rose-500/10 hover:bg-rose-500/30 text-rose-400 border border-rose-500/20 transition-all hover:scale-105"
              title="Delete Resource"
            >
              <Trash2 size={16} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default ResourceCard;