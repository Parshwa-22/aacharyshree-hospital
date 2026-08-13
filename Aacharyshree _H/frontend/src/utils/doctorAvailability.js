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

export function formatSpecificDates(datesCsv) {
  const dates = (datesCsv || "").split(",").map((date) => date.trim()).filter(Boolean).sort();
  if (!dates.length) return "Dates to be announced";
  return dates.map((date) => new Date(`${date}T00:00:00`).toLocaleDateString(undefined, { day: "numeric", month: "short" })).join(", ");
}

export function doctorAvailability(doctor, now = new Date()) {
  if (doctor.availabilityType === "ON_CALL") return { available: false, label: "On call", detail: "Appointment required", tone: "amber" };
  const today = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;
  const isSpecificDate = doctor.availabilityType === "SPECIFIC_DATES";
  const scheduledToday = isSpecificDate
    ? (doctor.availableDates || "").split(",").map((date) => date.trim()).includes(today)
    : !doctor.availableDays || doctor.availableDays.split(",").map((day) => day.trim().toUpperCase()).includes(DAY_CODES[now.getDay()]);
  const start = minutes(doctor.startTime);
  const end = minutes(doctor.endTime);
  const current = now.getHours() * 60 + now.getMinutes();
  const withinHours = start === null || end === null || (current >= start && current <= end);
  const detail = isSpecificDate ? formatSpecificDates(doctor.availableDates) : "Regular consultation schedule";
  return scheduledToday && withinHours
    ? { available: true, label: "Available now", detail, tone: "emerald" }
    : { available: false, label: "Not available now", detail, tone: "slate" };
}
