import React, { useEffect, useRef, useState } from "react";
import { Volume2, VolumeX, Quote, Star } from "lucide-react";
import { useTranslation } from "react-i18next";
import { fetchTestimonials } from "../../api/publicApi";
import { getTranslated } from "../../utils/translate";

function StarRow({ rating, onDark }) {
  if (!rating) return null;
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((n) => (
        <Star
          key={n}
          size={13}
          className={
            n <= rating
              ? "fill-amber-400 text-amber-400"
              : onDark
              ? "text-white/30"
              : "text-slate-300"
          }
        />
      ))}
    </div>
  );
}


function VideoTestimonial({ item, lang }) {
  const videoRef = useRef(null);
  const [muted, setMuted] = useState(true);

  const toggleMute = () => {
    if (!videoRef.current) return;
    videoRef.current.muted = !videoRef.current.muted;
    setMuted(videoRef.current.muted);
  };

  return (
    <div className="relative w-full aspect-[9/16] max-h-[480px] rounded-2xl overflow-hidden shadow-xl bg-black">
      <video
        ref={videoRef}
        src={item.videoUrl}
        poster={item.thumbnail}
        className="w-full h-full object-cover"
        autoPlay
        loop
        muted
        playsInline
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
      <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between">
        <div>
          <span className="text-white text-sm font-semibold drop-shadow block">{item.patientName || "Patient"}</span>
          <StarRow rating={item.rating} onDark />
          {getTranslated(item, "message", lang) && <p className="mt-1 max-w-[220px] text-xs text-white/90 line-clamp-2">{getTranslated(item, "message", lang)}</p>}
        </div>
        <button
          onClick={toggleMute}
          className="p-2 rounded-full bg-white/20 backdrop-blur-md hover:bg-white/40 transition text-white"
          aria-label={muted ? "Unmute" : "Mute"}
        >
          {muted ? <VolumeX size={16} /> : <Volume2 size={16} />}
        </button>
      </div>
    </div>
  );
}

function ImageTestimonial({ item, lang }) {
  const message = getTranslated(item, "message", lang);
  return (
    <div className="relative w-full aspect-[9/16] max-h-[480px] rounded-2xl overflow-hidden shadow-xl bg-slate-900">
      <img src={item.image} alt={item.patientName || "Patient"} className="w-full h-full object-cover" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
      <div className="absolute bottom-3 left-3 right-3">
        <span className="text-white text-sm font-semibold drop-shadow block mb-1">{item.patientName || "Patient"}</span>
        <div className="mb-1">
          <StarRow rating={item.rating} onDark />
        </div>
        {message && <p className="text-white/90 text-xs line-clamp-3">{message}</p>}
      </div>
    </div>
  );
}

function TextTestimonial({ item, lang }) {
  const message = getTranslated(item, "message", lang);
  return (
    <div className="w-full rounded-2xl shadow-lg bg-white p-6 flex flex-col justify-center min-h-[220px]">
      <Quote className="text-[#26AFDE] mb-3" size={28} />
      <StarRow rating={item.rating} />
      <p className="text-slate-600 text-sm leading-relaxed mb-4 mt-2">{message}</p>
      <span className="text-sm font-semibold text-[#0f2742] mt-auto">— {item.patientName || "Patient"}</span>
    </div>
  );
}

export default function Testimonials() {
  const { t, i18n } = useTranslation();
  const [testimonials, setTestimonials] = useState([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    let cancelled = false;

    fetchTestimonials().then((data) => {
      if (cancelled) return;
      setTestimonials(data);
      setLoaded(true);
    });

    return () => {
      cancelled = true;
    };
  }, []);

  if (loaded && testimonials.length === 0) return null;

  return (
    <section className="bg-[#F8FAFD] py-14 md:py-20">
      <div className="text-center mb-10 px-4">
        <h2 className="relative inline-block text-4xl md:text-5xl font-extralight text-gray-800 leading-tight">
          <span>
            <span className="text-red-500">{t("testimonialsTitleHighlight", "Patient ")}</span>
            {t("testimonialsTitleRest", "Testimonials")}
          </span>
          <span className="absolute left-1/2 -bottom-3 h-[2px] w-32 bg-gradient-to-r from-[#26AFDE] to-[#47C5B9] -translate-x-1/2 rounded-full"></span>
        </h2>
        <p className="mt-6 text-gray-500 max-w-2xl mx-auto text-sm md:text-base">
          {t("testimonialsSubtitle", "Videos play muted by default — tap the sound icon on any card to listen.")}
        </p>
      </div>

      <div className="max-w-6xl mx-auto px-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {testimonials.map((item) => {
          if (item.type === "VIDEO" && item.videoUrl) return <VideoTestimonial key={item.id} item={item} lang={i18n.language} />;
          if (item.type === "IMAGE" && item.image) return <ImageTestimonial key={item.id} item={item} lang={i18n.language} />;
          return <TextTestimonial key={item.id} item={item} lang={i18n.language} />;
        })}
      </div>
    </section>
  );
}
