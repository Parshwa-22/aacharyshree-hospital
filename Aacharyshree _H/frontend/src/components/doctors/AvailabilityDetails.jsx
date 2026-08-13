import { useState } from "react";
import { CalendarDays, Clock3, ChevronDown } from "lucide-react";
import { formatAvailableDays } from "../../utils/formatDays";
import { formatMonthlyDays, formatTimeRange } from "../../utils/doctorAvailability";

export default function AvailabilityDetails({ doctor }) {
  const [open, setOpen] = useState(false);
  const hasSchedule = doctor.availableDays || doctor.availableDaysOfMonth || doctor.startTime || doctor.endTime || doctor.availabilityType === "ON_CALL";
  const isMonthly = doctor.availabilityType === "MONTHLY_DAYS";
  const schedule = !hasSchedule ? "Schedule not set" : doctor.availabilityType === "ON_CALL" ? "Please call before visiting" : isMonthly ? formatMonthlyDays(doctor.availableDaysOfMonth) : formatAvailableDays(doctor.availableDays) || "Available every day";
  const time = formatTimeRange(doctor.startTime, doctor.endTime);
  return <div className="mt-3 text-left"><button type="button" onClick={() => setOpen((value) => !value)} className="flex w-full items-center justify-center gap-1.5 rounded-lg border border-[#26AFDE]/25 bg-[#F5FCFE] px-3 py-2 text-xs font-bold text-[#147c9e] transition hover:bg-[#e9f9fd]" aria-expanded={open}><CalendarDays size={14} /> View availability <ChevronDown size={14} className={`transition ${open ? "rotate-180" : ""}`} /></button>{open && <div className="mt-2 space-y-2 rounded-xl border border-slate-100 bg-slate-50 p-3 text-xs text-slate-600"><div className="flex items-start gap-2"><CalendarDays size={15} className="mt-0.5 shrink-0 text-[#26AFDE]" /><span><b className="text-slate-700">{!hasSchedule ? "Schedule:" : isMonthly ? "Monthly visit:" : "Days:"}</b> {schedule}</span></div>{time && <div className="flex items-center gap-2"><Clock3 size={15} className="shrink-0 text-[#26AFDE]" /><span><b className="text-slate-700">Time:</b> {time}</span></div>}</div>}</div>;
}
