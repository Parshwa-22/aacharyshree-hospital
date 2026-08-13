import { useEffect, useState } from "react";
import { X, Star } from "lucide-react";
import ImageUploader from "../common/ImageUploader";
import MultiImageUploader from "../common/MultiImageUploader";
import TranslationsEditor from "../common/TranslationsEditor";

function buildInitialValues(fields, existing) {
  const values = {};
  for (const field of fields) {
    if (existing && existing[field.name] !== undefined && existing[field.name] !== null) {
      values[field.name] = existing[field.name];
    } else if (field.default !== undefined) {
      values[field.name] = field.default;
    } else if (field.type === "checkbox") {
      values[field.name] = false;
    } else if (field.type === "checkboxGroup") {
      values[field.name] = "";
    } else if (field.type === "dateList") {
      values[field.name] = "";
    } else {
      values[field.name] = "";
    }
  }
  return values;
}

// A field with `showIf: { field: "type", equals: "VIDEO" }` only renders
// when values[showIf.field] === showIf.equals (or is in showIf.in, an array).
function isVisible(field, values) {
  if (!field.showIf) return true;
  const current = values[field.showIf.field];
  if (field.showIf.equals !== undefined) return current === field.showIf.equals;
  if (field.showIf.in) return field.showIf.in.includes(current);
  return true;
}

