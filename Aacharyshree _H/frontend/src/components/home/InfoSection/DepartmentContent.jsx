import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

export default function DepartmentContent({ department }) {
  return (
    <>
      {/* ====================== DESKTOP ====================== */}

      <motion.div
        initial={{
          opacity: 0,
          x: 120,
        }}
        whileInView={{
          opacity: 1,
          x: 0,
        }}
        viewport={{
          once: true,
          amount: 0.3,
        }}
        transition={{
          duration: 0.8,
        }}
        className="relative hidden h-full w-full lg:flex"
      >
        <div
          className="relative flex h-full w-full items-center overflow-hidden bg-white shadow-[0_35px_80px_rgba(0,0,0,0.12)]"
          style={{
            clipPath:
              "polygon(12% 0%,100% 0%,100% 100%,5% 100%,0% 50%)",
          }}
        >
          {/* Background */}

          <div className="absolute inset-0 bg-gradient-to-br from-white via-white to-slate-50" />

          {/* Decorative Circle */}

          <div className="absolute -right-20 -top-20 h-72 w-72 rounded-full bg-blue-100/40 blur-3xl" />

          {/* Content */}

          <div className="relative z-20 w-full pl-36 pr-16">

            {/* Small Title */}

            <p className="text-lg font-bold uppercase tracking-[0.35em] text-[#E53935]">
              OUR
            </p>

            {/* Main Title */}

            <h2 className="mt-2 text-6xl font-extralight tracking-tight text-slate-800">
              Departments
            </h2>

            {/* Line */}

            <div className="mt-8 h-1.5 w-24 rounded-full bg-[#4DA3F7]" />

            {/* Services */}

            <div className="mt-12 space-y-6">

              {department.services.slice(0, 4).map((item) => (
                <div
                  key={item}
                  className="group flex cursor-pointer items-center gap-4 text-xl font-light text-slate-500 transition-all duration-300 hover:translate-x-2 hover:text-[#1565C0]"
                >
                  <div className="h-2 w-2 rounded-full bg-[#4DA3F7]" />

                  {item}
                </div>
              ))}

            </div>

            {department.services.length > 4 && (
              <p className="mt-4 text-sm font-medium text-[#4DA3F7]">
                +{department.services.length - 4} more services
              </p>
            )}

            {/* Button */}

            <Link
              to={`/departments/${department.slug}`}
              className="group mt-14 inline-flex items-center gap-3 rounded-md bg-[#4DA3F7] px-8 py-4 font-semibold text-white transition-all duration-300 hover:bg-[#1565C0]"
            >
              View All

              <ArrowRight
                size={18}
                className="transition-transform duration-300 group-hover:translate-x-1"
              />

            </Link>

          </div>
        </div>
      </motion.div>

      {/* ====================== MOBILE ====================== */}

      <motion.div
        initial={{
          opacity: 0,
          y: 40,
        }}
        whileInView={{
          opacity: 1,
          y: 0,
        }}
        viewport={{
          once: true,
        }}
        transition={{
          duration: 0.7,
        }}
        className="overflow-hidden rounded-b-3xl bg-white shadow-xl lg:hidden"
      >
        <div className="p-7">

          <p className="text-sm font-bold uppercase tracking-[0.3em] text-[#E53935]">
            OUR
          </p>

          <h2 className="mt-2 text-4xl font-light text-slate-800">
            Departments
          </h2>

          <div className="mt-5 h-1 w-20 rounded-full bg-[#4DA3F7]" />

          <div className="mt-8 space-y-5">

            {department.services.slice(0, 4).map((item) => (
              <div
                key={item}
                className="flex items-center gap-3 text-base text-slate-600"
              >
                <div className="h-2 w-2 rounded-full bg-[#4DA3F7]" />

                {item}
              </div>
            ))}

          </div>

          {department.services.length > 4 && (
            <p className="mt-3 text-sm font-medium text-[#4DA3F7]">
              +{department.services.length - 4} more services
            </p>
          )}

          <Link
            to={`/departments/${department.slug}`}
            className="mt-8 inline-flex items-center gap-2 rounded-lg bg-[#4DA3F7] px-6 py-3 font-semibold text-white transition hover:bg-[#1565C0]"
          >
            View All

            <ArrowRight size={16} />

          </Link>

        </div>
      </motion.div>
    </>
  );
}