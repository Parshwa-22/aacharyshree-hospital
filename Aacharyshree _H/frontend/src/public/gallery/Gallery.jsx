import { useEffect, useState } from "react";
import Navbar from "../../components/home/Navbar";
import Footer from "../../components/home/Footer";
import { fetchGallery } from "../../api/publicApi";
import { useTranslation } from "react-i18next";
import { getTranslated } from "../../utils/translate";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";

const json = (value) => {
  if (Array.isArray(value)) return value;
  try {
    const parsed = JSON.parse(value || "[]");
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};

const mediaUrl = (value) => value && value.startsWith("/")
  ? `${import.meta.env.VITE_API_BASE_URL || ""}${value}`
  : typeof value === "string" ? value.trim() : "";

const galleryUrl = (value) => {
  const url = mediaUrl(value);
  return url.includes("res.cloudinary.com") && url.includes("/image/upload/")
    ? url.replace("/image/upload/", "/image/upload/f_jpg,q_82,w_1200/")
    : url;
};

function GalleryPhoto({ src, title, className = "" }) {
  const url = galleryUrl(src);
  return (
    <div className={`relative w-full overflow-hidden rounded-2xl bg-slate-100 ${className}`}>
      <img
        src={url}
        alt={title}
        loading="eager"
        fetchPriority="high"
        decoding="sync"
        className="gallery-photo !visible !block h-full w-full object-cover object-center shadow"
      />
    </div>
  );
}

export default function Gallery() {
  const { t, i18n } = useTranslation();
  const [sections, setSections] = useState([]);
  const [isMobile, setIsMobile] = useState(() => typeof window !== "undefined" && window.matchMedia("(max-width: 767px)").matches);

  useEffect(() => {
    const query = window.matchMedia("(max-width: 767px)");
    const update = () => setIsMobile(query.matches);
    update();
    query.addEventListener?.("change", update);
    return () => query.removeEventListener?.("change", update);
  }, []);

  useEffect(() => {
    fetchGallery().then((data) => setSections(data.map((section) => ({
      ...section,
      title: getTranslated(section, "title", i18n.language),
    }))));
  }, [i18n.language]);

  return <>
    <Navbar />
    <main className="min-h-screen bg-[#F8FAFD] py-8 sm:py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <h1 className="text-3xl font-bold text-[#0f2742] sm:text-4xl">{t("galleryTitle", "Photo Gallery")}</h1>
        <div className="mt-7 grid gap-8 sm:mt-10 sm:gap-10">
          {sections.map((section) => <section key={section.id}>
            <h2 className="mb-4 text-xl font-semibold text-[#0f2742] sm:text-2xl">{section.title}</h2>
            {isMobile ? (
              <div className="flex w-full snap-x snap-mandatory gap-4 overflow-x-auto overscroll-x-contain pb-2 [scrollbar-width:thin]">
                {json(section.photos).map((src, i) => <div key={i} className="h-[min(70vw,22rem)] w-full min-w-full shrink-0 snap-center"><GalleryPhoto src={src} title={section.title} className="h-full" /></div>)}
              </div>
            ) : (
              <Swiper className="w-full" spaceBetween={18} slidesPerView={2.2} breakpoints={{ 1024: { slidesPerView: 3.2 } }}>
                {json(section.photos).map((src, i) => <SwiperSlide key={i}><GalleryPhoto src={src} title={section.title} className="h-64" /></SwiperSlide>)}
              </Swiper>
            )}
          </section>)}
          {sections.length === 0 && <p className="py-16 text-center text-slate-400">{t("noGallery", "No gallery sections published yet.")}</p>}
        </div>
      </div>
    </main>
    <Footer />
  </>;
}
