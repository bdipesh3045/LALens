import { useMemo, useState, useCallback } from "react";
import { Link } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import {
  GraduationCap,
  Briefcase,
  Heart,
  BookOpen,
  DollarSign,
  FlaskConical,
  Users,
  Check,
  ArrowRight,
  ArrowLeft,
  Send,
  ShieldCheck,
  Sparkles,
  Loader2,
  Landmark,
  School,
  Wrench,
  HeartPulse,
  HandHelping
} from "lucide-react";
import {
  INTAKE_ROLES,
  INTAKE_BUDGETS,
  INTAKE_FOCUS,
  matchSchools
} from "../utils/investmentMatch";
import SourceBadge from "../components/SourceBadge";
import IntakeMatchLoader from "../components/IntakeMatchLoader";
import IntakeChoiceGrid from "../components/IntakeChoiceGrid";

const ROLE_ICONS = {
  briefcase: Briefcase,
  heart: Heart,
  book: BookOpen,
  landmark: Landmark,
  school: School
};
const FOCUS_ICONS = {
  book: BookOpen,
  flask: FlaskConical,
  wrench: Wrench,
  "heart-pulse": HeartPulse,
  users: Users,
  "hand-helping": HandHelping
};

const STEPS = ["Your role", "Budget", "Focus area"];

function IntakeStepper({ step }) {
  const displayStep = step >= 4 ? 4 : step;
  return (
    <ol className="intake-stepper" aria-label="Progress">
      {STEPS.map((label, i) => {
        const n = i + 1;
        const done = displayStep > n;
        const active = displayStep === n && step < 4;
        return (
          <li key={label} className={`intake-step${done ? " done" : ""}${active ? " active" : ""}`}>
            <span className="intake-step-dot">{done ? <Check size={14} /> : n}</span>
            <span className="intake-step-label">{label}</span>
          </li>
        );
      })}
    </ol>
  );
}

