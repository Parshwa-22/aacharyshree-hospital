import { useState } from "react";
import "./CurtainOpening.css";

const OPENING_DURATION = 1650;

export default function CurtainOpening({ onOpen, onComplete }) {
  const [isOpening, setIsOpening] = useState(false);
  const [error, setError] = useState("");

  const enter = async () => {
    if (isOpening) return;
    setError("");
    setIsOpening(true);
    try {
      await onOpen();
      window.setTimeout(onComplete, OPENING_DURATION);
    } catch (requestError) {
      setIsOpening(false);
      setError(requestError?.response?.data?.message || "We could not open the ceremony. Please try again.");
    }
  };

  return (
    <section className={`curtain-opening ${isOpening ? "curtain-opening--opening" : ""}`} aria-label="Website inauguration">
      <div className="curtain-opening__ambient" />
      <div className="curtain-opening__curtain curtain-opening__curtain--left" aria-hidden="true" />
      <div className="curtain-opening__curtain curtain-opening__curtain--right" aria-hidden="true" />
      <div className="curtain-opening__valance" aria-hidden="true"><span /><span /><span /><span /><span /></div>
      <div className="curtain-opening__content">
        <p className="curtain-opening__eyebrow">AACHARYSHREE HOSPITAL</p>
        <div className="curtain-opening__ornament" aria-hidden="true"><i /><span>✦</span><i /></div>
        <h1>Welcome</h1>
        <p className="curtain-opening__subtitle">A new chapter of compassionate care begins.</p>
        <button type="button" className="curtain-opening__button" onClick={enter} disabled={isOpening}>
          <span>{isOpening ? "Opening…" : "Enter"}</span>
        </button>
        <p className="curtain-opening__hint" aria-live="polite">{error || (isOpening ? "Please enjoy the opening moment" : "Tap to open the curtain")}</p>
      </div>
    </section>
  );
}
