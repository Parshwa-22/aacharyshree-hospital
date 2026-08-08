import { useEffect, useState } from "react";
import { HeartHandshake } from "lucide-react";
import Navbar from "../../components/home/Navbar";
import Footer from "../../components/home/Footer";
import Accessibility from "../../shared/components/accessibility/AccessibilityButton";
import { useTranslation } from "react-i18next";
import { fetchDonors, fetchContactSettings } from "../../api/publicApi";
import { getTranslated } from "../../utils/translate";

export default function Donors() {
  const { t, i18n } = useTranslation();
  const [donors, setDonors] = useState([]);
  const [loaded, setLoaded] = useState(false);
  const [donationPhone, setDonationPhone] = useState("");

  useEffect(() => {
    let cancelled = false;

    fetchDonors().then((data) => {
      if (cancelled) return;
      setDonors(data);
      setLoaded(true);
    });

    fetchContactSettings().then((settings) => {
      if (cancelled || !settings) return;
      setDonationPhone(settings.donationPhone || "");
    });

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <>
      <Navbar />

      <main className="bg-white">
        <section className="relative h-[280px] md:h-[380px] flex items-center justify-center">
          <img
            src="/images/hospital-lobby.jpg"
            alt="Donors"
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/55" />
          <div className="relative z-10 text-center text-white px-4">
            <h1 className="text-3xl md:text-5xl font-bold">
              {t("donorsTitle", "Our Donors")}
            </h1>
            <p className="mt-3 text-lg opacity-90">
              {t(
                "donorsSubtitle",
                "Grateful to everyone who supports our mission of accessible healthcare"
              )}
            </p>
          </div>
        </section>

        <section className="max-w-6xl mx-auto px-6 py-14">
          {!loaded ? null : donors.length === 0 ? (
            <p className="text-center text-slate-400 text-sm border border-dashed border-slate-200 rounded-lg py-14">
              Donor listings will appear here once added in the admin panel.
            </p>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {donors.map((donor) => (
                <div
                  key={donor.id}
                  className="bg-[#F8FAFD] rounded-2xl p-6 flex flex-col items-center text-center shadow-sm hover:shadow-md transition"
                >
                  <div className="w-20 h-20 rounded-full bg-white shadow flex items-center justify-center mb-4 overflow-hidden">
                    <img
                      src={donor.image || "/images/l1.png"}
                      alt={donor.name}
                      className="w-14 h-14 object-cover"
                    />
                  </div>
                  <h3 className="font-semibold text-[#0f2742]">{donor.name}</h3>
                  {donor.donationAmount != null && (
                    <p className="text-lg font-bold text-[#26AFDE] mt-1">
                      ₹{donor.donationAmount.toLocaleString("en-IN")}
                    </p>
                  )}
                  {donor.donationType && (
                    <p className="text-sm text-slate-500 mt-1">
                      {getTranslated(donor, "donationType", i18n.language)}
                    </p>
                  )}
                  {donor.message && (
                    <p className="text-xs text-slate-400 mt-2 italic">
                      "{getTranslated(donor, "message", i18n.language)}"
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}
        </section>

        <section className="max-w-3xl mx-auto px-6 pb-16 text-center">
          <HeartHandshake className="mx-auto text-[#26AFDE] mb-4" size={40} />
          <h2 className="text-2xl font-semibold text-[#0f2742] mb-3">
            {t("donorsCtaTitle", "Want to support our trust?")}
          </h2>
          <p className="text-slate-500 mb-6">
            {t(
              "donorsCtaBody",
              "Every contribution helps us provide better ayurvedic, allopathic and diagnostic care to those who need it most."
            )}
          </p>
          <a
            href={donationPhone ? `tel:${donationPhone}` : "/contact"}
            className="inline-flex items-center gap-2 rounded-md bg-[#4DA3F7] px-8 py-4 font-semibold text-white transition-all duration-300 hover:bg-[#1565C0]"
          >
            {donationPhone
              ? `${t("donorsCtaButton", "Call to Donate")}: ${donationPhone}`
              : t("donorsCtaButton", "Get in Touch")}
          </a>
        </section>

        <Accessibility />
      </main>

      <Footer />
    </>
  );
}
