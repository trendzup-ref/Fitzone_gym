import { useEffect, useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { toast } from "react-toastify";

import {
  FaDumbbell,
  FaHome,
  FaUser,
  FaBullhorn,
  FaSignOutAlt,
  FaCalendarAlt,
  FaClock,
  FaIdCard,
  FaPhone,
  FaEnvelope,
  FaMapMarkerAlt,
  FaVenusMars,
  FaEdit,
  FaBell,
  FaArrowRight,
  FaBars,
  FaTimes,
} from "react-icons/fa";

import styles from "./Dashboard.module.css";

const API_URL = import.meta.env.VITE_BACKEND_URL || "https://fitzone-gym-one-peach.vercel.app/api";

const Dashboard = () => {
  const [member, setMember] = useState(null);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Fetch Member Profile
  const fetchMemberProfile = async () => {
    try {
      setLoading(true);

      const response = await fetch(`${API_URL}/member-dashboard/profile`, {
        method: "GET",
        credentials: "include",
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Unable to fetch profile");
      }

      setMember(data.member);
    } catch (error) {
      console.error("Dashboard Error:", error);
      toast.error(error.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMemberProfile();
  }, []);

  // Calculate Remaining Days
  const getDaysRemaining = (expiryDate) => {
    if (!expiryDate) return 0;

    const today = new Date();
    const expiry = new Date(expiryDate);

    today.setHours(0, 0, 0, 0);
    expiry.setHours(0, 0, 0, 0);

    return Math.max(
      0,
      Math.ceil((expiry - today) / (1000 * 60 * 60 * 24))
    );
  };

  // Format Date
  const formatDate = (date) => {
    if (!date) return "N/A";

    return new Date(date).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  // Logout
  const handleLogout = async () => {
    try {
      const response = await fetch(`${API_URL}/member-auth/logout`, {
        method: "POST",
        credentials: "include",
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Logout failed");
      }

      toast.success("Logout successful!");
      window.location.href = "/member/login";
    } catch (error) {
      toast.error(error.message || "Logout failed");
    }
  };

  if (loading) {
    return (
      <div className={styles.loadingScreen}>
        <FaDumbbell className={styles.loadingIcon} />
        <p>Loading your dashboard...</p>
      </div>
    );
  }

  if (!member) {
    return (
      <div className={styles.loadingScreen}>
        <h2>Unable to load dashboard</h2>
        <p>Please login again.</p>
        <Link to="/member/login" className={styles.loginButton}>
          Go to Login
        </Link>
      </div>
    );
  }

  const daysRemaining = getDaysRemaining(member.membershipExpiryDate);

  const membershipStatus =
    member.status === "Active" && daysRemaining > 0 ? "Active" : "Expired";

  // Temporary announcements until announcement API is connected
  const announcements = [
    {
      title: "Gym Timing Update",
      description:
        "Please check with the gym reception for the latest gym timings.",
      date: "Latest Update",
      type: "Important",
    },
    {
      title: "Fitness Training",
      description:
        "Stay consistent with your workouts and follow your fitness routine.",
      date: "Gym Notice",
      type: "General",
    },
    {
      title: "Gym Maintenance",
      description:
        "Please contact the gym reception for maintenance-related updates.",
      date: "Gym Notice",
      type: "General",
    },
  ];

  return (
    <div className={styles.dashboardPage}>
      {/* Sidebar Overlay */}
      {sidebarOpen && (
        <div
          className={styles.sidebarOverlay}
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`${styles.sidebar} ${
          sidebarOpen ? styles.sidebarActive : ""
        }`}
      >
        <div className={styles.sidebarLogo}>
          <button
            className={styles.closeSidebar}
            onClick={() => setSidebarOpen(false)}
            aria-label="Close Sidebar"
          >
            <FaTimes />
          </button>
        </div>

        {/* Member Profile */}
        <div className={styles.sidebarProfile}>
          <div className={styles.profileAvatar}>
            {member.name?.charAt(0).toUpperCase()}
          </div>
          <h3>{member.name}</h3>
          <p>Gym Member</p>
        </div>

        {/* Navigation */}
        <nav className={styles.sidebarNav}>
          <NavLink
            to="/member/dashboard"
            end
            className={({ isActive }) =>
              `${styles.navLink} ${isActive ? styles.activeNav : ""}`
            }
            onClick={() => setSidebarOpen(false)}
          >
            <FaHome />
            <span>Dashboard</span>
          </NavLink>

          <NavLink
            to="/member/profile"
            className={({ isActive }) =>
              `${styles.navLink} ${isActive ? styles.activeNav : ""}`
            }
            onClick={() => setSidebarOpen(false)}
          >
            <FaUser />
            <span>My Profile</span>
          </NavLink>

          <NavLink
            to="/member/edit-profile"
            className={({ isActive }) =>
              `${styles.navLink} ${isActive ? styles.activeNav : ""}`
            }
            onClick={() => setSidebarOpen(false)}
          >
            <FaEdit />
            <span>Edit Profile</span>
          </NavLink>

          <NavLink
            to="/member/announcements"
            className={({ isActive }) =>
              `${styles.navLink} ${isActive ? styles.activeNav : ""}`
            }
            onClick={() => setSidebarOpen(false)}
          >
            <FaBullhorn />
            <span>Announcements</span>
          </NavLink>
        </nav>

        {/* Logout */}
        <button className={styles.logoutButton} onClick={handleLogout}>
          <FaSignOutAlt />
          <span>Logout</span>
        </button>
      </aside>

      {/* Main Content */}
      <main className={styles.mainContent}>
        {/* Topbar */}
        <header className={styles.topbar}>
          <div className={styles.topbarLeft}>
            <button
              className={styles.menuButton}
              onClick={() => setSidebarOpen(true)}
              aria-label="Open Sidebar"
            >
              <FaBars />
            </button>
            <h2>Member Dashboard</h2>
          </div>

          <div className={styles.topbarRight}>
            <div className={styles.notificationIcon}>
              <FaBell />
              <span />
            </div>

            <div className={styles.topbarMember}>
              <div className={styles.smallAvatar}>
                {member.name?.charAt(0).toUpperCase()}
              </div>
              <span>{member.name}</span>
            </div>
          </div>
        </header>

        <div className={styles.dashboardBody}>
          {/* Welcome Banner */}
          <section className={styles.welcomeBanner}>
            <div>
              <span className={styles.welcomeTag}>FITZONE GYM</span>
              <h1>
                Welcome Back, <span>{member.name}!</span>
              </h1>
              <p>Here's your fitness membership overview.</p>
            </div>
            <FaDumbbell className={styles.bannerIcon} />
          </section>

          {/* Statistics Cards */}
          <section className={styles.statsGrid}>
            <div className={styles.statCard}>
              <div className={styles.statIcon}>
                <FaIdCard />
              </div>
              <div>
                <p>Membership Plan</p>
                <h3>{member.membership?.name || "Not Available"}</h3>
              </div>
            </div>

            <div className={styles.statCard}>
              <div className={styles.statIcon}>
                <FaClock />
              </div>
              <div>
                <p>Days Remaining</p>
                <h3>{daysRemaining} Days</h3>
              </div>
            </div>

            <div className={styles.statCard}>
              <div className={styles.statIcon}>
                <FaCalendarAlt />
              </div>
              <div>
                <p>Join Date</p>
                <h3>{formatDate(member.joinDate)}</h3>
              </div>
            </div>

            <div className={styles.statCard}>
              <div className={styles.statIcon}>
                <FaDumbbell />
              </div>
              <div>
                <p>Membership Status</p>
                <h3
                  className={
                    membershipStatus === "Active"
                      ? styles.activeText
                      : styles.expiredText
                  }
                >
                  {membershipStatus}
                </h3>
              </div>
            </div>
          </section>

          {/* Information Sections */}
          <section className={styles.informationGrid}>
            {/* Personal Information */}
            <div className={styles.infoCard}>
              <div className={styles.cardHeader}>
                <h2>
                  <FaUser />
                  Personal Information
                </h2>
                <Link to="/member/edit-profile">
                  <FaEdit />
                  Edit
                </Link>
              </div>

              <div className={styles.personalInfo}>
                <div className={styles.memberAvatar}>
                  {member.image ? (
                    <img src={member.image} alt={member.name} />
                  ) : (
                    <FaUser />
                  )}
                </div>

                <div className={styles.detailsGrid}>
                  <div className={styles.detailItem}>
                    <FaUser />
                    <div>
                      <span>Full Name</span>
                      <strong>{member.name}</strong>
                    </div>
                  </div>

                  <div className={styles.detailItem}>
                    <FaEnvelope />
                    <div>
                      <span>Email Address</span>
                      <strong>{member.email}</strong>
                    </div>
                  </div>

                  <div className={styles.detailItem}>
                    <FaPhone />
                    <div>
                      <span>Phone Number</span>
                      <strong>{member.phone || "N/A"}</strong>
                    </div>
                  </div>

                  <div className={styles.detailItem}>
                    <FaVenusMars />
                    <div>
                      <span>Gender</span>
                      <strong>{member.gender || "N/A"}</strong>
                    </div>
                  </div>

                  <div className={styles.detailItem}>
                    <FaMapMarkerAlt />
                    <div>
                      <span>Address</span>
                      <strong>{member.address || "N/A"}</strong>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Membership Information */}
            <div className={styles.infoCard}>
              <div className={styles.cardHeader}>
                <h2>
                  <FaIdCard />
                  Membership Details
                </h2>
                <span
                  className={
                    membershipStatus === "Active"
                      ? styles.activeBadge
                      : styles.expiredBadge
                  }
                >
                  {membershipStatus}
                </span>
              </div>

              <div className={styles.membershipDetails}>
                <div>
                  <span>Membership Plan</span>
                  <strong>{member.membership?.name || "N/A"}</strong>
                </div>

                <div>
                  <span>Plan Price</span>
                  <strong>
                    {member.membership?.price != null
                      ? `₹${member.membership.price}`
                      : "N/A"}
                  </strong>
                </div>

                <div>
                  <span>Duration</span>
                  <strong>
                    {member.membership?.month
                      ? `${member.membership.month} Month(s)`
                      : "N/A"}
                  </strong>
                </div>

                <div>
                  <span>Join Date</span>
                  <strong>{formatDate(member.joinDate)}</strong>
                </div>

                <div>
                  <span>Expiry Date</span>
                  <strong>{formatDate(member.membershipExpiryDate)}</strong>
                </div>

                <div className={styles.remainingDays}>
                  <span>Days Remaining</span>
                  <strong>{daysRemaining} Days</strong>
                </div>
              </div>

              <Link to="/member/profile" className={styles.membershipButton}>
                View Membership Details
                <FaArrowRight />
              </Link>
            </div>
          </section>

          {/* Announcements */}
          <section className={styles.announcementSection}>
            <div className={styles.sectionHeader}>
              <h2>
                <FaBullhorn />
                Gym Announcements
              </h2>
              <Link to="/member/announcements">
                View All <FaArrowRight />
              </Link>
            </div>

            <div className={styles.announcementGrid}>
              {announcements.map((announcement, index) => (
                <div className={styles.announcementCard} key={index}>
                  <div className={styles.announcementTop}>
                    <FaBullhorn />
                    <span
                      className={
                        announcement.type === "Important"
                          ? styles.importantBadge
                          : styles.generalBadge
                      }
                    >
                      {announcement.type}
                    </span>
                  </div>

                  <h3>{announcement.title}</h3>
                  <p>{announcement.description}</p>

                  <span className={styles.announcementDate}>
                    <FaCalendarAlt />
                    {announcement.date}
                  </span>
                </div>
              ))}
            </div>
          </section>

          {/* Footer */}
          <footer className={styles.dashboardFooter}>
            © 2026 Fitzone Gym. All rights reserved.
          </footer>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;