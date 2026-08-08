import { createContext, useContext, useState } from "react";
import apiClient from "../api/client";

const CustomerAuthContext = createContext(null);
const TOKEN_KEY = "customer_token";
const EMAIL_KEY = "customer_email";

export function CustomerAuthProvider({ children }) {
  const [email, setEmail] = useState(() => localStorage.getItem(EMAIL_KEY));
  const [token, setToken] = useState(() => localStorage.getItem(TOKEN_KEY));
  const [modalOpen, setModalOpen] = useState(false);
  const [pendingAction, setPendingAction] = useState(null);

  const requestOtp = async (emailToVerify) => {
    await apiClient.post("/api/customer-auth/request-otp", { email: emailToVerify });
  };

  const verifyOtp = async (emailToVerify, otp) => {
    const { data } = await apiClient.post("/api/customer-auth/verify-otp", {
      email: emailToVerify,
      otp,
    });
    localStorage.setItem(TOKEN_KEY, data.token);
    localStorage.setItem(EMAIL_KEY, data.email);
    setToken(data.token);
    setEmail(data.email);
    return data;
  };

  const logout = () => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(EMAIL_KEY);
    setToken(null);
    setEmail(null);
    window.dispatchEvent(new Event("customer-logout"));
  };

  // Call this instead of running an action directly whenever that action
  // should only happen while logged in (Add to Cart, Wishlist, Buy Now).
  // If already logged in, runs immediately; otherwise opens the login
  // modal and re-runs `action` automatically the moment OTP verification
  // succeeds — the user never has to click "Add to Cart" a second time.
  const requireAuth = (action) => {
    if (token) {
      action();
      return;
    }
    setPendingAction(() => action);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setPendingAction(null);
  };

  const onAuthSuccess = () => {
    setModalOpen(false);
    if (pendingAction) {
      pendingAction();
      setPendingAction(null);
    }
  };

  return (
    <CustomerAuthContext.Provider
      value={{
        email,
        token,
        isAuthenticated: !!token,
        requestOtp,
        verifyOtp,
        logout,
        requireAuth,
        modalOpen,
        closeModal,
        onAuthSuccess,
      }}
    >
      {children}
    </CustomerAuthContext.Provider>
  );
}

export function useCustomerAuth() {
  const ctx = useContext(CustomerAuthContext);
  if (!ctx) throw new Error("useCustomerAuth must be used inside <CustomerAuthProvider>");
  return ctx;
}
