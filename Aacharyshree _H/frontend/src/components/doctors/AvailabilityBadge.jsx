import { doctorAvailability } from "../../utils/doctorAvailability";

export default function AvailabilityBadge({ doctor, type, className = "" }) {
  const status = doctor ? doctorAvailability(doctor) : (type === "ON_CALL" ? { label: "On Call", tone: "amber" } : { label: type ? "Available daily" : "", tone: "emerald" });
  if (!status.label) return null;

  return (
    <span
      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold tracking-wide uppercase ${
        status.tone === "amber" ? "bg-amber-100 text-amber-700" : status.tone === "slate" ? "bg-slate-100 text-slate-600" : "bg-emerald-100 text-emerald-700"
      } ${className}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${status.tone === "amber" ? "bg-amber-500" : status.tone === "slate" ? "bg-slate-400" : "bg-emerald-500"}`} />
      {status.label}
    </span>
  );
}
