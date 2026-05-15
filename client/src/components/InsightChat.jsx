import { useState } from "react";
import { SendHorizontal, LoaderCircle, ShieldCheck } from "lucide-react";
import BrandLogo from "./BrandLogo";

const suggested = [
  "Which 5 parishes need a new vocational pathway most urgently?",
  "Where do healthcare workforce gaps overlap with low proficiency?",
  "Why is this parish ranked as urgent?",
  "What intervention would create the strongest near-term impact?",
  "What data would improve confidence in this recommendation?"
];

function InsightChat({ selectedParishId }) {
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState([{ role: "assistant", text: "Ask a plain-English question to receive an evidence-based recommendation." }]);

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
      setMessages((prev) => [...prev, { role: "assistant", text: "I could not reach the backend endpoint. Please verify the server is running.", meta: "Low confidence" }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="card chat-card">
      <div className="section-head">
        <div>
          <p className="section-label">AI Insight Engine</p>
          <div className="chat-title-row">
            <h3>Decision-support assistant</h3>
            <span className="prototype-badge">Grounded in current sample dataset</span>
          </div>
        </div>
        <span className="icon-badge">
          <BrandLogo variant="badge" alt="" />
        </span>
      </div>
      <div className="chip-row">
        {suggested.map((q) => <button key={q} className="chip" onClick={() => send(q)}>{q}</button>)}
      </div>
      <div className="chat-body">
        {messages.map((m, i) => (
          <article key={`${m.role}-${i}`} className={`bubble ${m.role}`}>
            <p>{m.text}</p>
            {m.meta ? <span className="tiny">{m.meta}</span> : null}
            {m.sources?.length ? <span className="tiny">Sources: {m.sources.join(", ")}</span> : null}
          </article>
        ))}
        {loading ? <article className="bubble assistant"><LoaderCircle size={14} className="spin" /> Generating response...</article> : null}
      </div>
      <form className="chat-input" onSubmit={(e) => { e.preventDefault(); send(); }}>
        <label htmlFor="chat-input" className="sr-only">Ask a question</label>
        <input id="chat-input" value={input} onChange={(e) => setInput(e.target.value)} placeholder="Ask where to invest, what to build, and why..." />
        <button type="submit" className="btn btn-primary" disabled={loading}>
          {loading ? <LoaderCircle size={15} className="spin" /> : <SendHorizontal size={15} />}
          {loading ? "Analyzing" : "Send"}
        </button>
      </form>
      <p className="tiny muted"><ShieldCheck size={12} /> Decision-support only, not a replacement for human judgment.</p>
    </section>
  );
}

export default InsightChat;