export default function ItemFormModal({ title, fields, initialItem, onClose, onSave, saving }) {
  const [values, setValues] = useState(() => buildInitialValues(fields, initialItem));
  const [error, setError] = useState("");

  useEffect(() => {
    setValues(buildInitialValues(fields, initialItem));
  }, [initialItem, fields]);

  const setField = (name, value) => setValues((prev) => ({ ...prev, [name]: value }));

  const toggleInGroup = (name, option) => {
    const current = values[name] ? values[name].split(",").map((s) => s.trim()).filter(Boolean) : [];
    const next = current.includes(option) ? current.filter((o) => o !== option) : [...current, option];
    setField(name, next.join(","));
  };

  const addDateToList = (name, date) => {
    if (!date) return;
    const current = (values[name] || "").split(",").map((item) => item.trim()).filter(Boolean);
    if (!current.includes(date)) setField(name, [...current, date].sort().join(","));
  };

  const removeDateFromList = (name, date) => {
    setField(name, (values[name] || "").split(",").map((item) => item.trim()).filter((item) => item && item !== date).join(","));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    for (const field of fields) {
      if (!isVisible(field, values)) continue;
      if (field.required && !values[field.name]) {
        setError(`${field.label} is required`);
        return;
      }
      if (field.min !== undefined && values[field.name] !== "" && Number(values[field.name]) < field.min) {
        setError(`${field.label} cannot be less than ${field.min}`);
        return;
      }
    }

    try {
      await onSave(values);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to save — please try again");
    }
  };

  const visibleFields = fields.filter((f) => isVisible(f, values));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4 py-8 overflow-y-auto">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-lg">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
          <h3 className="text-lg font-semibold text-slate-800">
            {initialItem ? `Edit ${title}` : `Add ${title}`}
          </h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="px-6 py-5 space-y-4 max-h-[70vh] overflow-y-auto">
          {visibleFields.map((field) => (
            <div key={field.name}>
              {field.type === "text" && (
                <>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    {field.label}
                    {field.required && <span className="text-red-500"> *</span>}
                  </label>
                  <input
                    type="text"
                    value={values[field.name] ?? ""}
                    placeholder={field.placeholder}
                    onChange={(e) => setField(field.name, e.target.value)}
                    className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand"
                  />
                </>
              )}

              {field.type === "searchableSelect" && (
                <>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    {field.label}
                    {field.required && <span className="text-red-500"> *</span>}
                  </label>
                  <input
                    type="text"
                    list={`${field.name}-options`}
                    value={values[field.name] ?? ""}
                    placeholder={field.placeholder || "Type to search..."}
                    onChange={(e) => setField(field.name, e.target.value)}
                    className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand"
                  />
                  <datalist id={`${field.name}-options`}>
                    {field.options.map((opt) => (
                      <option key={opt} value={opt} />
                    ))}
                  </datalist>
                  <p className="text-xs text-slate-400 mt-1">
                    Start typing to filter, or enter a new value not in the list.
                  </p>
                </>
              )}

              {field.type === "number" && (
                <>
                  <label className="block text-sm font-medium text-slate-700 mb-1">{field.label}</label>
                  <input
                    type="number"
                    min={field.min}
                    value={values[field.name] ?? ""}
                    onChange={(e) => setField(field.name, e.target.value === "" ? "" : Number(e.target.value))}
                    className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand"
                  />
                </>
              )}

              {field.type === "date" && (
                <>
                  <label className="block text-sm font-medium text-slate-700 mb-1">{field.label}</label>
                  <input
                    type="date"
                    value={values[field.name] ?? ""}
                    onChange={(e) => setField(field.name, e.target.value)}
                    className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand"
                  />
                </>
              )}

              {field.type === "dateList" && (
                <>
                  <label className="block text-sm font-medium text-slate-700 mb-1">{field.label}</label>
                  <div className="flex gap-2">
                    <input
                      type="date"
                      min={new Date().toISOString().slice(0, 10)}
                      onChange={(e) => { addDateToList(field.name, e.target.value); e.target.value = ""; }}
                      className="flex-1 rounded-md border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand"
                    />
                  </div>
                  <p className="mt-1 text-xs text-slate-400">{field.help || "Choose a date to add it to the schedule."}</p>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {(values[field.name] || "").split(",").map((date) => date.trim()).filter(Boolean).sort().map((date) => (
                      <button key={date} type="button" onClick={() => removeDateFromList(field.name, date)} className="rounded-full bg-brand/10 px-2.5 py-1 text-xs font-medium text-brand-dark hover:bg-red-50 hover:text-red-600" title="Remove date">
                        {new Date(`${date}T00:00:00`).toLocaleDateString(undefined, { day: "numeric", month: "short", year: "numeric" })} ×
                      </button>
                    ))}
                  </div>
                </>
              )}

              {field.type === "time" && (
                <>
                  <label className="block text-sm font-medium text-slate-700 mb-1">{field.label}</label>
                  <input
                    type="time"
                    value={values[field.name] ?? ""}
                    onChange={(e) => setField(field.name, e.target.value)}
                    className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand"
                  />
                </>
              )}

              {field.type === "textarea" && (
                <>
                  <label className="block text-sm font-medium text-slate-700 mb-1">{field.label}</label>
                  <textarea
                    rows={3}
                    value={values[field.name] ?? ""}
                    onChange={(e) => setField(field.name, e.target.value)}
                    className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand"
                  />
                </>
              )}

              {field.type === "select" && (
                <>
                  <label className="block text-sm font-medium text-slate-700 mb-1">{field.label}</label>
                  <select
                    value={values[field.name] ?? ""}
                    onChange={(e) => setField(field.name, e.target.value)}
                    className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand"
                  >
                    {field.options.map((opt) => (
                      <option key={opt} value={opt}>
                        {opt}
                      </option>
                    ))}
                  </select>
                </>
              )}

              {field.type === "checkbox" && (
                <label className="flex items-center gap-2 text-sm text-slate-700">
                  <input
                    type="checkbox"
                    checked={!!values[field.name]}
                    onChange={(e) => setField(field.name, e.target.checked)}
                    className="rounded border-slate-300 text-brand focus:ring-brand"
                  />
                  {field.label}
                </label>
              )}

              {field.type === "checkboxGroup" && (
                <>
                  <label className="block text-sm font-medium text-slate-700 mb-2">{field.label}</label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {field.options.map((opt) => {
                      const selected = (values[field.name] || "").split(",").map((s) => s.trim()).includes(opt);
                      return (
                        <label
                          key={opt}
                          className={`flex items-center gap-2 text-xs px-2 py-2 rounded-md border cursor-pointer ${
                            selected ? "border-brand bg-brand/10 text-brand-dark" : "border-slate-200 text-slate-600"
                          }`}
                        >
                          <input
                            type="checkbox"
                            checked={selected}
                            onChange={() => toggleInGroup(field.name, opt)}
                            className="rounded border-slate-300 text-brand focus:ring-brand"
                          />
                          {opt}
                        </label>
                      );
                    })}
                  </div>
                </>
              )}

              {field.type === "stars" && (
                <>
                  <label className="block text-sm font-medium text-slate-700 mb-1">{field.label}</label>
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((n) => (
                      <button
                        key={n}
                        type="button"
                        onClick={() => setField(field.name, n)}
                        className="p-0.5"
                        aria-label={`${n} star${n > 1 ? "s" : ""}`}
                      >
                        <Star
                          size={22}
                          className={n <= (values[field.name] || 0) ? "fill-amber-400 text-amber-400" : "text-slate-300"}
                        />
                      </button>
                    ))}
                    {values[field.name] > 0 && (
                      <button
                        type="button"
                        onClick={() => setField(field.name, 0)}
                        className="ml-2 text-xs text-slate-400 hover:text-slate-600"
                      >
                        Clear
                      </button>
                    )}
                  </div>
                </>
              )}

              {(field.type === "image" || field.type === "video") && (
                <ImageUploader
                  label={field.label}
                  value={values[field.name]}
                  onChange={(url) => setField(field.name, url)}
                  accept={field.type === "video" ? "video/*" : "image/*"}
                />
              )}

              {field.type === "multiImage" && (
                <MultiImageUploader label={field.label} value={values[field.name]} onChange={(value) => setField(field.name, value)} />
              )}

              {field.type === "translations" && (
                <TranslationsEditor
                  value={values[field.name]}
                  onChange={(json) => setField(field.name, json)}
                  fields={field.translatableFields}
                />
              )}
            </div>
          ))}

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
