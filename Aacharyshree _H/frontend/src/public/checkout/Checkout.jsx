import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Loader2, ShieldCheck } from "lucide-react";
import Navbar from "../../components/home/Navbar";
import Footer from "../../components/home/Footer";
import apiClient from "../../api/client";
import { useCart } from "../../context/CartContext";
import { useCustomerAuth } from "../../context/CustomerAuthContext";

// Loads the Razorpay Checkout script once, and reuses it on later checkouts.
function loadRazorpayScript() {
  return new Promise((resolve) => {
    if (window.Razorpay) {
      resolve(true);
      return;
    }
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
}

export default function Checkout() {
  const { items, total, clearCart } = useCart();
  const { email: customerEmail, isAuthenticated, requireAuth } = useCustomerAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({ name: "", phone: "", email: customerEmail || "", address: "" });

  useEffect(() => {
    // Direct navigation to /checkout (skipping the Cart page's gate) still
    // requires login — bounce back to /cart, where requireAuth will prompt.
    if (!isAuthenticated) {
      navigate("/cart");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const setField = (name, value) => setForm((prev) => ({ ...prev, [name]: value }));

  const handleCheckout = async (e) => {
    e.preventDefault();
    setError("");

    if (!form.name || !form.phone) {
      setError("Name and phone number are required.");
      return;
    }
    if (items.length === 0) {
      setError("Your cart is empty.");
      return;
    }

    setLoading(true);
    try {
      // Step 1: ask our backend to create the order + a matching Razorpay order.
      const { data: orderData } = await apiClient.post("/api/orders/create-razorpay-order", {
        customerName: form.name,
        customerPhone: form.phone,
        customerEmail: form.email,
        customerAddress: form.address,
        items: items.map((i) => ({ productId: i.productId, quantity: i.quantity })),
      });

      const scriptLoaded = await loadRazorpayScript();
      if (!scriptLoaded) {
        setError("Could not load the payment gateway. Check your internet connection and try again.");
        setLoading(false);
        return;
      }

      // Step 2: open Razorpay's Checkout widget.
      const razorpay = new window.Razorpay({
        key: orderData.razorpayKeyId,
        amount: orderData.amountInPaise,
        currency: orderData.currency,
        name: "Aacharyshree Hospital",
        description: "Order #" + orderData.orderId,
        order_id: orderData.razorpayOrderId,
        prefill: {
          name: form.name,
          contact: form.phone,
          email: form.email,
        },
        handler: async (response) => {
          // Step 3: hand the payment result back to our backend to verify + confirm.
          try {
            await apiClient.post("/api/orders/verify-payment", {
              orderId: orderData.orderId,
              razorpayOrderId: response.razorpay_order_id,
              razorpayPaymentId: response.razorpay_payment_id,
              razorpaySignature: response.razorpay_signature,
            });
            clearCart();
            navigate(`/order-confirmation/${orderData.orderId}?phone=${encodeURIComponent(form.phone)}`);
          } catch (err) {
            setError("Payment succeeded but confirming the order failed — contact us with your payment ID: " + response.razorpay_payment_id);
          } finally {
            setLoading(false);
          }
        },
        modal: {
          ondismiss: () => setLoading(false),
        },
        theme: { color: "#26AFDE" },
      });

      razorpay.on("payment.failed", () => {
        setError("Payment failed or was cancelled. Please try again.");
        setLoading(false);
      });

      razorpay.open();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to start checkout. Please try again.");
      setLoading(false);
    }
  };

  if (items.length === 0) {
    return (
      <>
        <Navbar />
        <main className="min-h-[50vh] flex items-center justify-center text-center px-6">
          <div>
            <p className="text-slate-400 mb-4">Your cart is empty.</p>
            <Link to="/products" className="text-[#26AFDE] underline">Browse Products</Link>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />

      <main className="bg-white min-h-[60vh]">
        <div className="max-w-2xl mx-auto px-6 py-14">
          <h1 className="text-3xl font-bold text-[#0f2742] mb-2">Checkout</h1>
          <p className="text-slate-500 text-sm mb-8">
            No account needed — just your details for delivery and order tracking.
          </p>

          <div className="bg-[#F8FAFD] rounded-xl p-4 mb-8">
            {items.map((item) => (
              <div key={item.productId} className="flex justify-between text-sm text-slate-600 py-1">
                <span>{item.name} × {item.quantity}</span>
                <span>₹{(item.price * item.quantity).toFixed(2)}</span>
              </div>
            ))}
            <div className="flex justify-between font-bold text-[#0f2742] pt-3 mt-2 border-t border-slate-200">
              <span>Total</span>
              <span>₹{total.toFixed(2)}</span>
            </div>
          </div>

          <form onSubmit={handleCheckout} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Full Name *</label>
              <input
                className="w-full rounded-md border border-slate-300 px-3 py-2.5 text-sm"
                value={form.name}
                onChange={(e) => setField("name", e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Phone Number *</label>
              <input
                className="w-full rounded-md border border-slate-300 px-3 py-2.5 text-sm"
                value={form.phone}
                onChange={(e) => setField("phone", e.target.value)}
                placeholder="Used to track your order later"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
              <input
                type="email"
                className="w-full rounded-md border border-slate-300 px-3 py-2.5 text-sm"
                value={form.email}
                onChange={(e) => setField("email", e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Delivery Address</label>
              <textarea
                rows={3}
                className="w-full rounded-md border border-slate-300 px-3 py-2.5 text-sm"
                value={form.address}
                onChange={(e) => setField("address", e.target.value)}
              />
            </div>

            {error && <p className="text-sm text-red-500">{error}</p>}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-lg bg-gradient-to-r from-[#47C5B9] to-[#26AFDE] text-white font-semibold text-lg hover:opacity-90 transition disabled:opacity-50 inline-flex items-center justify-center gap-2"
            >
              {loading ? <Loader2 className="animate-spin" size={20} /> : <ShieldCheck size={20} />}
              {loading ? "Processing..." : `Pay ₹${total.toFixed(2)} Securely`}
            </button>
          </form>
        </div>
      </main>

      <Footer />
    </>
  );
}
