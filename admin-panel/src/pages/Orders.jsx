import { useEffect, useState } from "react";
import { Loader2, Package, ChevronDown, ChevronUp } from "lucide-react";
import apiClient from "../api/client";

const STATUS_OPTIONS = ["PLACED", "CONFIRMED", "PACKED", "SHIPPED", "DELIVERED", "CANCELLED"];

const STATUS_COLORS = {
  PLACED: "bg-slate-100 text-slate-700",
  CONFIRMED: "bg-blue-100 text-blue-700",
  PACKED: "bg-indigo-100 text-indigo-700",
  SHIPPED: "bg-amber-100 text-amber-700",
  DELIVERED: "bg-emerald-100 text-emerald-700",
  CANCELLED: "bg-red-100 text-red-700",
};

const PAYMENT_COLORS = {
  PENDING: "bg-slate-100 text-slate-600",
  PAID: "bg-emerald-100 text-emerald-700",
  FAILED: "bg-red-100 text-red-700",
};

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [expandedId, setExpandedId] = useState(null);
  const [updatingId, setUpdatingId] = useState(null);

  const load = async () => {
    setLoading(true);
    try {
      const { data } = await apiClient.get("/api/orders");
      setOrders(data);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load orders");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const updateStatus = async (orderId, status) => {
    setUpdatingId(orderId);
    try {
      const { data } = await apiClient.put(`/api/orders/${orderId}/status`, { status });
      setOrders((prev) => prev.map((o) => (o.id === orderId ? data : o)));
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update status");
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <div>
      <h1 className="text-xl font-semibold text-slate-800 mb-1">Orders</h1>
      <p className="text-sm text-slate-500 mb-6">
        Customers check their own order with the Order ID + phone number they used — no login needed on their end.
      </p>

      {error && <p className="text-sm text-red-600 mb-4">{error}</p>}

      {loading ? (
        <div className="flex items-center gap-2 text-slate-500 text-sm py-10 justify-center">
          <Loader2 size={18} className="animate-spin" /> Loading...
        </div>
      ) : orders.length === 0 ? (
        <div className="text-center py-14 text-slate-400 text-sm border border-dashed border-slate-300 rounded-lg">
          No orders yet.
        </div>
      ) : (
        <div className="space-y-2">
          {orders.map((order) => {
            const expanded = expandedId === order.id;
            return (
              <div key={order.id} className="bg-white border border-slate-200 rounded-lg overflow-hidden">
                <button
                  onClick={() => setExpandedId(expanded ? null : order.id)}
                  className="w-full flex items-center gap-3 px-4 py-3 text-left"
                >
                  <Package size={18} className="text-slate-400 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-slate-800">
                      Order #{order.id} — {order.customerName}
                    </p>
                    <p className="text-xs text-slate-500">
                      {order.customerPhone} · ₹{order.totalAmount} · {new Date(order.createdAt).toLocaleString()}
                    </p>
                  </div>
                  <span className={`text-xs font-semibold px-2 py-1 rounded-full ${PAYMENT_COLORS[order.paymentStatus] || ""}`}>
                    {order.paymentStatus}
                  </span>
                  <span className={`text-xs font-semibold px-2 py-1 rounded-full ${STATUS_COLORS[order.status] || ""}`}>
                    {order.status}
                  </span>
                  {expanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                </button>

                {expanded && (
                  <div className="px-4 pb-4 border-t border-slate-100 pt-3">
                    <div className="grid sm:grid-cols-2 gap-4 mb-4">
                      <div>
                        <p className="text-xs font-semibold text-slate-500 mb-1">Contact</p>
                        <p className="text-sm text-slate-700">{order.customerEmail || "—"}</p>
                        <p className="text-sm text-slate-700">{order.customerAddress || "—"}</p>
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-slate-500 mb-1">Payment</p>
                        <p className="text-xs text-slate-500">Razorpay Order: {order.razorpayOrderId || "—"}</p>
                        <p className="text-xs text-slate-500">Payment ID: {order.razorpayPaymentId || "—"}</p>
                      </div>
                    </div>

                    <p className="text-xs font-semibold text-slate-500 mb-2">Items</p>
                    <div className="space-y-1 mb-4">
                      {(order.items || []).map((item) => (
                        <div key={item.id} className="flex justify-between text-sm text-slate-600 bg-slate-50 rounded px-3 py-1.5">
                          <span>{item.productName} × {item.quantity}</span>
                          <span>₹{item.subtotal}</span>
                        </div>
                      ))}
                    </div>

                    <div className="flex items-center gap-2">
                      <label className="text-xs font-semibold text-slate-500">Update status:</label>
                      <select
                        value={order.status}
                        disabled={updatingId === order.id}
                        onChange={(e) => updateStatus(order.id, e.target.value)}
                        className="rounded-md border border-slate-300 px-2 py-1 text-sm"
                      >
                        {STATUS_OPTIONS.map((s) => (
                          <option key={s} value={s}>{s}</option>
                        ))}
                      </select>
                      {updatingId === order.id && <Loader2 size={14} className="animate-spin text-slate-400" />}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
