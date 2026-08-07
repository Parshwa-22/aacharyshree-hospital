import { useEffect, useState } from "react";
import { Plus, Loader2 } from "lucide-react";
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
  arrayMove,
} from "@dnd-kit/sortable";
import apiClient from "../../api/client";
import SortableItemRow from "./SortableItemRow";
import ItemFormModal from "./ItemFormModal";
import ConfirmDialog from "../common/ConfirmDialog";

export default function CollectionManager({ config }) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [saving, setSaving] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 5 } }));

  const load = async () => {
    setLoading(true);
    setError("");
    try {
      const { data } = await apiClient.get(config.endpoint, { params: config.queryParams });
      setItems(data);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [config.endpoint, JSON.stringify(config.queryParams)]);

  const handleDragEnd = async (event) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = items.findIndex((i) => i.id === active.id);
    const newIndex = items.findIndex((i) => i.id === over.id);
    const reordered = arrayMove(items, oldIndex, newIndex);
    setItems(reordered); // optimistic update

    try {
      await apiClient.put(
        `${config.endpoint}/reorder`,
        reordered.map((item, index) => ({ id: item.id, displayOrder: index }))
      );
    } catch (err) {
      setError("Failed to save new order — reloading list");
      load();
    }
  };

  const handleToggleActive = async (item) => {
    const updated = { ...item, isActive: !item.isActive };
    setItems((prev) => prev.map((i) => (i.id === item.id ? updated : i)));
    try {
      await apiClient.put(`${config.endpoint}/${item.id}`, updated);
    } catch (err) {
      setError("Failed to update visibility");
      load();
    }
  };

  const openAddModal = () => {
    setEditingItem(null);
    setModalOpen(true);
  };

  const openEditModal = (item) => {
    setEditingItem(item);
    setModalOpen(true);
  };

  const handleSave = async (values) => {
    setSaving(true);
    try {
      if (editingItem) {
        await apiClient.put(`${config.endpoint}/${editingItem.id}`, values);
      } else {
        await apiClient.post(config.endpoint, values);
      }
      setModalOpen(false);
      load();
    } finally {
      setSaving(false);
    }
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    try {
      await apiClient.delete(`${config.endpoint}/${deleteTarget.id}`);
      setItems((prev) => prev.filter((i) => i.id !== deleteTarget.id));
    } catch (err) {
      setError("Failed to delete");
    } finally {
      setDeleteTarget(null);
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-5">
        <div>
          <h1 className="text-xl font-semibold text-slate-800">{config.title}</h1>
          {config.reorderable && (
            <p className="text-sm text-slate-500 mt-0.5">Drag the handle to reorder how these appear on the site.</p>
          )}
        </div>
        <button
          onClick={openAddModal}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-md bg-brand text-white text-sm font-medium hover:bg-brand-dark transition"
        >
          <Plus size={16} /> Add {config.title.replace(/s$/, "")}
        </button>
      </div>

      {error && (
        <div className="mb-4 text-sm text-red-600 bg-red-50 border border-red-100 rounded-md px-4 py-2">
          {error}
        </div>
      )}

      {loading ? (
        <div className="flex items-center gap-2 text-slate-500 text-sm py-10 justify-center">
          <Loader2 size={18} className="animate-spin" /> Loading...
        </div>
      ) : items.length === 0 ? (
        <div className="text-center py-14 text-slate-400 text-sm border border-dashed border-slate-300 rounded-lg">
          Nothing here yet — click "Add {config.title.replace(/s$/, "")}" to create the first one.
        </div>
      ) : (
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <SortableContext items={items.map((i) => i.id)} strategy={verticalListSortingStrategy}>
            <div className="space-y-2">
              {items.map((item) => (
                <SortableItemRow
                  key={item.id}
                  item={item}
                  config={config}
                  dragEnabled={config.reorderable}
                  onEdit={openEditModal}
                  onDelete={setDeleteTarget}
                  onToggleActive={handleToggleActive}
                />
              ))}
            </div>
          </SortableContext>
        </DndContext>
      )}

      {modalOpen && (
        <ItemFormModal
          title={config.title.replace(/s$/, "")}
          fields={config.fields}
          initialItem={editingItem}
          saving={saving}
          onClose={() => setModalOpen(false)}
          onSave={handleSave}
        />
      )}

      <ConfirmDialog
        open={!!deleteTarget}
        title={`Delete this ${config.title.replace(/s$/, "").toLowerCase()}?`}
        message="This can't be undone."
        onConfirm={confirmDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
}
