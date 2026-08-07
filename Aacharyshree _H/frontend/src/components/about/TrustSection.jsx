import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { CheckCircle2, Landmark } from "lucide-react";
import apiClient from "../../api/client";
import { getTranslated } from "../../utils/translate";

export default function TrustSection() {
  const { i18n } = useTranslation();
  const [trust, setTrust] = useState(null);

  useEffect(() => {
    let cancelled = false;

    apiClient
      .get("/api/trust-info")
      .then(({ data }) => {
        if (!cancelled) setTrust(data);
      })
      .catch(() => {
        // No backend / not configured yet — section simply doesn't render.
      });

    return () => {
      cancelled = true;
    };
  }, []);

  if (!trust || !trust.name) return null;

  const name = getTranslated(trust, "name", i18n.language);
  const description = getTranslated(trust, "description", i18n.language);
  const achievementsRaw = getTranslated(trust, "achievements", i18n.language);
  const achievements = (achievementsRaw || "")
    .split(",")
    .map((a) => a.trim())
    .filter(Boolean);

  return (
    <section className="bg-[#F8FAFD] py-14 md:py-20">
      <div className="max-w-6xl mx-auto px-6">
        <div className="grid md:grid-cols-2 gap-10 items-center">
          <div className={trust.image ? "" : "md:col-span-2"}>
            <div className="inline-flex items-center gap-2 text-[#26AFDE] font-semibold text-sm mb-3">
              <Landmark size={18} />
              Our Trust
            </div>

            <h2 className="text-3xl md:text-4xl font-extralight text-gray-800 mb-2">
              {name}
            </h2>

            {trust.establishedYear && (
              <p className="text-sm text-slate-500 mb-4">Established {trust.establishedYear}</p>
            )}

            {description && (
              <p className="text-slate-600 leading-relaxed whitespace-pre-line mb-6">
                {description}
              </p>
            )}

            {achievements.length > 0 && (
              <div className="grid sm:grid-cols-2 gap-3">
                {achievements.map((item, i) => (
                  <div key={i} className="flex items-start gap-2 bg-white rounded-lg px-3 py-2.5 shadow-sm">
                    <CheckCircle2 className="text-[#26AFDE] mt-0.5 flex-shrink-0" size={16} />
                    <span className="text-sm text-slate-700">{item}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {trust.image && (
            <div className="rounded-2xl overflow-hidden shadow-xl">
              <img src={trust.image} alt={name} className="w-full h-full object-cover" />
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
