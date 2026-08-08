import { useRef, useState } from "react";
import { Upload, X, Loader2 } from "lucide-react";
import apiClient from "../../api/client";

export default function MultiImageUploader({ label, value, onChange, accept = "image/*" }) {
  const inputRef = useRef(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  let urls = [];
  try { urls = Array.isArray(value) ? value : JSON.parse(value || "[]"); } catch { urls = []; }

  const handleFiles = async (files) => {
    if (!files.length) return;
    setUploading(true); setError("");
    try {
      const uploaded = [];
      for (const file of files) {
        const formData = new FormData();
        formData.append("file", file);
        const { data } = await apiClient.post("/api/upload", formData, { headers: { "Content-Type": "multipart/form-data" } });
        uploaded.push(data.url);
      }
      onChange(JSON.stringify([...urls, ...uploaded]));
    } catch (err) { setError(err.response?.data?.message || "Upload failed"); }
    finally { setUploading(false); }
  };

  return <div>
    {label && <label className="block text-sm font-medium text-slate-700 mb-1">{label}</label>}
    <button type="button" onClick={() => inputRef.current?.click()} disabled={uploading} className="inline-flex items-center gap-2 px-3 py-2 rounded-md border border-slate-300 text-sm text-slate-700 hover:bg-slate-50 disabled:opacity-50">
      {uploading ? <Loader2 size={16} className="animate-spin" /> : <Upload size={16} />} {uploading ? "Uploading..." : "Upload photos"}
    </button>
    <input ref={inputRef} type="file" multiple accept={accept} className="hidden" onChange={(e) => handleFiles(Array.from(e.target.files || []))} />
    {urls.length > 0 && <div className="mt-2 space-y-1">{urls.map((url, index) => <div key={`${url}-${index}`} className="flex items-center gap-2 text-xs text-slate-500"><span className="truncate flex-1">{url}</span><button type="button" onClick={() => onChange(JSON.stringify(urls.filter((_, i) => i !== index)))} className="text-slate-400 hover:text-red-500" aria-label="Remove photo"><X size={14} /></button></div>)}</div>}
    {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
  </div>;
}
