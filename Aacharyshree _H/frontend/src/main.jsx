import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";
import { BrowserRouter } from "react-router-dom";
import "./i18n"; // Import the i18n configuration
import { CartProvider } from "./context/CartContext";
import { WishlistProvider } from "./context/WishlistContext";
import { CustomerAuthProvider } from "./context/CustomerAuthContext";
import AuthModal from "./shared/components/auth/AuthModal";

ReactDOM.createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <CustomerAuthProvider>
      <CartProvider>
        <WishlistProvider>
          <App />
          <AuthModal />
        </WishlistProvider>
      </CartProvider>
    </CustomerAuthProvider>
  </BrowserRouter>
);
