import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { X, Images, Orbit, BedDouble } from "lucide-react";

import RoomGallery from "./RoomGallery";
import Room360Viewer from "./Room360Viewer";
import RoomFeatures from "./RoomFeatures";

export default function RoomModal({
  room,
  onClose,
}) {
  const [tab, setTab] = useState("gallery");

  const modalRef = useRef(null);

  useEffect(() => {
    if (!room) return;

    const handleKey = (e) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener("keydown", handleKey);

    return () => {
      window.removeEventListener("keydown", handleKey);
    };
  }, [room, onClose]);

  useEffect(() => {
    if (room) {
      setTab("gallery");
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }

    return () => {
      document.body.style.overflow = "auto";
    };
  }, [room]);

  if (!room) return null;

  return (
    <AnimatePresence>

      <motion.div
        className="fixed inset-0 z-[999] flex items-center justify-center bg-black/60 backdrop-blur-md p-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      >

        <motion.div
          ref={modalRef}
          initial={{
            opacity: 0,
            scale: 0.95,
            y: 40,
          }}
          animate={{
            opacity: 1,
            scale: 1,
            y: 0,
          }}
          exit={{
            opacity: 0,
            scale: 0.95,
            y: 30,
          }}
          transition={{
            duration: 0.3,
          }}
          onClick={(e) => e.stopPropagation()}
          className="relative flex max-h-[92vh] w-full max-w-6xl flex-col overflow-hidden rounded-[28px] bg-white shadow-[0_30px_80px_rgba(0,0,0,0.25)]"
        >

          {/* Header */}

          <div className="flex items-center justify-between border-b px-8 py-5">

            <div>

              <h2 className="text-3xl font-bold text-slate-800">
                {room.title}
              </h2>

              <p className="mt-1 text-slate-500">
                {room.price}
              </p>

            </div>

            <button
              onClick={onClose}
              className="rounded-xl p-2 transition hover:bg-slate-100"
            >
              <X size={28} />
            </button>

          </div>

          {/* Tabs */}

          <div className="flex overflow-x-auto border-b">

            <button
              onClick={() => setTab("gallery")}
              className={`flex items-center gap-2 px-6 py-4 font-semibold transition ${
                tab === "gallery"
                  ? "border-b-2 border-[#184A73] text-[#184A73]"
                  : "text-slate-500"
              }`}
            >
              <Images size={18} />
              Images
            </button>

            {room.panorama && (
              <button
                onClick={() => setTab("360")}
                className={`flex items-center gap-2 px-6 py-4 font-semibold transition ${
                  tab === "360"
                    ? "border-b-2 border-[#184A73] text-[#184A73]"
                    : "text-slate-500"
                }`}
              >
                <Orbit size={18} />
                360° View
              </button>
            )}

            <button
              onClick={() => setTab("features")}
              className={`flex items-center gap-2 px-6 py-4 font-semibold transition ${
                tab === "features"
                  ? "border-b-2 border-[#184A73] text-[#184A73]"
                  : "text-slate-500"
              }`}
            >
              <BedDouble size={18} />
              Amenities
            </button>

          </div>

          {/* Body */}

          <div className="flex-1 overflow-y-auto bg-slate-50">

            {tab === "gallery" && (
              <RoomGallery images={room.gallery} animationType={room.animationType} />
            )}

            {tab === "360" && (
              <Room360Viewer image={room.panorama} />
            )}

            {tab === "features" && (
              <RoomFeatures features={room.features} />
            )}

          </div>

        </motion.div>

      </motion.div>

    </AnimatePresence>
  );
}