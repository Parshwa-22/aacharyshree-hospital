import { useRef, useState } from "react";
import { Upload, X, Loader2 } from "lucide-react";
import apiClient from "../../api/client";

export default function ImageUploader({ label, value, onChange, accept = "image/*" }) {
  const inputRef = useRef(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  const handleFile = async (file) => {
    if (!file) return;
    setUploading(true);
    setError("");
    try {
      const formData = new FormData();
      formData.append("file", file);
      const { data } = await apiClient.post("/api/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      onChange(data.url);
    } catch (err) {
      setError(err.response?.data?.message || "Upload failed");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div>
      {label && <label className="block text-sm font-medium text-slate-700 mb-1">{label}</label>}

      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
          className="inline-flex items-center gap-2 px-3 py-2 rounded-md border border-slate-300 text-sm text-slate-700 hover:bg-slate-50 transition disabled:opacity-50"
        >
          {uploading ? <Loader2 size={16} className="animate-spin" /> : <Upload size={16} />}
          {uploading ? "Uploading..." : value ? "Replace" : "Upload"}
        </button>

        {value && (
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-500 truncate max-w-[160px]">{value}</span>
            <button
              type="button"
              onClick={() => onChange("")}
              className="text-slate-400 hover:text-red-500"
              aria-label="Remove"
            >
              <X size={14} />
            </button>
          </div>
        )}
      </div>

      <input
        ref={inputRef}
        type="file"
        accept={accept}
        className="hidden"
        onChange={(e) => handleFile(e.target.files?.[0])}
      />

      {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
    </div>
  );
}
