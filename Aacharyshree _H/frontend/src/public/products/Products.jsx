import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Package, ShoppingCart, Heart, Check, Minus, Plus, Star } from "lucide-react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import Navbar from "../../components/home/Navbar";
import Footer from "../../components/home/Footer";
import Accessibility from "../../shared/components/accessibility/AccessibilityButton";
import { useTranslation } from "react-i18next";
import apiClient from "../../api/client";
import { getTranslated } from "../../utils/translate";
import { useCart } from "../../context/CartContext";
import { useWishlist } from "../../context/WishlistContext";
import { useCustomerAuth } from "../../context/CustomerAuthContext";

function ProductCard({ product, lang }) {
  const { addItem } = useCart();
  const { toggle, isWishlisted } = useWishlist();
  const { requireAuth } = useCustomerAuth();
  const [added, setAdded] = useState(false);
  const [qty, setQty] = useState(1);

  const name = getTranslated(product, "name", lang);
  const description = getTranslated(product, "description", lang);
  const images = [...(product.images || [])].sort((a, b) => (a.displayOrder ?? 0) - (b.displayOrder ?? 0));
  const outOfStock = product.stock != null && product.stock <= 0;
  const lowStock = !outOfStock && product.stock != null && product.stock <= 5;
  const wishlisted = isWishlisted(product.id);

  const handleAdd = () => {
    if (outOfStock) return;
    requireAuth(() => {
      addItem(product, qty);
      setAdded(true);
      setQty(1);
      setTimeout(() => setAdded(false), 1500);
    });
  };

  const handleWishlist = () => {
    requireAuth(() => toggle(product.id));
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 hover:shadow-lg transition overflow-hidden relative group">
      <button
        onClick={handleWishlist}
        className="absolute top-3 right-3 z-10 p-2 rounded-full bg-white/90 shadow hover:scale-110 transition"
        aria-label={wishlisted ? "Remove from wishlist" : "Add to wishlist"}
      >
        <Heart size={16} className={wishlisted ? "fill-red-500 text-red-500" : "text-slate-400"} />
      </button>

      {/* IMAGE GALLERY — swipeable when there's more than one photo */}
      <div className="w-full aspect-square bg-slate-50 border-b border-slate-100">
        {images.length > 0 ? (
          images.length > 1 ? (
            <Swiper modules={[Pagination]} pagination={{ clickable: true }} className="w-full h-full product-swiper">
              {images.map((img, i) => (
                <SwiperSlide key={i}>
                  <img src={img.imageUrl} alt={name} className="w-full h-full object-cover" />
                </SwiperSlide>
              ))}
            </Swiper>
          ) : (
            <img src={images[0].imageUrl} alt={name} className="w-full h-full object-cover" />
          )
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Package className="text-slate-300" size={40} />
          </div>
        )}
      </div>

      <div className="p-4">
        {product.category && (
          <p className="text-[10px] uppercase tracking-wide text-[#26AFDE] font-semibold mb-1">{product.category}</p>
        )}
        <h3 className="font-medium text-[#0f2742] text-sm leading-snug line-clamp-2 min-h-[2.5rem]">{name}</h3>

        {/* Amazon/Flipkart-style rating placeholder row — shown only once
            real ratings exist; omitted rather than faked with static stars. */}

        {description && <p className="text-xs text-slate-500 mt-1 line-clamp-2">{description}</p>}

        <div className="flex items-baseline gap-2 mt-3">
          <span className="text-xl font-bold text-[#0f2742]">
            {product.price != null ? `₹${product.price}` : "Contact for pricing"}
          </span>
        </div>

        {outOfStock ? (
          <span className="inline-block mt-1 text-xs text-red-500 font-semibold">Out of stock</span>
        ) : lowStock ? (
          <span className="inline-block mt-1 text-xs text-amber-600 font-semibold">Only {product.stock} left</span>
        ) : (
          <span className="inline-block mt-1 text-xs text-emerald-600 font-semibold">In stock</span>
        )}

        {/* QUANTITY STEPPER — always renders the current value directly,
            no hidden/blurred state, no extra click needed to see it. */}
        {!outOfStock && (
          <div className="flex items-center gap-3 mt-3">
            <div className="flex items-center border border-slate-300 rounded-lg overflow-hidden">
              <button
                type="button"
                onClick={() => setQty((q) => Math.max(1, q - 1))}
                className="px-2.5 py-1.5 text-slate-600 hover:bg-slate-100"
                aria-label="Decrease quantity"
              >
                <Minus size={14} />
              </button>
              <span className="px-3 py-1.5 text-sm font-semibold text-[#0f2742] min-w-[2rem] text-center select-none">
                {qty}
              </span>
              <button
                type="button"
                onClick={() => setQty((q) => q + 1)}
                className="px-2.5 py-1.5 text-slate-600 hover:bg-slate-100"
                aria-label="Increase quantity"
              >
                <Plus size={14} />
              </button>
            </div>
          </div>
        )}

        <button
          onClick={handleAdd}
          disabled={outOfStock}
          className={`mt-3 w-full inline-flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-semibold transition ${
            outOfStock
              ? "bg-slate-100 text-slate-400 cursor-not-allowed"
              : added
              ? "bg-emerald-500 text-white"
              : "bg-gradient-to-r from-[#47C5B9] to-[#26AFDE] text-white hover:opacity-90"
          }`}
        >
          {added ? (
            <>
              <Check size={16} /> Added to Cart
            </>
          ) : (
            <>
              <ShoppingCart size={16} /> Add to Cart
            </>
          )}
        </button>
      </div>
    </div>
  );
}

export default function Products() {
  const { t, i18n } = useTranslation();
  const [products, setProducts] = useState([]);
  const [loaded, setLoaded] = useState(false);
  const { count } = useCart();

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

  return (
    <>
      <Navbar />

      <main className="bg-white">
        <section className="relative h-[280px] md:h-[380px] flex items-center justify-center">
          <img
            src="/images/diagnostic.jpg"
            alt="Products"
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/55" />
          <div className="relative z-10 text-center text-white px-4">
            <h1 className="text-3xl md:text-5xl font-bold">
              {t("productsTitle", "Our Products")}
            </h1>
            <p className="mt-3 text-lg opacity-90">
              {t("productsSubtitle", "Health packages and products offered by the hospital")}
            </p>
          </div>
        </section>

        <div className="max-w-6xl mx-auto px-6 pt-6 flex justify-end">
          <Link
            to="/cart"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#0f2742] text-white text-sm font-semibold shadow hover:opacity-90 transition"
          >
            <ShoppingCart size={16} />
            Cart {count > 0 && `(${count})`}
          </Link>
        </div>

        <section className="max-w-6xl mx-auto px-6 py-8 grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {!loaded ? null : products.length === 0 ? (
            <p className="col-span-full text-center text-slate-400 text-sm border border-dashed border-slate-200 rounded-lg py-14">
              Products will appear here once added in the admin panel.
            </p>
          ) : (
            products.map((product) => <ProductCard key={product.id} product={product} lang={i18n.language} />)
          )}
        </section>

        <Accessibility />
      </main>

      <Footer />
    </>
  );
}
