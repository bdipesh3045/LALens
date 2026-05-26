import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Check, Loader2 } from "lucide-react";

const STAGES = [
  { label: "Loading parish scores", detail: "12-parish sample" },
  { label: "Checking workforce gaps", detail: "Healthcare, trades, STEM" },
  { label: "Evaluating pathway fit", detail: "CTE and literacy overlays" },
  { label: "Ranking schools", detail: "Role, budget, and focus" }
];

const SCAN_TICKS = [
  "Madison Parish - score 87",
  "St. Landry Parish - gap elevated",
  "Tensas Parish - literacy need",
  "East Carroll - pathway gap",
  "Caddo Parish - feasibility check",
  "Ranking sample schools"
];

function IntakeMatchLoader({ onComplete }) {
  const [activeStage, setActiveStage] = useState(0);
  const [progress, setProgress] = useState(0);
  const [scanIdx, setScanIdx] = useState(0);

  useEffect(() => {
    const scanTimer = window.setInterval(() => {
      setScanIdx((i) => (i + 1) % SCAN_TICKS.length);
    }, 520);
    return () => window.clearInterval(scanTimer);
  }, []);

  useEffect(() => {
    const stageDelays = [900, 850, 900, 950];
    const progressTargets = [28, 52, 76, 100];
    let cancelled = false;
    const timers = [];

    const runStage = (index) => {
      if (cancelled || index >= STAGES.length) return;
      setActiveStage(index);
      const start = index === 0 ? 0 : progressTargets[index - 1];
      const end = progressTargets[index];
      const duration = stageDelays[index];
      const startTime = performance.now();

      const tick = (now) => {
        if (cancelled) return;
        const t = Math.min(1, (now - startTime) / duration);
        const eased = 1 - (1 - t) ** 2;
        setProgress(start + (end - start) * eased);
        if (t < 1) {
          requestAnimationFrame(tick);
        } else if (index < STAGES.length - 1) {
          timers.push(window.setTimeout(() => runStage(index + 1), 120));
        } else {
          timers.push(window.setTimeout(() => onComplete?.(), 400));
        }
      };
      requestAnimationFrame(tick);
    };

    timers.push(window.setTimeout(() => runStage(0), 200));

    return () => {
      cancelled = true;
      timers.forEach((id) => window.clearTimeout(id));
    };
  }, [onComplete]);

  return (
    <div className="intake-loader" role="status" aria-live="polite" aria-busy="true">
      <div className="intake-loader-spinner" />

      <h2 className="intake-loader-title">Finding your matches</h2>
      <p className="intake-loader-sub">Running alignment model...</p>

      <div className="intake-loader-bar-wrap">
        <motion.div className="intake-loader-bar" style={{ width: `${progress}%` }} />
      </div>

      <p className="intake-loader-scan">
        <Loader2 size={14} className="spin" aria-hidden />
        <AnimatePresence mode="wait">
          <motion.span
            key={scanIdx}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.2 }}
          >
            {SCAN_TICKS[scanIdx]}
          </motion.span>
        </AnimatePresence>
      </p>

      <ol className="intake-loader-stages">
        {STAGES.map((stage, i) => {
          const done = i < activeStage;
          const active = i === activeStage;
          return (
            <motion.li
              key={stage.label}
              className={`intake-loader-stage${done ? " done" : ""}${active ? " active" : ""}`}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.05 }}
            >
              <span className="intake-loader-stage-icon" aria-hidden>
                {done ? <Check size={14} /> : active ? <Loader2 size={14} className="spin" /> : <span className="intake-loader-stage-dot" />}
              </span>
              <span className="intake-loader-stage-text">
                <strong>{stage.label}</strong>
                <span className="intake-loader-stage-detail">{stage.detail}</span>
              </span>
            </motion.li>
          );
        })}
      </ol>
    </div>
  );
}

export default IntakeMatchLoader;
