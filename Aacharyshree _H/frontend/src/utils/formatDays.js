const DAY_ORDER = ["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"];
const DAY_LABEL = {
  MON: "Mon",
  TUE: "Tue",
  WED: "Wed",
  THU: "Thu",
  FRI: "Fri",
  SAT: "Sat",
  SUN: "Sun",
};

/**
 * "MON,TUE,WED,FRI" -> "Mon-Wed, Fri"
 * "MON,WED,FRI"      -> "Mon, Wed, Fri" (no two are consecutive)
 * "MON,TUE,WED,THU,FRI,SAT,SUN" -> "Mon-Sun"
 */
export function formatAvailableDays(daysCsv) {
  if (!daysCsv) return "";

  const selected = daysCsv
    .split(",")
    .map((d) => d.trim().toUpperCase())
    .filter((d) => DAY_ORDER.includes(d));

  if (selected.length === 0) return "";

  // Sort into calendar order regardless of how they were stored.
  const ordered = DAY_ORDER.filter((d) => selected.includes(d));

  const runs = [];
  let runStart = ordered[0];
  let runEnd = ordered[0];

  for (let i = 1; i < ordered.length; i++) {
    const prevIndex = DAY_ORDER.indexOf(runEnd);
    const currIndex = DAY_ORDER.indexOf(ordered[i]);
    if (currIndex === prevIndex + 1) {
      runEnd = ordered[i];
    } else {
      runs.push([runStart, runEnd]);
      runStart = ordered[i];
      runEnd = ordered[i];
    }
  }
  runs.push([runStart, runEnd]);

  return runs
    .map(([start, end]) =>
      start === end ? DAY_LABEL[start] : `${DAY_LABEL[start]}-${DAY_LABEL[end]}`
    )
    .join(", ");
}
