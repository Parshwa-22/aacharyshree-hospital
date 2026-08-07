import { useEffect, useState } from "react";
import { motion } from "framer-motion";

import RoomCard from "./RoomCard";
import RoomModal from "./RoomModal";
import apiClient from "../../api/client";

// Maps a backend Room (roomName, price, description, images[], amenities[], view360Url)
// to the shape this page's components expect (title, price, shortDescription,
// cover, gallery, panorama, features).
function mapApiRoom(room) {
  const sortedImages = [...(room.images || [])].sort(
    (a, b) => (a.displayOrder ?? 0) - (b.displayOrder ?? 0)
  );
  return {
    id: room.id,
    title: room.roomName,
    type: room.type,
    price: room.price != null ? `${room.price} / Day` : "Contact for pricing",
    shortDescription: room.description,
    cover: sortedImages[0]?.imageUrl || "/images/hb.jpg",
    gallery: sortedImages.map((img) => img.imageUrl),
    panorama: room.view360Url,
    animationType: room.animationType,
    // Amenities were unified into a single checklist on the backend —
    // shown here the same way the old title/value feature table was.
    features: (room.amenities || []).map((a) => ({ title: a.amenity, value: "Yes" })),
  };
}

export default function Rooms() {
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [rooms, setRooms] = useState([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    let cancelled = false;

    apiClient
      .get("/api/rooms", { params: { active: true } })
      .then(({ data }) => {
        if (cancelled) return;
        setRooms(Array.isArray(data) ? data.map(mapApiRoom) : []);
        setLoaded(true);
      })
      .catch(() => {
        if (!cancelled) setLoaded(true);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <>
      <section className="bg-[#F8FAFD] py-20">

        <div className="mx-auto max-w-7xl px-6">

          {/* ================= Heading ================= */}

          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="mb-16 text-center"
          >
            <p className="font-semibold uppercase tracking-[0.35em] text-[#184A73]">
              Patient Accommodation
            </p>

            <h2 className="mt-4 text-4xl font-bold text-slate-800 md:text-5xl">
              Comfortable Rooms
            </h2>

            <div className="mx-auto mt-6 h-1.5 w-28 rounded-full bg-[#184A73]" />

            <p className="mx-auto mt-8 max-w-3xl text-lg leading-8 text-slate-500">
              Designed to provide comfort, hygiene and a peaceful healing
              environment for every patient.
            </p>
          </motion.div>

          {/* ================= Cards ================= */}

          {loaded && rooms.length === 0 ? (
            <p className="text-center text-slate-400 text-sm border border-dashed border-slate-200 rounded-lg py-14 max-w-xl mx-auto">
              Room listings will appear here once added in the admin panel.
            </p>
          ) : (
            <div className="grid gap-10 lg:grid-cols-2">
              {rooms.map((room) => (
                <RoomCard key={room.id} room={room} onDetails={setSelectedRoom} />
              ))}
            </div>
          )}

        </div>

      </section>

      {/* ================= Modal ================= */}

      <RoomModal room={selectedRoom} onClose={() => setSelectedRoom(null)} />
    </>
  );
}
