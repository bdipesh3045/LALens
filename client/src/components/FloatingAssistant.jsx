import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Link, useLocation } from "react-router-dom";
import { Bot, MessageCircle, X, Send, Sparkles } from "lucide-react";

const suggested = [
  "Where should we invest first?",
  "How is the Opportunity Score calculated?",
  "Which parishes have sample metrics?",
  "What data is still missing?"
];

function FloatingAssistant() {
  const { pathname } = useLocation();
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState([
    { role: "assistant", text: "Ask about opportunity zones, scoring, or data sources." }
  ]);
  const panelRef = useRef(null);
  const closeBtnRef = useRef(null);

  useEffect(() => {
    if (!open) return undefined;
    const onKey = (e) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  useEffect(() => {
    if (!open) return undefined;
    const t = window.setTimeout(() => closeBtnRef.current?.focus(), 80);
    return () => window.clearTimeout(t);
  }, [open]);

  if (pathname === "/platform") return null;

  const send = async (text) => {
    const message = text || input.trim();
    if (!message) return;
    const history = messages
      .filter((m) => m.role === "user" || m.role === "assistant")
      .map((m) => ({ role: m.role, content: m.text }));
    setMessages((prev) => [...prev, { role: "user", text: message }]);
    setInput("");
    setLoading(true);
    try {
      const base = import.meta.env.VITE_API_URL || "";
      const res = await fetch(`${base}/api/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message, selectedParishId: null, history })
      });
      let data = {};
      try {
        data = await res.json();
      } catch {
        data = {};
      }
      if (!res.ok) {
        setMessages((prev) => [...prev, { role: "assistant", text: data.error || `Request failed (${res.status})` }]);
        return;
      }
      setMessages((prev) => [...prev, { role: "assistant", text: data.answer }]);
    } catch {
      setMessages((prev) => [...prev, { role: "assistant", text: "Could not reach the server. Please try again." }]);
    } finally {
      setLoading(false);
    }
  };

  const panelTransition = { type: "spring", stiffness: 440, damping: 34, mass: 0.85 };

  return (
    <div className="floating-assistant-root" aria-live="polite">
      <AnimatePresence>
        {open ? (
          <motion.button
            type="button"
            key="fab-backdrop"
            className="floating-assistant-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.22 }}
            aria-label="Close assistant"
            onClick={() => setOpen(false)}
          />
        ) : null}
      </AnimatePresence>
      <div className="floating-assistant-stack">
        <AnimatePresence>
          {open ? (
            <motion.div
              key="fab-panel"
              id="floating-assistant-panel"
              className="floating-assistant-panel"
              ref={panelRef}
              role="dialog"
              aria-modal="true"
              aria-label="Navigator assistant chat"
              initial={{ opacity: 0, y: 22, scale: 0.94 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 16, scale: 0.96 }}
              transition={panelTransition}
            >
                <header className="floating-assistant-head">
                  <div>
                    <p className="floating-assistant-title">
                      <Sparkles size={14} aria-hidden /> Navigator Assistant
                    </p>
                    <p className="floating-assistant-sub">Ask about opportunity zones, scoring, or data sources.</p>
                  </div>
                  <button
                    ref={closeBtnRef}
                    type="button"
                    className="floating-assistant-iconbtn"
                    onClick={() => setOpen(false)}
                    aria-label="Close assistant"
                  >
                    <X size={18} />
                  </button>
                </header>
                <div className="floating-assistant-chips">
                  {suggested.map((q) => (
                    <button key={q} type="button" className="floating-chip" onClick={() => send(q)}>
                      {q}
                    </button>
                  ))}
                </div>
                <div className="floating-assistant-messages">
                  {messages.map((m, i) => (
                    <div key={`${m.role}-${i}`} className={`floating-bubble floating-bubble-${m.role}`}>
                      {m.text}
                    </div>
                  ))}
                  {loading ? (
                    <div className="floating-bubble floating-bubble-assistant floating-loading" aria-busy="true">
                      <span className="floating-dots" aria-hidden>
                        <span />
                        <span />
                        <span />
                      </span>
                      <span className="floating-loading-label">Thinking</span>
                    </div>
                  ) : null}
                </div>
                <form
                  className="floating-assistant-form"
                  onSubmit={(e) => {
                    e.preventDefault();
                    send();
                  }}
                >
                  <label htmlFor="floating-assistant-input" className="sr-only">
                    Message
                  </label>
                  <input
                    id="floating-assistant-input"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Ask the Navigator"
                    autoComplete="off"
                  />
                  <button type="submit" className="floating-assistant-send" disabled={loading} aria-label="Send message">
                    <Send size={18} />
                  </button>
                </form>
                <p className="floating-assistant-foot">
                  <Link to="/data-sources">Data sources</Link>
                  <span aria-hidden> · </span>
                  <Link to="/methodology">Methodology</Link>
                </p>
              </motion.div>
          ) : null}
        </AnimatePresence>

        <motion.button
          type="button"
          className="floating-assistant-launcher"
          onClick={() => setOpen((o) => !o)}
          aria-expanded={open}
          aria-controls={open ? "floating-assistant-panel" : undefined}
          aria-label={open ? "Close Navigator assistant" : "Open Navigator assistant"}
          layout
          transition={{ type: "spring", stiffness: 500, damping: 32 }}
        >
          <span className="floating-assistant-launcher-inner">
            <Bot size={22} strokeWidth={1.75} aria-hidden />
            <MessageCircle size={14} className="floating-assistant-msgicon" aria-hidden />
          </span>
          <span className="floating-assistant-launcher-label">Ask Navigator</span>
        </motion.button>
      </div>
    </div>
  );
}

export default FloatingAssistant;
