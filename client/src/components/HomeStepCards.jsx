import { motion } from "framer-motion";

const cards = [
  {
    num: "01",
    title: "Explore parishes",
    body: "Map all 64 Louisiana parishes with statewide KPIs, opportunity scores, and a detail panel for workforce demand and local schools.",
    accent: "purple"
  },
  {
    num: "02",
    title: "Prioritize schools",
    body: "Rank institutions by workforce gap, poverty, and funding need, then drill into parish dashboards and score breakdowns.",
    accent: "orange"
  },
  {
    num: "03",
    title: "Match investment",
    body: "Use the investment intake wizard to align your role, budget, and focus area with sample school matches.",
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
