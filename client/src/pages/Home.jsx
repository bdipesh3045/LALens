import { useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ChartColumn, Map, Sparkles } from "lucide-react";
import { parishes, SAMPLE_METRIC_COUNT } from "../data/parishes";
import BrandLogo from "../components/BrandLogo";
import HomeNavbar from "../components/HomeNavbar";
import HomeFooter from "../components/HomeFooter";
import HomeStepper from "../components/HomeStepper";
import HomeHeroMap from "../components/HomeHeroMap";
import HomePlanningCard from "../components/HomePlanningCard";
import HomeMetricCard from "../components/HomeMetricCard";
import HomeStepCards from "../components/HomeStepCards";
import PlatformAnalytics from "../components/PlatformAnalytics";
import RealityNote from "../components/RealityNote";
import { problemMiniCards, productNarrative } from "../data/realityAnchors";

const fadeUp = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-60px" },
  transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] }
};

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
            Nexus DevDays
          </motion.p>

          <motion.h1
            className="home-hero-headline"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }}
          >
            See where Louisiana schools need help most.
          </motion.h1>

          <motion.p
            className="home-hero-subhead"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.08 }}
          >
            LALens combines education, workforce, and census data into one view.
            Find parishes where investment can make the biggest difference.
          </motion.p>

          <motion.div
            className="home-hero-stepper-wrap"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.12, type: "spring", stiffness: 260, damping: 28 }}
          >
            <HomeStepper />
          </motion.div>

          <motion.div
            className="home-hero-ctas home-hero-ctas--top"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.16 }}
          >
            <Link to="/platform" className="home-btn-primary">
              Open the map
            </Link>
            <Link to="/invest" className="home-btn-secondary">
              Match your investment
            </Link>
          </motion.div>
        </section>

        <section className="home-section home-section--metrics" aria-label="Key metrics">
          <div className="home-metrics-row">
            {[
              { value: String(homeStats.mapped), label: "Parishes mapped", hint: "All 64 Louisiana parishes", accent: "lavender" },
              { value: String(homeStats.sampleMetrics), label: "Scored in prototype", hint: "Full data available", accent: "orange" },
              { value: "5", label: "Factors per score", hint: "Transparent methodology", accent: "blue" },
              { value: "1", label: "Decision workflow", hint: "Map to brief", accent: "green" }
            ].map((card, i) => (
              <motion.div
                key={card.label}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.06, duration: 0.45 }}
              >
                <HomeMetricCard value={card.value} label={card.label} hint={card.hint} accent={card.accent} />
              </motion.div>
            ))}
          </div>
        </section>

        <motion.section className="home-section home-section--analytics" {...fadeUp}>
          <p className="home-kicker">Statewide signals</p>
          <h2 className="home-section-title">What the data tells us about Louisiana</h2>
          <p className="home-section-lead">
            Enrollment trends, workforce demand, and investment focus. Public data where available,
            model estimates where noted.
          </p>
          <div className="home-dashboard-analytics">
            <PlatformAnalytics />
          </div>
          <RealityNote compact className="home-reality-note" />
        </motion.section>

        <motion.section className="home-section home-section--problem" {...fadeUp}>
          <p className="home-kicker">The challenge</p>
          <h2 className="home-section-title">Good data exists. It just lives in different places.</h2>
          <p className="home-section-lead">
            School performance, enrollment, poverty rates, and workforce projections are scattered
            across agencies. LALens brings them together so you can see the full picture.
          </p>
          <div className="home-problem-grid">
            {problemMiniCards.map((card) => (
              <article key={card.title} className="home-problem-card">
                <h3>{card.title}</h3>
                <p>{card.body}</p>
              </article>
            ))}
          </div>
        </motion.section>

        <motion.section className="home-section home-section--map" {...fadeUp}>
          <p className="home-kicker">Gap map</p>
          <h2 className="home-section-title">Every Louisiana parish, one view</h2>
          <p className="home-section-lead">
            All <strong>64 parishes</strong> are mapped. Detailed scores are shown for{" "}
            <strong>{SAMPLE_METRIC_COUNT} parishes</strong> in this prototype.
          </p>
          <div className="home-hero-map-shell">
            <HomeHeroMap />
          </div>
          <p className="home-map-caption">
            Drag and zoom to explore. Sample parishes include full dashboards and AI-ready briefs.
          </p>
        </motion.section>

        <motion.section className="home-section home-section--planning" {...fadeUp}>
          <div className="home-planning-wrap">
            <HomePlanningCard />
          </div>
        </motion.section>

        <motion.section className="home-section home-features-section" {...fadeUp}>
          <p className="home-kicker">Three tools</p>
          <h2 className="home-section-title">Map, ask, compare</h2>
          <p className="home-section-lead">
            Identify gaps, ask plain-English questions, and compare scores without switching tabs.
          </p>
          <div className="home-feature-grid">
            <motion.article className="home-feature-card" whileHover={{ y: -4 }}>
              <span className="home-feature-accent lavender" />
              <span className="home-feature-icon">
                <Map size={22} strokeWidth={1.75} />
              </span>
              <h3>Gap Map</h3>
              <p>See which parishes have overlapping academic need, enrollment pressure, and workforce gaps.</p>
            </motion.article>
            <motion.article className="home-feature-card" whileHover={{ y: -4 }}>
              <span className="home-feature-accent pink" />
              <span className="home-feature-icon home-feature-icon--logo">
                <Sparkles size={22} strokeWidth={1.75} />
              </span>
              <h3>AI Insight Engine</h3>
              <p>Ask questions in plain English. Get answers grounded in the sample data.</p>
            </motion.article>
            <motion.article className="home-feature-card" whileHover={{ y: -4 }}>
              <span className="home-feature-accent blue" />
              <span className="home-feature-icon">
                <ChartColumn size={22} strokeWidth={1.75} />
              </span>
              <h3>Decision Dashboard</h3>
              <p>Compare Opportunity Scores, see what drives them, and weigh risks and partners.</p>
            </motion.article>
          </div>
        </motion.section>

        <motion.section className="home-section home-steps-section" {...fadeUp}>
          <p className="home-kicker">How it works</p>
          <h2 className="home-section-title">From map to matched brief</h2>
          <p className="home-section-lead">
            Explore parishes, prioritize schools, and get a ranked brief you can share with funders and operators.
          </p>
          <HomeStepCards />
        </motion.section>

        <motion.section className="home-section home-final-cta" {...fadeUp}>
          <h2 className="home-final-title">Ready to find the next opportunity?</h2>
          <p className="home-final-text">
            Start with the {SAMPLE_METRIC_COUNT}-parish sample. Full statewide data will expand as
            official datasets connect.
          </p>
          <div className="home-hero-ctas">
            <Link to="/platform" className="home-btn-primary">
              Open the map
            </Link>
            <Link to="/data-sources" className="home-btn-secondary">
              View data sources
            </Link>
          </div>
        </motion.section>
      </main>

      <HomeFooter />
    </div>
  );
}

export default Home;
