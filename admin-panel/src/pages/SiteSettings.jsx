import { useEffect, useState } from "react";
import { Loader2, Save } from "lucide-react";
import apiClient from "../api/client";
import TranslationsEditor from "../components/common/TranslationsEditor";

export default function SiteSettings() {
  const [values, setValues] = useState({ heroTitle: "", heroSubtitle: "", translations: "" });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    apiClient
      .get("/api/site-settings")
      .then(({ data }) =>
        setValues({
          heroTitle: data.heroTitle || "",
          heroSubtitle: data.heroSubtitle || "",
          translations: data.translations || "",
        })
      )
      .catch(() => setError("Failed to load site settings"))
      .finally(() => setLoading(false));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    setMessage("");
    try {
      await apiClient.put("/api/site-settings", values);
      setMessage("Saved — the homepage will show this on next load.");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to save");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-xl">
      <h1 className="text-xl font-semibold text-slate-800 mb-1">Site Settings</h1>
      <p className="text-sm text-slate-500 mb-6">
        Sitewide homepage heading — shown once below the navbar, separate from the hero
        image slider (which no longer has its own title/subtitle per slide).
      </p>

      {loading ? (
        <div className="flex items-center gap-2 text-slate-500 text-sm py-10 justify-center">
          <Loader2 size={18} className="animate-spin" /> Loading...
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="bg-white border border-slate-200 rounded-xl p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Homepage Title</label>
            <input
              className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
              value={values.heroTitle}
              onChange={(e) => setValues((v) => ({ ...v, heroTitle: e.target.value }))}
              placeholder="Welcome to Aacharyshree Hospital"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Homepage Subtitle</label>
            <input
              className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
              value={values.heroSubtitle}
              onChange={(e) => setValues((v) => ({ ...v, heroSubtitle: e.target.value }))}
              placeholder="Your Health, Our Priority"
            />
          </div>

          <TranslationsEditor
            value={values.translations}
            onChange={(json) => setValues((v) => ({ ...v, translations: json }))}
            fields={[
              { name: "heroTitle", label: "Homepage Title", type: "text" },
              { name: "heroSubtitle", label: "Homepage Subtitle", type: "text" },
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
