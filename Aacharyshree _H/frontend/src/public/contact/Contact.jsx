import { useEffect, useState } from "react";
import { Phone } from "lucide-react";
import Navbar from "../../components/home/Navbar";
import Footer from "../../components/home/Footer";
import Accessibility from "../../shared/components/accessibility/AccessibilityButton";

import { useTranslation } from "react-i18next";
import apiClient from "../../api/client";
import { getTranslated } from "../../utils/translate";

export default function Contact() {
  const { t, i18n } = useTranslation();
  const [contacts, setContacts] = useState([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    let cancelled = false;

    apiClient
      .get("/api/contacts", { params: { active: true } })
      .then(({ data }) => {
        if (cancelled) return;
        setContacts(Array.isArray(data) ? data : []);
        setLoaded(true);
      })
      .catch(() => {
        if (!cancelled) setLoaded(true);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <>
      <Navbar />

      <main className="pt-0 bg-white">
        
        <section className="relative h-[350px] md:h-[450px] flex items-center justify-center">

  {/* ✅ Background Image */}
  <img
    src="/images/call.jpg"
    alt="Contact"
    className="absolute w-full h-full object-cover"
  />

  {/* ✅ Overlay */}
  <div className="absolute inset-0 bg-black/50"></div>

  {/* ✅ Content */}
  <div className="relative text-center text-white px-4">
    <h1 className="text-3xl md:text-5xl font-bold">
      {t("contact")}
    </h1>
    <p className="mt-3 text-lg opacity-90">
      {t("contactSubtitle")}
    </p>
  </div>

</section>
        {/* CONTACT TABLE — department directory, fully backend-managed */}
        <section className="max-w-6xl mx-auto px-4 py-12">
          <h2 className="text-2xl font-semibold mb-6 text-[#26AFDE]">
            {t("contactInfo")}
          </h2>

          {!loaded ? null : contacts.length === 0 ? (
            <p className="text-center text-slate-400 text-sm border border-dashed border-slate-200 rounded-lg py-14">
              Department contacts will appear here once added in the admin panel.
            </p>
          ) : (
            <div className="overflow-x-auto shadow-lg rounded-xl">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-[#26AFDE] text-white">
                    <th className="p-4 text-left">{t("department")}</th>
                    <th className="p-4 text-left">{t("phone")}</th>
                    <th className="p-4 text-left">{t("time")}</th>
                    <th className="p-4 text-left"></th>
                  </tr>
                </thead>

                <tbody>
                  {contacts.map((item) => (
                    <tr
                      key={item.id}
                      className="border-b hover:bg-[#A0DCDF]/30 transition"
                    >
                      <td className="p-4 font-medium text-slate-800">{getTranslated(item, "department", i18n.language)}</td>
                      <td className="p-4 font-medium text-[#26AFDE]">
                        {item.phone}
                      </td>
                      <td className="p-4 text-slate-600">{getTranslated(item, "availability", i18n.language)}</td>
                      <td className="p-4">
                        <a
                          href={`tel:${item.phone}`}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#26AFDE] text-white text-xs font-semibold hover:bg-[#1e8fb3] transition"
                        >
                          <Phone size={12} /> Call
                        </a>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>

        {/* ADDRESS + MAP */}
        <section className="max-w-6xl mx-auto px-4 pb-16">
          <h2 className="text-2xl font-semibold mb-6 text-[#26AFDE]">
            {t("address")}
          </h2>

          <div className="grid md:grid-cols-2 gap-8 items-center">
            
            {/* ADDRESS */}
            <div className="bg-[#A0DCDF]/20 p-6 rounded-xl shadow">
              <h3 className="text-xl font-bold mb-2 text-[#26AFDE]">
                {t("hospitalName")}
              </h3>
              <p>{t("addressLine1")}</p>
              <p>{t("addressLine2")}</p>
            </div>

            {/* GOOGLE MAP */}
            <div className="w-full h-[300px] rounded-xl overflow-hidden shadow">
              <iframe
                title="map"
                src="https://maps.google.com/maps?q=kolhapur&t=&z=13&ie=UTF8&iwloc=&output=embed"
                className="w-full h-full border-0"
                loading="lazy"
              ></iframe>
            </div>

          </div>
        </section>

        <Accessibility />
      </main>

      <Footer />
    </>
  );
}
