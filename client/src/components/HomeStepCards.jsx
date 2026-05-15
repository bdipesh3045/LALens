import { motion } from "framer-motion";

const cards = [
  {
    num: "01",
    title: "Collect the signals",
    body: "Public education, workforce, demographic, and geographic data are organized into one parish-level view.",
    accent: "purple"
  },
  {
    num: "02",
    title: "Calculate opportunity",
    body: "A transparent scoring model compares student need, enrollment pressure, workforce gap, pathway access, and feasibility.",
    accent: "orange"
  },
  {
    num: "03",
    title: "Recommend action",
    body: "Leaders receive a ranked investment brief with evidence, risks, confidence level, and potential partners.",
    accent: "green"
  }
];

function HomeStepCards() {
  return (
    <div className="home-three-cards">
      {cards.map((c, i) => (
        <motion.article
          key={c.num}
          className="home-step-card"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: i * 0.06 }}
          whileHover={{ y: -4 }}
        >
          <span className={`home-step-badge ${c.accent}`}>{c.num}</span>
          <h3>{c.title}</h3>
          <p>{c.body}</p>
        </motion.article>
      ))}
    </div>
  );
}

export default HomeStepCards;
