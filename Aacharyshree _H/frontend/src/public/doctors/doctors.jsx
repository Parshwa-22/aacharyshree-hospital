import React, { useEffect, useState } from "react";
import Accessibility from "../../shared/components/accessibility/AccessibilityButton";
import Navbar from "../../components/home/Navbar";
import Footer from "../../components/home/Footer";
import { fetchDoctors, fetchContactSettings } from "../../api/publicApi";
import { formatAvailableDays } from "../../utils/formatDays";
import { getTranslated } from "../../utils/translate";
import { useTranslation } from "react-i18next";
import AvailabilityBadge from "../../components/doctors/AvailabilityBadge";
import SpecializationText from "../../components/doctors/SpecializationText";
import { formatMonthlyDays } from "../../utils/doctorAvailability";
import AvailabilityDetails from "../../components/doctors/AvailabilityDetails";

function formatTime12h(hhmm) {
  if (!hhmm) return "";
  const [h, m] = hhmm.split(":").map(Number);
  if (Number.isNaN(h)) return hhmm;
  const period = h >= 12 ? "PM" : "AM";
  const hour12 = h % 12 === 0 ? 12 : h % 12;
  return `${hour12}:${String(m).padStart(2, "0")} ${period}`;
}

const DoctorsPage = ({ doctors }) => {
  const { i18n } = useTranslation();
  const [search, setSearch] = useState("");
  const [apiDoctors, setApiDoctors] = useState(null);
  const [appointmentPhone, setAppointmentPhone] = useState("");

  useEffect(() => {
    let cancelled = false;

    fetchContactSettings().then((settings) => {
      if (cancelled || !settings) return;
      setAppointmentPhone(settings.appointmentPhone || "");
    });

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    let cancelled = false;

    fetchDoctors().then((data) => {
      if (cancelled || data.length === 0) return;
      // Backend field names -> what this page's cards expect.
      setApiDoctors(
        data.map((doc) => ({
          name: doc.name,
          image: doc.image,
          specialization: doc.specialization,
          qualification: doc.qualification,
          department: doc.department || "General Medicine",
          experience: doc.experience,
          availableDays: doc.availableDays,
          availableDaysOfMonth: doc.availableDaysOfMonth,
          startTime: doc.startTime,
          endTime: doc.endTime,
          availabilityType: doc.availabilityType,
          translations: doc.translations,
        }))
      );
    });

    return () => {
      cancelled = true;
    };
  }, []);

  // ✅ Use an explicitly passed prop if given, otherwise live backend data only —
  // no static demo doctors anymore.
  const data = (doctors && doctors.length) ? doctors : (apiDoctors || []);

  // 🔍 Filter
  const filteredDoctors = data.filter((doc) =>
    doc.name.toLowerCase().includes(search.toLowerCase())
  );

  // 📦 Group by department
  const groupedDoctors = filteredDoctors.reduce((acc, doc) => {
    if (!acc[doc.department]) acc[doc.department] = [];
    acc[doc.department].push(doc);
    return acc;
  }, {});

  const scheduleText = (doc) => {
    const datesOrDays = doc.availabilityType === "MONTHLY_DAYS" ? formatMonthlyDays(doc.availableDaysOfMonth) : formatAvailableDays(doc.availableDays);
    return datesOrDays;
  };

  return (
    <>
      <Navbar />

      {/* ❌ removed pb-16 → NO GAP */}
      <section className="relative pt-0 px-6 md:px-12 bg-gradient-to-br from-white via-[#f8fcff] to-[#eef9ff] overflow-hidden">

        {/* 🔷 TITLE */}
        <div className="text-center mb-8">
          <h2 className="text-3xl md:text-4xl font-light text-[#0f2742] inline-block relative">
            <span className="text-red-500 font-normal">Our </span>
            <span className="italic tracking-wide">Doctors</span>
            <div className="h-[3px] w-16 bg-gradient-to-r from-[#00c6ff] to-[#00d9a5] mt-2 mx-auto rounded-full"></div>
          </h2>
        </div>

        {/* 🔍 SEARCH */}
        <div className="max-w-xl mx-auto mb-10 relative">
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search Doctor"
            className="w-full pl-12 pr-4 py-3 rounded-full bg-white/80 backdrop-blur-md border border-gray-200 shadow-sm
            focus:outline-none focus:ring-2 focus:ring-[#0f2742]"
          />
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
            🔍
          </span>
        </div>

        {/* 👨‍⚕️ DEPARTMENTS */}
        {Object.keys(groupedDoctors).length === 0 && (
          <p className="text-center text-slate-400 text-sm border border-dashed border-slate-200 rounded-lg py-14 max-w-xl mx-auto">
            Doctor profiles will appear here once added in the admin panel.
          </p>
        )}
        {Object.keys(groupedDoctors).map((dept) => (
          <div key={dept} className="mb-12">

            {/* Heading — translated using the first doctor in this group */}
            <h3 className="text-2xl font-light text-[#0f2742] mb-6 text-center">
              <span className="italic tracking-wide">
                {getTranslated(groupedDoctors[dept][0], "department", i18n.language) || dept}
              </span>
              <div className="h-[3px] w-12 bg-gradient-to-r from-[#00c6ff] to-[#00d9a5] mt-2 mx-auto rounded-full"></div>
            </h3>

            {/* Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 items-stretch">
              {groupedDoctors[dept].map((doc, i) => (
                <div
                  key={i}
                  className="min-w-0 h-full bg-white rounded-2xl shadow-md hover:shadow-xl transition duration-300 overflow-hidden group flex flex-col"
                >

                  {/* IMAGE */}
                  <div className="relative aspect-[4/3] w-full overflow-hidden bg-gray-50">
                    <img
                      src={doc.image}
                      alt={doc.name}
                      className="block h-full w-full object-contain object-center"
                    />

                    {/* NAME STRIP */}
                    <div className="absolute bottom-0 left-0 w-full">
                      <div className="bg-gradient-to-r from-[#00c6ff] to-[#00d9a5] text-white text-center py-2 text-sm font-medium rounded-t-[40px] shadow-md">
                        {doc.name}
                      </div>
                    </div>
                  </div>

                  {/* DETAILS */}
                  <div className="flex flex-1 flex-col p-4 text-center">
                    <SpecializationText className="min-h-[2.5rem] text-gray-800">{getTranslated(doc, "specialization", i18n.language)}</SpecializationText>

                    <div className="mt-2 flex flex-wrap justify-center gap-1.5">
                      {getTranslated(doc, "department", i18n.language) && <span className="rounded-full bg-sky-50 px-2 py-1 text-[11px] font-semibold text-sky-700">{getTranslated(doc, "department", i18n.language)}</span>}
                      {doc.qualification && <span className="rounded-full bg-violet-50 px-2 py-1 text-[11px] font-semibold text-violet-700">{doc.qualification}</span>}
                    </div>
                    {doc.experience && <p className="mt-2 text-xs font-medium text-slate-500">{doc.experience} {doc.experience.toLowerCase().includes("year") ? "" : "years experience"}</p>}

                    <div className="mt-2 flex justify-center">
                      <AvailabilityBadge doctor={doc} />
                    </div>

                    <AvailabilityDetails doctor={doc} />

                    {false && (doc.availableDays || doc.availableDaysOfMonth || (doc.startTime && doc.endTime)) && (
                      <p className="mt-1 min-h-[1rem] break-words text-xs text-gray-400">
                        <span className="font-semibold text-slate-600">{doc.availabilityType === "MONTHLY_DAYS" ? "Monthly visit: " : "Consultation: "}</span>{scheduleText(doc)}
                        {doc.startTime && doc.endTime
                          ? ` · ${formatTime12h(doc.startTime)}–${formatTime12h(doc.endTime)}`
                          : ""}
                      </p>
                    )}

                    {/* BUTTON — click-to-call, using the number set in the admin panel */}
                    {appointmentPhone ? (
                      <a
                        href={`tel:${appointmentPhone}`}
                        className="mt-4 inline-block px-5 py-2 text-sm rounded-full bg-gradient-to-r from-[#0f2742] to-[#1e4d6b] text-white shadow-md hover:shadow-lg hover:scale-105 transition"
                      >
                        Book Appointment
                      </a>
                    ) : (
                      <button className="mt-4 px-5 py-2 text-sm rounded-full bg-gradient-to-r from-[#0f2742] to-[#1e4d6b] text-white shadow-md hover:shadow-lg hover:scale-105 transition">
                        Book Appointment
                      </button>
                    )}
                  </div>

                </div>
              ))}
            </div>
          </div>
        ))}

      </section>

      <Footer />

      <Accessibility />
    </>
  );
};

export default DoctorsPage;
