import { useState, useEffect } from "react";
import { NavLink, useLocation } from "react-router-dom";
import {
  FaHome,
  FaUsers,
  FaDumbbell,
  FaComments,
  FaSignOutAlt,
  FaBars,
  FaTimes,
  FaIdCard ,
  FaBullhorn
} from "react-icons/fa";

import styles from "./Sidebar.module.css";
import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AdminContext } from "../../context/AdminContext";


const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    setIsOpen(false);
  }, [location.pathname]);

  const navigate = useNavigate();

const { logout } = useContext(AdminContext);

const handleLogout = async () => {
  try {
    await logout();

    navigate("/admin/login", { replace: true });
  } catch (error) {
    console.error("Logout failed:", error);
  }
};

  const menuItems = [
    { name: "Dashboard", path: "/admin/dashboard", icon: <FaHome /> },
    { name: "Members", path: "/admin/members", icon: <FaUsers /> },
    { name: "Membership", path: "/admin/membership", icon: <FaIdCard /> },
    { name: "Trainers", path: "/admin/trainers", icon: <FaDumbbell /> },
    { name: "Inquiries", path: "/admin/inquiries", icon: <FaComments /> },
    { name : "Announcements" , path: "/admin/announcements" , icon: <FaBullhorn/> }
  ];

  return (
    <>
      {/* Mobile Top Navigation Bar  */}
      <header className={styles.mobileHeader}>
        <div className={styles.mobileBrand}>
          <FaDumbbell className={styles.mobileBrandIcon} />
          <span>Fitzone Gym</span>
        </div>
        <button
          className={styles.menuToggleBtn}
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Toggle navigation menu"
        >
          {isOpen ? <FaTimes /> : <FaBars />}
        </button>
      </header>

      {/* Backdrop Overlay for Mobile Drawer */}
      {isOpen && (
        <div
          className={styles.backdrop}
          onClick={() => setIsOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Sidebar Component */}
      <aside
        className={`${styles.sidebar} ${isOpen ? styles.sidebarMobileOpen : ""}`}
      >
        {/* Logo */}
        <div className={styles.logo}>
          <FaDumbbell className={styles.logoIcon} />
          <div>
            <h2>Fitzone Gym</h2>
            <span>Gym Management System</span>
          </div>
        </div>

        
        <nav className={styles.navigation}>
          {menuItems.map((item) => (
            <NavLink
              key={item.name}
              to={item.path}
              className={({ isActive }) =>
                `${styles.navLink} ${isActive ? styles.active : ""}`
              }
            >
              <span className={styles.navIcon}>{item.icon}</span>
              <span>{item.name}</span>
            </NavLink>
          ))}
        </nav>

      
        <div className={styles.logoutSection}>
          <button className={styles.logoutButton} onClick={handleLogout}>
            <FaSignOutAlt />
            <span>Logout</span>
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;