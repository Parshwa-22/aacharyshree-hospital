import Sidebar from "./Sidebar";
import { Menu, X } from "lucide-react";
import { useState } from "react";

export default function AdminLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <main className="min-w-0 flex-1 px-4 py-5 sm:px-8 sm:py-8 max-w-5xl">
        <button type="button" onClick={() => setSidebarOpen((open) => !open)} className="mb-4 inline-flex items-center gap-2 rounded-lg bg-[#0f2742] px-3 py-2 text-sm font-semibold text-white md:hidden" aria-label="Open admin menu">
          {sidebarOpen ? <X size={18} /> : <Menu size={18} />} Menu
        </button>
        {children}
      </main>
    </div>
  );
}
