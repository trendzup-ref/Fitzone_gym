import { useState } from "react";
import { NavLink } from "react-router-dom";
import "./Navbar.css";
import {FaDumbbell} from "react-icons/fa"

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  const navLinks = [
    { name: "Home", path: "/" },
    { name: "About", path: "/about" },
    { name: "Programs", path: "/programs" },
    { name: "Trainers", path: "/trainers" },
    { name: "Gallery", path: "/gallery" },
    { name: "Contact", path: "/contact" },
  ];

  return (
    <header className="navbar">
      <div className="navbar-container">

        {/* Logo */}
        <NavLink to="/" className="navbar-logo">
          <span className="logo-icon"> <FaDumbbell /> </span>

          <div className="logo-text">
            <h2>
              Fitzone <span>Gym</span>
            </h2>
            <p>Fitness • Strength • Lifestyle</p>
          </div>
        </NavLink>

        {/* Navigation Links */}
        <nav className={`nav-menu ${menuOpen ? "active" : ""}`}>
          {navLinks.map((link) => (
            <NavLink
              key={link.path}
              to={link.path}
              end={link.path === "/"}
              className={({ isActive }) =>
                isActive ? "nav-link active-link" : "nav-link"
              }
              onClick={() => setMenuOpen(false)}
            >
              {link.name}
            </NavLink>
          ))}

          {/* Mobile Admin Login */}
          <NavLink
            to="/login"
            className="admin-btn mobile-admin"
            onClick={() => setMenuOpen(false)}
          >
            Login / Register
          </NavLink>
        </nav>

        {/* Login / Register */}
        <NavLink to="/login" className="admin-btn desktop-admin">
          <span>♟</span> Login / Register 
        </NavLink>

        {/* Mobile Menu Button */}
        <button
          className="menu-toggle"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle navigation"
          aria-expanded={menuOpen}
        >
          {menuOpen ? "✕" : "☰"}
        </button>

      </div>
    </header>
  );
}

export default Navbar;