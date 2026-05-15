import { useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Bot, ChartColumn, Map } from "lucide-react";
import { parishes, SAMPLE_METRIC_COUNT } from "../data/parishes";
import HomeNavbar from "../components/HomeNavbar";
import HomeFooter from "../components/HomeFooter";
import HomeStepper from "../components/HomeStepper";
import HomePlanningCard from "../components/HomePlanningCard";
import HomeMetricCard from "../components/HomeMetricCard";
import HomeChartsPreview from "../components/HomeChartsPreview";
import HomeStepCards from "../components/HomeStepCards";

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
            <span className="home-hero-line">Find where Louisiana</span>
            <span className="home-hero-line">education needs</span>
            <span className="home-hero-line">
              <span className="home-gradient-investment">investment.</span>
            </span>
            <span className="home-hero-line">Build pathways that</span>
            <span className="home-hero-line">
              match <span className="home-gradient-opportunity">opportunity.</span>
            </span>
          </motion.h1>

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
            <Link to="/methodology" className="home-btn-secondary">
              View Methodology
            </Link>
          </motion.div>
        </section>

        <HomeStepper />

        <div className="home-planning-wrap">
          <HomePlanningCard />
        </div>

        <section className="home-metrics-row" aria-label="Key metrics">
          <HomeMetricCard value={String(homeStats.mapped)} label="Parishes mapped" accent="lavender" />
          <HomeMetricCard value={String(homeStats.sampleMetrics)} label="Sample metrics" accent="orange" />
          <HomeMetricCard value="5" label="Score factors" accent="blue" />
          <HomeMetricCard value="1" label="Decision model" accent="green" />
        </section>
        <p className="tiny muted home-map-note" style={{ textAlign: "center", maxWidth: "52rem", margin: "-0.5rem auto 0" }}>
          The prototype maps all Louisiana parishes and demonstrates scoring with an initial sample dataset.
        </p>

        <HomeChartsPreview />

        <section className="home-features-section">
          <h2 className="home-section-title home-section-title-center">Three tools. One investment decision.</h2>
          <div className="home-feature-grid">
            <motion.article
              className="home-feature-card"
              whileHover={{ y: -6 }}
              transition={{ duration: 0.2 }}
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
              whileHover={{ y: -6 }}
              transition={{ duration: 0.2 }}
            >
              <span className="home-feature-accent pink" />
              <span className="home-feature-icon">
                <Bot size={22} strokeWidth={1.75} />
              </span>
              <h3>AI Insight Engine</h3>
              <p>Ask plain-English questions and receive answers grounded in the 12-parish sample shown in this prototype.</p>
            </motion.article>
            <motion.article
              className="home-feature-card"
              whileHover={{ y: -6 }}
              transition={{ duration: 0.2 }}
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

        <section className="home-steps-section">
          <p className="home-kicker">THREE STEPS</p>
          <h2 className="home-section-title home-section-title-center">One navigator for better education investment.</h2>
          <HomeStepCards />
        </section>

        <section className="home-final-cta">
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
        </section>
      </main>

      <HomeFooter />
    </div>
  );
}

export default Home;
