import { useEffect, useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { ArrowRight, Menu, X } from "lucide-react";
import BrandLogo from "./BrandLogo";

const links = [
  { to: "/platform", label: "Platform" },
  { to: "/invest", label: "Investment Intake" },
  { to: "/methodology", label: "Methodology" },
  { to: "/data-sources", label: "Data Sources" },
  { to: "/challenge", label: "Challenge" }
];

function HomeNavbar() {
  const { pathname } = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    document.body.classList.toggle("home-nav-menu-open", menuOpen);
    return () => document.body.classList.remove("home-nav-menu-open");
  }, [menuOpen]);

  return (
    <header className="home-nav">
      <div className="home-nav-inner">
        <Link to="/" className="home-brand">
          <span className="home-brand-icon">
            <BrandLogo variant="nav" loading="eager" fetchPriority="high" />
          </span>
          <span className="home-brand-text">
            <span className="home-brand-title">LALens</span>
            <span className="home-brand-sub">Louisiana Education Data</span>
          </span>
        </Link>

        <nav className="home-nav-links" aria-label="Main navigation">
          {links.map((link) => (
            <NavLink key={link.to} to={link.to} className={({ isActive }) => (isActive ? "active" : "")}>
              {link.label}
            </NavLink>
          ))}
        </nav>

        <Link to="/platform" className="home-cta home-cta--desktop">
          Open Map
          <ArrowRight size={16} strokeWidth={2} aria-hidden />
        </Link>

        <button
          type="button"
          className="home-nav-toggle"
          aria-expanded={menuOpen}
          aria-controls="home-nav-mobile"
          onClick={() => setMenuOpen((open) => !open)}
        >
          <span className="sr-only">{menuOpen ? "Close menu" : "Open menu"}</span>
          {menuOpen ? <X size={22} aria-hidden /> : <Menu size={22} aria-hidden />}
        </button>
      </div>

      <nav
        id="home-nav-mobile"
        className={`home-nav-mobile${menuOpen ? " is-open" : ""}`}
        aria-label="Mobile navigation"
        aria-hidden={!menuOpen}
      >
        {links.map((link) => (
          <NavLink key={link.to} to={link.to} className={({ isActive }) => (isActive ? "active" : "")}>
            {link.label}
          </NavLink>
        ))}
        <Link to="/platform" className="home-cta home-cta--mobile" onClick={() => setMenuOpen(false)}>
          Open Map
          <ArrowRight size={16} strokeWidth={2} aria-hidden />
        </Link>
      </nav>
    </header>
  );
}

export default HomeNavbar;
