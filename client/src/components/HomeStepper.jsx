import { Map, SlidersHorizontal, Route } from "lucide-react";
import { motion } from "framer-motion";

const steps = [
  { num: "01", label: "Map the Gaps", icon: Map },
  { num: "02", label: "Prioritize Investment", icon: SlidersHorizontal, active: true },
  { num: "03", label: "Build Pathways", icon: Route }
];

function HomeStepper() {
  return (
    <div className="home-stepper">
      <div className="home-stepper-track" aria-hidden />
      <div className="home-stepper-nodes">
        {steps.map((step, i) => (
          <motion.div
            key={step.num}
            className={`home-step-node ${step.active ? "active" : ""}`}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }}
          >
            <span className="home-step-num">{step.num}</span>
            <div className={`home-step-circle ${step.active ? "active" : ""}`}>
              <step.icon size={20} strokeWidth={1.75} />
            </div>
            <span className="home-step-label">{step.label}</span>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

export default HomeStepper;
