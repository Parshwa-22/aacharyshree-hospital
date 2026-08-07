import React from "react";
import { motion } from "framer-motion";

const departments = [
  {
    title: "Ayurvedic",
    desc: "Traditional medicine approach with natural remedies and holistic healing.",
    img: "/images/g.png",
  },
  {
    title: "Allopathic",
    desc: "Modern medicine with advanced diagnosis and treatment.",
    img: "/images/bahubuli-sagarji.jpeg",
  },
  {
    title: "Diagnostic",
    desc: "Accurate laboratory and imaging services for better healthcare.",
    img: "/images/sanmati-sagarji.jpeg",
  },
];

const InfoSection = () => {
  return (
<section className="bg-white pt-0 pb-0 overflow-hidden">
      {departments.map((dept, index) => (

        <section
          key={index}
          className="relative h-[760px] w-full overflow-hidden bg-[#0f2742]"
        >

          {/* Background Image */}
          <motion.div
            initial={{ x: -120, opacity: 0 }}
            whileInView={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="absolute left-0 top-0 h-full w-full lg:w-[68%]"
          >
            <img
              src={dept.img}
              alt={dept.title}
              className="h-full w-full object-cover"
            />

            {/* Dark Overlay */}
            <div className="absolute inset-0 bg-[#0b2342]/35"></div>
          </motion.div>

          {/* Bottom Navy Slant */}
          <div
            className="absolute bottom-0 left-0 w-full h-44 bg-[#1f4f73]"
            style={{
              clipPath: "polygon(0 42%,100% 0,100% 100%,0 100%)",
            }}
          />

          {/* White Information Panel */}
          <motion.div
            initial={{ x: 120, opacity: 0 }}
            whileInView={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.9 }}
            viewport={{ once: true }}
            className="absolute right-0 top-0 h-full w-full lg:w-[46%]"
          >
            <div
              className="relative h-full bg-white shadow-2xl"
              style={{
                clipPath: "polygon(18% 0%,100% 0%,100% 100%,5% 92%)",
              }}
            >

              {/* Decorative SVG Lines */}
              {/* Decorative SVG Lines */}
<svg
  className="absolute inset-0 z-10 h-full w-full pointer-events-none"
  viewBox="0 0 600 800"
  preserveAspectRatio="none"
>
  {/* Line 1 */}
  <polyline
    points="
      60,0
      60,120
      180,120
      180,260
      100,260
      100,420
      260,420
      260,620
      180,620
      180,800
    "
    fill="none"
    stroke="rgba(255,255,255,0.35)"
    strokeWidth="2"
    strokeLinejoin="miter"
    strokeLinecap="square"
  />

  {/* Line 2 */}
  <polyline
    points="
      220,0
      220,180
      360,180
      360,340
      300,340
      300,540
      470,540
      470,800
    "
    fill="none"
    stroke="rgba(255,255,255,0.22)"
    strokeWidth="2"
    strokeLinejoin="miter"
    strokeLinecap="square"
  />

  {/* Line 3 */}
  <polyline
    points="
      420,0
      420,100
      540,100
      540,300
      460,300
      460,500
      600,500
      600,800
    "
    fill="none"
    stroke="rgba(255,255,255,0.18)"
    strokeWidth="2"
    strokeLinejoin="miter"
    strokeLinecap="square"
  />

  {/* Line 4 */}
  <polyline
    points="
      0,220
      140,220
      140,360
      40,360
      40,560
      180,560
      180,760
    "
    fill="none"
    stroke="rgba(255,255,255,0.15)"
    strokeWidth="1.8"
    strokeLinejoin="miter"
    strokeLinecap="square"
  />

  {/* Line 5 */}
  <polyline
    points="
      340,220
      340,420
      520,420
      520,620
      420,620
      420,800
    "
    fill="none"
    stroke="rgba(255,255,255,0.15)"
    strokeWidth="1.8"
    strokeLinejoin="miter"
    strokeLinecap="square"
  />
</svg>

              {/* Content */}{/* Content */}
<div className="relative z-10 flex h-full items-center justify-end">

  <div className="max-w-md pr-20 pl-16 text-right">

    <span className="text-rose-500 font-bold text-xl">
      Our
    </span>

    <h2 className="mt-2 text-5xl font-extralight text-gray-800 leading-tight">
      {dept.title}
    </h2>

    <div className="mt-8 ml-auto w-24 h-1 bg-sky-400 rounded-full"></div>

    <div className="mt-10 space-y-5">

      <div className="group cursor-pointer">
        <h3 className="text-lg uppercase tracking-wide text-gray-700 transition-all duration-300 group-hover:text-[#AB47BC]">
          Holistic Healing
        </h3>
      </div>

      <div className="group cursor-pointer">
        <h3 className="text-lg uppercase tracking-wide text-gray-700 transition-all duration-300 group-hover:text-[#AB47BC]">
          Modern Healthcare
        </h3>
      </div>

      <div className="group cursor-pointer">
        <h3 className="text-lg uppercase tracking-wide text-gray-700 transition-all duration-300 group-hover:text-[#AB47BC]">
          Diagnostics & Lab
        </h3>
      </div>

      <div className="group cursor-pointer">
        <h3 className="text-lg uppercase tracking-wide text-gray-700 transition-all duration-300 group-hover:text-[#AB47BC]">
          Preventive Care
        </h3>
      </div>

      <div className="group cursor-pointer">
        <h3 className="text-lg uppercase tracking-wide text-gray-700 transition-all duration-300 group-hover:text-[#AB47BC]">
          Rehabilitation
        </h3>
      </div>

    </div>

    <p className="mt-10 text-gray-600 leading-8">
      {dept.desc}
    </p>

    <button
      className="
        mt-10
        px-10
        py-4
        bg-sky-400
        text-white
        font-semibold
        rounded
        shadow-lg
        transition-all
        duration-300
        hover:bg-[#AB47BC]
        hover:shadow-2xl
        hover:-translate-y-1
      "
    >
      Learn More
    </button>

  </div>

</div>

            </div>

          </motion.div>

        </section>

      ))}

    </section>
  );
};

export default InfoSection;