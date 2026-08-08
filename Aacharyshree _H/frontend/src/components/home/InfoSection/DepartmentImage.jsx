import { motion } from "framer-motion";

export default function DepartmentImage({
  image,
  title,
}) {
  return (
    <motion.div
      initial={{
        opacity: 0,
        x: -120,
      }}
      whileInView={{
        opacity: 1,
        x: 0,
      }}
      viewport={{
        once: true,
        amount: 0.35,
      }}
      transition={{
        duration: 0.9,
        ease: "easeOut",
      }}
      className="relative h-[300px] w-full max-w-full min-w-0 overflow-hidden md:h-[640px]"
    >
      {/* ================= IMAGE ================= */}

      <img
        src={image}
        alt={title}
        className="block h-full w-full max-w-full object-cover object-center"
      />

      {/* ================= DARK OVERLAY ================= */}

      <div className="absolute inset-0 bg-gradient-to-r from-black/30 via-black/20 to-black/55" />

     {/* ================= BLUE SLANTED STRIP ================= */}

<div
  className="
    absolute
    -bottom-8
    left-0
    h-28
    w-[120%]
    -rotate-6
    bg-[#184A73]
  "
/>

{/* ================= Department Name ================= */}

<div
  className="
    absolute
    bottom-3
    left-1/2
    z-30
    -translate-x-1/2
    max-w-[92%] text-center
  "
>
  <h2 className="break-words px-2 text-base font-semibold uppercase tracking-[0.12em] text-white drop-shadow-xl md:text-2xl">
    {title}
  </h2>
</div>

      {/* ================= DECORATIVE WHITE POLYGON ================= */}

      <svg
        className="pointer-events-none absolute inset-0 h-full w-full"
        viewBox="0 0 1000 700"
        preserveAspectRatio="none"
      >
        <polyline
          points="760,0 700,180 815,330 770,520 920,700"
          fill="none"
          stroke="rgba(255,255,255,0.55)"
          strokeWidth="2"
        />

        <polyline
          points="830,0 785,160 905,340 860,520 1000,700"
          fill="none"
          stroke="rgba(255,255,255,0.35)"
          strokeWidth="2"
        />

        <polyline
          points="915,0 875,170 975,350"
          fill="none"
          stroke="rgba(255,255,255,0.45)"
          strokeWidth="2"
        />
      </svg>

      {/* ================= EDGE SHADOW ================= */}

      <div className="absolute right-0 top-0 h-full w-32 bg-gradient-to-l from-black/30 to-transparent" />
    </motion.div>
  );
}
