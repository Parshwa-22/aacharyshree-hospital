import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./doctors.css";
import { useTranslation } from "react-i18next";
import { fetchDoctors } from "../../api/publicApi";
import { getTranslated } from "../../utils/translate";
import AvailabilityBadge from "../doctors/AvailabilityBadge";

// Below this many doctors, the seamless-scroll marquee (which works by
// rendering the list twice back to back) is skipped — with very few
// doctors, doubling them looked like a bug ("I added 1, it shows 2").
// Instead a plain grid is shown until there are enough for the effect
// to actually read as continuous scrolling.
const MARQUEE_MIN_COUNT = 5;

const DoctorsSection = () => {
  const { t, i18n } = useTranslation();
  const [doctors, setDoctors] = useState([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    let cancelled = false;

    fetchDoctors().then((data) => {
      if (cancelled) return;
      setDoctors(data);
      setLoaded(true);
    });

    return () => {
      cancelled = true;
    };
  }, []);

  if (loaded && doctors.length === 0) return null;

  const useMarquee = doctors.length >= MARQUEE_MIN_COUNT;
  const displayList = useMarquee ? [...doctors, ...doctors] : doctors;
  const homeSpecialization = (doc) => {
    const text = getTranslated(doc, "specialization", i18n.language) || "";
    const limit = 58;
    return text.length > limit ? <>{text.slice(0, limit).trimEnd()}… <span className="font-bold text-[#1597C2]">View more</span></> : text;
  };

  const DoctorCard = ({ doc, i }) => (
    <Link to="/doctors" key={`${doc.id ?? doc.name}-${i}`} className="doctor-card block">
      <div className="relative">
        <img src={doc.image} alt={doc.name} className="w-full h-64 object-cover" />
        <div className="name-strip">
          <span>{doc.name}</span>
        </div>
      </div>
      <div className="p-4 text-center">
        <p className="min-h-[2.5rem] break-words text-sm font-semibold text-gray-800">{homeSpecialization(doc)}</p>
        {doc.department && (
          <p className="mt-1 inline-flex rounded-full bg-sky-50 px-2 py-1 text-xs font-semibold text-sky-700">{getTranslated(doc, "department", i18n.language)}</p>
        )}
        {doc.experience && (
          <p className="mt-2 text-xs font-medium text-gray-500">{doc.experience} {doc.experience.toLowerCase().includes("year") ? "" : t("doctorsExperience", "Years Experience")}</p>
        )}
        <div className="mt-2 flex justify-center">
          <AvailabilityBadge doctor={doc} />
        </div>
      </div>
    </Link>
  );

  return (
    <section className="bg-white pt-2 pb-8 mb-0 overflow-hidden">
      <div className="text-center mb-10">
        <h2 className="relative inline-block text-5xl font-extralight text-gray-800 leading-tight">
          <span>
            <span className="text-red-500">{t("doctorsTitleHighlight", "Our ")}</span>
            {t("doctorsTitleRest", "Expert Doctors")}
          </span>
          <span className="absolute left-1/2 -bottom-3 h-[2px] w-32 bg-gradient-to-r from-[#26AFDE] to-[#47C5B9] -translate-x-1/2 rounded-full"></span>
        </h2>
      </div>

      {useMarquee ? (
        <div className="relative overflow-hidden group">
          <div className="scroll-track">
            {displayList.map((doc, i) => (
              <DoctorCard doc={doc} i={i} key={`${doc.id ?? doc.name}-${i}`} />
            ))}
          </div>
        </div>
      ) : (
        <div className="flex flex-wrap justify-center gap-6 px-4">
          {displayList.map((doc, i) => (
            <DoctorCard doc={doc} i={i} key={`${doc.id ?? doc.name}-${i}`} />
          ))}
        </div>
      )}
    </section>
  );
};

export default DoctorsSection;
