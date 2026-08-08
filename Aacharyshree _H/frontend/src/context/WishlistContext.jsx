import { createContext, useContext, useEffect, useState } from "react";

const WishlistContext = createContext(null);
const STORAGE_KEY = "hospital_wishlist_v1";

function storageKey(email) { return email ? `${STORAGE_KEY}:${email.toLowerCase()}` : STORAGE_KEY; }
function loadWishlist(email = localStorage.getItem("customer_email")) {
  try {
    const raw = localStorage.getItem(storageKey(email));
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function WishlistProvider({ children }) {
  const [productIds, setProductIds] = useState(loadWishlist);
  const [ownerEmail, setOwnerEmail] = useState(() => localStorage.getItem("customer_email"));

  useEffect(() => {
    if (ownerEmail) localStorage.setItem(storageKey(ownerEmail), JSON.stringify(productIds));
  }, [productIds, ownerEmail]);

  useEffect(() => {
    const changeOwner = (event) => { const email = event.detail || null; setOwnerEmail(email); setProductIds(loadWishlist(email)); };
    const clearOnLogout = () => { setOwnerEmail(null); setProductIds([]); };
    window.addEventListener("customer-login", changeOwner);
    window.addEventListener("customer-logout", clearOnLogout);
    return () => { window.removeEventListener("customer-login", changeOwner); window.removeEventListener("customer-logout", clearOnLogout); };
  }, []);

  const toggle = (productId) => {
    setProductIds((prev) =>
      prev.includes(productId) ? prev.filter((id) => id !== productId) : [...prev, productId]
    );
  };

  const isWishlisted = (productId) => productIds.includes(productId);

  return (
    <WishlistContext.Provider value={{ productIds, toggle, isWishlisted }}>
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  const ctx = useContext(WishlistContext);
  if (!ctx) throw new Error("useWishlist must be used inside <WishlistProvider>");
  return ctx;
}
