import React, { useState, useEffect } from "react";
import { Search, Stethoscope, Building2 } from "lucide-react";

const placeholders = [
  {
    text: "How can I help you...",
    icon: <Search className="w-6 h-6 sm:w-8 sm:h-8" />,
  },
  {
    text: "Find Doctor",
    icon: <Stethoscope className="w-6 h-6 sm:w-8 sm:h-8" />,
  },
  {
    text: "Find Department",
    icon: <Building2 className="w-6 h-6 sm:w-8 sm:h-8" />,
  },
];

const SearchBar = () => {
  const [displayText, setDisplayText] = useState("");
  const [index, setIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const current = placeholders[index].text;

    const timeout = setTimeout(() => {
      if (!deleting) {
        setDisplayText(current.substring(0, charIndex + 1));
        setCharIndex((prev) => prev + 1);

        if (charIndex + 1 === current.length) {
          setTimeout(() => setDeleting(true), 1200);
        }
      } else {
        setDisplayText(current.substring(0, charIndex - 1));
        setCharIndex((prev) => prev - 1);

        if (charIndex === 0) {
          setDeleting(false);
          setIndex((prev) => (prev + 1) % placeholders.length);
        }
      }
    }, deleting ? 40 : 80);

    return () => clearTimeout(timeout);
  }, [charIndex, deleting, index]);

  return (
    <div className="w-full flex justify-center items-center px-4 sm:px-6">
      
      <div className="flex items-center justify-between w-full max-w-[1400px] gap-4">

        {/* 🐦 LEFT LOGO */}
        <div className="hidden lg:flex w-[100px] justify-center">
          <img
            src="/images/l.png"
            alt="logo"
            className="w-16 lg:w-20 opacity-80 transition-all duration-300 hover:scale-110 hover:-translate-y-2"
          />
        </div>

        {/* 🔍 SEARCH BAR */}
        <div className="flex-1 w-full">
          
          <div className="group flex flex-col sm:flex-row w-full bg-white border border-[#A0DCDF] shadow-lg rounded-xl overflow-hidden">

            {/* 🔹 TOP ROW (ICON + INPUT) */}
            <div className="flex items-center flex-1">

              {/* ICON */}
              <div className="w-[60px] sm:w-[90px] h-[60px] sm:h-[80px] bg-[#47C5B9] flex items-center justify-center text-white transition-all duration-300 group-hover:scale-105">
                {placeholders[index].icon}
              </div>

              {/* INPUT */}
              <input
                type="text"
                placeholder={displayText}
                className="flex-1 px-4 sm:px-6 text-base sm:text-lg outline-none text-gray-700 placeholder-gray-400 h-[60px] sm:h-[80px]"
              />
            </div>

            {/* 🔥 SEARCH BUTTON */}
            <button
              className="
                w-full sm:w-[160px] 
                h-[60px] sm:h-[80px]
                text-white 
                text-base sm:text-lg 
                font-bold 
                bg-gradient-to-r from-[#47C5B9] to-[#26AFDE]
                transition-all duration-300 
                hover:brightness-110
                active:scale-95
              "
            >
              Search
            </button>

          </div>
        </div>

        {/* 🐦 RIGHT LOGO */}
        <div className="hidden lg:flex w-[100px] justify-center">
          <img
            src="/images/l.png"
            alt="logo"
            className="w-16 lg:w-20 opacity-80 transition-all duration-300 hover:scale-110 hover:-translate-y-2"
          />
        </div>

      </div>
    </div>
  );
};

export default SearchBar;