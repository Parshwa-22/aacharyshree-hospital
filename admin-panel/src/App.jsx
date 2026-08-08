import { Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Doctors from "./pages/Doctors";
import Testimonials from "./pages/Testimonials";
import HeroSlides from "./pages/HeroSlides";
import Donors from "./pages/Donors";
import Rooms from "./pages/Rooms";
import Departments from "./pages/Departments";
import Counters from "./pages/Counters";
import Products from "./pages/Products";
import Orders from "./pages/Orders";
import Contacts from "./pages/Contacts";
import NavItems from "./pages/NavItems";
import TrustInfo from "./pages/TrustInfo";
import SiteSettings from "./pages/SiteSettings";
import ContactSettings from "./pages/ContactSettings";
import Monks from "./pages/Monks";
import ProtectedRoute from "./components/ProtectedRoute";

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />

      <Route path="/" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
      <Route path="/doctors" element={<ProtectedRoute><Doctors /></ProtectedRoute>} />
      <Route path="/testimonials" element={<ProtectedRoute><Testimonials /></ProtectedRoute>} />
      <Route path="/hero" element={<ProtectedRoute><HeroSlides /></ProtectedRoute>} />
      <Route path="/donors" element={<ProtectedRoute><Donors /></ProtectedRoute>} />
      <Route path="/rooms" element={<ProtectedRoute><Rooms /></ProtectedRoute>} />
      <Route path="/departments" element={<ProtectedRoute><Departments /></ProtectedRoute>} />
      <Route path="/counters" element={<ProtectedRoute><Counters /></ProtectedRoute>} />
      <Route path="/products" element={<ProtectedRoute><Products /></ProtectedRoute>} />
      <Route path="/orders" element={<ProtectedRoute><Orders /></ProtectedRoute>} />
      <Route path="/contacts" element={<ProtectedRoute><Contacts /></ProtectedRoute>} />
      <Route path="/nav-items" element={<ProtectedRoute><NavItems /></ProtectedRoute>} />
      <Route path="/trust-info" element={<ProtectedRoute><TrustInfo /></ProtectedRoute>} />
      <Route path="/site-settings" element={<ProtectedRoute><SiteSettings /></ProtectedRoute>} />
      <Route path="/contact-settings" element={<ProtectedRoute><ContactSettings /></ProtectedRoute>} />
      <Route path="/monks" element={<ProtectedRoute><Monks /></ProtectedRoute>} />
    </Routes>
  );
}
