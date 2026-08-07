import Navbar from "../../components/home/Navbar";
import Footer from "../../components/home/Footer";
import Accessibility from "../../shared/components/accessibility/AccessibilityButton";

// ✅ Your new modular room components
import  Rooms  from "../../components/rooms";

export default function RoomsPage() {
return (
<> <Navbar />


  <main className="pt-0">
    {/* 🔷 Rooms Section (Main Showcase) */}
    <Rooms />

    {/* 🔷 Global Features */}
    <Accessibility />
  </main>

  <Footer />
</>

);
}
