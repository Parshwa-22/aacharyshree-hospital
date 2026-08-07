import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical, Pencil, Trash2, Eye, EyeOff } from "lucide-react";

export default function SortableItemRow({ item, config, onEdit, onDelete, onToggleActive, dragEnabled }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: item.id,
    disabled: !dragEnabled,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const title = config.listTitleField ? item[config.listTitleField] : `#${item.id}`;
  const subtitle = config.listSubtitleField ? item[config.listSubtitleField] : null;
  const image = config.listImageField ? item[config.listImageField] : null;

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="flex items-center gap-3 bg-white border border-slate-200 rounded-lg px-4 py-3"
    >
      {dragEnabled && (
        <button
          {...attributes}
          {...listeners}
          className="cursor-grab active:cursor-grabbing text-slate-400 hover:text-slate-600 touch-none"
          aria-label="Drag to reorder"
        >
          <GripVertical size={18} />
        </button>
      )}

      {image ? (
        <img src={image} alt="" className="w-10 h-10 rounded object-cover bg-slate-100 flex-shrink-0" />
      ) : (
        config.listImageField && <div className="w-10 h-10 rounded bg-slate-100 flex-shrink-0" />
      )}

      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-slate-800 truncate">{title || "(untitled)"}</p>
        {subtitle && <p className="text-xs text-slate-500 truncate">{subtitle}</p>}
      </div>

      <button
        onClick={() => onToggleActive(item)}
        title={item.isActive ? "Visible — click to hide" : "Hidden — click to show"}
        className={`p-1.5 rounded-md ${item.isActive ? "text-emerald-600 hover:bg-emerald-50" : "text-slate-400 hover:bg-slate-100"}`}
      >
        {item.isActive ? <Eye size={16} /> : <EyeOff size={16} />}
      </button>

      <button onClick={() => onEdit(item)} className="p-1.5 rounded-md text-slate-500 hover:bg-slate-100">
        <Pencil size={16} />
      </button>

      <button onClick={() => onDelete(item)} className="p-1.5 rounded-md text-red-500 hover:bg-red-50">
        <Trash2 size={16} />
      </button>
    </div>
  );
}
