import { motion, useReducedMotion } from "framer-motion";
import { Users, LineChart, Briefcase, Waypoints, CircleCheck } from "lucide-react";
import { DEFAULT_WEIGHTS } from "../utils/scoring";
import { scoreFactorHelp } from "../data/realityAnchors";
import SourceBadge from "./SourceBadge";
import RealityNote from "./RealityNote";

const FACTORS = [
  {
    key: "studentNeedScore",
    label: "Student need",
    Icon: Users,
    accent: "#6d5dfb",
    accentEnd: "#b4a8ff"
  },
  {
    key: "enrollmentPressureScore",
    label: "Enrollment pressure",
    Icon: LineChart,
    accent: "#2563eb",
    accentEnd: "#93c5fd"
  },
  {
    key: "workforceGapScore",
    label: "Workforce gap",
    Icon: Briefcase,
    accent: "#0d9488",
    accentEnd: "#5eead4"
  },
  {
    key: "pathwayAccessGapScore",
    label: "Pathway access",
    Icon: Waypoints,
    accent: "#d97706",
    accentEnd: "#fcd34d"
  },
  {
    key: "feasibilityScore",
    label: "Feasibility",
    Icon: CircleCheck,
    accent: "#16a34a",
    accentEnd: "#86efac"
  }
];

const FACTOR_HELP_KEYS = {
  studentNeedScore: "studentNeed",
  enrollmentPressureScore: "enrollmentPressure",
  workforceGapScore: "workforceGap",
  pathwayAccessGapScore: "pathwayAccess",
  feasibilityScore: "feasibility"
};

const FACTORS_WITH_META = FACTORS.map((row) => ({
  ...row,
  weightPct: Math.round((DEFAULT_WEIGHTS[row.key] ?? 0) * 100),
  help: scoreFactorHelp[FACTOR_HELP_KEYS[row.key]] || ""
}));

function clampScore(n) {
  const x = Number(n);
  if (!Number.isFinite(x)) return 0;
  return Math.min(100, Math.max(0, Math.round(x)));
}

export default function ScoreBreakdown({ parish, compact = false }) {
  const reduceMotion = useReducedMotion();

  return (
    <article className={`card score-breakdown-card${compact ? " score-breakdown-card--compact" : ""}`}>
      <header className="score-breakdown-head">
        <div className="score-breakdown-head-row">
          <div>
            <p className="section-label">Score breakdown</p>
            <h3 className="score-breakdown-title">Five factor indices</h3>
          </div>
          <SourceBadge type="model" />
        </div>
        {!compact && (
          <p className="score-breakdown-lead">
            Each factor is scored 0–100. The headline Opportunity Score is a weighted blend using the percentages shown.
          </p>
        )}
      </header>
      <ul className="score-breakdown-list" aria-label="Opportunity score factors">
        {FACTORS_WITH_META.map((row, i) => {
          const val = clampScore(parish?.[row.key]);
          const { Icon } = row;
          const fillStyle = {
            background: `linear-gradient(90deg, ${row.accent} 0%, ${row.accentEnd} 100%)`
          };
          return (
            <li className="score-breakdown-row" key={row.key}>
              <div className="score-breakdown-label-cell">
                <span
                  className="score-breakdown-icon"
                  style={{ color: row.accent, backgroundColor: `${row.accent}18` }}
                  aria-hidden
                >
                  <Icon size={18} strokeWidth={1.85} />
                </span>
                <div className="score-breakdown-text">
                  <span className="score-breakdown-label">{row.label}</span>
                  <span className="score-breakdown-weight">{row.weightPct}% of composite</span>
                  {!compact && <span className="score-breakdown-help tiny muted">{row.help}</span>}
                </div>
              </div>
              <div
                className="score-breakdown-track"
                role="progressbar"
                aria-valuemin={0}
                aria-valuemax={100}
                aria-valuenow={val}
                aria-label={`${row.label}: ${val} out of 100`}
              >
                <motion.div
                  className="score-breakdown-fill"
                  style={fillStyle}
                  initial={reduceMotion ? false : { width: 0 }}
                  animate={{ width: `${val}%` }}
                  transition={
                    reduceMotion
                      ? { duration: 0 }
                      : { delay: 0.05 + i * 0.06, duration: 0.55, ease: [0.22, 1, 0.36, 1] }
                  }
                />
              </div>
              <span className="score-breakdown-value" aria-hidden>
                {val}
              </span>
            </li>
          );
        })}
      </ul>
      {!compact && <RealityNote compact />}
    </article>
  );
}
