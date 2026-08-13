import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { CheckCircle2, ArrowLeft, Loader2 } from "lucide-react";
import Navbar from "../../components/home/Navbar";
import Footer from "../../components/home/Footer";
import Accessibility from "../../shared/components/accessibility/AccessibilityButton";
import apiClient from "../../api/client";
import { getTranslated } from "../../utils/translate";
import { useTranslation } from "react-i18next";
import { fetchDoctors, fetchContactSettings } from "../../api/publicApi";
import AvailabilityBadge from "../../components/doctors/AvailabilityBadge";
import SpecializationText from "../../components/doctors/SpecializationText";
import { formatSpecificDates, formatTimeRange } from "../../utils/doctorAvailability";
import { formatAvailableDays } from "../../utils/formatDays";

export default function DepartmentDetail() {
  const { slug } = useParams();
  const { i18n } = useTranslation();
  const [department, setDepartment] = useState(null);
  const [doctors, setDoctors] = useState([]);
  const [appointmentPhone, setAppointmentPhone] = useState("");
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setNotFound(false);

    apiClient
      .get(`/api/departments/slug/${slug}`)
      .then(({ data }) => {
        if (cancelled) return;
        setDepartment(data);
      })
      .catch(() => {
        if (!cancelled) setNotFound(true);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    fetchContactSettings().then((settings) => {
      if (cancelled || !settings) return;
      setAppointmentPhone(settings.appointmentPhone || "");
    });

    return () => {
      cancelled = true;
    };
  }, [slug]);

  // Once we know the department, pull every doctor whose `department`
  // field matches it (same free-text value the admin panel's dropdown
  // sets on both sides), so this page always reflects live doctor data.
  useEffect(() => {
    if (!department?.title) return;
    let cancelled = false;

    fetchDoctors().then((data) => {
      if (cancelled) return;
      const match = data.filter(
        (doc) => (doc.department || "").trim().toLowerCase() === department.title.trim().toLowerCase()
      );
      setDoctors(match);
    });

    return () => {
      cancelled = true;
    };
  }, [department]);

  if (loading) {
    return (
      <>
        <Navbar />
        <main className="pt-32 pb-24 text-center min-h-[50vh] flex items-center justify-center">
          <Loader2 className="animate-spin text-slate-400" size={28} />
        </main>
        <Footer />
      </>
    );
  }

  if (notFound || !department) {
    return (
      <>
        <Navbar />
        <main className="pt-24 pb-24 text-center min-h-[50vh]">
          <h1 className="text-2xl font-semibold text-slate-700">Department not found</h1>
          <Link to="/" className="text-[#26AFDE] underline mt-4 inline-block">
            Back to Home
          </Link>
        </main>
        <Footer />
      </>
    );
  }

  const deptTitle = getTranslated(department, "title", i18n.language);
  const deptDescription = getTranslated(department, "description", i18n.language);
  const services = (getTranslated(department, "services", i18n.language) || "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
  const scheduleText = (doc) => {
    const datesOrDays = doc.availabilityType === "SPECIFIC_DATES" ? formatSpecificDates(doc.availableDates) : formatAvailableDays(doc.availableDays);
    return [datesOrDays, formatTimeRange(doc.startTime, doc.endTime)].filter(Boolean).join(" · ");
  };

  return (
    <>
      <Navbar />

      <main className="bg-white">
        <section className="relative h-[300px] w-full overflow-hidden bg-[#0f2742] md:h-[420px] flex items-end">
          <img
            src={department.image}
            alt={deptTitle}
            className="absolute inset-0 h-full w-full object-contain object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-black/10" />

          <div className="relative z-10 max-w-5xl mx-auto w-full px-6 pb-8">
            <Link to="/" className="inline-flex items-center gap-2 text-white/80 hover:text-white text-sm mb-3">
              <ArrowLeft size={16} /> Back to Home
            </Link>
            <h1 className="text-3xl md:text-5xl font-bold text-white">{deptTitle}</h1>
          </div>
        </section>

        <section className="max-w-5xl mx-auto px-6 py-14">
          {deptDescription && (
            <p className="text-lg text-slate-600 leading-relaxed max-w-3xl">{deptDescription}</p>
          )}

          {services.length > 0 && (
            <>
              <h2 id="services" className="mt-10 text-2xl font-semibold text-[#0f2742]">
                Services under {deptTitle}
              </h2>
              <div className="mt-6 grid sm:grid-cols-2 gap-4">
                {services.map((service) => (
                  <div key={service} className="flex items-center gap-3 p-4 rounded-xl bg-[#F8FAFD] border border-slate-100">
                    <CheckCircle2 className="text-[#26AFDE]" size={20} />
                    <span className="text-slate-700 font-medium">{service}</span>
                  </div>
                ))}
              </div>
            </>
          )}

          {doctors.length > 0 && (
            <>
              <h2 className="mt-14 text-2xl font-semibold text-[#0f2742]">
                Doctors in {deptTitle}
              </h2>
              <div className="mt-6 grid grid-cols-1 items-stretch gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {doctors.map((doc) => (
                  <div
                    key={doc.id}
                    className="flex h-full min-w-0 flex-col overflow-hidden rounded-2xl bg-white shadow-md transition duration-300 hover:shadow-xl"
                  >
                    <div className="aspect-[4/3] w-full overflow-hidden bg-slate-50">
                      <img src={doc.image} alt={doc.name} className="block h-full w-full object-contain object-center" />
                    </div>
                    <div className="flex flex-1 flex-col p-4 text-center">
                      <p className="min-h-[1.5rem] break-words line-clamp-2 font-semibold text-[#0f2742]">{doc.name}</p>
                      <SpecializationText className="mt-1 min-h-[2.5rem] font-medium text-slate-500">{getTranslated(doc, "specialization", i18n.language)}</SpecializationText>
                      <div className="mt-2 flex justify-center">
                        <AvailabilityBadge doctor={doc} />
                      </div>
                      {(doc.availableDays || doc.availableDates || (doc.startTime && doc.endTime)) && (
                        <p className="mt-2 rounded-lg bg-slate-50 px-2 py-1.5 text-center text-xs leading-relaxed text-slate-500">
                          <span className="font-semibold text-slate-600">{doc.availabilityType === "SPECIFIC_DATES" ? "Scheduled dates: " : "Consultation: "}</span>{scheduleText(doc)}
                        </p>
                      )}
                      {appointmentPhone && (
                        <a
                          href={`tel:${appointmentPhone}`}
                          className="mt-3 inline-block px-4 py-1.5 text-xs rounded-full bg-gradient-to-r from-[#0f2742] to-[#1e4d6b] text-white shadow hover:shadow-md hover:scale-105 transition"
                        >
                          Book Appointment
                        </a>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}

        </section>

        <Accessibility />
      </main>

      <Footer />
    </>
  );
}
