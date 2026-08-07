import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import "./hero.css";
import { fetchHeroSlides, fetchSiteSettings } from "../../api/publicApi";
import { getTranslated } from "../../utils/translate";

const FALLBACK_SLIDE = {
  id: "fallback",
  type: "IMAGE",
  image: "/images/hb.jpg",
  animationType: "FADE",
};

const AUTO_ADVANCE_MS = 6000;

const Hero = () => {
  const { i18n } = useTranslation();
  const [slides, setSlides] = useState([FALLBACK_SLIDE]);
  const [siteSettings, setSiteSettings] = useState(null);
  const [index, setIndex] = useState(0);

  useEffect(() => {
    let cancelled = false;

    fetchHeroSlides().then((data) => {
      if (cancelled || data.length === 0) return;
      setSlides(data);
    });

    fetchSiteSettings().then((settings) => {
      if (cancelled || !settings) return;
      setSiteSettings(settings);
    });

    return () => {
      cancelled = true;
    };
  }, []);

  // Auto-advance through slides (only matters once there's more than one).
  useEffect(() => {
    if (slides.length <= 1) return;
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % slides.length);
    }, AUTO_ADVANCE_MS);
    return () => clearInterval(timer);
  }, [slides]);

  useEffect(() => {
    // Clamp index if the slide list shrinks (e.g. one gets deleted/deactivated).
    if (index >= slides.length) setIndex(0);
  }, [slides, index]);

  const slide = slides[index] || slides[0];
  const animClass = slide.animationType === "SLIDE" ? "hero-anim-slide" : "hero-anim-fade";
  const heroTitle = getTranslated(siteSettings, "heroTitle", i18n.language);
  const heroSubtitle = getTranslated(siteSettings, "heroSubtitle", i18n.language);

  return (
    <section className="relative w-full min-h-[70vh] sm:min-h-[80vh] md:min-h-[90vh] overflow-hidden bg-[#0f2742]">
      {/* BACKGROUND MEDIA */}
      <div key={slide.id} className={`absolute inset-0 ${animClass}`}>
        {slide.type === "VIDEO" && slide.videoUrl ? (
          <video
            src={slide.videoUrl}
            poster={slide.thumbnail}
            className="w-full h-full object-cover"
            autoPlay
            loop
            muted
            playsInline
          />
        ) : (
          <img
            src={slide.image || FALLBACK_SLIDE.image}
            alt="Aacharyshree Hospital"
            className="w-full h-full object-cover"
          />
        )}
      </div>

      {/* GRADIENT OVERLAY */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/40 to-black/70"></div>

      {/* SITEWIDE TITLE/SUBTITLE — positioned toward the lower half so it
          never visually collides with the fixed navbar above it. */}
      {(heroTitle || heroSubtitle) && (
        <div className="relative z-10 flex flex-col justify-end items-center text-center h-full px-6 sm:px-10 md:px-20 pb-16 sm:pb-20 md:pb-24">
          <div className="max-w-[900px]">
            {heroTitle && (
              <h1 className="text-white font-extrabold leading-tight text-2xl sm:text-3xl md:text-4xl lg:text-5xl mb-3">
                {heroTitle}
              </h1>
            )}
            {heroSubtitle && (
              <p className="text-gray-200 text-base sm:text-lg md:text-xl">
                {heroSubtitle}
              </p>
            )}
          </div>
        </div>
      )}

      {/* SLIDE DOTS (only shown with more than one slide) */}
      {slides.length > 1 && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-10 flex gap-2">
          {slides.map((s, i) => (
            <button
              key={s.id}
              onClick={() => setIndex(i)}
              aria-label={`Show slide ${i + 1}`}
              className={`h-1.5 rounded-full transition-all ${
                i === index ? "w-6 bg-white" : "w-1.5 bg-white/50"
              }`}
            />
          ))}
        </div>
      )}
    </section>
  );
};

export default Hero;
