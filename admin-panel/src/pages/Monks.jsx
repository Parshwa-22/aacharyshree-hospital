import { useEffect, useState } from "react";
import { LocateFixed, MapPin, Pencil, Plus, Trash2 } from "lucide-react";
import apiClient from "../api/client";
import ImageUploader from "../components/common/ImageUploader";

const empty = { name: "", groupName: "", photo: "", travelReason: "", locationLink: "", locationLabel: "", latitude: "", longitude: "", isActive: true };
const mediaUrl = (value) => value && value.startsWith("/") ? `${import.meta.env.VITE_API_BASE_URL || ""}${value}` : value;

function coordsFromLink(link) {
  if (!link) return null;
  const match = link.match(/(?:@|!3d)(-?\d+(?:\.\d+)?)[,!](?:4d)?(-?\d+(?:\.\d+)?)|(?:[?&](?:q|query|ll)=)(-?\d+(?:\.\d+)?)(?:,|%2C)(-?\d+(?:\.\d+)?)/i);
  return match ? { latitude: Number(match[1] ?? match[3]), longitude: Number(match[2] ?? match[4]) } : null;
}

async function reverseGeocode(latitude, longitude) {
  const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${latitude}&lon=${longitude}`, { headers: { Accept: "application/json" } });
  const data = await response.json();
  return data.display_name || "Current location";
}

export default function Monks() {
  const [items, setItems] = useState([]); const [editing, setEditing] = useState(null); const [form, setForm] = useState(empty); const [modalOpen, setModalOpen] = useState(false); const [busy, setBusy] = useState(false); const [error, setError] = useState("");
  const load = () => apiClient.get("/api/monks").then(({ data }) => setItems(data));
  useEffect(() => { load(); }, []);
  const set = (name, value) => setForm((old) => ({ ...old, [name]: value }));
  const useDeviceLocation = () => {
    if (!navigator.geolocation) return setError("This browser does not support live location.");
    setError("");
    navigator.geolocation.getCurrentPosition(async ({ coords }) => {
      const latitude = Number(coords.latitude.toFixed(7)); const longitude = Number(coords.longitude.toFixed(7));
      setForm((old) => ({ ...old, latitude, longitude, locationLink: `https://www.google.com/maps/search/?api=1&query=${latitude},${longitude}`, locationLabel: "Resolving location…" }));
      try { set("locationLabel", await reverseGeocode(latitude, longitude)); } catch { set("locationLabel", "Current location"); }
    }, (geoError) => {
      const message = geoError.code === 1 ? "Location permission was denied. Paste a Google Maps shared link instead." : geoError.code === 2 ? "Your location is currently unavailable. Try again or paste a Google Maps shared link." : "Location lookup timed out. Try again or paste a Google Maps shared link.";
      setError(message);
    }, { enableHighAccuracy: true, timeout: 15000, maximumAge: 0 });
  };
  const parseLink = async (value) => {
    set("locationLink", value); const point = coordsFromLink(value); if (!point) return;
    setForm((old) => ({ ...old, ...point, locationLink: `https://www.google.com/maps/search/?api=1&query=${point.latitude},${point.longitude}`, locationLabel: "Resolving location…" }));
    try { set("locationLabel", await reverseGeocode(point.latitude, point.longitude)); } catch { set("locationLabel", "Location from Google Maps"); }
  };
  const open = (item = null) => { setError(""); setEditing(item); setForm(item ? { ...empty, ...item } : empty); setModalOpen(true); };
  const save = async (event) => {
    event.preventDefault(); setBusy(true); setError("");
    try {
      const point = coordsFromLink(form.locationLink); const payload = { ...form, ...(point || {}) };
      if (form.locationLink && !point && (form.latitude === "" || form.longitude === "")) throw new Error("That Google Maps link does not contain usable coordinates. Use live location or paste a shared pin link.");
      if (payload.latitude === "" || payload.longitude === "" || payload.latitude == null || payload.longitude == null) throw new Error("Choose Use live location or paste a valid Google Maps location before saving.");
      if (editing) await apiClient.put(`/api/monks/${editing.id}`, payload);
      else await apiClient.post("/api/monks", payload);
      setEditing(null); setModalOpen(false); await load();
    } catch (err) { setError(err.response?.data?.message || "Could not save Vihar update."); } finally { setBusy(false); }
  };
  const remove = async (id) => { if (!window.confirm("Delete this monk/group?")) return; await apiClient.delete(`/api/monks/${id}`); load(); };
  return <div>
    <div className="mb-5 flex items-center justify-between"><div><h1 className="text-xl font-semibold text-slate-800">Vihar Update</h1><p className="text-sm text-slate-500">Add a profile once, then update its location to append travel history.</p></div><button onClick={() => open()} className="inline-flex items-center gap-2 rounded-md bg-brand px-4 py-2 text-sm font-medium text-white"><Plus size={16} /> Add Vihar Profile</button></div>
    {error && <p className="mb-4 rounded-md bg-red-50 px-4 py-2 text-sm text-red-600">{error}</p>}
    <div className="space-y-3">{items.map((item) => <div key={item.id} className="flex items-center justify-between gap-4 rounded-xl border border-slate-200 bg-white p-4 shadow-sm"><div className="flex min-w-0 items-center gap-3"><div className="h-14 w-14 shrink-0 overflow-hidden rounded-lg bg-slate-100">{item.photo ? <img src={mediaUrl(item.photo)} alt={item.name} className="h-full w-full object-cover" onError={(event) => { event.currentTarget.style.display = "none"; }} /> : <MapPin className="m-4 text-brand" />}</div><div className="min-w-0"><p className="truncate font-semibold text-slate-800">{item.name}</p><p className="truncate text-xs text-slate-500">{item.locationLabel || "No location yet"}</p></div></div><div className="flex shrink-0 gap-2"><button onClick={() => open(item)} className="rounded-md border p-2 text-slate-600 hover:bg-slate-50" aria-label="Edit"><Pencil size={16} /></button><button onClick={() => remove(item.id)} className="rounded-md border p-2 text-red-500 hover:bg-red-50" aria-label="Delete"><Trash2 size={16} /></button></div></div>)}</div>
    {modalOpen ? <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/40 px-4 py-8"><form onSubmit={save} className="w-full max-w-2xl space-y-4 rounded-xl bg-white p-6 shadow-xl"><div className="flex items-center justify-between"><h2 className="text-lg font-semibold">{editing ? "Edit Vihar Update" : "Add Vihar Profile"}</h2><button type="button" onClick={() => { setEditing(null); setModalOpen(false); }} className="text-slate-400">×</button></div><input required placeholder="Monk / Group Name *" value={form.name} onChange={(e) => set("name", e.target.value)} className="w-full rounded-md border px-3 py-2" /><input placeholder="Group Name (optional)" value={form.groupName} onChange={(e) => set("groupName", e.target.value)} className="w-full rounded-md border px-3 py-2" /><ImageUploader label="Monk / group photo" value={form.photo} onChange={(url) => set("photo", url)} /><textarea placeholder="Travel reason / Vihar details" value={form.travelReason} onChange={(e) => set("travelReason", e.target.value)} className="w-full rounded-md border px-3 py-2" rows={3} /><div className="flex gap-2"><input placeholder="Google Maps shared location link" value={form.locationLink} onChange={(e) => parseLink(e.target.value)} className="min-w-0 flex-1 rounded-md border px-3 py-2" /><button type="button" onClick={useDeviceLocation} className="inline-flex shrink-0 items-center gap-1 rounded-md bg-brand px-3 py-2 text-sm text-white"><LocateFixed size={16} /> Use live location</button></div><div className="grid grid-cols-1 gap-3 sm:grid-cols-2"><input readOnly placeholder="Latitude (auto)" value={form.latitude} className="rounded-md border bg-slate-50 px-3 py-2" /><input readOnly placeholder="Longitude (auto)" value={form.longitude} className="rounded-md border bg-slate-50 px-3 py-2" /></div><input readOnly placeholder="Location name (auto)" value={form.locationLabel} className="w-full rounded-md border bg-slate-50 px-3 py-2" /><label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={!!form.isActive} onChange={(e) => set("isActive", e.target.checked)} /> Visible on website</label><div className="flex justify-end gap-2"><button type="button" onClick={() => { setEditing(null); setModalOpen(false); }} className="rounded-md border px-4 py-2">Cancel</button><button disabled={busy} className="rounded-md bg-brand px-4 py-2 text-white">{busy ? "Saving…" : "Save"}</button></div></form></div> : null}
  </div>;
}