function InvestmentIntake() {
  const [step, setStep] = useState(1);
  const [role, setRole] = useState("");
  const [budget, setBudget] = useState("");
  const [focus, setFocus] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const matches = useMemo(() => {
    if (!role || !budget || !focus) return [];
    return matchSchools({ role, budget, focus });
  }, [role, budget, focus]);

  const roleItems = useMemo(
    () =>
      INTAKE_ROLES.map((r) => {
        const Icon = ROLE_ICONS[r.icon] || Briefcase;
        return { id: r.id, title: r.title, desc: r.desc, icon: <Icon size={22} aria-hidden /> };
      }),
    []
  );

  const budgetItems = useMemo(
    () =>
      INTAKE_BUDGETS.map((b) => ({
        id: b.id,
        title: b.title,
        desc: b.desc,
        icon: <DollarSign size={22} aria-hidden />
      })),
    []
  );

  const focusItems = useMemo(
    () =>
      INTAKE_FOCUS.map((f) => {
        const Icon = FOCUS_ICONS[f.icon] || BookOpen;
        return { id: f.id, title: f.title, desc: f.desc, icon: <Icon size={22} aria-hidden /> };
      }),
    []
  );

  const canContinue =
    (step === 1 && role) || (step === 2 && budget) || (step === 3 && focus);

  const goNext = () => {
    if (step < 3) setStep((s) => s + 1);
    else setStep(4);
  };

  const goBack = () => {
    if (step === 5) setStep(3);
    else if (step > 1 && step !== 4) setStep((s) => s - 1);
  };

  const handleMatchingComplete = useCallback(() => {
    setStep(5);
  }, []);

  const handleSubmit = async () => {
    if (submitting) return;
    setSubmitting(true);
    await new Promise((r) => window.setTimeout(r, 900));
    setSubmitting(false);
    setStep(6);
  };

  const header = (
    <header className="intake-header">
      <GraduationCap size={20} aria-hidden />
      <span>K-12 Investment Intake</span>
    </header>
  );

  if (step === 6) {
    return (
      <main className="intake-page">
        {header}
        <motion.div
          className="intake-card intake-card--center"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <span className="intake-success-icon" aria-hidden>
            <Check size={36} strokeWidth={2.5} />
          </span>
          <h1>Interest recorded</h1>
          <p className="intake-lead">
            This is a decision preview. In a production deployment, your profile would route to district or operator partners for follow-up.
          </p>
          <div className="intake-status-card">
            <h2>Your sample K-12 matches</h2>
            <p className="tiny muted">Demo workflow. Not a live funding commitment.</p>
            <div className="intake-status-grid">
              <div className="intake-status-tile pending">
                <strong>{matches.length}</strong>
                <span>Queued</span>
              </div>
              <div className="intake-status-tile">
                <strong>0</strong>
                <span>In discussion</span>
              </div>
              <div className="intake-status-tile">
                <strong>0</strong>
                <span>Funded</span>
              </div>
            </div>
          </div>
          <div className="intake-actions">
            <Link to="/platform" className="btn btn-secondary">
              Back to dashboard
            </Link>
            <Link to="/platform" className="btn btn-primary">
              Explore parishes
            </Link>
          </div>
        </motion.div>
      </main>
    );
  }

  if (step === 4) {
    return (
      <main className="intake-page">
        {header}
        <div className="intake-card intake-card--loader">
          <IntakeStepper step={step} />
          <IntakeMatchLoader onComplete={handleMatchingComplete} />
        </div>
      </main>
    );
  }

  if (step === 5) {
    return (
      <main className="intake-page">
        {header}
        <motion.div
          className="intake-card intake-card--wide"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
        >
          <span className="intake-matches-ready">
            <Sparkles size={14} aria-hidden />
            Matches ready
          </span>
          <h1>Your recommended investment matches</h1>
          <p className="intake-lead">
            Ranked from LALens parish signals, need indicators, and pathway fit. Ranges are demo estimates, not official LDOE funding figures.
          </p>
          <ul className="intake-match-list">
            {matches.map((s, i) => (
              <motion.li
                key={s.id}
                className="intake-match-card"
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15 + i * 0.08 }}
              >
                <motion.div className="intake-match-main">
                  <div className="intake-match-title-row">
                    <h3>{s.name}</h3>
                    <span className={`intake-match-pct${s.matchPct >= 88 ? " high" : ""}`}>{s.matchPct}% match</span>
                    <SourceBadge type="demo" label="Demo estimate" />
                  </div>
                  <p className="tiny muted">
                    {s.parishName} Parish · {s.type}
                  </p>
                  <p className="intake-match-stat">{s.needSignal}</p>
                  <p className="intake-match-why">{s.whyMatch}</p>
                  <div className="intake-program-tags">
                    {s.programs.map((p) => (
                      <span key={p} className="intake-program-tag">
                        {p}
                      </span>
                    ))}
                  </div>
                </motion.div>
                <div className="intake-match-funding">
                  <strong>{s.investmentRange}</strong>
                  <span className="tiny muted">Indicative range</span>
                  <span className="tiny muted">{s.budgetFit}</span>
                </div>
              </motion.li>
            ))}
          </ul>

          <div className="intake-submit-panel">
            <motion.div
              className="intake-submit-panel-inner"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.35 }}
            >
              <div className="intake-submit-top">
                <motion.div className="intake-submit-summary">
                  <span className="intake-submit-count" aria-hidden>
                    {matches.length}
                  </span>
                  <div>
                    <strong>Ready to record your interest?</strong>
                    <p>Your profile will be queued for all {matches.length} matched schools in this demo.</p>
                  </div>
                </motion.div>
                <ul className="intake-submit-schools" aria-label="Matched schools">
                  {matches.map((s) => (
                    <li key={s.id} title={s.name}>
                      {s.name.split(" ").slice(0, 2).join(" ")}
                    </li>
                  ))}
                </ul>
              </div>

              <button
                type="button"
                className={`intake-submit-btn${submitting ? " is-loading" : ""}`}
                onClick={handleSubmit}
                disabled={submitting}
                aria-busy={submitting}
              >
                <span className="intake-submit-btn-text">
                  {submitting ? "Recording interest…" : `Record interest · ${matches.length} schools`}
                </span>
                <span className="intake-submit-btn-icon" aria-hidden>
                  {submitting ? <Loader2 size={20} className="spin" /> : <Send size={20} />}
                </span>
              </button>

              <div className="intake-submit-footer">
                <button type="button" className="intake-submit-link" onClick={() => setStep(3)}>
                  Refine my profile
                </button>
                <span className="intake-submit-divider" aria-hidden />
                <span className="intake-submit-disclaimer">
                  <ShieldCheck size={12} aria-hidden />
                  Demo only. Not a funding commitment.
                </span>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </main>
    );
  }

  return (
    <main className="intake-page">
      {header}

      <motion.div className="intake-card intake-card--form">
        <IntakeStepper step={step} />

        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            className="intake-step-content"
            initial={{ opacity: 0, x: 12 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -12 }}
            transition={{ duration: 0.25 }}
          >
            {step === 1 && (
              <>
                <h1>
                  Match your investment to{" "}
                  <span className="intake-gradient-text">Louisiana K-12</span> need
                </h1>
                <p className="intake-lead">
                  Tell us who you are and what you want to support. LALens ranks sample schools using parish opportunity signals and pathway fit.
                </p>
                <p className="intake-field-label">I am a…</p>
                <IntakeChoiceGrid items={roleItems} value={role} onChange={setRole} columns={3} />
              </>
            )}

            {step === 2 && (
              <>
                <h1>
                  What is your <span className="intake-gradient-text">investment capacity</span>?
                </h1>
                <p className="intake-lead">We use this to suggest program scale, from classroom grants through multi-site partnerships.</p>
                <p className="intake-field-label">Annual giving range</p>
                <IntakeChoiceGrid items={budgetItems} value={budget} onChange={setBudget} columns={3} />
              </>
            )}

            {step === 3 && (
              <>
                <h1>
                  What <span className="intake-gradient-text">focus area</span> matters most?
                </h1>
                <p className="intake-lead">Choose the education lever you want to align with workforce and student-need signals.</p>
                <p className="intake-field-label">K-12 focus</p>
                <IntakeChoiceGrid items={focusItems} value={focus} onChange={setFocus} columns={3} />
              </>
            )}
          </motion.div>
        </AnimatePresence>

        <div className="intake-nav">
          {step > 1 ? (
            <button type="button" className="btn btn-secondary intake-btn-back" onClick={goBack}>
              <ArrowLeft size={16} aria-hidden /> Back
            </button>
          ) : (
            <span />
          )}
          {step < 3 ? (
            <button type="button" className="btn intake-btn-gradient" disabled={!canContinue} onClick={goNext}>
              Continue <ArrowRight size={16} aria-hidden />
            </button>
          ) : (
            <button type="button" className="btn intake-btn-gradient" disabled={!canContinue} onClick={goNext}>
              Find matches <ArrowRight size={16} aria-hidden />
            </button>
          )}
        </div>

        <p className="intake-footnote">
          <ShieldCheck size={14} aria-hidden />
          Matches combine public-source references with model estimates in the 12-parish sample. Not an official state allocation tool.
        </p>
      </motion.div>
    </main>
  );
}

export default InvestmentIntake;
