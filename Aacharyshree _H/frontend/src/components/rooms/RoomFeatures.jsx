import {
    Bed,
    Sofa,
    Fan,
    AirVent,
    Tv,
    Bath,
    Wifi,
    BellRing,
    Refrigerator,
    Sparkles,
    CheckCircle2,
  } from "lucide-react";
  
  const iconMap = {
    Beds: Bed,
    Bed: Bed,
    Sofa: Sofa,
    Fans: Fan,
    Fan: Fan,
    "Air Conditioner": AirVent,
    Television: Tv,
    "Smart TV": Tv,
    "Attached Washroom": Bath,
    WiFi: Wifi,
    "Wi-Fi": Wifi,
    "Nurse Calling System": BellRing,
    Refrigerator: Refrigerator,
    "Mini Refrigerator": Refrigerator,
    "Daily Housekeeping": Sparkles,
  };
  
  export default function RoomFeatures({ features }) {
    return (
      <div className="p-8">
  
        {/* Heading */}
  
        <h3 className="mb-8 text-3xl font-bold text-slate-800">
          Room Amenities
        </h3>
  
        {/* Features Grid */}
  
        <div className="grid gap-5 md:grid-cols-2">
  
          {features.map((feature, index) => {
  
            const Icon =
              iconMap[feature.title] ||
              CheckCircle2;
  
            return (
              <div
                key={index}
                className="
                  flex
                  items-center
                  justify-between
                  rounded-2xl
                  border
                  border-slate-200
                  bg-white
                  p-5
                  shadow-sm
                  transition-all
                  duration-300
                  hover:-translate-y-1
                  hover:shadow-lg
                "
              >
                <div className="flex items-center gap-4">
  
                  <div
                    className="
                      flex
                      h-12
                      w-12
                      items-center
                      justify-center
                      rounded-xl
                      bg-[#184A73]/10
                    "
                  >
                    <Icon
                      size={22}
                      className="text-[#184A73]"
                    />
                  </div>
  
                  <span className="font-medium text-slate-700">
                    {feature.title}
                  </span>
  
                </div>
  
                <span className="font-semibold text-[#184A73]">
                  {feature.value}
                </span>
  
              </div>
            );
          })}
  
        </div>
      </div>
    );
  }