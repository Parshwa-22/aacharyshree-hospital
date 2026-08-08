import { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import Navbar from "../../components/home/Navbar";
import Footer from "../../components/home/Footer";
import { fetchGallery } from "../../api/publicApi";
import { useTranslation } from "react-i18next";
import { getTranslated } from "../../utils/translate";
const json = (value) => { try { const parsed = JSON.parse(value || "[]"); return Array.isArray(parsed) ? parsed : []; } catch { return []; } };
export default function Gallery() { const { t, i18n } = useTranslation(); const [sections, setSections] = useState([]); useEffect(() => { fetchGallery().then((data) => setSections(data.map((section) => ({ ...section, title: getTranslated(section, "title", i18n.language) })))); }, [i18n.language]); return <><Navbar /><main className="min-h-screen bg-[#F8FAFD] py-12"><div className="mx-auto max-w-7xl px-6"><h1 className="text-4xl font-bold text-[#0f2742]">{t("galleryTitle", "Photo Gallery")}</h1><div className="mt-10 grid gap-10">{sections.map((section) => <section key={section.id}><h2 className="mb-4 text-2xl font-semibold text-[#0f2742]">{section.title}</h2><Swiper spaceBetween={18} slidesPerView={1.2} breakpoints={{640:{slidesPerView:2.2},1024:{slidesPerView:3.2}}}>{json(section.photos).map((src, i) => <SwiperSlide key={i}><img src={src} alt={section.title} className="h-64 w-full rounded-2xl object-cover shadow" /></SwiperSlide>)}</Swiper></section>)}{sections.length === 0 && <p className="py-16 text-center text-slate-400">{t("noGallery", "No gallery sections published yet.")}</p>}</div></div></main><Footer /></>; }
