import { useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ChartColumn, Map } from "lucide-react";
import { parishes, SAMPLE_METRIC_COUNT } from "../data/parishes";
import BrandLogo from "../components/BrandLogo";
import HomeNavbar from "../components/HomeNavbar";
import HomeFooter from "../components/HomeFooter";
import HomeStepper from "../components/HomeStepper";
import HomeHeroMap from "../components/HomeHeroMap";
import HomePlanningCard from "../components/HomePlanningCard";
import HomeMetricCard from "../components/HomeMetricCard";
import HomeChartsPreview from "../components/HomeChartsPreview";
import HomeStepCards from "../components/HomeStepCards";
import PlatformAnalytics from "../components/PlatformAnalytics";
import RealityNote from "../components/RealityNote";
import { problemMiniCards, productNarrative } from "../data/realityAnchors";

function Home() {
  useEffect(() => {
    document.body.classList.add("home-page");
    return () => document.body.classList.remove("home-page");
  }, []);

  const homeStats = useMemo(() => {
    const mapped = parishes.length;
    const sampleMetrics = parishes.filter((p) => p.hasMetrics).length;
    return { mapped, sampleMetrics };
  }, []);

  return (
    <div className="home-layout">
      <HomeNavbar />

      <main className="home-main">
        <section className="home-hero">
          <motion.p
            className="home-hero-kicker"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
          >
            NEXUS DEVDAYS EDTECH CHALLENGE
          </motion.p>

          <motion.h1
            className="home-hero-headline"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }}
          >
            <span className="home-hero-line">Find gaps. Build better</span>
            <span className="home-hero-line">
            <span className="home-gradient-opportunity">pathways.</span>
            </span>
          </motion.h1>

          <motion.p
            className="home-hero-subhead"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.06 }}
          >
            LALens turns Louisiana education, workforce, and demographic signals into clear investment recommendations, showing where need and opportunity overlap.
          </motion.p>

          <motion.div
            className="home-hero-stepper-wrap"
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.06, type: "spring", stiffness: 280, damping: 28 }}
          >
            <HomeStepper />
          </motion.div>

          <section className="home-metrics-row home-hero-metrics" aria-label="Key metrics">
            {[
              { value: String(homeStats.mapped), label: "Parishes mapped", hint: "Public geography layer", accent: "lavender" },
              { value: String(homeStats.sampleMetrics), label: "Scored examples", hint: "Prototype sample", accent: "orange" },
              { value: "5", label: "Score factors", hint: "Transparent model", accent: "blue" },
              { value: "1", label: "Decision workflow", hint: "Map to action", accent: "green" }
            ].map((card, i) => (
              <motion.div
                key={card.label}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.07 + i * 0.05, duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
              >
                <HomeMetricCard value={card.value} label={card.label} hint={card.hint} accent={card.accent} />
              </motion.div>
            ))}
          </section>

          <RealityNote compact />

          <motion.div
            className="home-dashboard-analytics"
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.09, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          >
            <PlatformAnalytics />
          </motion.div>

          <motion.section
            className="home-problem-section"
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.45 }}
          >
            <p className="home-kicker">THE PROBLEM</p>
            <h2 className="home-section-title home-section-title-center">{productNarrative.problemTitle}</h2>
            <p className="home-section-lead home-section-lead-center">{productNarrative.problemLead}</p>
            <div className="home-problem-grid">
              {problemMiniCards.map((card) => (
                <article key={card.title} className="home-problem-card">
                  <h3>{card.title}</h3>
                  <p>{card.body}</p>
                </article>
              ))}
            </div>
          </motion.section>

          <motion.div
            className="home-hero-map-shell"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.12, type: "spring", stiffness: 260, damping: 26 }}
          >
            <HomeHeroMap />
          </motion.div>

          <p className="tiny muted home-map-note home-hero-map-note">
            The prototype maps all Louisiana parishes and demonstrates scoring with an initial sample dataset.
          </p>

          <motion.p
            className="home-hero-body"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.12 }}
          >
            LALens is designed to combine education, workforce, and demographic signals into transparent recommendations for where to invest, what to build, and why. The prototype maps <strong>all 64 Louisiana parishes</strong> and demonstrates scoring with an initial <strong>{SAMPLE_METRIC_COUNT}-parish sample dataset</strong>—not statewide official releases for every parish.
          </motion.p>

          <motion.div
            className="home-hero-ctas"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.18 }}
          >
            <Link to="/platform" className="home-btn-primary">
              Explore the Platform
            </Link>
            <Link to="/invest" className="home-btn-secondary">
              K-12 Investment Intake
            </Link>
            <Link to="/methodology" className="home-btn-secondary">
              View Methodology
            </Link>
          </motion.div>
        </section>

        <motion.div
          className="home-planning-wrap"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
        >
          <HomePlanningCard />
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.5 }}
        >
          <HomeChartsPreview />
        </motion.div>

        <section className="home-features-section">
          <motion.h2
            className="home-section-title home-section-title-center"
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.4 }}
          >
            Three tools. One investment decision.
          </motion.h2>
          <div className="home-feature-grid">
            <motion.article
              className="home-feature-card"
              initial={{ opacity: 0, y: 22 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.4, delay: 0 }}
              whileHover={{ y: -6 }}
            >
              <span className="home-feature-accent lavender" />
              <span className="home-feature-icon">
                <Map size={22} strokeWidth={1.75} />
              </span>
              <h3>Gap Map</h3>
              <p>Identify parishes where academic need, enrollment pressure, and workforce gaps overlap.</p>
            </motion.article>
            <motion.article
              className="home-feature-card"
              initial={{ opacity: 0, y: 22 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.4, delay: 0.08 }}
              whileHover={{ y: -6 }}
            >
              <span className="home-feature-accent pink" />
              <span className="home-feature-icon home-feature-icon--logo">
                <BrandLogo variant="feature" />
              </span>
              <h3>AI Insight Engine</h3>
              <p>Ask plain-English questions and receive answers grounded in the 12-parish sample shown in this prototype.</p>
            </motion.article>
            <motion.article
              className="home-feature-card"
              initial={{ opacity: 0, y: 22 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.4, delay: 0.16 }}
              whileHover={{ y: -6 }}
            >
              <span className="home-feature-accent blue" />
              <span className="home-feature-icon">
                <ChartColumn size={22} strokeWidth={1.75} />
              </span>
              <h3>Decision Dashboard</h3>
              <p>Compare Opportunity Scores, score drivers, evidence, risks, and potential partners.</p>
            </motion.article>
          </div>
        </section>

        <motion.section
          className="home-steps-section"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.45 }}
        >
          <p className="home-kicker">HOW IT WORKS</p>
          <h2 className="home-section-title home-section-title-center">From statewide map to matched K-12 investment.</h2>
          <HomeStepCards />
        </motion.section>

        <motion.section
          className="home-final-cta"
          initial={{ opacity: 0, scale: 0.98 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
        >
          <h2 className="home-final-title">Ready to find the next opportunity zone?</h2>
          <p className="home-final-text">
            Explore the prototype map and see how decision-ready intelligence can support education-investment conversations—starting with the 12-parish sample, with a path to full statewide integration.
          </p>
          <div className="home-hero-ctas">
            <Link to="/platform" className="home-btn-primary">
              Explore the Platform
            </Link>
            <Link to="/data-sources" className="home-btn-secondary">
              View Data Sources
            </Link>
          </div>
        </motion.section>
      </main>

      <HomeFooter />
    </div>
  );
}

export default Home;
