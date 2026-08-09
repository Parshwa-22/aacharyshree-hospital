import { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import Navbar from "../../components/home/Navbar";
import Footer from "../../components/home/Footer";
import { fetchGallery } from "../../api/publicApi";
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

const mediaUrl = (value) => value && value.startsWith("/")
  ? `${import.meta.env.VITE_API_BASE_URL || ""}${value}`
  : value;

export default function Gallery() {
  const { t, i18n } = useTranslation();
  const [sections, setSections] = useState([]);

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
            <div className="grid gap-4 sm:hidden">
              {json(section.photos).map((src, i) => <img key={i} src={mediaUrl(src)} alt={section.title} className="block h-52 w-full rounded-2xl object-cover shadow" />)}
            </div>
            <Swiper className="hidden sm:block" spaceBetween={18} slidesPerView={2.2} breakpoints={{ 1024: { slidesPerView: 3.2 } }}>
              {json(section.photos).map((src, i) => <SwiperSlide key={i}>
                <img src={mediaUrl(src)} alt={section.title} className="h-64 w-full rounded-2xl object-cover shadow" />
              </SwiperSlide>)}
            </Swiper>
          </section>)}
          {sections.length === 0 && <p className="py-16 text-center text-slate-400">{t("noGallery", "No gallery sections published yet.")}</p>}
        </div>
      </div>
    </main>
    <Footer />
  </>;
}
