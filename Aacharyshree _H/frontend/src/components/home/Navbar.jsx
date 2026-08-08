"use client";

import React, { useEffect, useState } from "react";
import { Menu, X, ShoppingCart, User, LogOut } from "lucide-react";
import { Link, NavLink } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { fetchNavItems } from "../../api/publicApi";
import { getTranslated } from "../../utils/translate";
import { useCart } from "../../context/CartContext";
import { useCustomerAuth } from "../../context/CustomerAuthContext";
import BrandLogo from "../common/BrandLogo";

const LANGUAGES = [
  { code: "en", label: "Eng" },
  { code: "mr", label: "Marathi" },
  { code: "hi", label: "Hindi" },
  { code: "kn", label: "Kannada" },
];

const Navbar = () => {
  const { i18n } = useTranslation();
  const { count } = useCart();
  const { isAuthenticated, email, requireAuth, logout } = useCustomerAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [navItems, setNavItems] = useState([]);

  useEffect(() => {
    let cancelled = false;

    fetchNavItems("NAVBAR").then((data) => {
      if (cancelled) return;
      setNavItems(data);
    });

    return () => {
      cancelled = true;
    };
  }, []);

  const changeLanguage = (code) => {
    i18n.changeLanguage(code);
    localStorage.setItem("appLanguage", code);
  };

  const renderLink = (item, onClick, isMobile) => {
    const label = getTranslated(item, "label", i18n.language);
    const baseClass = isMobile
      ? `relative w-fit pb-1 after:content-[''] after:absolute after:left-0 after:-bottom-0
         after:h-[2px] after:bg-[#0f2742] after:transition-all after:duration-300`
      : `relative py-2 font-semibold text-[#0f2742] transition-colors duration-300
         after:content-[''] after:absolute after:left-0 after:-bottom-0.5
         after:h-[2px] after:bg-[#0f2742] after:transition-all after:duration-300`;

    if (item.openInNewTab) {
      return (
        <a
          key={item.id}
          href={item.path}
          target="_blank"
          rel="noopener noreferrer"
          onClick={onClick}
          className={`${baseClass} after:w-0 hover:after:w-full`}
        >
          {label}
        </a>
      );
    }

    return (
      <NavLink
        key={item.id}
        to={item.path}
        onClick={onClick}
        className={({ isActive }) => `${baseClass} ${isActive ? "after:w-full" : "after:w-0 hover:after:w-full"}`}
      >
        {label}
      </NavLink>
    );
  };

  return (
    <nav className="fixed top-0 left-0 w-full z-50 backdrop-blur-md bg-[linear-gradient(to_right,white_18%,#47C5B9_60%,#26AFDE_80%,#A0DCDF_100%)] shadow-lg">

      <div className="w-full flex items-center justify-between h-[80px]">

        <Link to="/" className="h-full w-[140px] sm:w-[180px] md:w-[220px] flex items-center">
          <BrandLogo className="h-full w-[250px]" />
        </Link>

        <div className="flex items-center justify-between w-full pl-2 pr-4 md:pr-8">

          <div className="hidden md:flex items-center gap-6 ml-auto">

            <ul className="flex items-center gap-7">
              {navItems.map((item) => (
                <li key={item.id}>{renderLink(item)}</li>
              ))}
            </ul>

            <Link to="/cart" className="relative p-2 text-[#0f2742] hover:scale-110 transition" aria-label="Cart">
              <ShoppingCart size={22} />
              {count > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                  {count}
                </span>
              )}
            </Link>

            {isAuthenticated ? (
              <div className="flex items-center gap-2">
                <span className="flex items-center gap-1.5 text-xs font-semibold text-[#0f2742]" title={email}>
                  <User size={16} /> <span className="hidden lg:inline max-w-[120px] truncate">{email}</span>
                </span>
                <button
                  onClick={logout}
                  className="p-2 text-[#0f2742] hover:text-red-500 transition"
                  aria-label="Log out"
                  title="Log out"
                >
                  <LogOut size={18} />
                </button>
              </div>
            ) : (
              <button
                onClick={() => requireAuth(() => {})}
                className="
                  px-6 py-2 font-bold rounded-md
                  bg-gradient-to-r from-[#47C5B9] to-[#26AFDE]
                  text-white
                  transition-all duration-300
                  hover:scale-110 hover:-translate-y-1
                  hover:shadow-[0_10px_25px_rgba(38,175,222,0.4)]
                  active:scale-95
                "
              >
                Login / Register
              </button>
            )}

            <select
              value={i18n.language}
              onChange={(e) => changeLanguage(e.target.value)}
              aria-label="Language"
              className="bg-white/40 text-[#0f2742] border border-white/50 rounded-md px-3 py-2 text-sm font-semibold backdrop-blur-md focus:outline-none hover:bg-white transition"
            >
              {LANGUAGES.map((lang) => <option key={lang.code} value={lang.code}>{lang.label}</option>)}
            </select>
          </div>

          <div className="md:hidden text-[#0f2742] ml-auto">
            <button onClick={() => setIsOpen(!isOpen)}>
              {isOpen ? <X size={30} /> : <Menu size={30} />}
            </button>
          </div>

        </div>
      </div>

      <div
        className={`
          md:hidden fixed top-0 left-0 h-full w-[75%]
          bg-[#A0DCDF] bg-gradient-to-b from-white via-[#47C5B9] to-[#26AFDE] opacity-100
          backdrop-blur-none shadow-2xl border-r border-white/40
          transform transition-transform duration-300 z-[60]
          ${isOpen ? "translate-x-0" : "-translate-x-full"}
        `}
      >
        <div className="p-6 flex flex-col gap-6 text-[#0f2742] font-semibold text-lg">

          <div className="flex justify-end">
            <button onClick={() => setIsOpen(false)}>
              <X size={28} />
            </button>
          </div>

          {navItems.map((item) => renderLink(item, () => setIsOpen(false), true))}

          <select
            value={i18n.language}
            onChange={(e) => changeLanguage(e.target.value)}
            className="bg-white/50 text-[#0f2742] border border-white/50 rounded-md px-3 py-2 text-sm font-semibold backdrop-blur-md focus:outline-none"
          >
            {LANGUAGES.map((lang) => (
              <option key={lang.code} value={lang.code}>
                {lang.label}
              </option>
            ))}
          </select>

          <Link
            to="/cart"
            onClick={() => setIsOpen(false)}
            className="flex items-center gap-2 relative w-fit"
          >
            <ShoppingCart size={20} />
            Cart {count > 0 && `(${count})`}
          </Link>

          {isAuthenticated ? (
            <div className="mt-4 flex items-center justify-between">
                  <span className="flex items-center gap-1.5 text-sm font-semibold">
                  <User size={16} /> <span className="max-w-[180px] truncate">{email}</span>
              </span>
              <button
                onClick={() => {
                  logout();
                  setIsOpen(false);
                }}
                className="flex items-center gap-1 text-sm text-red-500"
              >
                <LogOut size={16} /> Log out
              </button>
            </div>
          ) : (
            <button
              onClick={() => {
                requireAuth(() => {});
                setIsOpen(false);
              }}
              className="
                mt-4 px-6 py-3 font-bold rounded-md
                bg-gradient-to-r from-[#47C5B9] to-[#26AFDE]
                text-white
                transition hover:scale-105
              "
            >
              Login / Register
            </button>
          )}
        </div>
      </div>

      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/40 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}
    </nav>
  );
};

export default Navbar;
