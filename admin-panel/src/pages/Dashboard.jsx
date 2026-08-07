import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  Stethoscope,
  MessageSquareQuote,
  Image,
  HeartHandshake,
  BedDouble,
  Menu as MenuIcon,
  Building2,
  Package,
  ShoppingCart,
  PhoneCall,
  Hash,
} from "lucide-react";
import apiClient from "../api/client";

// Products/Orders/Contacts surfaced first — the most operationally
// relevant numbers at a glance, per the requested dashboard overview.
const cards = [
  { key: "products", label: "Products", to: "/products", icon: Package, endpoint: "/api/products" },
  { key: "orders", label: "Orders", to: "/orders", icon: ShoppingCart, endpoint: "/api/orders" },
  { key: "contacts", label: "Department Contacts", to: "/contacts", icon: PhoneCall, endpoint: "/api/contacts" },
  { key: "doctors", label: "Doctors", to: "/doctors", icon: Stethoscope, endpoint: "/api/doctors" },
  { key: "testimonials", label: "Testimonials", to: "/testimonials", icon: MessageSquareQuote, endpoint: "/api/testimonials" },
  { key: "hero", label: "Hero Slides", to: "/hero", icon: Image, endpoint: "/api/hero" },
  { key: "donors", label: "Donors", to: "/donors", icon: HeartHandshake, endpoint: "/api/donors" },
  { key: "rooms", label: "Rooms", to: "/rooms", icon: BedDouble, endpoint: "/api/rooms" },
  { key: "departments", label: "Departments", to: "/departments", icon: Building2, endpoint: "/api/departments" },
  { key: "counters", label: "Homepage Counters", to: "/counters", icon: Hash, endpoint: "/api/counters" },
  { key: "nav-items", label: "Nav Tabs", to: "/nav-items", icon: MenuIcon, endpoint: "/api/nav-items" },
];

export default function Dashboard() {
  const [counts, setCounts] = useState({});

  useEffect(() => {
    cards.forEach(async (card) => {
      try {
        const { data } = await apiClient.get(card.endpoint);
        setCounts((prev) => ({ ...prev, [card.key]: data.length }));
      } catch {
        setCounts((prev) => ({ ...prev, [card.key]: "—" }));
      }
    });
  }, []);

  return (
    <div>
      <h1 className="text-xl font-semibold text-slate-800 mb-1">Dashboard</h1>
      <p className="text-sm text-slate-500 mb-6">
        Everything here updates the public hospital website in real time.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {cards.map(({ key, label, to, icon: Icon }) => (
          <Link
            key={key}
            to={to}
            className="bg-white border border-slate-200 rounded-xl p-5 hover:shadow-md hover:border-brand transition"
          >
            <Icon className="text-brand mb-3" size={22} />
            <p className="text-2xl font-bold text-slate-800">
              {counts[key] ?? <span className="text-slate-300">…</span>}
            </p>
            <p className="text-sm text-slate-500 mt-1">{label}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
