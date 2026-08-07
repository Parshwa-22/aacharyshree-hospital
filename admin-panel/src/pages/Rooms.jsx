import { useEffect, useState } from "react";
import { Plus, Pencil, Trash2, Loader2, BedDouble, X, ArrowUp, ArrowDown } from "lucide-react";
import apiClient from "../api/client";
import ImageUploader from "../components/common/ImageUploader";
import ConfirmDialog from "../components/common/ConfirmDialog";
import { ROOM_TYPE_OPTIONS, ROOM_AMENITY_OPTIONS } from "../config/entityConfigs";

const emptyRoom = {
  roomName: "",
  type: ROOM_TYPE_OPTIONS[0],
  price: "",
  capacity: 1,
  view360Url: "",
  description: "",
  availability: true,
  isActive: true,
  animationType: "Fade",
  images: [], // [{ imageUrl, displayOrder }]
  amenitiesList: [], // array of amenity strings
};

const ROOM_ANIMATION_PRESETS = ["Fade", "Slide", "Zoom"];

function roomToFormValues(room) {
  if (!room) return emptyRoom;
  return {
    ...room,
    type: room.type || ROOM_TYPE_OPTIONS[0],
    animationType: room.animationType || "Fade",
    images: [...(room.images || [])].sort((a, b) => (a.displayOrder ?? 0) - (b.displayOrder ?? 0)),
    amenitiesList: (room.amenities || []).map((a) => a.amenity),
  };
}

function formValuesToPayload(values) {
  return {
    roomName: values.roomName,
    type: values.type,
    price: values.price === "" ? null : Number(values.price),
    capacity: values.capacity === "" ? null : Number(values.capacity),
    view360Url: values.view360Url,
    description: values.description,
    availability: values.availability,
    isActive: values.isActive,
    animationType: values.animationType || "Fade",
    images: values.images.map((img, index) => ({ imageUrl: img.imageUrl, displayOrder: index })),
    amenities: values.amenitiesList.map((amenity) => ({ amenity })),
  };
}

