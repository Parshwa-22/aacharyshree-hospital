import { useEffect, useState } from "react";

export default function AboutContent() {
  const [text, setText] = useState("");
  const fullText = "About Us";

  // ✨ Typing Effect
  useEffect(() => {
    let i = 0;
    const interval = setInterval(() => {
      setText(fullText.slice(0, i + 1));
      i++;
      if (i === fullText.length) clearInterval(interval);
    }, 80);

    return () => clearInterval(interval);
  }, []);

  return (
<section className="relative overflow-hidden pt-0 pb-0 px-6 md:px-12 bg-gradient-to-br from-white via-[#f8fcff] to-[#eef9ff]">
      {/* 🔵 Background Decorations */}
      <div className="absolute inset-0 pointer-events-none opacity-20">
        <div className="absolute top-10 left-10 w-40 h-40 border border-blue-200 rounded-full blur-2xl"></div>
        <div className="absolute bottom-10 right-10 w-60 h-60 border border-blue-100 rounded-full blur-2xl"></div>
      </div>

      <div className="max-w-5xl mx-auto relative z-10">

        {/* 🔥 Title */}
        <div className="text-center mb-16">
          <h2 className="relative inline-block text-3xl md:text-4xl font-light tracking-wide text-[#0f2742]">

            {text}
            <span className="animate-pulse ml-1">|</span>

            {/* Underline */}
            <span className="absolute left-1/2 -bottom-2 h-[2px] w-20 bg-gradient-to-r from-red-500 to-[#0f2742] transform -translate-x-1/2 rounded-full"></span>
          </h2>
        </div>

        {/* 💎 Content */}
        <div className="space-y-8 text-gray-700 leading-relaxed text-[15px]">

          {/* Block 1 */}
          <div className="opacity-0 animate-[fadePremium_1s_ease_forwards]">
            <p>
              Our hospital is founded with the vision of creating a space where
              healthcare goes beyond treatment. We aim to serve every individual
              with equality, compassion, and respect, ensuring that every patient
              feels valued and cared for.
            </p>
          </div>

          {/* Block 2 */}
          <div className="opacity-0 animate-[fadePremium_1s_ease_forwards] delay-200">
            <p>
              We believe that true healing is a combination of physical care,
              mental peace, and spiritual balance. Our approach integrates modern
              medical facilities with a calm and supportive environment that
              promotes overall well-being.
            </p>
          </div>

          {/* Block 3 */}
          <div className="opacity-0 animate-[fadePremium_1s_ease_forwards] delay-400">
            <p>
              Our mission is to make quality healthcare accessible and affordable
              to all, without any discrimination based on religion, caste, or
              financial background. We are committed to maintaining ethical
              standards and providing services that truly make a difference in
              people’s lives.
            </p>
          </div>

          {/* Block 4 */}
          <div className="opacity-0 animate-[fadePremium_1s_ease_forwards] delay-600">
            <p>
              Special care is taken to respect the beliefs and practices of
              individuals, ensuring they receive not only medical support but also
              emotional and spiritual comfort during their healing journey.
            </p>
          </div>

          {/* ✨ Quote Card */}
          <div className="mt-10 opacity-0 animate-[fadePremium_1s_ease_forwards] delay-700">
            <div className="bg-white/70 backdrop-blur-lg border border-gray-200 rounded-2xl p-6 shadow-lg text-center">
              <p className="italic text-[#0f2742] text-lg">
                "Service to humanity is the highest form of worship."
              </p>
              <p className="italic mt-3 text-gray-600">
                "Where compassion and care unite, true healing begins."
              </p>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}