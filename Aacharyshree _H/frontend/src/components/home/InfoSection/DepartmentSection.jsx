import DepartmentImage from "./DepartmentImage";
import DepartmentContent from "./DepartmentContent";

export default function DepartmentSection({ department }) {
  return (
<section className="relative overflow-hidden bg-[#F8FAFD]">
      {/* ================= Desktop ================= */}

      <div className="relative mx-auto hidden h-[650px] max-w-[1800px] lg:block">

        {/* Image */}

        <div className="absolute left-0 top-0 h-full w-[68%]">

          <DepartmentImage
            image={department.image}
            title={department.title}
          />

        </div>

        {/* Content */}

        <div
          className="
          absolute
          top-0
          right-[-5%]
          z-30
          flex
          h-full
          w-[52%]
          items-center
        "
        >
          <DepartmentContent
            department={department}
          />
        </div>

        {/* Decorative White Lines */}

        <svg
          className="pointer-events-none absolute inset-0 z-20 h-full w-full"
          viewBox="0 0 1600 700"
          preserveAspectRatio="none"
        >
          <polyline
            points="760,0 700,170 815,330 760,520 900,700"
            fill="none"
            stroke="rgba(255,255,255,0.70)"
            strokeWidth="2"
          />

          <polyline
            points="840,0 790,160 905,340 860,520 980,700"
            fill="none"
            stroke="rgba(255,255,255,0.45)"
            strokeWidth="2"
          />

          <polyline
            points="930,0 885,170 1000,350"
            fill="none"
            stroke="rgba(255,255,255,0.35)"
            strokeWidth="2"
          />
        </svg>

      </div>

      {/* ================= Mobile ================= */}

      <div className="mx-auto block max-w-xl px-4 lg:hidden">

        <DepartmentImage
          image={department.image}
          title={department.title}
        />

        <DepartmentContent
          department={department}
        />

      </div>

    </section>
  );
}