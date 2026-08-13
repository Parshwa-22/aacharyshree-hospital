import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft, CheckCircle2, Loader2 } from "lucide-react";
import Navbar from "../../components/home/Navbar";
import Footer from "../../components/home/Footer";
import Accessibility from "../../shared/components/accessibility/AccessibilityButton";
import apiClient from "../../api/client";
import { fetchDoctors, fetchContactSettings } from "../../api/publicApi";
import { getTranslated } from "../../utils/translate";
import { useTranslation } from "react-i18next";
import DoctorProfileCard from "../../components/doctors/DoctorProfileCard";

export default function DepartmentDetail() {
  const { slug } = useParams(); const { i18n } = useTranslation();
  const [department, setDepartment] = useState(null); const [doctors, setDoctors] = useState([]); const [phone, setPhone] = useState(""); const [loading, setLoading] = useState(true); const [notFound, setNotFound] = useState(false);
  useEffect(() => { let cancelled = false; apiClient.get(`/api/departments/slug/${slug}`).then(({ data }) => !cancelled && setDepartment(data)).catch(() => !cancelled && setNotFound(true)).finally(() => !cancelled && setLoading(false)); fetchContactSettings().then((s) => !cancelled && setPhone(s?.appointmentPhone || "")); return () => { cancelled = true; }; }, [slug]);
  useEffect(() => { if (!department?.title) return; fetchDoctors().then((data) => setDoctors(data.filter((doc) => (doc.department || "").trim().toLowerCase() === department.title.trim().toLowerCase()))); }, [department]);
  if (loading) return <><Navbar /><main className="flex min-h-[50vh] items-center justify-center"><Loader2 className="animate-spin text-slate-400" /></main><Footer /></>;
  if (notFound || !department) return <><Navbar /><main className="py-24 text-center"><h1 className="text-2xl font-semibold">Department not found</h1><Link to="/" className="mt-4 inline-block text-[#26AFDE]">Back to Home</Link></main><Footer /></>;
  const title = getTranslated(department, "title", i18n.language); const services = (getTranslated(department, "services", i18n.language) || "").split(",").map((s) => s.trim()).filter(Boolean);
  return <><Navbar /><main><section className="relative flex h-[300px] items-end overflow-hidden bg-[#0f2742] md:h-[420px]"><img src={department.image} alt={title} className="absolute inset-0 h-full w-full object-contain" /><div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" /><div className="relative z-10 mx-auto w-full max-w-5xl px-6 pb-8"><Link to="/" className="mb-3 inline-flex items-center gap-2 text-sm text-white/80"><ArrowLeft size={16} /> Back to Home</Link><h1 className="text-3xl font-bold text-white md:text-5xl">{title}</h1></div></section><section className="mx-auto max-w-6xl px-6 py-14">{getTranslated(department, "description", i18n.language) && <p className="max-w-3xl text-lg leading-relaxed text-slate-600">{getTranslated(department, "description", i18n.language)}</p>}{services.length > 0 && <><h2 className="mt-10 text-2xl font-semibold text-[#0f2742]">Services under {title}</h2><div className="mt-6 grid gap-4 sm:grid-cols-2">{services.map((service) => <div key={service} className="flex items-center gap-3 rounded-xl border border-slate-100 bg-[#F8FAFD] p-4"><CheckCircle2 className="text-[#26AFDE]" size={20} />{service}</div>)}</div></>}{doctors.length > 0 && <><h2 className="mt-14 text-2xl font-semibold text-[#0f2742]">Doctors in {title}</h2><div className="mt-6 grid items-stretch gap-6 sm:grid-cols-2 lg:grid-cols-3">{doctors.map((doc) => <DoctorProfileCard key={doc.id} doctor={doc} specialization={getTranslated(doc, "specialization", i18n.language)} department={getTranslated(doc, "department", i18n.language)} appointmentPhone={phone} />)}</div></>}</section><Accessibility /></main><Footer /></>;
}
