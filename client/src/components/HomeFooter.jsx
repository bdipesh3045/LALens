import { Link } from "react-router-dom";
import BrandLogo from "./BrandLogo";

function HomeFooter() {
  return (
    <footer className="home-footer">
      <div className="home-footer-inner">
        <div className="home-footer-brand">
          <BrandLogo variant="footer" />
          <p className="home-footer-tagline">
            LALens uses <strong>live public Census data</strong> for all 64 parishes and a{" "}
            <strong>12-parish prototype</strong> for Opportunity Scores.
          </p>
        </div>
        <div className="home-footer-links">
          <Link to="/methodology">Methodology</Link>
          <Link to="/data-sources">Data Sources</Link>
          <Link to="/platform">Platform</Link>
          <Link to="/challenge">Challenge</Link>
        </div>
      </div>
    </footer>
  );
}

export default HomeFooter;
