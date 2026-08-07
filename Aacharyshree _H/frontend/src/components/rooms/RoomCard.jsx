import { motion } from "framer-motion";
import {
  ArrowRight,
  IndianRupee,
} from "lucide-react";

export default function RoomCard({
  room,
  onDetails,
}) {
  return (
    <motion.div
      whileHover={{
        y: -10,
      }}
      transition={{
        duration: 0.35,
      }}
      className="
        group
        overflow-hidden
        rounded-[28px]
        bg-white
        shadow-[0_20px_60px_rgba(0,0,0,0.08)]
        transition-all
        duration-500
        hover:shadow-[0_30px_80px_rgba(24,74,115,0.18)]
      "
    >
      {/* ================= IMAGE ================= */}

      <div className="relative h-[260px] overflow-hidden">

        <img
          src={room.cover}
          alt={room.title}
          className="
            h-full
            w-full
            object-cover
            transition-transform
            duration-700
            group-hover:scale-110
          "
        />

        {/* Gradient */}

        <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/20 to-transparent" />

        {/* Room Type */}

        <div
          className="
            absolute
            left-5
            top-5
            rounded-full
            bg-white/90
            px-4
            py-2
            text-xs
            font-semibold
            uppercase
            tracking-[0.2em]
            text-[#184A73]
            backdrop-blur-lg
          "
        >
          {room.type}
        </div>

        {/* Price */}

        <div
          className="
            absolute
            bottom-5
            right-5
            rounded-2xl
            bg-white/90
            px-5
            py-3
            backdrop-blur-xl
          "
        >
          <div className="flex items-center gap-2">

            <IndianRupee
              size={18}
              className="text-[#184A73]"
            />

            <span className="font-bold text-[#184A73]">
              {room.price}
            </span>

          </div>
        </div>

      </div>

      {/* ================= CONTENT ================= */}

      <div className="p-7">

        <h3 className="text-3xl font-bold text-slate-800">
          {room.title}
        </h3>

        <p className="mt-4 leading-7 text-slate-500">
          {room.shortDescription}
        </p>

        {/* Buttons */}

        <div className="mt-8 grid grid-cols-2 gap-4">

          
          {/* More */}

          <button
            onClick={() => onDetails(room)}
            className="
              group
              flex
              items-center
              justify-center
              gap-2
              rounded-xl
              bg-[#184A73]
              py-3
              font-semibold
              text-white
              transition-all
              duration-300
              hover:bg-[#0E3556]
            "
          >
            More Details

            <ArrowRight
              size={18}
              className="
                transition-transform
                duration-300
                group-hover:translate-x-1
              "
            />

          </button>

        </div>

      </div>
    </motion.div>
  );
}