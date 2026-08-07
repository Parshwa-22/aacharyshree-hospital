import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Search, Loader2, PackageCheck, PackageX } from "lucide-react";
import Navbar from "../../components/home/Navbar";
import Footer from "../../components/home/Footer";
import apiClient from "../../api/client";

const STATUS_STEPS = ["PLACED", "CONFIRMED", "PACKED", "SHIPPED", "DELIVERED"];

export default function TrackOrder() {
  const [searchParams] = useSearchParams();
  const [orderId, setOrderId] = useState(searchParams.get("orderId") || "");
  const [phone, setPhone] = useState(searchParams.get("phone") || "");
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [searched, setSearched] = useState(false);

  const handleSearch = async (e) => {
    e?.preventDefault();
    if (!orderId || !phone) {
      setError("Enter both your Order ID and phone number.");
      return;
    }
    setLoading(true);
    setError("");
    setSearched(true);
    try {
      const { data } = await apiClient.get("/api/orders/track", { params: { orderId, phone } });
      setOrder(data);
    } catch (err) {
      setOrder(null);
      setError("No order found with that Order ID and phone number.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (searchParams.get("orderId") && searchParams.get("phone")) {
      handleSearch();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const isCancelled = order?.status === "CANCELLED";
  const currentStepIndex = STATUS_STEPS.indexOf(order?.status);

  return (
    <>
      <Navbar />

      <main className="bg-white min-h-[60vh]">
        <div className="max-w-2xl mx-auto px-6 py-14">
          <h1 className="text-3xl font-bold text-[#0f2742] mb-2">Track Your Order</h1>
          <p className="text-slate-500 text-sm mb-8">Enter the Order ID and phone number you used at checkout.</p>

          <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-3 mb-8">
            <input
              className="flex-1 rounded-md border border-slate-300 px-3 py-2.5 text-sm"
              placeholder="Order ID"
              value={orderId}
              onChange={(e) => setOrderId(e.target.value)}
            />
            <input
              className="flex-1 rounded-md border border-slate-300 px-3 py-2.5 text-sm"
              placeholder="Phone Number"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
            <button
              type="submit"
              disabled={loading}
              className="px-5 py-2.5 rounded-md bg-gradient-to-r from-[#47C5B9] to-[#26AFDE] text-white font-semibold text-sm inline-flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {loading ? <Loader2 className="animate-spin" size={16} /> : <Search size={16} />}
              Track
            </button>
          </form>

          {error && <p className="text-sm text-red-500 mb-6">{error}</p>}

          {searched && !loading && order && (
            <div className="bg-[#F8FAFD] rounded-xl p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <p className="font-semibold text-[#0f2742]">Order #{order.id}</p>
                  <p className="text-xs text-slate-500">{new Date(order.createdAt).toLocaleString()}</p>
                </div>
                {isCancelled ? (
                  <PackageX className="text-red-500" size={28} />
                ) : (
                  <PackageCheck className="text-emerald-500" size={28} />
                )}
              </div>

              {isCancelled ? (
                <p className="text-red-600 font-semibold text-center py-4">This order was cancelled.</p>
              ) : (
                <div className="flex items-center justify-between mb-2">
                  {STATUS_STEPS.map((step, i) => (
                    <div key={step} className="flex-1 flex flex-col items-center relative">
                      {i > 0 && (
                        <div
                          className={`absolute right-1/2 top-3 h-0.5 w-full -z-10 ${
                            i <= currentStepIndex ? "bg-[#26AFDE]" : "bg-slate-200"
                          }`}
                        />
                      )}
                      <div
                        className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold ${
                          i <= currentStepIndex ? "bg-[#26AFDE] text-white" : "bg-slate-200 text-slate-400"
                        }`}
                      >
                        {i + 1}
                      </div>
                      <span className={`text-[10px] mt-2 text-center ${i <= currentStepIndex ? "text-[#0f2742] font-semibold" : "text-slate-400"}`}>
                        {step}
                      </span>
                    </div>
                  ))}
                </div>
              )}

              <div className="mt-8 space-y-1">
                {(order.items || []).map((item) => (
                  <div key={item.id} className="flex justify-between text-sm text-slate-600">
                    <span>{item.productName} × {item.quantity}</span>
                    <span>₹{item.subtotal}</span>
                  </div>
                ))}
                <div className="flex justify-between font-bold text-[#0f2742] pt-3 mt-2 border-t border-slate-200">
                  <span>Total</span>
                  <span>₹{order.totalAmount}</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </>
  );
}
