import { NavLink, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Stethoscope,
  MessageSquareQuote,
  Image,
  HeartHandshake,
  BedDouble,
  Menu as MenuIcon,
  Building2,
  Settings,
  Landmark,
  Package,
  ShoppingCart,
  PhoneCall,
  Phone,
  Hash,
  LogOut,
  CalendarDays, Images,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";

const links = [
  { to: "/", label: "Dashboard", icon: LayoutDashboard, end: true },
  { to: "/doctors", label: "Doctors", icon: Stethoscope },
  { to: "/testimonials", label: "Testimonials", icon: MessageSquareQuote },
  { to: "/hero", label: "Hero Slides", icon: Image },
  { to: "/donors", label: "Donors", icon: HeartHandshake },
  { to: "/rooms", label: "Rooms", icon: BedDouble },
  { to: "/departments", label: "Departments", icon: Building2 },
  { to: "/counters", label: "Homepage Counters", icon: Hash },
  { to: "/products", label: "Products", icon: Package },
  { to: "/orders", label: "Orders", icon: ShoppingCart },
  { to: "/contacts", label: "Department Contacts", icon: PhoneCall },
  { to: "/nav-items", label: "Navbar & Footer Tabs", icon: MenuIcon },
  { to: "/trust-info", label: "Trust Info (About page)", icon: Landmark },
  { to: "/contact-settings", label: "Click-to-Call Numbers", icon: Phone },
  { to: "/site-settings", label: "Site Settings", icon: Settings },
  { to: "/events", label: "Events", icon: CalendarDays },
  { to: "/gallery", label: "Photo Gallery", icon: Images },
];

export default function Sidebar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <aside className="w-64 flex-shrink-0 bg-[#0f2742] text-white flex flex-col h-screen sticky top-0">
      <div className="px-6 py-5 border-b border-white/10">
        <p className="font-bold text-lg leading-tight">Aacharyshree</p>
        <p className="text-xs text-white/50">Admin Panel</p>
      </div>

      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {links.map(({ to, label, icon: Icon, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition ${
                isActive ? "bg-brand text-white" : "text-white/70 hover:bg-white/10 hover:text-white"
              }`
            }
          >
            <Icon size={18} />
            {label}
          </NavLink>
        ))}
      </nav>

      <div className="px-4 py-4 border-t border-white/10">
        <p className="text-xs text-white/50 px-2 mb-2 truncate">Signed in as {user?.username}</p>
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-white/70 hover:bg-white/10 hover:text-white transition"
        >
          <LogOut size={16} /> Log out
        </button>
      </div>
    </aside>
  );
}
