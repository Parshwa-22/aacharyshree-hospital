"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Accessibility } from "lucide-react";

export default function AccessibilityWidget() {
  const [open, setOpen] = useState(false);
  const [font, setFont] = useState("default");
  const [theme, setTheme] = useState("default");
  const [dyslexia, setDyslexia] = useState(false);

  const [volume, setVolume] = useState(1);
  const [selectedText, setSelectedText] = useState("");
  const [voice, setVoice] = useState(null);

  const panelRef = useRef(null);

  /* ---------------- LOAD SETTINGS ---------------- */
  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("accessibility")) || {};

    if (saved.font) applyFont(saved.font);
    if (saved.theme) applyTheme(saved.theme);
    if (saved.dyslexia) toggleDyslexia(saved.dyslexia);

    if (saved.voice?.volume) setVolume(saved.voice.volume);
  }, []);

  const save = (data) => {
    const prev = JSON.parse(localStorage.getItem("accessibility")) || {};
    localStorage.setItem("accessibility", JSON.stringify({ ...prev, ...data }));
  };

  /* ---------------- FONT ---------------- */
  const applyFont = (type) => {
    const map = {
      small: "14px",
      default: "16px",
      large: "18px",
    };
    document.documentElement.style.fontSize = map[type];
    setFont(type);
    save({ font: type });
  };

  /* ---------------- THEME ---------------- */
  const applyTheme = (mode) => {
    const root = document.documentElement;

    root.removeAttribute("data-theme");
    document.body.classList.remove("dark");

    if (mode === "dark") {
      document.body.classList.add("dark");
    } else {
      root.setAttribute("data-theme", mode);
    }

    setTheme(mode);
    save({ theme: mode });
  };

  /* ---------------- DYSLEXIA ---------------- */
  const toggleDyslexia = (val) => {
    document.body.classList.toggle("dyslexia", val);
    setDyslexia(val);
    save({ dyslexia: val });
  };

  /* ---------------- TEXT SELECTION ---------------- */
  useEffect(() => {
    const handleSelection = () => {
      const text = window.getSelection()?.toString().trim();
      if (text) setSelectedText(text);
    };

    document.addEventListener("mouseup", handleSelection);
    return () => document.removeEventListener("mouseup", handleSelection);
  }, []);

  /* ---------------- VOICE LOAD FIX ---------------- */
  useEffect(() => {
    const loadVoices = () => {
      const voices = speechSynthesis.getVoices();
      if (voices.length > 0) {
        const selected =
          voices.find((v) => v.lang.includes("en")) || voices[0];
        setVoice(selected);
      }
    };

    loadVoices();
    speechSynthesis.onvoiceschanged = loadVoices;
  }, []);

  /* ---------------- SPEECH ---------------- */
  const playSpeech = () => {
    if (!selectedText) {
      alert("Please select text first");
      return;
    }

    speechSynthesis.cancel();

    const speech = new SpeechSynthesisUtterance(selectedText);

    if (voice) speech.voice = voice;

    speech.volume = Number(volume);

    speechSynthesis.speak(speech);
  };

  /* ---------------- OUTSIDE CLICK ---------------- */
  useEffect(() => {
    const handleClick = (e) => {
      if (panelRef.current && !panelRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  /* ---------------- BUTTON STYLE ---------------- */
  const btnClass =
    "flex-1 py-2 rounded-lg transition font-medium border shadow-sm " +
    "bg-white text-gray-800 border-gray-300 " +
    "dark:bg-gray-700 dark:text-white dark:border-gray-600 " +
    "hover:bg-[#47C5B9] hover:text-white hover:border-transparent";

  return (
    <>
      {/* FLOAT BUTTON */}
      <div className="fixed left-0 top-1/2 -translate-y-1/2 z-50 group">
        <div
          onClick={() => setOpen(true)}
          className="w-[45px] h-[45px]
          bg-gradient-to-r from-[#47C5B9] to-[#26AFDE]
          flex items-center justify-center rounded-r-xl shadow-xl
          cursor-pointer transform transition
          group-hover:translate-x-2"
        >
          <Accessibility className="text-white" />
        </div>
      </div>

      {/* PANEL */}
      <AnimatePresence>
        {open && (
          <motion.div
            className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              ref={panelRef}
              className="pointer-events-auto w-[90%] max-w-lg p-6 rounded-2xl
              bg-white dark:bg-gray-900
              backdrop-blur-xl shadow-2xl border border-gray-200 dark:border-gray-700"
              initial={{ scale: 0.8, y: 80, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.8, y: 80, opacity: 0 }}
            >
              <h2 className="text-xl font-semibold text-center mb-4">
                Accessibility
              </h2>

              {/* FONT */}
              <div className="mb-4">
                <p className="mb-2 font-medium">Text Size</p>
                <div className="flex gap-2">
                  {["small", "default", "large"].map((f, i) => (
                    <button
                      key={f}
                      onClick={() => applyFont(f)}
                      className={
                        font === f
                          ? "flex-1 py-2 rounded-lg bg-[#26AFDE] text-white"
                          : btnClass
                      }
                    >
                      {["A-", "A", "A+"][i]}
                    </button>
                  ))}
                </div>
              </div>

              {/* THEMES */}
              <div className="mb-4">
                <p className="mb-2 font-medium">Color Mode</p>
                <div className="grid grid-cols-2 gap-2">
                  {["default", "contrast", "bw", "dark", "soft"].map((t) => (
                    <button
                      key={t}
                      onClick={() => applyTheme(t)}
                      className={
                        theme === t
                          ? "py-2 rounded-lg bg-[#47C5B9] text-white capitalize"
                          : btnClass + " capitalize"
                      }
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>

              {/* DYSLEXIA */}
              <div className="mb-4 flex justify-between">
                <p className="font-medium">Dyslexia Mode</p>
                <input
                  type="checkbox"
                  checked={dyslexia}
                  onChange={(e) => toggleDyslexia(e.target.checked)}
                />
              </div>

              {/* READ BUTTON */}
              <div className="mb-4">
                <p className="mb-2 font-medium">Read Text</p>

                <button
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={playSpeech}
                  className="w-full py-2 rounded-lg bg-gradient-to-r from-[#47C5B9] to-[#26AFDE] text-white font-medium shadow-md hover:opacity-90"
                >
                  🔊 Read Selected Text
                </button>
              </div>

              {/* VOLUME */}
              <div>
                <p className="mb-2 font-medium">Volume</p>

                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.1"
                  value={volume}
                  onChange={(e) => {
                    setVolume(e.target.value);
                    save({ voice: { volume: e.target.value } });
                  }}
                  className="w-full"
                />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}