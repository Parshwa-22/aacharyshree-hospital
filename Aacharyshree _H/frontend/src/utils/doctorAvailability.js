const DAY_CODES = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];
const DAY_ALIASES = { SUNDAY: "SUN", SUN: "SUN", MONDAY: "MON", MON: "MON", TUESDAY: "TUE", TUE: "TUE", WEDNESDAY: "WED", WED: "WED", THURSDAY: "THU", THU: "THU", FRIDAY: "FRI", FRI: "FRI", SATURDAY: "SAT", SAT: "SAT" };

function minutes(value) {
  if (!value || !/^\d{2}:\d{2}$/.test(value)) return null;
  const [hours, mins] = value.split(":").map(Number);
  return hours * 60 + mins;
}

export function formatTimeRange(startTime, endTime) {
  const format = (value) => {
    if (!value) return "";
    const [hour, minute] = value.split(":").map(Number);
    if (Number.isNaN(hour)) return value;
    return `${hour % 12 || 12}:${String(minute).padStart(2, "0")} ${hour >= 12 ? "PM" : "AM"}`;
  };
  return startTime && endTime ? `${format(startTime)} – ${format(endTime)}` : "";
}

export function formatMonthlyDays(daysCsv) {
  const days = [...new Set((daysCsv || "").split(",").map(Number).filter((day) => Number.isInteger(day) && day >= 1 && day <= 31))].sort((a, b) => a - b);
  if (!days.length) return "Dates to be announced";
  const suffix = (day) => (day % 10 === 1 && day % 100 !== 11 ? "st" : day % 10 === 2 && day % 100 !== 12 ? "nd" : day % 10 === 3 && day % 100 !== 13 ? "rd" : "th");
  return `Every month on ${days.map((day) => `${day}${suffix(day)}`).join(", ")}`;
}

export function doctorAvailability(doctor, now = new Date()) {
  if (doctor.availabilityType === "ON_CALL") return { available: false, label: "Available on call", detail: "Please call before visiting", tone: "amber" };
  const isMonthly = doctor.availabilityType === "MONTHLY_DAYS";
  const hasExplicitSchedule = isMonthly ? Boolean(doctor.availableDaysOfMonth) : Boolean(doctor.availableDays);
  if (!hasExplicitSchedule) return { available: false, label: "", detail: "", tone: "slate" };
  const indiaParts = new Intl.DateTimeFormat("en-US", { weekday: "short", day: "numeric", timeZone: "Asia/Kolkata" }).formatToParts(now);
  const indiaWeekday = (indiaParts.find((part) => part.type === "weekday")?.value || "").toUpperCase().slice(0, 3);
  const indiaDay = Number(indiaParts.find((part) => part.type === "day")?.value);
  const scheduledToday = isMonthly
    ? (doctor.availableDaysOfMonth || "").split(",").map(Number).includes(indiaDay)
    : doctor.availableDays.split(",").map((day) => DAY_ALIASES[day.trim().toUpperCase()] || day.trim().toUpperCase()).includes(indiaWeekday);
  const detail = isMonthly ? formatMonthlyDays(doctor.availableDaysOfMonth) : "Regular consultation schedule";
  return scheduledToday
    ? { available: true, label: "Available today", detail, tone: "emerald" }
    : { available: false, label: "Available on selected days", detail, tone: "slate" };
}
