import { useState } from "react";
import { Languages } from "lucide-react";

const LANGUAGES = [
  { code: "hi", label: "Hindi" },
  { code: "mr", label: "Marathi" },
  { code: "kn", label: "Kannada" },
];

function parseTranslations(value) {
  try {
    return value ? JSON.parse(value) : {};
  } catch {
    return {};
  }
}

// `value` is a JSON string like {"hi":{"message":"..."},"mr":{...},"kn":{...}}.
// `fields` describes which of the item's fields can be translated, e.g.
// [{ name: "message", label: "Message", type: "textarea" }].
export default function TranslationsEditor({ value, onChange, fields }) {
  const [activeLang, setActiveLang] = useState("hi");
  const data = parseTranslations(value);

  const setFieldValue = (lang, fieldName, fieldValue) => {
    const next = { ...data, [lang]: { ...(data[lang] || {}), [fieldName]: fieldValue } };
    onChange(JSON.stringify(next));
  };

  return (
    <div>
      <label className="flex items-center gap-2 text-sm font-medium text-slate-700 mb-2">
        <Languages size={15} /> Translations
      </label>

      <div className="border border-slate-200 rounded-lg p-3 bg-slate-50/50">
        <div className="flex gap-2 mb-3">
          {LANGUAGES.map((lang) => (
            <button
              type="button"
              key={lang.code}
              onClick={() => setActiveLang(lang.code)}
              className={`px-3 py-1 text-xs rounded-full transition ${
                activeLang === lang.code ? "bg-brand text-white" : "bg-white text-slate-600 border border-slate-200"
              }`}
            >
              {lang.label}
            </button>
          ))}
        </div>

        <p className="text-xs text-slate-400 mb-3">
          Leave a field blank to fall back to the English text above for that language.
        </p>

        {fields.map((f) => (
          <div key={f.name} className="mb-2 last:mb-0">
            <label className="block text-xs font-medium text-slate-600 mb-1">{f.label}</label>
            {f.type === "textarea" ? (
              <textarea
                rows={2}
                className="w-full rounded-md border border-slate-300 px-2 py-1.5 text-sm bg-white"
                value={(data[activeLang] && data[activeLang][f.name]) || ""}
                onChange={(e) => setFieldValue(activeLang, f.name, e.target.value)}
              />
            ) : (
              <input
                type="text"
                className="w-full rounded-md border border-slate-300 px-2 py-1.5 text-sm bg-white"
                value={(data[activeLang] && data[activeLang][f.name]) || ""}
                onChange={(e) => setFieldValue(activeLang, f.name, e.target.value)}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
