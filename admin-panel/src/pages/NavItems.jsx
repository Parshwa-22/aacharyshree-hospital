import { useState } from "react";
import CollectionManager from "../components/collection/CollectionManager";
import { entityConfigs } from "../config/entityConfigs";

// Two separate, filtered views of the same /api/nav-items collection —
// items set to "BOTH" show up in both tabs, which is correct since they
// really do appear in both places on the live site.
function buildConfig(location) {
  return {
    ...entityConfigs.navItems,
    title: location === "NAVBAR" ? "Navbar Tabs" : "Footer Tabs",
    queryParams: { location },
    fields: entityConfigs.navItems.fields.map((f) =>
      f.name === "location" ? { ...f, default: location } : f
    ),
  };
}

const NAVBAR_CONFIG = buildConfig("NAVBAR");
const FOOTER_CONFIG = buildConfig("FOOTER");

export default function NavItems() {
  const [tab, setTab] = useState("NAVBAR");

  return (
    <div>
      <div className="flex gap-2 mb-6">
        <button
          onClick={() => setTab("NAVBAR")}
          className={`px-4 py-2 text-sm font-semibold rounded-full transition ${
            tab === "NAVBAR" ? "bg-brand text-white" : "bg-slate-100 text-slate-600"
          }`}
        >
          Navbar
        </button>
        <button
          onClick={() => setTab("FOOTER")}
          className={`px-4 py-2 text-sm font-semibold rounded-full transition ${
            tab === "FOOTER" ? "bg-brand text-white" : "bg-slate-100 text-slate-600"
          }`}
        >
          Footer
        </button>
      </div>

      <CollectionManager config={tab === "NAVBAR" ? NAVBAR_CONFIG : FOOTER_CONFIG} />

      <p className="text-xs text-slate-400 mt-6">
        Setting "Show in" to <strong>Both</strong> on an item makes it appear in both tabs —
        that's expected, it really does show in both the navbar and the footer on the live site.
      </p>
    </div>
  );
}
