import { useEffect, useState } from "react";
import { CalendarDays, MapPin, Clock, Video } from "lucide-react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import Navbar from "../../components/home/Navbar";
import Footer from "../../components/home/Footer";
import { fetchEvents } from "../../api/publicApi";
import { useTranslation } from "react-i18next";
import { getTranslated } from "../../utils/translate";

const json = (value) => { if (Array.isArray(value)) return value; try { const parsed = JSON.parse(value || "[]"); return Array.isArray(parsed) ? parsed : []; } catch { return []; } };
export default function Events() {
  const { t, i18n } = useTranslation(); const [events, setEvents] = useState([]);
  useEffect(() => { fetchEvents().then((data) => setEvents(data.map((event) => ({ ...event, name: getTranslated(event, "name", i18n.language), description: getTranslated(event, "description", i18n.language) })))); }, [i18n.language]);
  return <><Navbar /><main className="bg-white min-h-screen py-12"><div className="max-w-6xl mx-auto px-6"><h1 className="text-4xl font-bold text-[#0f2742]">{t("eventsTitle", "Events")}</h1><p className="mt-2 text-slate-500">{t("eventsSubtitle", "Join our upcoming programmes and celebrations.")}</p><div className="mt-10 grid gap-8">{events.map((event) => { const media = [...json(event.posterImages), ...json(event.photos)]; return <article key={event.id} className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-lg"><div className="grid lg:grid-cols-[minmax(280px,0.9fr)_1.1fr]">{media.length ? <Swiper className="h-full min-h-[280px] w-full" spaceBetween={8}>{media.map((src, i) => <SwiperSlide key={i}><img src={src} alt={event.name} className="h-full min-h-[280px] w-full object-cover" /></SwiperSlide>)}</Swiper> : <div className="min-h-[280px] bg-slate-100" />}<div className="p-7"><div className="flex items-start justify-between gap-3"><h2 className="text-3xl font-bold text-[#0f2742]">{event.name}</h2>{event.isNew && <span className="shrink-0 rounded-full bg-rose-500 px-3 py-1 text-xs font-bold text-white">{t("newEvent", "New Event")}</span>}</div><p className="mt-4 whitespace-pre-line leading-7 text-slate-600">{event.description}</p><div className="mt-6 grid gap-3 text-sm text-slate-600 sm:grid-cols-2"><span className="inline-flex gap-2"><CalendarDays size={17} />{event.eventDate || "—"}</span><span className="inline-flex gap-2"><Clock size={17} />{event.eventTime || "—"}</span><span className="inline-flex gap-2"><MapPin size={17} />{event.place || "—"}</span>{event.guestSpeakers && <span>Guest: {event.guestSpeakers}</span>}</div>{json(event.videos).length > 0 && <p className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-[#26AFDE]"><Video size={16} />{json(event.videos).length} videos available</p>}</div></div></article>; })}{events.length === 0 && <p className="py-16 text-center text-slate-400">{t("noEvents", "No events published yet.")}</p>}</div></div></main><Footer /></>;
}
