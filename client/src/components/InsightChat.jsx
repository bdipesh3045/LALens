import { useEffect, useRef, useState } from "react";
import { SendHorizontal, LoaderCircle, ShieldCheck, Bot, User } from "lucide-react";
import BrandLogo from "./BrandLogo";

const suggested = [
  "Top parishes for a new vocational pathway",
  "Healthcare workforce gaps vs proficiency",
  "Why this parish ranks as urgent",
  "Strongest near-term intervention",
  "Data that would improve this recommendation"
];

function InsightChat({ selectedParishId }) {
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState([]);
  const threadRef = useRef(null);

  useEffect(() => {
    const el = threadRef.current;
    if (!el) return;
    el.scrollTop = el.scrollHeight;
  }, [messages, loading]);

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
        body: JSON.stringify({ message, selectedParishId, history })
      });
      let data = {};
      try {
        data = await res.json();
      } catch {
        data = {};
      }
      if (!res.ok) {
        const errText = data.error || `Request failed (${res.status})`;
        setMessages((prev) => [...prev, { role: "assistant", text: errText, meta: "Low confidence" }]);
        return;
      }
      const engine = data.provider === "groq" ? "Groq" : "Rules + dataset";
      const focus = data.resolvedParishName ? ` Focus: ${data.resolvedParishName}.` : "";
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          text: data.answer,
          meta: `${data.confidence} confidence · ${engine}${focus}`,
          sources: data.sources
        }
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          text: "I could not reach the backend endpoint. Please verify the server is running.",
          meta: "Low confidence"
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const threadEmpty = messages.length === 0 && !loading;

  return (
    <section className="card chat-card insight-chat">
      <header className="insight-chat-head">
        <div className="insight-chat-head-main">
          <div className="insight-chat-head-top">
            <span className="insight-chat-status" aria-hidden />
            <span className="insight-chat-status-label">Ready</span>
          </div>
          <div className="chat-title-row insight-chat-title-row">
            <h3>Insight assistant</h3>
            <span className="prototype-badge insight-chat-badge">Sample metrics</span>
          </div>
        </div>
        <div className="insight-chat-mark" aria-hidden>
          <BrandLogo variant="feature" alt="" />
        </div>
      </header>

      <div className="insight-chat-window">
        <div
          ref={threadRef}
          className={`insight-chat-thread${threadEmpty ? " insight-chat-thread--empty" : ""}`}
          aria-live="polite"
          aria-relevant="additions"
        >
          {threadEmpty ? (
            <div className="insight-chat-empty">
              <p className="insight-chat-empty-title">New conversation</p>
              <p className="insight-chat-empty-hint">Use quick replies below or type your own message.</p>
            </div>
          ) : null}
          {messages.map((m, i) =>
            m.role === "user" ? (
              <div key={`${m.role}-${i}`} className="insight-msg insight-msg--user">
                <div className="insight-msg-stack">
                  <article className="insight-msg-bubble insight-msg-bubble--user">
                    <p className="insight-bubble-text">{m.text}</p>
                  </article>
                </div>
                <div className="insight-msg-avatar insight-msg-avatar--user" aria-hidden>
                  <User size={15} strokeWidth={2} />
                </div>
              </div>
            ) : (
              <div key={`${m.role}-${i}`} className="insight-msg insight-msg--assistant">
                <div className="insight-msg-avatar insight-msg-avatar--bot" aria-hidden>
                  <Bot size={16} strokeWidth={2} />
                </div>
                <div className="insight-msg-stack">
                  <article className="insight-msg-bubble insight-msg-bubble--assistant">
                    <p className="insight-bubble-text">{m.text}</p>
                    {m.meta ? <span className="insight-bubble-meta">{m.meta}</span> : null}
                    {m.sources?.length ? (
                      <span className="insight-bubble-meta">Sources: {m.sources.join(", ")}</span>
                    ) : null}
                  </article>
                </div>
              </div>
            )
          )}
          {loading ? (
            <div className="insight-msg insight-msg--assistant" key="typing">
              <div className="insight-msg-avatar insight-msg-avatar--bot" aria-hidden>
                <Bot size={16} strokeWidth={2} />
              </div>
              <div className="insight-msg-stack">
                <article className="insight-msg-bubble insight-msg-bubble--assistant insight-msg-bubble--typing">
                  <LoaderCircle size={15} className="spin insight-typing-icon" aria-hidden />
                  <span className="insight-typing-label">Thinking…</span>
                </article>
              </div>
            </div>
          ) : null}
        </div>

        <div className="insight-chat-dock">
          <p className="insight-dock-label">Quick replies</p>
          <ul className="insight-chip-row">
            {suggested.map((q) => (
              <li key={q}>
                <button type="button" className="insight-chip" onClick={() => send(q)} disabled={loading}>
                  {q}
                </button>
              </li>
            ))}
          </ul>
          <form className="insight-composer" onSubmit={(e) => { e.preventDefault(); send(); }}>
            <label htmlFor="chat-input" className="sr-only">
              Message
            </label>
            <input
              id="chat-input"
              className="insight-composer-input"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Message…"
              disabled={loading}
              autoComplete="off"
            />
            <button
              type="submit"
              className="btn btn-primary insight-send-fab"
              disabled={loading}
              aria-label={loading ? "Sending" : "Send message"}
            >
              {loading ? <LoaderCircle size={18} className="spin" aria-hidden /> : <SendHorizontal size={18} aria-hidden />}
            </button>
          </form>
        </div>
      </div>

      <p className="insight-disclaimer">
        <ShieldCheck size={14} strokeWidth={1.75} aria-hidden />
        <span>Advisory only—confirm material decisions locally.</span>
      </p>
    </section>
  );
}

export default InsightChat;
