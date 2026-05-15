import { Link } from "react-router-dom";

function HomeFooter() {
  return (
    <footer className="home-footer">
      <div className="home-footer-inner">
        <p>
          LALens uses a <strong>12-parish sample</strong> to demonstrate the workflow. Official public datasets are not yet connected.
        </p>
        <div className="home-footer-links">
          <Link to="/methodology">Methodology</Link>
          <Link to="/data-sources">Data Sources</Link>
          <Link to="/platform">Platform</Link>
        </div>
      </div>
    </footer>
  );
}

export default HomeFooter;
