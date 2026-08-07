import { Swiper, SwiperSlide } from "swiper/react";

import {
  Navigation,
  Pagination,
  Thumbs,
  EffectFade,
  EffectCube,
  EffectFlip,
  EffectCoverflow,
} from "swiper/modules";

import { useState } from "react";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/thumbs";
import "swiper/css/effect-fade";
import "swiper/css/effect-cube";
import "swiper/css/effect-flip";
import "swiper/css/effect-coverflow";

// Maps the admin-panel's animation text to a real Swiper transition effect.
// Recognized presets: Fade, Cube, Flip, Coverflow. Anything else (including
// a custom value the admin typed in, or "Slide") falls back to the normal
// slide transition, since arbitrary custom text can't have bespoke CSS
// generated automatically.
function resolveEffect(animationType) {
  const key = (animationType || "").trim().toLowerCase();
  if (key === "fade") return { effect: "fade", modules: [EffectFade] };
  if (key === "cube") return { effect: "cube", modules: [EffectCube] };
  if (key === "flip") return { effect: "flip", modules: [EffectFlip] };
  if (key === "coverflow") return { effect: "coverflow", modules: [EffectCoverflow] };
  return { effect: "slide", modules: [] };
}

export default function RoomGallery({ images, animationType }) {
  const [thumbsSwiper, setThumbsSwiper] = useState(null);
  const { effect, modules } = resolveEffect(animationType);

  return (
    <div className="p-6">

      {/* Main Slider */}

      <Swiper
        modules={[Navigation, Pagination, Thumbs, ...modules]}
        effect={effect}
        navigation
        pagination={{
          clickable: true,
        }}
        thumbs={{
          swiper:
            thumbsSwiper &&
            !thumbsSwiper.destroyed
              ? thumbsSwiper
              : null,
        }}
        className="overflow-hidden rounded-3xl"
      >
        {images.map((image, index) => (
          <SwiperSlide key={index}>
            <img
              src={image}
              alt={`Room ${index + 1}`}
              className="
                h-[420px]
                w-full
                rounded-3xl
                object-cover
              "
            />
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Thumbnails */}

      <Swiper
        modules={[Thumbs]}
        watchSlidesProgress
        onSwiper={setThumbsSwiper}
        slidesPerView={4}
        spaceBetween={12}
        className="mt-5"
      >
        {images.map((image, index) => (
          <SwiperSlide key={index}>
            <img
              src={image}
              alt=""
              className="
                h-24
                w-full
                cursor-pointer
                rounded-xl
                object-cover
                transition
                hover:scale-105
              "
            />
          </SwiperSlide>
        ))}
      </Swiper>

    </div>
  );
}
