import { useState } from "react";

export default function SpecializationText({ children, className = "", limit = 72 }) {
  const [expanded, setExpanded] = useState(false);
  const text = typeof children === "string" ? children.trim() : "";
  const needsToggle = text.length > limit;
  const shown = !needsToggle || expanded ? text : `${text.slice(0, limit).trimEnd()}…`;

  return (
    <p className={`break-words text-sm font-semibold text-slate-700 ${className}`}>
      {shown}
      {needsToggle && <button type="button" onClick={(event) => { event.preventDefault(); event.stopPropagation(); setExpanded((value) => !value); }} className="ml-1 whitespace-nowrap text-xs font-bold text-[#1597C2] hover:text-[#0f2742] hover:underline" aria-expanded={expanded}>{expanded ? "Show less" : "Read more"}</button>}
    </p>
  );
}
