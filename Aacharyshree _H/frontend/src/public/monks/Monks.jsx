import { useEffect, useState } from "react";
import { MapPin, ExternalLink } from "lucide-react";
import { fetchMonks } from "../../api/publicApi";
import { useTranslation } from "react-i18next";

export default function Monks() {
  const { t } = useTranslation();
  const [monks, setMonks] = useState([]);
  useEffect(() => { fetchMonks().then(setMonks); }, []);
  return <main className="min-h-screen px-4 py-12 max-w-6xl mx-auto">
    <h1 className="text-3xl font-bold text-[#0f2742] mb-2">{t("monksTitle", "Monk Live Locations")}</h1>
    <p className="text-slate-600 mb-8">{t("monksSubtitle", "Find the current vihar location of our Acharyas and groups.")}</p>
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {monks.map((monk) => <article key={monk.id} className="min-h-[220px] rounded-2xl bg-white border border-slate-200 p-6 shadow-sm flex flex-col">
        <h2 className="text-xl font-semibold text-[#0f2742]">{monk.name}</h2>
        <p className="mt-3 flex items-start gap-2 text-slate-600"><MapPin size={18} className="mt-0.5 shrink-0 text-[#26AFDE]" />{monk.locationLabel || t("locationUpdating", "Location being updated")}</p>
        {monk.latitude != null && monk.longitude != null && <a className="mt-auto pt-5 inline-flex items-center gap-2 text-[#0f2742] font-semibold" target="_blank" rel="noreferrer" href={`https://www.google.com/maps?q=${monk.latitude},${monk.longitude}`}>{t("viewOnMap", "View on Google Maps")} <ExternalLink size={16} /></a>}
      </article>)}
      {!monks.length && <p className="text-slate-500">{t("noLocations", "No active locations have been published yet.")}</p>}
    </div>
  </main>;
}
