import { useEffect, useState } from "react";
import { Loader2, Save } from "lucide-react";
import apiClient from "../api/client";
import ImageUploader from "../components/common/ImageUploader";
import TranslationsEditor from "../components/common/TranslationsEditor";

export default function TrustInfo() {
  const [values, setValues] = useState({
    name: "",
    establishedYear: "",
    description: "",
    achievements: "", // comma-separated, as stored by the backend
    image: "",
    translations: "",
  });
  const [achievementsText, setAchievementsText] = useState(""); // newline-separated, for editing
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    apiClient
      .get("/api/trust-info")
      .then(({ data }) => {
        setValues({
          name: data.name || "",
          establishedYear: data.establishedYear || "",
          description: data.description || "",
          achievements: data.achievements || "",
          image: data.image || "",
          translations: data.translations || "",
        });
        setAchievementsText((data.achievements || "").split(",").map((s) => s.trim()).filter(Boolean).join("\n"));
      })
      .catch(() => setError("Failed to load trust info"))
      .finally(() => setLoading(false));
  }, []);

  const setField = (name, value) => setValues((prev) => ({ ...prev, [name]: value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    setMessage("");
    try {
      const payload = {
        ...values,
        achievements: achievementsText.split("\n").map((s) => s.trim()).filter(Boolean).join(","),
      };
      await apiClient.put("/api/trust-info", payload);
      setMessage("Saved — the About page will show this on next load.");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to save");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-xl">
      <h1 className="text-xl font-semibold text-slate-800 mb-1">Trust Information</h1>
      <p className="text-sm text-slate-500 mb-6">
        The hospital's governing trust — shown on the public About page. There's only one
        trust, so this is a single record rather than a list.
      </p>

      {loading ? (
        <div className="flex items-center gap-2 text-slate-500 text-sm py-10 justify-center">
          <Loader2 size={18} className="animate-spin" /> Loading...
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="bg-white border border-slate-200 rounded-xl p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Trust Name</label>
            <input
              className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
              value={values.name}
              onChange={(e) => setField("name", e.target.value)}
              placeholder="Vidya Sanmati Das Seva Sanstha"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Established (year)</label>
            <input
              className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
              value={values.establishedYear}
              onChange={(e) => setField("establishedYear", e.target.value)}
              placeholder="e.g. 2018"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Description / Story</label>
            <textarea
              rows={5}
              className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
              value={values.description}
              onChange={(e) => setField("description", e.target.value)}
              placeholder="Tell the trust's story — mission, founding, background..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Achievements (one per line)
            </label>
            <textarea
              rows={4}
              className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm font-mono text-xs"
              value={achievementsText}
              onChange={(e) => setAchievementsText(e.target.value)}
              placeholder={"50,000+ patients treated\n3 medical streams under one roof\nISO 9001:2015 certified"}
            />
            <p className="text-xs text-slate-400 mt-1">Shown as a checklist on the About page.</p>
          </div>

          <ImageUploader label="Trust / founder photo" value={values.image} onChange={(url) => setField("image", url)} />

          <TranslationsEditor
            value={values.translations}
            onChange={(json) => setField("translations", json)}
            fields={[
              { name: "name", label: "Trust Name", type: "text" },
              { name: "description", label: "Description / Story", type: "textarea" },
              { name: "achievements", label: "Achievements (comma-separated)", type: "textarea" },
            ]}
          />

          {message && <p className="text-sm text-emerald-600">{message}</p>}
          {error && <p className="text-sm text-red-500">{error}</p>}

          <button
            type="submit"
            disabled={saving}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-md bg-brand text-white text-sm font-medium hover:bg-brand-dark transition disabled:opacity-50"
          >
            <Save size={16} /> {saving ? "Saving..." : "Save"}
          </button>
        </form>
      )}
    </div>
  );
}
