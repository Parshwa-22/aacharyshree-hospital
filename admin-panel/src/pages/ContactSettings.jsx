import { useEffect, useState } from "react";
import { Loader2, Save, Phone } from "lucide-react";
import apiClient from "../api/client";

export default function ContactSettings() {
  const [values, setValues] = useState({ appointmentPhone: "", donationPhone: "" });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    apiClient
      .get("/api/contact-settings")
      .then(({ data }) =>
        setValues({
          appointmentPhone: data.appointmentPhone || "",
          donationPhone: data.donationPhone || "",
        })
      )
      .catch(() => setError("Failed to load contact settings"))
      .finally(() => setLoading(false));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    setMessage("");
    try {
      await apiClient.put("/api/contact-settings", values);
      setMessage("Saved — the call buttons across the site now use these numbers.");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to save");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-xl">
      <h1 className="text-xl font-semibold text-slate-800 mb-1">Click-to-Call Numbers</h1>
      <p className="text-sm text-slate-500 mb-6">
        Used by the "Book Appointment" button on doctor cards and the donation
        contact button on the Donors page — tapping them dials straight out on mobile.
      </p>

      {loading ? (
        <div className="flex items-center gap-2 text-slate-500 text-sm py-10 justify-center">
          <Loader2 size={18} className="animate-spin" /> Loading...
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="bg-white border border-slate-200 rounded-xl p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1 flex items-center gap-2">
              <Phone size={14} /> Appointment Booking Number
            </label>
            <input
              className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
              value={values.appointmentPhone}
              onChange={(e) => setValues((v) => ({ ...v, appointmentPhone: e.target.value }))}
              placeholder="9090641008"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1 flex items-center gap-2">
              <Phone size={14} /> Donation Contact Number
            </label>
            <input
              className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
              value={values.donationPhone}
              onChange={(e) => setValues((v) => ({ ...v, donationPhone: e.target.value }))}
              placeholder="9090641008"
            />
          </div>

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
