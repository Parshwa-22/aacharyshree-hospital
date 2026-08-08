import { useEffect, useState } from "react";
import { HeartHandshake } from "lucide-react";
import Navbar from "../../components/home/Navbar";
import Footer from "../../components/home/Footer";
import Accessibility from "../../shared/components/accessibility/AccessibilityButton";
import { useTranslation } from "react-i18next";
import { fetchDonors, fetchContactSettings } from "../../api/publicApi";
import { getTranslated } from "../../utils/translate";
import BrandLogo from "../../components/common/BrandLogo";

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

  const vipDonors = donors.filter((donor) => donor.vip);
  const regularDonors = donors.filter((donor) => !donor.vip);
  const renderDonor = (donor) => (
    <div key={donor.id} className="min-w-0 h-full bg-[#F8FAFD] rounded-2xl p-6 flex flex-col items-center text-center shadow-sm hover:shadow-md transition">
      <div className={`${donor.vip ? "aspect-[4/3] w-full rounded-xl" : "h-24 w-24 rounded-full"} bg-white shadow flex items-center justify-center mb-4 overflow-hidden`}>
        {donor.image ? <img src={donor.image} alt={donor.name} className={`${donor.vip ? "h-full w-full" : "h-16 w-16"} object-cover object-center`} /> : <BrandLogo className={`${donor.vip ? "h-full w-full" : "h-16 w-16"}`} alt={donor.name} />}
      </div>
      <h3 className="min-h-[1.5rem] max-w-full break-words line-clamp-2 font-semibold text-[#0f2742]">{donor.name}</h3>
      {donor.donationAmount != null && (
        <p className="mt-2 rounded-full bg-[#E8F8FC] px-5 py-1.5 text-2xl font-extrabold tracking-wide text-[#1597C2]">
          &#8377;{donor.donationAmount.toLocaleString("en-IN")}
        </p>
      )}
      {donor.donationType && <p className="mt-3 text-base font-medium text-slate-600">{getTranslated(donor, "donationType", i18n.language)}</p>}
      {donor.message && <p className="mt-3 max-w-prose text-sm italic leading-relaxed text-slate-500">"{getTranslated(donor, "message", i18n.language)}"</p>}
    </div>
  );

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
            <>
              {vipDonors.length > 0 && (
                <div>
                  <div className={`mx-auto grid gap-6 ${vipDonors.length === 1 ? "max-w-xl grid-cols-1" : vipDonors.length === 2 || vipDonors.length === 4 ? "max-w-4xl grid-cols-1 sm:grid-cols-2" : "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"}`}>
                    {vipDonors.map(renderDonor)}
                  </div>
                </div>
              )}
              {regularDonors.length > 0 && (
                <div>
                  <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {regularDonors.map(renderDonor)}
                  </div>
                </div>
              )}
            {false && (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...donors].sort((a, b) => Number(!!b.vip) - Number(!!a.vip)).map((donor) => (
                <div
                  key={donor.id}
                  className={`${donor.vip ? "sm:col-span-2 lg:col-span-2" : ""} min-w-0 h-full bg-[#F8FAFD] rounded-2xl p-6 flex flex-col items-center text-center shadow-sm hover:shadow-md transition`}
                >
                  <div className={`${donor.vip ? "aspect-[4/3] w-full rounded-xl" : "h-24 w-24 rounded-full"} bg-white shadow flex items-center justify-center mb-4 overflow-hidden`}>
                    {donor.image ? <img src={donor.image} alt={donor.name} className={`${donor.vip ? "h-full w-full" : "h-16 w-16"} object-cover object-center`} /> : <BrandLogo className={`${donor.vip ? "h-full w-full" : "h-16 w-16"}`} alt={donor.name} />}
                  </div>
                  <h3 className="min-h-[1.5rem] max-w-full break-words line-clamp-2 font-semibold text-[#0f2742]">{donor.name}</h3>
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
            </>
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
