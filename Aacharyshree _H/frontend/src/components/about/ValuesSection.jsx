import { useEffect, useState } from "react";
import {
  FaLeaf,
  FaHeartbeat,
  FaMicroscope,
  FaUserMd,
  FaHospital,
} from "react-icons/fa";

const valuesData = [
  {
    title: "Ayurvedic Healing",
    icon: <FaLeaf />,
    points: [
      "Holistic natural treatments",
      "Root-cause healing approach",
      "Herbal and organic remedies",
      "Balance of mind & body",
    ],
  },
  {
    title: "Allopathic Excellence",
    icon: <FaHeartbeat />,
    points: [
      "Modern medical practices",
      "Advanced treatment methods",
      "Emergency care readiness",
      "Expert medical professionals",
    ],
  },
  {
    title: "Advanced Diagnostics",
    icon: <FaMicroscope />,
    points: [
      "Accurate lab testing",
      "Latest diagnostic tools",
      "Fast & reliable reports",
      "Early disease detection",
    ],
  },
  {
    title: "Patient-Centered Care",
    icon: <FaUserMd />,
    points: [
      "Personalized treatment plans",
      "Compassionate support",
      "Respect for every patient",
      "Spiritual care integration",
    ],
  },
  {
    title: "Integrated Healthcare",
    icon: <FaHospital />,
    points: [
      "All facilities in one campus",
      "Affordable healthcare access",
      "Seamless patient experience",
      "Holistic healing environment",
    ],
  },
];

const OurValues = () => {
  const [displayText, setDisplayText] = useState("");
  const fullText = "Our Values";

  // ✨ Typing Effect
  useEffect(() => {
    let i = 0;
    const interval = setInterval(() => {
      setDisplayText(fullText.slice(0, i + 1));
      i++;
      if (i === fullText.length) clearInterval(interval);
    }, 80);

    return () => clearInterval(interval);
  }, []);

  return (
    <section className="relative pt-10 pb-24 px-6 md:px-12 bg-white overflow-hidden">
      
      {/* Background decoration */}
      <div className="absolute inset-0 pointer-events-none opacity-20">
        <div className="absolute top-10 left-10 w-40 h-40 border border-blue-200 rounded-full blur-2xl"></div>
        <div className="absolute bottom-10 right-10 w-60 h-60 border border-blue-100 rounded-full blur-2xl"></div>
      </div>

      {/* 🔥 Title */}
      <div className="text-center mb-20">
        <h2 className="relative inline-block text-3xl md:text-4xl font-light tracking-wide text-[#0f2742] pt-6">
          
          {/* Split styled typing */}
          <span>
            <span className="text-red-500">
              {displayText.startsWith("Our")
                ? displayText.slice(0, 3)
                : displayText}
            </span>
            <span>
              {displayText.length > 3 ? displayText.slice(3) : ""}
            </span>
          </span>

          {/* Cursor */}
          <span className="animate-pulse ml-1">|</span>

          {/* Underline */}
          <span className="absolute left-1/2 -bottom-2 h-[2px] w-24 bg-gradient-to-r from-red-500 to-[#0f2742] transform -translate-x-1/2 rounded-full"></span>
        </h2>
      </div>

      {/* Cards */}
      <div className="max-w-7xl mx-auto flex flex-col gap-10">
        
        {/* Row 1 */}
        <div className="grid md:grid-cols-3 gap-8">
          {valuesData.slice(0, 3).map((item, index) => (
            <Card key={index} item={item} delay={index * 0.2} />
          ))}
        </div>

        {/* Row 2 */}
        <div className="grid md:grid-cols-2 gap-8 md:w-2/3 mx-auto">
          {valuesData.slice(3, 5).map((item, index) => (
            <Card key={index} item={item} delay={index * 0.2} />
          ))}
        </div>

      </div>
    </section>
  );
};

export default OurValues;


// 🔹 Card Component
const Card = ({ item, delay }) => {
  return (
    <div
      className="group bg-white rounded-xl p-6 shadow-md border border-gray-100
      transform transition-all duration-700
      hover:shadow-2xl hover:-translate-y-3 hover:scale-[1.02]
      opacity-0 animate-[premiumFade_0.9s_ease_forwards]"
      style={{
        animationDelay: `${delay}s`,
      }}
    >
      {/* Icon + Title */}
      <div className="flex items-center gap-3 mb-4">
        <div className="text-2xl text-[#0f2742] group-hover:text-red-500 transition duration-300">
          {item.icon}
        </div>

        <h3 className="text-lg font-medium text-[#0f2742] relative inline-block">
          {item.title}

          {/* Hover underline */}
          <span
            className="absolute left-0 -bottom-1 w-0 h-[2px] bg-red-500
            transition-all duration-300 group-hover:w-full"
          ></span>
        </h3>
      </div>

      {/* Points */}
      <ul className="space-y-2 text-gray-600 text-sm leading-relaxed transition-all duration-300 group-hover:font-semibold">
        {item.points.map((point, i) => (
          <li key={i}>• {point}</li>
        ))}
      </ul>
    </div>
  );
};