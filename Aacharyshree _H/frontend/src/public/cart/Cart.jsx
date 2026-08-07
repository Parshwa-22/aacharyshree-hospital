import { Link, useNavigate } from "react-router-dom";
import { Trash2, Plus, Minus, ShoppingBag, Heart } from "lucide-react";
import Navbar from "../../components/home/Navbar";
import Footer from "../../components/home/Footer";
import { useCart } from "../../context/CartContext";
import { useWishlist } from "../../context/WishlistContext";
import { useCustomerAuth } from "../../context/CustomerAuthContext";

export default function Cart() {
  const { items, removeItem, updateQuantity, total } = useCart();
  const { productIds } = useWishlist();
  const { requireAuth } = useCustomerAuth();
  const navigate = useNavigate();

  return (
    <>
      <Navbar />

      <main className="bg-white min-h-[60vh]">
        <div className="max-w-4xl mx-auto px-6 py-14">
          <h1 className="text-3xl font-bold text-[#0f2742] mb-2">Your Cart</h1>
          <div className="flex items-center gap-4 mb-8">
            <p className="text-slate-500 text-sm">{items.length} item{items.length !== 1 ? "s" : ""}</p>
            {productIds.length > 0 && (
              <Link to="/wishlist" className="text-sm text-[#26AFDE] hover:underline inline-flex items-center gap-1">
                <Heart size={14} /> View Wishlist ({productIds.length})
              </Link>
            )}
          </div>

          {items.length === 0 ? (
            <div className="text-center py-20 border border-dashed border-slate-200 rounded-xl">
              <ShoppingBag className="mx-auto text-slate-300 mb-4" size={40} />
              <p className="text-slate-400 mb-4">Your cart is empty.</p>
              <Link
                to="/products"
                className="inline-block px-6 py-3 rounded-md bg-gradient-to-r from-[#47C5B9] to-[#26AFDE] text-white font-semibold"
              >
                Browse Products
              </Link>
            </div>
          ) : (
            <>
              <div className="space-y-3 mb-8">
                {items.map((item) => (
                  <div key={item.productId} className="flex items-center gap-4 bg-[#F8FAFD] rounded-xl p-4">
                    {item.image ? (
                      <img src={item.image} alt={item.name} className="w-16 h-16 rounded-lg object-cover" />
                    ) : (
                      <div className="w-16 h-16 rounded-lg bg-slate-200" />
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-[#0f2742] truncate">{item.name}</p>
                      <p className="text-sm text-slate-500">₹{item.price} each</p>
                    </div>
                    <div className="flex items-center gap-2 bg-white rounded-full border border-slate-200 px-2 py-1">
                      <button
                        onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                        className="p-1 text-slate-500 hover:text-[#0f2742]"
                        aria-label="Decrease quantity"
                      >
                        <Minus size={14} />
                      </button>
                      <span className="text-sm font-semibold w-5 text-center text-[#0f2742]">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                        className="p-1 text-slate-500 hover:text-[#0f2742]"
                        aria-label="Increase quantity"
                      >
                        <Plus size={14} />
                      </button>
                    </div>
                    <span className="font-semibold text-[#0f2742] w-20 text-right">
                      ₹{(item.price * item.quantity).toFixed(2)}
                    </span>
                    <button
                      onClick={() => removeItem(item.productId)}
                      className="p-2 text-red-400 hover:text-red-600"
                      aria-label="Remove item"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                ))}
              </div>

              <div className="flex items-center justify-between border-t border-slate-200 pt-6">
                <span className="text-lg font-semibold text-[#0f2742]">Total</span>
                <span className="text-2xl font-bold text-[#0f2742]">₹{total.toFixed(2)}</span>
              </div>

              <button
                onClick={() => requireAuth(() => navigate("/checkout"))}
                className="mt-6 w-full py-3.5 rounded-lg bg-gradient-to-r from-[#47C5B9] to-[#26AFDE] text-white font-semibold text-lg hover:opacity-90 transition"
              >
                Proceed to Checkout
              </button>
            </>
          )}
        </div>
      </main>

      <Footer />
    </>
  );
}
