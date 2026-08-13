import { useEffect, useState } from "react";
import Navbar from "../../components/home/Navbar";
import Footer from "../../components/home/Footer";
import Accessibility from "../../shared/components/accessibility/AccessibilityButton";
import { fetchDoctors, fetchContactSettings } from "../../api/publicApi";
import { getTranslated } from "../../utils/translate";
import { useTranslation } from "react-i18next";
import DoctorProfileCard from "../../components/doctors/DoctorProfileCard";

export default function DoctorsPage({ doctors }) {
  const { i18n } = useTranslation();
  const [apiDoctors, setApiDoctors] = useState([]);
  const [search, setSearch] = useState("");
  const [appointmentPhone, setAppointmentPhone] = useState("");
  useEffect(() => { fetchDoctors().then(setApiDoctors); fetchContactSettings().then((s) => setAppointmentPhone(s?.appointmentPhone || "")); }, []);
  const data = doctors?.length ? doctors : apiDoctors;
  const filtered = data.filter((doc) => doc.name?.toLowerCase().includes(search.toLowerCase()));
  const grouped = filtered.reduce((groups, doc) => { const key = doc.department || "General Medicine"; (groups[key] ||= []).push(doc); return groups; }, {});
  return <><Navbar /><main className="bg-gradient-to-br from-white via-[#f8fcff] to-[#eef9ff] px-6 py-8 md:px-12"><div className="mb-8 text-center"><h1 className="text-3xl font-light text-[#0f2742] md:text-4xl"><span className="text-red-500">Our </span><i>Doctors</i></h1><div className="mx-auto mt-2 h-1 w-16 rounded-full bg-gradient-to-r from-[#00c6ff] to-[#00d9a5]" /></div><div className="mx-auto mb-10 max-w-xl"><input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search Doctor" className="w-full rounded-full border border-gray-200 bg-white px-5 py-3 shadow-sm outline-none focus:ring-2 focus:ring-[#26AFDE]" /></div>{Object.entries(grouped).map(([department, items]) => <section key={department} className="mx-auto mb-12 max-w-6xl"><h2 className="mb-6 text-center text-2xl font-light text-[#0f2742]">{getTranslated(items[0], "department", i18n.language) || department}</h2><div className="grid items-stretch gap-6 sm:grid-cols-2 lg:grid-cols-3">{items.map((doc) => <DoctorProfileCard key={doc.id || doc.name} doctor={doc} specialization={getTranslated(doc, "specialization", i18n.language)} department={getTranslated(doc, "department", i18n.language)} appointmentPhone={appointmentPhone} />)}</div></section>)}</main><Footer /><Accessibility /></>;
}
