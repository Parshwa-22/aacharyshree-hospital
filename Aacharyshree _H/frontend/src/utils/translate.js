/**
 * Reads a translated value for `field` from a backend item's `translations`
 * JSON blob (set via the admin panel's language-tabbed editor), falling
 * back to the item's plain English field whenever:
 *  - the current language is English,
 *  - the item has no translations at all, or
 *  - that specific field was left blank for the current language.
 *
 * `item.translations` is stored as a JSON string like:
 *   {"hi":{"message":"..."},"mr":{...},"kn":{...}}
 */
export function getTranslated(item, field, lang) {
  if (!item) return "";
  const base = item[field];

  if (!lang || lang === "en" || !item.translations) return base;

  try {
    const parsed =
      typeof item.translations === "string" ? JSON.parse(item.translations) : item.translations;
    const value = parsed?.[lang]?.[field];
    return value && value.trim() !== "" ? value : base;
  } catch {
    return base;
  }
}
