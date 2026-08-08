import { useEffect, useMemo, useState } from "react";
import { MapPin, Navigation, Route, Clock3 } from "lucide-react";
import { useTranslation } from "react-i18next";
import Navbar from "../../components/home/Navbar";
import Footer from "../../components/home/Footer";
import Accessibility from "../../shared/components/accessibility/AccessibilityButton";
import { fetchMonks } from "../../api/publicApi";

function parseHistory(value) {
  try { return Array.isArray(value) ? value : JSON.parse(value || "[]"); } catch { return []; }
}

function mapUrl(monk) {
  if (monk.latitude == null || monk.longitude == null) return "";
  return `https://www.google.com/maps/search/?api=1&query=${monk.latitude},${monk.longitude}`;
}

function embedUrl(monk) {
  if (monk.latitude == null || monk.longitude == null) return "";
  return `https://www.google.com/maps?q=${monk.latitude},${monk.longitude}&z=16&output=embed`;
}

export default function Monks() {
  const { t } = useTranslation();
  const [monks, setMonks] = useState([]);
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    let cancelled = false;
    fetchMonks().then(async (items) => {
      const enriched = await Promise.all(items.map(async (monk) => {
        if (monk.locationLabel || monk.latitude == null || monk.longitude == null) return monk;
        try {
          const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${monk.latitude}&lon=${monk.longitude}`, { headers: { Accept: "application/json" } });
          const data = await response.json();
          return { ...monk, locationLabel: data.display_name || "Current location" };
        } catch { return monk; }
      }));
      if (!cancelled) setMonks(enriched);
    });
    return () => { cancelled = true; };
  }, []);
  const active = selected || monks[0];
  const history = useMemo(() => (active?.locationHistory?.length ? active.locationHistory : parseHistory(active?.locationUpdates)), [active]);

  return <>
    <Navbar />
    <main className="min-h-screen bg-[#F8FAFD] px-4 py-10 sm:px-6">
      <div className="mx-auto max-w-7xl">
        <header className="mb-8 text-center">
          <p className="text-sm font-semibold uppercase tracking-[.2em] text-[#26AFDE]">Vihar tracking</p>
          <h1 className="mt-2 text-3xl font-bold text-[#0f2742] sm:text-5xl">{t("monksTitle", "Monk Live Locations")}</h1>
          <p className="mx-auto mt-3 max-w-2xl text-slate-500">{t("monksSubtitle", "Follow current locations and the recorded travel path of each Acharya group.")}</p>
        </header>
        {!monks.length ? <p className="rounded-2xl border border-dashed border-slate-300 bg-white p-16 text-center text-slate-500">No monk locations published yet.</p> : <>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {monks.map((monk) => <button key={monk.id} onClick={() => setSelected(monk)} className={`min-w-0 rounded-2xl border bg-white p-4 text-left shadow-sm transition hover:-translate-y-1 hover:shadow-lg ${active?.id === monk.id ? "border-[#26AFDE] ring-2 ring-[#26AFDE]/20" : "border-slate-200"}`}>
              <div className="flex items-center gap-3"><div className="h-16 w-16 shrink-0 overflow-hidden rounded-xl bg-[#E8F8FC]">{(monk.photo || monk.image) ? <img src={monk.photo || monk.image} alt={monk.name} className="h-full w-full object-cover" /> : <MapPin className="m-5 text-[#26AFDE]" />}</div><div className="min-w-0"><h2 className="truncate font-bold text-[#0f2742]">{monk.name}</h2>{monk.groupName && <p className="truncate text-sm text-slate-500">{monk.groupName}</p>}<p className="mt-1 text-xs text-[#1597C2]">{monk.locationLabel || "Location available"}</p></div></div>
            </button>)}
          </div>
          {active && <section className="mt-8 overflow-hidden rounded-3xl bg-white shadow-xl">
            <div className="grid lg:grid-cols-[1.1fr_.9fr]">
              <div className="min-h-[360px] bg-slate-100">{embedUrl(active) ? <iframe title={`${active.name} current location`} src={embedUrl(active)} className="h-full min-h-[360px] w-full border-0" loading="lazy" /> : <div className="flex min-h-[360px] items-center justify-center p-8 text-center text-slate-500">Location link is awaiting coordinates.</div>}</div>
              <div className="p-6 sm:p-8"><div className="flex items-start justify-between gap-4"><div><h2 className="text-2xl font-bold text-[#0f2742]">{active.name}</h2>{active.travelReason && <p className="mt-2 text-slate-600">{active.travelReason}</p>}</div>{mapUrl(active) && <a href={mapUrl(active)} target="_blank" rel="noreferrer" className="rounded-full bg-[#26AFDE] p-3 text-white" aria-label="Open directions"><Navigation size={18} /></a>}</div><div className="mt-6 flex items-center gap-2 text-sm text-slate-500"><Route size={17} className="text-[#26AFDE]" /> Travel history ({history.length} updates)</div>
                <div className="relative mt-5 grid gap-5 sm:grid-cols-2 before:absolute before:left-1/2 before:top-4 before:h-[calc(100%-2rem)] before:w-1 before:-translate-x-1/2 before:rounded-full before:bg-gradient-to-b before:from-[#47C5B9] before:to-[#26AFDE] max-sm:before:left-3 max-sm:before:translate-x-0">{history.slice().reverse().map((point, index) => { const current = index === 0; const time = point.recordedAt || point.timestamp; const label = point.locationLabel || point.label || "Recorded location"; return <div key={`${time}-${index}`} className={`relative z-10 rounded-2xl border p-4 shadow-sm ${current ? "border-[#26AFDE] bg-[#E8F8FC]" : "border-slate-100 bg-[#F8FAFD]"} ${index % 2 ? "sm:translate-y-8" : ""} max-sm:ml-7`}><span className={`absolute top-5 h-4 w-4 rounded-full border-4 border-white ${current ? "bg-[#26AFDE]" : "bg-[#47C5B9]"} sm:-left-[29px] max-sm:-left-[29px]`} /><div className="flex items-start justify-between gap-2"><p className="font-semibold text-[#0f2742]">{label}</p>{current && <span className="rounded-full bg-[#26AFDE] px-2 py-1 text-[10px] font-bold text-white">CURRENT</span>}</div>{point.photo && <img src={point.photo} alt={label} className="mt-3 h-28 w-full rounded-lg object-cover" />}<p className="mt-2 flex items-center gap-1 text-xs text-slate-500"><Clock3 size={13} />{time ? new Date(time).toLocaleString() : ""}</p>{point.travelReason && <p className="mt-2 text-sm text-slate-600">{point.travelReason}</p>}<p className="mt-1 text-xs text-slate-400">{point.latitude}, {point.longitude}</p><a className="mt-2 inline-block text-xs font-semibold text-[#1597C2]" href={`https://www.google.com/maps/search/?api=1&query=${point.latitude},${point.longitude}`} target="_blank" rel="noreferrer">View on Google Maps</a></div>; })}</div>
              </div>
            </div>
          </section>}
        </>}
      </div>
    </main><Footer /><Accessibility />
  </>;
}
