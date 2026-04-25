import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import "./Navbar.css";

function Navbar() {
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  const links = [
    { to: "/", label: "Home" },
    { to: "/jobs", label: "Find Jobs" },
    { to: "/login", label: "Login" },
    { to: "/register", label: "Register" },
  ];

  return (
    <nav className="navbar">
      {/* Brand */}
      <Link to="/" className="navbar-brand">
        <div className="brand-icon">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
            <path d="M20 7H4C2.9 7 2 7.9 2 9v10c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V9c0-1.1-.9-2-2-2z" fill="currentColor"/>
            <path d="M16 7V5c0-1.1-.9-2-2-2h-4c-1.1 0-2 .9-2 2v2" stroke="white" strokeWidth="2" strokeLinecap="round"/>
            <circle cx="12" cy="13" r="2" fill="white"/>
          </svg>
        </div>
        <div className="brand-text">
          <span className="brand-name">Job<span className="brand-accent">Portal</span></span>
        </div>
      </Link>

      {/* Desktop Nav */}
      <div className="nav-links">
        {links.map(({ to, label }) => (
          <Link
            key={to}
            to={to}
            className={`nav-link ${location.pathname === to ? "active" : ""}`}
          >
            {label}
          </Link>
        ))}
        <Link to="/dashboard" className="nav-dashboard-btn">
          Dashboard
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" strokeWidth="2.5" stroke="currentColor">
            <path d="M5 12h14M12 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </Link>
      </div>

      {/* Mobile Hamburger */}
      <button className="hamburger" onClick={() => setMenuOpen(!menuOpen)} aria-label="Toggle menu">
        <span className={menuOpen ? "bar open" : "bar"} />
        <span className={menuOpen ? "bar open" : "bar"} />
        <span className={menuOpen ? "bar open" : "bar"} />
      </button>

      {/* Mobile Drawer */}
      {menuOpen && (
        <div className="mobile-menu">
          {links.map(({ to, label }) => (
            <Link
              key={to}
              to={to}
              className={`mobile-link ${location.pathname === to ? "active" : ""}`}
              onClick={() => setMenuOpen(false)}
            >
              {label}
            </Link>
          ))}
          <Link to="/dashboard" className="mobile-dashboard-btn" onClick={() => setMenuOpen(false)}>
            Dashboard →
          </Link>
        </div>
      )}
    </nav>
  );
}

export default Navbar;