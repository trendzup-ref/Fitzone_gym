import { useState } from "react";

import {
FaBell,
FaUserCircle,
FaChevronDown,
FaUser,
FaCog,
FaSignOutAlt,
} from "react-icons/fa";

import styles from "./Navbar.module.css";

const Navbar = () => {

const [showProfile, setShowProfile] = useState(false);

return ( <header className={styles.navbar}>


  {/* Left Section */}

  <div className={styles.leftSection}>
    <h2>Dashboard</h2>
    <p>Welcome back, Admin! Here's your gym overview.</p>
  </div>

  {/* Right Section */}

  <div className={styles.rightSection}>

    {/* Notification */}
{/* 
    <button className={styles.notification}>
      <FaBell />
      <span className={styles.notificationBadge}>3</span>
    </button> */}

    {/* Profile */}

    <div className={styles.profileContainer}>

      <button
        className={styles.profile}
        onClick={() => setShowProfile(!showProfile)}
      >
        <FaUserCircle className={styles.avatar} />

        <div className={styles.profileInfo}>
          <h4>Admin</h4>
          {/* <span>Administrator</span> */}
        </div>

        {/* <FaChevronDown className={styles.arrow} /> */}
      </button>

      {/* Dropdown */}

      {/* {showProfile && (

        <div className={styles.dropdown}>

          <button>
            <FaUser />
            My Profile
          </button>

          <button>
            <FaCog />
            Settings
          </button>

          <hr />

          <button className={styles.logout}>
            <FaSignOutAlt />
            Logout
          </button>

        </div>

      )} */}

    </div>

  </div>

</header>


);
};

export default Navbar;
