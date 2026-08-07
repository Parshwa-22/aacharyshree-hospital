import { motion } from "framer-motion";
export default function InfoSection() {
  return (
<section className="relative overflow-hidden pt-0 pb-24 px-6 md:px-12 bg-gradient-to-br from-white via-[#f8fcff] to-[#eef9ff]">
      {/* 🔹 Decorative Background Elements */}
      <div className="absolute -top-20 -left-20 w-[300px] h-[300px] bg-[#47C5B9]/20 blur-[120px] rounded-full"></div>
      <div className="absolute bottom-0 right-0 w-[300px] h-[300px] bg-[#26AFDE]/20 blur-[120px] rounded-full"></div>

      {/* Lines */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-20 w-full h-[1px] bg-gradient-to-r from-transparent via-gray-300 to-transparent"></div>
        <div className="absolute bottom-20 w-full h-[1px] bg-gradient-to-r from-transparent via-gray-300 to-transparent"></div>
      </div>

      <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-12 items-start">

        {/* 🔹 LEFT IMAGES */}
        <motion.div
          initial={{ x: -120, opacity: 0 }}
          whileInView={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="flex flex-col gap-8"
        >
          <img
            src="/images/cps&vs.jpeg"
            alt="hospital"
            className="w-full rounded-3xl shadow-2xl object-cover"
          />

        </motion.div>

        {/* 🔹 RIGHT CARDS */}
        <motion.div
          initial={{ x: 120, opacity: 0 }}
          whileInView={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="flex flex-col gap-8"
        >

          {/* 🔹 Swapna Purti */}
          <div className="relative bg-white/70 backdrop-blur-lg border border-white/40 rounded-3xl shadow-xl p-8 group hover:shadow-2xl transition">

            {/* Accent Line */}
            <div className="absolute left-0 top-0 h-full w-1 bg-gradient-to-b from-[#47C5B9] to-[#26AFDE] rounded-l-3xl"></div>

            <h3 className="text-2xl font-semibold mb-4 group-hover:font-bold transition">
              Swapna Purti
            </h3>

            <ul className="text-gray-700 text-base leading-relaxed space-y-3 group-hover:font-semibold transition list-disc pl-5">
              <li>
                This hospital stands as the fulfilment of a sacred vision entrusted by Acharyashree Vidyasagar Maharaj Ji and realized by AacharayShree Chandra Prabhu Maharaj Ji.
              </li>
              <li>
                It is dedicated to serving the common people with high-quality healthcare at affordable and reasonable costs.
              </li>
              <li>
                Equal treatment is ensured for all patients, irrespective of their background or financial status.
              </li>
              <li>
                Special provisions allow Pratimadhari and Mahapratimadhari individuals to receive treatment without compromising their niyam.
              </li>
              <li>
                Designed as an integrated healthcare campus, all major facilities are available under one roof.
              </li>
            </ul>
          </div>

          {/* 🔹 Vision + Mission */}
          <div className="grid md:grid-cols-2 gap-6">

            {/* Vision */}
            <div className="relative bg-white/70 backdrop-blur-lg border border-white/40 rounded-3xl shadow-xl p-8 group hover:shadow-2xl transition">

              <div className="absolute left-0 top-0 h-full w-1 bg-gradient-to-b from-[#26AFDE] to-[#A0DCDF] rounded-l-3xl"></div>

              <h3 className="text-xl font-semibold mb-4 group-hover:font-bold transition">
                Vision
              </h3>

              <p className="text-gray-700 text-base leading-relaxed group-hover:font-semibold transition">
                To establish a dedicated healthcare institution where every patient
                receives treatment with equality, dignity, and spiritual peace.
                This hospital reflects the vision of Acharyashree Chandprabhsagar Maharaj Ji,
                where healing goes beyond the physical to nurture mental and spiritual well-being.
              </p>
            </div>

            {/* Mission */}
            <div className="relative bg-white/70 backdrop-blur-lg border border-white/40 rounded-3xl shadow-xl p-8 group hover:shadow-2xl transition">

              <div className="absolute left-0 top-0 h-full w-1 bg-gradient-to-b from-[#47C5B9] to-[#26AFDE] rounded-l-3xl"></div>

              <h3 className="text-xl font-semibold mb-4 group-hover:font-bold transition">
                Mission
              </h3>

              <ul className="text-gray-700 text-base leading-relaxed space-y-2 group-hover:font-semibold transition list-disc pl-5">
                <li>
                  To provide dedicated facilities for Tyagi and Pratimadhari individuals while preserving their religious disciplines.
                </li>
                <li>
                  To ensure availability of pure vegetarian food (Shuddha Bhojan) within the hospital.
                </li>
                <li>
                  To establish a temple within the premises for spiritual peace and mental well-being.
                </li>
              </ul>
            </div>

          </div>

        </motion.div>
      </div>
    </section>
  );
}