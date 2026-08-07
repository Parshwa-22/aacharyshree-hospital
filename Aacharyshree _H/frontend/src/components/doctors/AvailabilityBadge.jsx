export default function AvailabilityBadge({ type, className = "" }) {
  if (!type) return null;

  const isOnCall = type === "ON_CALL";

  return (
    <span
      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold tracking-wide uppercase ${
        isOnCall ? "bg-amber-100 text-amber-700" : "bg-emerald-100 text-emerald-700"
      } ${className}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${isOnCall ? "bg-amber-500" : "bg-emerald-500"}`} />
      {isOnCall ? "On Call" : "Available Daily"}
    </span>
  );
}
