import React, { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import apiClient from "../../api/client";
import { getTranslated } from "../../utils/translate";

const CountUp = ({ target, start }) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let startValue = 0;
    const duration = 2000; // 2 seconds
    const increment = target / (duration / 16);

    const counter = setInterval(() => {
      startValue += increment;
      if (startValue >= target) {
        setCount(target);
        clearInterval(counter);
      } else {
        setCount(Math.floor(startValue));
      }
    }, 16);

    return () => clearInterval(counter);
  }, [target, start]);

  return <span>{count}</span>;
};

const CountSection = () => {
  const { i18n } = useTranslation();
  const ref = useRef();
  const [start, setStart] = useState(false);
  const [counters, setCounters] = useState([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    let cancelled = false;

    apiClient
      .get("/api/counters", { params: { active: true } })
      .then(({ data }) => {
        if (cancelled) return;
        setCounters(Array.isArray(data) ? data : []);
        setLoaded(true);
      })
      .catch(() => {
        if (!cancelled) setLoaded(true);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setStart(true);
        }
      },
      { threshold: 0.4 }
    );

    if (ref.current) observer.observe(ref.current);

    return () => observer.disconnect();
  }, []);

  if (loaded && counters.length === 0) return null;

  return (
    <section
      ref={ref}
      className="w-full bg-gradient-to-r from-[#0f2742] to-[#1f4f73] text-white py-14 sm:py-20"
    >
      <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10 text-center">

        {counters.map((item) => (
          <div
            key={item.id}
            className="group relative p-6 sm:p-8 rounded-2xl bg-white/5 backdrop-blur-md border border-white/10 shadow-lg hover:shadow-2xl hover:border-[#47C5B9]/50 hover:-translate-y-1 transition-all duration-300"
          >
            <div className="mx-auto mb-3 h-1 w-10 rounded-full bg-gradient-to-r from-[#47C5B9] to-[#26AFDE]" />

            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold bg-gradient-to-r from-[#47C5B9] to-[#8fe3da] bg-clip-text text-transparent drop-shadow-sm">
              {start ? <CountUp target={item.value} start={start} /> : 0}
              {item.suffix || ""}
            </h2>

            <p className="mt-4 text-xs sm:text-sm font-semibold tracking-[0.2em] uppercase text-gray-300">
              {getTranslated(item, "label", i18n.language)}
            </p>

            {/* underline animation */}
            <div className="mt-4 h-[2px] w-0 bg-[#47C5B9] group-hover:w-full transition-all duration-500 mx-auto"></div>
          </div>
        ))}

      </div>
    </section>
  );
};

export default CountSection;
