import { useState } from "react";
import { X, Mail, Loader2, ShieldCheck } from "lucide-react";
import { useCustomerAuth } from "../../../context/CustomerAuthContext";

export default function AuthModal() {
  const { modalOpen, closeModal, requestOtp, verifyOtp, onAuthSuccess } = useCustomerAuth();

  const [step, setStep] = useState("email"); // "email" | "otp"
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  if (!modalOpen) return null;

  const reset = () => {
    setStep("email");
    setEmail("");
    setOtp("");
    setError("");
  };

  const handleClose = () => {
    reset();
    closeModal();
  };

  const handleRequestOtp = async (e) => {
    e.preventDefault();
    if (!email) return;
    setLoading(true);
    setError("");
    try {
      await requestOtp(email);
      setStep("otp");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to send OTP. Check the email and try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    if (!otp) return;
    setLoading(true);
    setError("");
    try {
      await verifyOtp(email, otp);
      reset();
      onAuthSuccess();
    } catch (err) {
      setError(err.response?.data?.message || "Incorrect or expired code.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 px-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm p-6 relative">
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-600"
          aria-label="Close"
        >
          <X size={20} />
        </button>

        <div className="text-center mb-6">
          <div className="mx-auto w-12 h-12 rounded-full bg-gradient-to-r from-[#47C5B9] to-[#26AFDE] flex items-center justify-center mb-3">
            {step === "email" ? <Mail className="text-white" size={22} /> : <ShieldCheck className="text-white" size={22} />}
          </div>
          <h2 className="text-lg font-bold text-[#0f2742]">
            {step === "email" ? "Login / Register" : "Enter the Code"}
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            {step === "email"
              ? "No password needed — we'll email you a one-time code."
              : `We sent a 6-digit code to ${email}`}
          </p>
        </div>

        {step === "email" ? (
          <form onSubmit={handleRequestOtp} className="space-y-4">
            <input
              type="email"
              required
              autoFocus
              placeholder="you@example.com"
              className="w-full rounded-md border border-slate-300 px-3 py-2.5 text-sm text-center"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            {error && <p className="text-sm text-red-500 text-center">{error}</p>}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 rounded-md bg-gradient-to-r from-[#47C5B9] to-[#26AFDE] text-white font-semibold text-sm inline-flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {loading && <Loader2 className="animate-spin" size={16} />}
              Send Code
            </button>
          </form>
        ) : (
          <form onSubmit={handleVerifyOtp} className="space-y-4">
            <input
              type="text"
              inputMode="numeric"
              maxLength={6}
              required
              autoFocus
              placeholder="••••••"
              className="w-full rounded-md border border-slate-300 px-3 py-3 text-2xl text-center tracking-[0.5em] font-bold"
              value={otp}
              onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
            />
            {error && <p className="text-sm text-red-500 text-center">{error}</p>}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 rounded-md bg-gradient-to-r from-[#47C5B9] to-[#26AFDE] text-white font-semibold text-sm inline-flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {loading && <Loader2 className="animate-spin" size={16} />}
              Verify & Continue
            </button>
            <button
              type="button"
              onClick={() => setStep("email")}
              className="w-full text-xs text-slate-400 hover:text-slate-600"
            >
              Use a different email
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
