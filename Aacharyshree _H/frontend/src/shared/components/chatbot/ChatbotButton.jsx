"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, X } from "lucide-react";

export default function Chatbot() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      sender: "bot",
      text: "Hi 👋 I am Namo AI. Say 'Hey Namo' to start.",
      time: getTime(),
    },
  ]);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);

  const bottomRef = useRef(null);
  const recognitionRef = useRef(null);

  const isProcessingRef = useRef(false);
  const isActivatedRef = useRef(false);

  /* ---------------- TIME ---------------- */
  function getTime() {
    return new Date().toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  }

  /* ---------------- AUTO SCROLL ---------------- */
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, typing]);

  /* ---------------- BOT RESPONSE ---------------- */
  const getBotResponse = (query) => {
    const q = query.toLowerCase();

    if (q.includes("appointment"))
      return "I can help you book an appointment. Please choose a doctor.";

    if (q.includes("doctor"))
      return "We have specialists in Cardiology, Neurology, Orthopedics.";

    if (q.includes("report"))
      return "Your reports are available in the Reports section.";

    if (q.includes("hello") || q.includes("hi"))
      return "Hello 👋 How can I assist you?";

    return "I can help with appointments, doctors, and reports 😊";
  };

  /* ---------------- SPEAK ---------------- */
  const speak = (text) => {
    window.speechSynthesis.cancel();
    const speech = new SpeechSynthesisUtterance(text);
    speech.lang = "en-US";
    window.speechSynthesis.speak(speech);
  };

  /* ---------------- SEND MESSAGE ---------------- */
  const sendMessage = (text) => {
    if (!text.trim()) return;

    const now = getTime();

    setMessages((prev) => [
      ...prev,
      { sender: "user", text, time: now },
    ]);

    setTyping(true);

    setTimeout(() => {
      const reply = getBotResponse(text);

      setMessages((prev) => [
        ...prev,
        { sender: "bot", text: reply, time: getTime() },
      ]);

      speak(reply);
      setTyping(false);
    }, 700);
  };

  /* ---------------- VOICE ENGINE ---------------- */
  useEffect(() => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) return;

    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = false;
    recognition.lang = "en-US";

    recognition.onresult = (event) => {
      if (isProcessingRef.current) return;

      const result = event.results[event.results.length - 1];

      if (!result.isFinal) return;

      let transcript = result[0].transcript.toLowerCase().trim();

      console.log("Heard:", transcript);

      // Check wake word
      if (transcript.includes("hey namo")) {
        isActivatedRef.current = true;

        // Remove wake word
        transcript = transcript.replace("hey namo", "").trim();

        speak("Yes, how can I help you?");
      }

      // If activated → process query
      if (isActivatedRef.current && transcript.length > 2) {
        isProcessingRef.current = true;

        sendMessage(transcript);

        setTimeout(() => {
          isProcessingRef.current = false;
        }, 1500);
      }
    };

    recognition.onerror = () => {
      recognition.stop();
      recognition.start();
    };

    recognition.onend = () => {
      recognition.start(); // auto-restart
    };

    recognitionRef.current = recognition;

    recognition.start();

    return () => recognition.stop();
  }, []);

  /* ---------------- UI ---------------- */
  return (
    <>
      {/* FLOAT BUTTON */}
      <div className="fixed bottom-6 right-6 z-50">
        <div
          onClick={() => setOpen(true)}
          className="w-[65px] h-[65px] rounded-full shadow-xl overflow-hidden
          bg-gradient-to-r from-[#47C5B9] to-[#26AFDE]
          flex items-center justify-center cursor-pointer hover:scale-110 transition"
        >
          <img
            src="/images/ai.jpg"
            alt="Namo AI"
            className="w-full h-full object-cover"
          />
        </div>
      </div>

      {/* CHAT WINDOW */}
      <AnimatePresence>
        {open && (
          <motion.div
            className="fixed bottom-6 right-6 w-[370px] h-[520px] z-50"
            initial={{ opacity: 0, y: 80 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 80 }}
          >
            <div className="w-full h-full rounded-2xl shadow-2xl flex flex-col overflow-hidden
            bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700">

              {/* HEADER */}
              <div className="flex items-center justify-between p-3
              bg-gradient-to-r from-[#47C5B9] to-[#26AFDE] text-white">
                <div className="flex items-center gap-2">
                  <img
                    src="/images/ai.jpg"
                    className="w-8 h-8 object-cover rounded-full"
                  />
                  <span className="font-semibold">Namo AI</span>
                </div>

                <X
                  className="cursor-pointer"
                  onClick={() => setOpen(false)}
                />
              </div>

              {/* MESSAGES */}
              <div className="flex-1 overflow-y-auto p-3 space-y-3 text-sm">
                {messages.map((msg, i) => (
                  <div key={i}>
                    <div
                      className={`max-w-[75%] px-3 py-2 rounded-xl ${
                        msg.sender === "user"
                          ? "ml-auto bg-[#26AFDE] text-white"
                          : "bg-gray-200 dark:bg-gray-700 dark:text-white"
                      }`}
                    >
                      {msg.text}
                    </div>
                    <div className="text-[10px] text-gray-400 mt-1">
                      {msg.time}
                    </div>
                  </div>
                ))}

                {typing && (
                  <div className="bg-gray-200 dark:bg-gray-700 px-3 py-2 rounded-xl w-fit">
                    typing...
                  </div>
                )}

                <div ref={bottomRef}></div>
              </div>

              {/* INPUT */}
              <div className="p-2 border-t dark:border-gray-700 flex gap-2">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) =>
                    e.key === "Enter" && sendMessage(input)
                  }
                  placeholder="Ask Namo..."
                  className="flex-1 px-3 py-2 rounded-lg border
                  dark:bg-gray-800 dark:text-white outline-none"
                />

                <button
                  onClick={() => sendMessage(input)}
                  className="px-3 py-2 rounded-lg bg-[#26AFDE] text-white"
                >
                  <Send size={16} />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}