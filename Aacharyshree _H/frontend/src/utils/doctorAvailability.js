const DAY_CODES = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];

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
  if (doctor.availabilityType === "ON_CALL") return { available: false, label: "On call", detail: "Appointment required", tone: "amber" };
  const isMonthly = doctor.availabilityType === "MONTHLY_DAYS";
  const scheduledToday = isMonthly
    ? (doctor.availableDaysOfMonth || "").split(",").map(Number).includes(now.getDate())
    : !doctor.availableDays || doctor.availableDays.split(",").map((day) => day.trim().toUpperCase()).includes(DAY_CODES[now.getDay()]);
  const start = minutes(doctor.startTime);
  const end = minutes(doctor.endTime);
  const current = now.getHours() * 60 + now.getMinutes();
  const withinHours = start === null || end === null || (current >= start && current <= end);
  const detail = isMonthly ? formatMonthlyDays(doctor.availableDaysOfMonth) : "Regular consultation schedule";
  return scheduledToday && withinHours
    ? { available: true, label: "Available now", detail, tone: "emerald" }
    : { available: false, label: "Not available now", detail, tone: "slate" };
}
