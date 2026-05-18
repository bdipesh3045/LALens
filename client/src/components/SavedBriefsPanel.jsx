import { useCallback, useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Trash2, ChevronDown, ChevronUp, Loader2, Cloud, CloudOff } from "lucide-react";
import { deleteInvestmentBrief, getUserInvestmentBriefs } from "../services/briefService";

/**
 * SavedBriefsPanel
 * Shows Firestore-saved investment briefs for the signed-in user.
 * Compact, demo-safe, and gracefully handles empty/error states.
 */
function SavedBriefsPanel({ user, refreshTrigger = 0, onLoad }) {
  const [briefs, setBriefs]     = useState([]);
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState(null);
  const [expanded, setExpanded] = useState(null); // briefId of expanded row

  const fetchBriefs = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    setError(null);
    try {
      const data = await getUserInvestmentBriefs(user);
      setBriefs(data);
    } catch (err) {
      console.warn("[SavedBriefsPanel] fetch error:", err?.message);
      setError("Could not load saved briefs.");
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => { fetchBriefs(); }, [fetchBriefs, refreshTrigger]);

  const handleDelete = useCallback(async (briefId) => {
    try {
      await deleteInvestmentBrief(user, briefId);
      setBriefs((prev) => prev.filter((b) => b.id !== briefId));
      if (expanded === briefId) setExpanded(null);
    } catch (err) {
      console.warn("[SavedBriefsPanel] delete error:", err?.message);
    }
  }, [user, expanded]);

  const toggleExpand = useCallback((id) => {
    setExpanded((prev) => (prev === id ? null : id));
  }, []);

  const formatDate = (d) => {
    if (!d) return "Just now";
    const date = d instanceof Date ? d : new Date(d);
    return date.toLocaleString("en-US", {
      month: "short", day: "numeric", hour: "2-digit", minute: "2-digit"
    });
  };

  if (loading) {
    return (
      <div className="saved-briefs-panel saved-briefs-panel--loading" aria-live="polite">
        <Loader2 size={14} className="spin" aria-hidden />
        <span className="tiny muted">Loading saved briefs…</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="saved-briefs-panel saved-briefs-panel--error">
        <CloudOff size={14} aria-hidden />
        <span className="tiny muted">{error}</span>
      </div>
    );
  }

  if (!briefs.length) {
    return (
      <div className="saved-briefs-panel saved-briefs-panel--empty">
        <Cloud size={14} aria-hidden />
        <span className="tiny muted">No cloud-saved briefs yet. Save this brief to see it here.</span>
      </div>
    );
  }

  return (
    <ul className="saved-briefs-panel" aria-label="Cloud-saved investment briefs">
      {briefs.map((brief) => (
        <li key={brief.id} className="saved-brief-row">
          <div className="saved-brief-row-main">
            <div className="saved-brief-row-info">
              <p className="saved-brief-row-name">{brief.topMatch?.name || "Investment brief"}</p>
              <p className="tiny muted">
                {brief.profile?.focus}
                {brief.topMatch?.matchScore != null ? ` · ${brief.topMatch.matchScore}/100` : ""}
                <span className="saved-brief-row-date"> · {formatDate(brief.createdAt)}</span>
              </p>
            </div>
            <div className="saved-brief-row-actions">
              <button
                type="button"
                className="btn btn-secondary saved-brief-load-btn"
                onClick={() => { toggleExpand(brief.id); onLoad?.(brief); }}
                aria-expanded={expanded === brief.id}
              >
                {expanded === brief.id
                  ? <><ChevronUp size={13} aria-hidden /> Hide</>
                  : <><ChevronDown size={13} aria-hidden /> View</>
                }
              </button>
              <button
                type="button"
                className="saved-brief-delete-btn"
                onClick={() => handleDelete(brief.id)}
                aria-label={`Delete brief for ${brief.topMatch?.name || "investment"}`}
              >
                <Trash2 size={13} aria-hidden />
              </button>
            </div>
          </div>

          <AnimatePresence>
            {expanded === brief.id ? (
              <motion.div
                className="saved-brief-row-detail"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.25 }}
              >
                <dl className="saved-brief-detail-grid">
                  <dt>Institution</dt>
                  <dd>{brief.topMatch?.name}</dd>
                  <dt>Parish</dt>
                  <dd>{brief.topMatch?.parishName} Parish</dd>
                  <dt>Match score</dt>
                  <dd>{brief.topMatch?.matchScore}/100 — Prototype model estimate</dd>
                  <dt>Role</dt>
                  <dd>{brief.profile?.role}</dd>
                  <dt>Budget</dt>
                  <dd>{brief.profile?.budget}</dd>
                  <dt>Focus area</dt>
                  <dd>{brief.profile?.focus}</dd>
                  <dt>Est. range</dt>
                  <dd>{brief.topMatch?.investmentRange} — Demo estimate</dd>
                </dl>
                <p className="saved-brief-honesty tiny muted">
                  Prototype decision-support output. Combine public-source references with model estimates.
                  Verify before real funding decisions.
                </p>
              </motion.div>
            ) : null}
          </AnimatePresence>
        </li>
      ))}
    </ul>
  );
}

export default SavedBriefsPanel;
