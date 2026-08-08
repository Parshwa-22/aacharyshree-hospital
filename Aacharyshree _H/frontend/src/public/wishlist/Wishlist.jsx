import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Heart, ShoppingCart } from "lucide-react";
import Navbar from "../../components/home/Navbar";
import Footer from "../../components/home/Footer";
import apiClient from "../../api/client";
import { useWishlist } from "../../context/WishlistContext";
import { useCart } from "../../context/CartContext";
import { useTranslation } from "react-i18next";
import { getTranslated } from "../../utils/translate";
import { useCustomerAuth } from "../../context/CustomerAuthContext";

export default function Wishlist() {
  const { i18n } = useTranslation();
  const { productIds, toggle } = useWishlist();
  const { addItem } = useCart();
  const { requireAuth } = useCustomerAuth();
  const [products, setProducts] = useState([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    let cancelled = false;
    apiClient
      .get("/api/products", { params: { active: true } })
      .then(({ data }) => {
        if (cancelled) return;
        setProducts(Array.isArray(data) ? data : []);
        setLoaded(true);
      })
      .catch(() => {
        if (!cancelled) setLoaded(true);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const wishlistedProducts = products.filter((p) => productIds.includes(p.id));

  return (
    <>
      <Navbar />

      <main className="bg-white min-h-[60vh]">
        <div className="max-w-4xl mx-auto px-6 py-14">
          <h1 className="text-3xl font-bold text-[#0f2742] mb-8 flex items-center gap-2">
            <Heart className="text-red-500 fill-red-500" size={26} /> Your Wishlist
          </h1>

          {loaded && wishlistedProducts.length === 0 ? (
            <div className="text-center py-20 border border-dashed border-slate-200 rounded-xl">
              <p className="text-slate-400 mb-4">Nothing saved yet.</p>
              <Link to="/products" className="inline-block px-6 py-3 rounded-md bg-gradient-to-r from-[#47C5B9] to-[#26AFDE] text-white font-semibold">
                Browse Products
              </Link>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 gap-4">
              {wishlistedProducts.map((product) => (
                <div key={product.id} className="flex items-center gap-4 bg-[#F8FAFD] rounded-xl p-4">
                  {product.images?.[0]?.imageUrl && (
                    <img src={product.images[0].imageUrl} alt={product.name} className="w-16 h-16 rounded-lg object-cover" />
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-[#0f2742] truncate">
                      {getTranslated(product, "name", i18n.language)}
                    </p>
                    <p className="text-sm text-slate-500">{product.price != null ? `₹${product.price}` : ""}</p>
                  </div>
                  <button
                    onClick={() => requireAuth(() => addItem(product))}
                    className="p-2 rounded-full bg-[#26AFDE] text-white hover:opacity-90"
                    aria-label="Add to cart"
                  >
                    <ShoppingCart size={16} />
                  </button>
                  <button
                    onClick={() => toggle(product.id)}
                    className="p-2 rounded-full text-red-400 hover:text-red-600"
                    aria-label="Remove from wishlist"
                  >
                    <Heart size={16} className="fill-red-500" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </>
  );
}
