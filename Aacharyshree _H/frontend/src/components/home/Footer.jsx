"use client";

import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FaFacebookF, FaInstagram, FaTwitter, FaLinkedinIn } from "react-icons/fa";
import { HiOutlineLocationMarker } from "react-icons/hi";
import { useTranslation } from "react-i18next";
import { fetchNavItems } from "../../api/publicApi";
import { getTranslated } from "../../utils/translate";

const INSTAGRAM_URL = "https://www.instagram.com/vidyasanmatidas_sevasanstha?igsh=djlxdzgwMThtOTcw";

export default function Footer() {
  const { t, i18n } = useTranslation();
  const [links, setLinks] = useState([]);

  useEffect(() => {
    let cancelled = false;

    fetchNavItems("FOOTER").then((data) => {
      if (cancelled) return;
      setLinks(data);
    });

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <footer className="w-full mt-20">

      {/* MAIN FOOTER */}
      <div className="w-full bg-[#0B1F3A] text-gray-300">

        <div className="max-w-7xl mx-auto px-6 py-12 grid grid-cols-1 md:grid-cols-2 gap-10">

          {/* LOGO + ABOUT */}
          <div>
            <img
              src="/images/l1.png"
              alt="logo"
              className="w-[160px] mb-4"
            />
            <p className="text-sm text-gray-400 leading-relaxed">
              {t(
                "footerAbout",
                "Delivering trusted healthcare services with modern technology and a patient-first approach. Your health, our priority."
              )}
            </p>
          </div>

          {/* LOCATION + SOCIAL */}
          <div>
            <h3 className="text-white font-semibold mb-4 tracking-wide">
              {t("footerLocation", "Location")}
            </h3>

            <div className="flex items-start gap-2 text-sm mb-3">
              <HiOutlineLocationMarker className="mt-1 text-lg" />
              <a
                href="https://maps.app.goo.gl/BAmFdJdRa11WfBFk7"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-white transition"
              >
                {t("footerViewMap", "View on Google Maps")}
              </a>
            </div>

            <div className="rounded-lg overflow-hidden mb-5 border border-white/10">
              <iframe
                title="Hospital location map"
                src="https://maps.google.com/maps?q=Aacharyshree%20Hospital%20Kolhapur&t=&z=14&ie=UTF8&iwloc=&output=embed"
                width="100%"
                height="160"
                style={{ border: 0 }}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>

            <div className="flex gap-4">
              <a href="#" aria-label="Facebook" className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition cursor-pointer">
                <FaFacebookF size={14} />
              </a>
              <a
                href={INSTAGRAM_URL}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition cursor-pointer"
              >
                <FaInstagram size={14} />
              </a>
              <a href="#" aria-label="Twitter" className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition cursor-pointer">
                <FaTwitter size={14} />
              </a>
              <a href="#" aria-label="LinkedIn" className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition cursor-pointer">
                <FaLinkedinIn size={14} />
              </a>
            </div>
          </div>

        </div>

        {/* QUICK LINKS — full-width band, wraps in rows of 5 (fewer on
            smaller screens) instead of one long vertical column. */}
        {links.length > 0 && (
          <div className="border-t border-white/10">
            <div className="max-w-7xl mx-auto px-6 py-8">
              <h3 className="text-white font-semibold mb-4 tracking-wide text-sm">
                {t("footerQuickLinks", "Quick Links")}
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-x-6 gap-y-3 text-sm">
                {links.map((item) =>
                  item.openInNewTab ? (
                    <a
                      key={item.id}
                      href={item.path}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:text-white transition truncate"
                    >
                      {getTranslated(item, "label", i18n.language)}
                    </a>
                  ) : (
                    <Link key={item.id} to={item.path} className="hover:text-white transition truncate">
                      {getTranslated(item, "label", i18n.language)}
                    </Link>
                  )
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* BOTTOM BAR */}
      <div className="w-full bg-[#071426] text-gray-400 text-xs text-center py-4 border-t border-white/10">
        © {new Date().getFullYear()} {t("footerRights", "All rights reserved.")}
      </div>

    </footer>
  );
}
