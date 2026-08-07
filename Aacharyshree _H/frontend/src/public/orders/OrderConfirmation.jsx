import { useEffect, useState } from "react";
import { useParams, useSearchParams, Link } from "react-router-dom";
import { CheckCircle2, Loader2 } from "lucide-react";
import Navbar from "../../components/home/Navbar";
import Footer from "../../components/home/Footer";
import apiClient from "../../api/client";

export default function OrderConfirmation() {
  const { orderId } = useParams();
  const [searchParams] = useSearchParams();
  const phone = searchParams.get("phone") || "";

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!orderId || !phone) {
      setLoading(false);
      return;
    }
    apiClient
      .get("/api/orders/track", { params: { orderId, phone } })
      .then(({ data }) => setOrder(data))
      .catch(() => setOrder(null))
      .finally(() => setLoading(false));
  }, [orderId, phone]);

  return (
    <>
      <Navbar />

      <main className="bg-white min-h-[60vh] flex items-center justify-center px-6 py-14">
        <div className="max-w-md w-full text-center">
          {loading ? (
            <Loader2 className="animate-spin mx-auto text-slate-400" size={32} />
          ) : (
            <>
              <CheckCircle2 className="mx-auto text-emerald-500 mb-4" size={56} />
              <h1 className="text-2xl font-bold text-[#0f2742] mb-2">Order Placed!</h1>
              <p className="text-slate-500 mb-6">
                Your order <span className="font-semibold text-[#0f2742]">#{orderId}</span> has been received.
                {order?.paymentStatus === "PAID" ? " Payment confirmed." : " We'll confirm payment shortly."}
              </p>

              <div className="bg-[#F8FAFD] rounded-xl p-4 text-left text-sm text-slate-600 mb-6">
                <p>Keep your <strong>Order ID</strong> and <strong>phone number</strong> — you'll need both to track your order.</p>
              </div>

              <div className="flex gap-3 justify-center">
                <Link
                  to={`/track-order?orderId=${orderId}&phone=${encodeURIComponent(phone)}`}
                  className="px-5 py-2.5 rounded-md border border-slate-300 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                >
                  Track This Order
                </Link>
                <Link
                  to="/products"
                  className="px-5 py-2.5 rounded-md bg-gradient-to-r from-[#47C5B9] to-[#26AFDE] text-white text-sm font-semibold"
                >
                  Continue Shopping
                </Link>
              </div>
            </>
          )}
        </div>
      </main>

      <Footer />
    </>
  );
}
