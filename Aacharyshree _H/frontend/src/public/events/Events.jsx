import { useEffect, useState } from "react";
import { CalendarDays, MapPin, Clock, Video } from "lucide-react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import Navbar from "../../components/home/Navbar";
import Footer from "../../components/home/Footer";
import { fetchEvents } from "../../api/publicApi";
import { useTranslation } from "react-i18next";
import { getTranslated } from "../../utils/translate";

const json = (value) => {
  if (Array.isArray(value)) return value;
  try {
    const parsed = JSON.parse(value || "[]");
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};

const uniqueMedia = (values) => [...new Map(values.filter((src) => typeof src === "string" && src.trim()).map((src) => [src.trim(), src.trim()])).values()];

export default function Events() {
  const { t, i18n } = useTranslation();
  const [events, setEvents] = useState([]);
  const [isMobile, setIsMobile] = useState(() => typeof window !== "undefined" && window.matchMedia("(max-width: 767px)").matches);

  useEffect(() => {
    const query = window.matchMedia("(max-width: 767px)");
    const update = () => setIsMobile(query.matches);
    update();
    query.addEventListener?.("change", update);
    return () => query.removeEventListener?.("change", update);
  }, []);

  useEffect(() => {
    fetchEvents().then((data) => setEvents(data.map((event) => ({
      ...event,
      name: getTranslated(event, "name", i18n.language),
      description: getTranslated(event, "description", i18n.language),
    }))));
  }, [i18n.language]);

  return <>
    <Navbar />
    <main className="min-h-screen bg-white py-8 sm:py-12">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <h1 className="text-3xl font-bold text-[#0f2742] sm:text-4xl">{t("eventsTitle", "Events")}</h1>
        <p className="mt-2 text-slate-500">{t("eventsSubtitle", "Join our upcoming programmes and celebrations.")}</p>

        <div className="mt-7 grid gap-5 sm:mt-10 sm:gap-8">
          {events.map((event) => {
            // Admin can store the same upload in both posterImages and photos;
            // dedupe by URL so mobile never renders the same image twice.
            const media = uniqueMedia([...json(event.posterImages), ...json(event.photos)]);
            return <article key={event.id} className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-lg sm:rounded-3xl">
              <div className="grid lg:grid-cols-[minmax(280px,0.9fr)_1.1fr]">
                {media.length ? <div className="relative w-full overflow-hidden bg-slate-100">
                  {isMobile ? (
                    <Swiper modules={[Autoplay, Pagination]} slidesPerView={1} centeredSlides={false} loop={media.length > 1} autoplay={{ delay: 3200, disableOnInteraction: false }} pagination={{ clickable: true }} className="event-swiper h-[230px] w-full [&_.swiper-wrapper]:h-full [&_.swiper-slide]:h-full" spaceBetween={0}>
                      {media.map((src, i) => <SwiperSlide key={i}><img src={src} alt={event.name} className="block h-full w-full object-cover object-center" /></SwiperSlide>)}
                    </Swiper>
                  ) : (
                    <Swiper modules={[Autoplay, Pagination]} slidesPerView={1} centeredSlides={false} loop={media.length > 1} autoplay={{ delay: 3600, disableOnInteraction: false }} pagination={{ clickable: true }} className="event-swiper h-[300px] w-full lg:h-full lg:min-h-[280px] [&_.swiper-wrapper]:h-full [&_.swiper-slide]:h-full" spaceBetween={0}>
                      {media.map((src, i) => <SwiperSlide key={i}>
                        <img src={src} alt={event.name} className="h-full w-full object-cover object-center" />
                      </SwiperSlide>)}
                    </Swiper>
                  )}
                  {media.length > 1 && <span className="pointer-events-none absolute bottom-3 left-1/2 z-10 hidden -translate-x-1/2 rounded-full bg-black/65 px-3 py-1 text-xs font-semibold text-white sm:inline-flex">{t("swipePhotos", "Swipe photos")}</span>}
                </div> : <div className="h-[230px] bg-slate-100 sm:h-[300px] lg:h-auto lg:min-h-[280px]" />}

                <div className="p-4 sm:p-7">
                  <div className="flex items-start justify-between gap-3">
                    <h2 className="text-2xl font-bold text-[#0f2742] sm:text-3xl">{event.name}</h2>
                    {event.isNew && <span className="shrink-0 rounded-full bg-rose-500 px-3 py-1 text-xs font-bold text-white">{t("newEvent", "New Event")}</span>}
                  </div>
                  <p className="mt-4 whitespace-pre-line leading-7 text-slate-600">{event.description}</p>
                  <div className="mt-6 grid gap-3 text-sm text-slate-600 sm:grid-cols-2">
                    <span className="inline-flex gap-2"><CalendarDays size={17} />{event.eventDate || "-"}</span>
                    <span className="inline-flex gap-2"><Clock size={17} />{event.eventTime || "-"}</span>
                    <span className="inline-flex gap-2"><MapPin size={17} />{event.place || "-"}</span>
                    {event.guestSpeakers && <span>Guest: {event.guestSpeakers}</span>}
                  </div>
                  {json(event.videos).length > 0 && <p className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-[#26AFDE]"><Video size={16} />{json(event.videos).length} videos available</p>}
                </div>
              </div>
            </article>;
          })}
          {events.length === 0 && <p className="py-16 text-center text-slate-400">{t("noEvents", "No events published yet.")}</p>}
        </div>
      </div>
    </main>
    <Footer />
  </>;
}
