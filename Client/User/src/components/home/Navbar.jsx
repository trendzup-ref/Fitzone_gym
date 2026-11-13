import { useState, useEffect } from "react";
import { NavLink, useNavigate, useLocation } from "react-router-dom";

import { FaUser  } from 'react-icons/fa'

import "./Navbar.css";
import { FaDumbbell } from "react-icons/fa";

const API_URL =
  import.meta.env.VITE_BACKEND_URL || "https://fitzone-gym-one-peach.vercel.app/api";

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();
  const location = useLocation();

  const navLinks = [
    { name: "Home", path: "/" },
    { name: "About", path: "/about" },
    { name: "Programs", path: "/programs" },
    { name: "Trainers", path: "/trainers" },
    { name: "Gallery", path: "/gallery" },
    { name: "Contact", path: "/contact" },
  ];

  // Check Member Login
  const checkMemberLogin = async () => {
    try {
      const response = await fetch(
        `${API_URL}/member-dashboard/profile`,
        {
          method: "GET",
          credentials: "include",
        }
      );

      if (!response.ok) {
        setIsLoggedIn(false);
        return;
      }

      const data = await response.json();

      setIsLoggedIn(data.success === true);
    } catch (error) {
      console.error("Member Authentication Error:", error);
      setIsLoggedIn(false);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkMemberLogin();
  }, [location.pathname]);

  // Member Logout
  const handleLogout = async () => {
    try {
      const response = await fetch(
        `${API_URL}/member-auth/logout`,
        {
          method: "POST",
          credentials: "include",
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Logout failed");
      }

      setIsLoggedIn(false);
      setMenuOpen(false);

      navigate("/");
    } catch (error) {
      console.error("Logout Error:", error);
      alert(error.message || "Unable to logout");
    }
  };

  return (
    <header className="navbar">
      <div className="navbar-container">

        {/* Logo */}
        <NavLink to="/" className="navbar-logo">
          <span className="logo-icon">
            <FaDumbbell />
          </span>

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

          {/* Mobile Authentication */}
          {!loading && (
            <>
              {isLoggedIn ? (
                <>
                  <NavLink
                    to="/member/dashboard"
                    className="dashboard-btn mobile-auth-btn"
                    onClick={() => setMenuOpen(false)}
                  >
                    Dashboard
                  </NavLink>

                  <button
                    className="logout-btn mobile-auth-btn"
                    onClick={handleLogout}
                  >
                    Logout
                  </button>
                </>
              ) : (
                <NavLink
                  to="/member/login"
                  className="admin-btn mobile-admin"
                  onClick={() => setMenuOpen(false)}
                >
                  Login / Register
                </NavLink>
              )}
            </>
          )}

        </nav>

        {/* Desktop Authentication Buttons */}
        {!loading && (
          <div className="navbar-auth">

            {isLoggedIn ? (
              <>
                <button
                  className="logout-btn"
                  onClick={handleLogout}
                >
                  Logout
                </button>

                <NavLink
                  to="/member/dashboard"
                  className="dashboard-btn"
                >
                  Dashboard
                </NavLink>
              </>
            ) : (
              <NavLink
                to="/member/login"
                className="admin-btn desktop-admin"
              >
                 Login / Register
              </NavLink>
            )}

          </div>
        )}

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