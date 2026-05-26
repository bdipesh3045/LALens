import { useEffect, useState } from "react";
import { Map, BarChart3, GraduationCap } from "lucide-react";
import { motion } from "framer-motion";

const steps = [
  { num: "01", label: "Explore parishes", icon: Map },
  { num: "02", label: "Prioritize schools", icon: BarChart3 },
  { num: "03", label: "Match investment", icon: GraduationCap }
];

const STEP_MS = 2800;

function HomeStepper() {
  const [activeIdx, setActiveIdx] = useState(0);

  useEffect(() => {
    const id = window.setInterval(() => {
      setActiveIdx((i) => (i + 1) % steps.length);
    }, STEP_MS);
    return () => window.clearInterval(id);
  }, []);

  const progress = activeIdx / (steps.length - 1);

  return (
    <div className="home-stepper">
      <div className="home-stepper-nodes">
        <div className="home-stepper-track" aria-hidden>
          <div className="home-stepper-track-base" />
          <motion.div
            className="home-stepper-track-progress"
            initial={{ scaleX: 0 }}
            animate={{ scaleX: progress }}
            transition={{ type: "spring", stiffness: 100, damping: 20 }}
            style={{ transformOrigin: "left center" }}
          />
        </div>
        {steps.map((step, i) => {
          const active = i === activeIdx;
          return (
            <motion.div
              key={step.num}
              className={`home-step-node ${active ? "active" : ""}`}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ delay: i * 0.08, type: "spring", stiffness: 320, damping: 28 }}
            >
              <span className="home-step-num">{step.num}</span>
              <div className={`home-step-circle ${active ? "active" : ""}`}>
                <step.icon size={20} strokeWidth={1.75} />
              </div>
              <span className="home-step-label">{step.label}</span>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}

export default HomeStepper;