// ---- Multi-photo manager: upload, delete, reorder (up/down) ----
function RoomPhotoManager({ images, onChange }) {
  const addPhoto = (url) => {
    if (!url) return;
    onChange([...images, { imageUrl: url, displayOrder: images.length }]);
  };
  const removeAt = (index) => onChange(images.filter((_, i) => i !== index));
  const moveAt = (index, direction) => {
    const target = index + direction;
    if (target < 0 || target >= images.length) return;
    const next = [...images];
    [next[index], next[target]] = [next[target], next[index]];
    onChange(next);
  };

  return (
    <div>
      <label className="block text-sm font-medium text-slate-700 mb-2">
        Room Photos (first photo = main cover image)
      </label>

      {images.length > 0 && (
        <div className="grid grid-cols-3 sm:grid-cols-4 gap-3 mb-3">
          {images.map((img, index) => (
            <div key={`${img.imageUrl}-${index}`} className="relative group">
              <img
                src={img.imageUrl}
                alt=""
                className="w-full aspect-square object-cover rounded-lg border border-slate-200"
              />
              <span className="absolute top-1 left-1 bg-black/60 text-white text-[10px] px-1.5 py-0.5 rounded">
                {index + 1}
              </span>
              <button
                type="button"
                onClick={() => removeAt(index)}
                className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition"
                aria-label="Remove photo"
              >
                <X size={12} />
              </button>
              <div className="absolute bottom-1 right-1 flex gap-0.5 opacity-0 group-hover:opacity-100 transition">
                <button
                  type="button"
                  onClick={() => moveAt(index, -1)}
                  disabled={index === 0}
                  className="bg-white/90 rounded p-0.5 disabled:opacity-30"
                  aria-label="Move earlier"
                >
                  <ArrowUp size={12} />
                </button>
                <button
                  type="button"
                  onClick={() => moveAt(index, 1)}
                  disabled={index === images.length - 1}
                  className="bg-white/90 rounded p-0.5 disabled:opacity-30"
                  aria-label="Move later"
                >
                  <ArrowDown size={12} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <ImageUploader label="Upload another photo" value="" onChange={addPhoto} />
      <p className="text-xs text-slate-400 mt-1">
        Hover a photo to delete it or move it earlier/later — the first one is used as the main card image.
      </p>
    </div>
  );
}

function RoomFormModal({ initialItem, onClose, onSave, saving }) {
  const [values, setValues] = useState(roomToFormValues(initialItem));
  const [error, setError] = useState("");

  useEffect(() => setValues(roomToFormValues(initialItem)), [initialItem]);

  const setField = (name, value) => setValues((prev) => ({ ...prev, [name]: value }));

  const toggleAmenity = (amenity) => {
    setValues((prev) => ({
      ...prev,
      amenitiesList: prev.amenitiesList.includes(amenity)
        ? prev.amenitiesList.filter((a) => a !== amenity)
        : [...prev.amenitiesList, amenity],
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!values.roomName) {
      setError("Room name is required");
      return;
    }
    if (values.capacity !== "" && Number(values.capacity) < 1) {
      setError("Capacity must be at least 1");
      return;
    }
    if (values.price !== "" && Number(values.price) < 0) {
      setError("Price cannot be negative");
      return;
    }
    try {
      await onSave(formValuesToPayload(values));
    } catch (err) {
      setError(err.response?.data?.message || "Failed to save");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4 py-8 overflow-y-auto">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-lg">
        <div className="px-6 py-4 border-b border-slate-100">
          <h3 className="text-lg font-semibold text-slate-800">{initialItem ? "Edit Room" : "Add Room"}</h3>
        </div>

        <form onSubmit={handleSubmit} className="px-6 py-5 space-y-4 max-h-[75vh] overflow-y-auto">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Room Name *</label>
            <input
              className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
              value={values.roomName}
              onChange={(e) => setField("roomName", e.target.value)}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Type</label>
              <select
                className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
                value={values.type}
                onChange={(e) => setField("type", e.target.value)}
              >
                {ROOM_TYPE_OPTIONS.map((t) => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Price / day (₹)</label>
              <input
                type="number"
                min={0}
                className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
                value={values.price}
                onChange={(e) => setField("price", e.target.value)}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Capacity</label>
              <input
                type="number"
                min={1}
                className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
                value={values.capacity}
                onChange={(e) => setField("capacity", e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">360° View Link</label>
              <input
                className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
                value={values.view360Url}
                onChange={(e) => setField("view360Url", e.target.value)}
                placeholder="Paste a 360° tour link"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Description</label>
            <textarea
              rows={3}
              className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
              value={values.description}
              onChange={(e) => setField("description", e.target.value)}
            />
          </div>

          <RoomPhotoManager images={values.images} onChange={(imgs) => setField("images", imgs)} />

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Photo Gallery Animation
            </label>
            <input
              type="text"
              list="room-animation-options"
              className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
              value={values.animationType}
              onChange={(e) => setField("animationType", e.target.value)}
              placeholder="Fade, Slide, Zoom, or type your own"
            />
            <datalist id="room-animation-options">
              {ROOM_ANIMATION_PRESETS.map((opt) => (
                <option key={opt} value={opt} />
              ))}
            </datalist>
            <p className="text-xs text-slate-400 mt-1">
              Pick a preset or type a custom animation name — not in the list? Just type it in.
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Amenities</label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {ROOM_AMENITY_OPTIONS.map((amenity) => {
                const selected = values.amenitiesList.includes(amenity);
                return (
                  <label
                    key={amenity}
                    className={`flex items-center gap-2 text-xs px-2 py-2 rounded-md border cursor-pointer ${
                      selected ? "border-brand bg-brand/10 text-brand-dark" : "border-slate-200 text-slate-600"
                    }`}
                  >
                    <input type="checkbox" checked={selected} onChange={() => toggleAmenity(amenity)} />
                    {amenity}
                  </label>
                );
              })}
            </div>
          </div>

          <div className="flex gap-6">
            <label className="flex items-center gap-2 text-sm text-slate-700">
              <input
                type="checkbox"
                checked={!!values.availability}
                onChange={(e) => setField("availability", e.target.checked)}
              />
              Currently available
            </label>
            <label className="flex items-center gap-2 text-sm text-slate-700">
              <input
                type="checkbox"
                checked={!!values.isActive}
                onChange={(e) => setField("isActive", e.target.checked)}
              />
              Visible on website
            </label>
          </div>

          {error && <p className="text-sm text-red-500">{error}</p>}

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm rounded-md border border-slate-300 text-slate-600 hover:bg-slate-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="px-4 py-2 text-sm rounded-md bg-brand text-white hover:bg-brand-dark transition disabled:opacity-50"
            >
              {saving ? "Saving..." : "Save"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function Rooms() {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editingRoom, setEditingRoom] = useState(null);
  const [saving, setSaving] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const load = async () => {
    setLoading(true);
    try {
      const { data } = await apiClient.get("/api/rooms");
      setRooms(data);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load rooms");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const handleSave = async (payload) => {
    setSaving(true);
    try {
      if (editingRoom) {
        await apiClient.put(`/api/rooms/${editingRoom.id}`, payload);
      } else {
        await apiClient.post("/api/rooms", payload);
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
      await apiClient.delete(`/api/rooms/${deleteTarget.id}`);
      setRooms((prev) => prev.filter((r) => r.id !== deleteTarget.id));
    } finally {
      setDeleteTarget(null);
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-5">
        <h1 className="text-xl font-semibold text-slate-800">Rooms</h1>
        <button
          onClick={() => {
            setEditingRoom(null);
            setModalOpen(true);
          }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-md bg-brand text-white text-sm font-medium hover:bg-brand-dark transition"
        >
          <Plus size={16} /> Add Room
        </button>
      </div>

      {error && <p className="text-sm text-red-600 mb-4">{error}</p>}

      {loading ? (
        <div className="flex items-center gap-2 text-slate-500 text-sm py-10 justify-center">
          <Loader2 size={18} className="animate-spin" /> Loading...
        </div>
      ) : rooms.length === 0 ? (
        <div className="text-center py-14 text-slate-400 text-sm border border-dashed border-slate-300 rounded-lg">
          No rooms yet — click "Add Room" to create the first one.
        </div>
      ) : (
        <div className="space-y-2">
          {rooms.map((room) => {
            const sortedImages = [...(room.images || [])].sort((a, b) => (a.displayOrder ?? 0) - (b.displayOrder ?? 0));
            return (
              <div key={room.id} className="flex items-center gap-3 bg-white border border-slate-200 rounded-lg px-4 py-3">
                {sortedImages[0]?.imageUrl ? (
                  <img src={sortedImages[0].imageUrl} alt="" className="w-10 h-10 rounded object-cover bg-slate-100" />
                ) : (
                  <div className="w-10 h-10 rounded bg-slate-100 flex items-center justify-center">
                    <BedDouble size={16} className="text-slate-400" />
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-slate-800 truncate">{room.roomName}</p>
                  <p className="text-xs text-slate-500 truncate">
                    {room.type} {room.price != null ? `· ₹${room.price}/day` : ""} {room.capacity ? `· up to ${room.capacity}` : ""}
                  </p>
                </div>
                <button
                  onClick={() => {
                    setEditingRoom(room);
                    setModalOpen(true);
                  }}
                  className="p-1.5 rounded-md text-slate-500 hover:bg-slate-100"
                >
                  <Pencil size={16} />
                </button>
                <button onClick={() => setDeleteTarget(room)} className="p-1.5 rounded-md text-red-500 hover:bg-red-50">
                  <Trash2 size={16} />
                </button>
              </div>
            );
          })}
        </div>
      )}

      {modalOpen && (
        <RoomFormModal
          initialItem={editingRoom}
          saving={saving}
          onClose={() => setModalOpen(false)}
          onSave={handleSave}
        />
      )}

      <ConfirmDialog
        open={!!deleteTarget}
        title="Delete this room?"
        message="This can't be undone."
        onConfirm={confirmDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
}
