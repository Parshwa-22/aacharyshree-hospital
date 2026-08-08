import { Routes, Route } from "react-router-dom";
import Home from "../public/home/Home";
import About from "../public/about/About";
import Doctors from "../public/doctors/doctors";
import Rooms from "../public/rooms/Rooms";
import Contact from "../public/contact/Contact";
import Donors from "../public/donors/Donors";
import Products from "../public/products/Products";
import DepartmentDetail from "../public/departments/DepartmentDetail";
import Cart from "../public/cart/Cart";
import Wishlist from "../public/wishlist/Wishlist";
import Checkout from "../public/checkout/Checkout";
import OrderConfirmation from "../public/orders/OrderConfirmation";
import TrackOrder from "../public/orders/TrackOrder";
import Monks from "../public/monks/Monks";

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/about" element={<About />} />
      <Route path="/doctors" element={<Doctors />} />
      <Route path="/rooms" element={<Rooms />} />
      <Route path="/contact" element={<Contact />} />
      <Route path="/donors" element={<Donors />} />
      <Route path="/products" element={<Products />} />
      <Route path="/departments/:slug" element={<DepartmentDetail />} />
      <Route path="/cart" element={<Cart />} />
      <Route path="/wishlist" element={<Wishlist />} />
      <Route path="/checkout" element={<Checkout />} />
      <Route path="/order-confirmation/:orderId" element={<OrderConfirmation />} />
      <Route path="/track-order" element={<TrackOrder />} />
      <Route path="/monks" element={<Monks />} />
    </Routes>
  );
};

export default AppRoutes;
