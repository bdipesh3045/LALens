import { Link, NavLink } from "react-router-dom";
import { ArrowRight, Compass } from "lucide-react";

const links = [
  { to: "/platform", label: "Platform" },
  { to: "/methodology", label: "Methodology" },
  { to: "/data-sources", label: "Data Sources" },
  { to: "/challenge", label: "Challenge" }
];

function HomeNavbar() {
  return (
    <header className="home-nav">
      <div className="home-nav-inner">
        <Link to="/" className="home-brand">
          <span className="home-brand-icon">
            <Compass size={20} strokeWidth={1.75} />
          </span>
          <span className="home-brand-text">
            <span className="home-brand-title">Louisiana Opportunity Navigator</span>
            <span className="home-brand-sub">Education Intelligence Engine</span>
          </span>
        </Link>
        <nav className="home-nav-links" aria-label="Main navigation">
          {links.map((link) => (
            <NavLink key={link.to} to={link.to} className={({ isActive }) => (isActive ? "active" : "")}>
              {link.label}
            </NavLink>
          ))}
        </nav>
        <Link to="/platform" className="home-cta">
          Explore the Map
          <ArrowRight size={16} strokeWidth={2} />
        </Link>
      </div>
    </header>
  );
}

export default HomeNavbar;
