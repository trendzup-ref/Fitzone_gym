import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";

import {
  FaUser,
  FaEnvelope,
  FaPhone,
  FaMapMarkerAlt,
  FaVenusMars,
  FaCalendarAlt,
  FaDumbbell,
  FaIdCard,
  FaEdit,
  FaCheckCircle,
  FaTimesCircle,
} from "react-icons/fa";

import styles from "./Profile.module.css";

const API_URL =
  import.meta.env.VITE_BACKEND_URL || "https://fitzone-gym-one-peach.vercel.app/api";

const Profile = () => {
  const [member, setMember] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch Member Profile
  const fetchProfile = async () => {
    try {
      setLoading(true);

      const response = await fetch(
        `${API_URL}/member-dashboard/profile`,
        {
          method: "GET",
          credentials: "include",
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Unable to fetch profile");
      }

      // Support common API response structures
      const profileData =
        data.member || data.profile || data.data || data;

      setMember(profileData);

    } catch (error) {
      console.error("Profile Error:", error);
      toast.error(error.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  // Format Date
  const formatDate = (date) => {
    if (!date) return "Not Available";

    return new Date(date).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
  };

  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.loader}></div>
        <p>Loading Profile...</p>
      </div>
    );
  }

  if (!member) {
    return (
      <div className={styles.errorContainer}>
        <h2>Profile Not Found</h2>
        <p>Unable to load your profile information.</p>
        <button onClick={fetchProfile}>Try Again</button>
      </div>
    );
  }

  const membership = member.membership || {};

  const membershipStatus =
    member.status || "Not Available";

  return (
    <div className={styles.profilePage}>

      {/* Page Header */}
      <div className={styles.pageHeader}>
        <div>
          <span className={styles.pageTag}>MEMBER ACCOUNT</span>
          <h1>My <span>Profile</span></h1>
          <p>View and manage your personal information.</p>
        </div>

        <Link
          to="/member/edit-profile"
          className={styles.editButton}
        >
          <FaEdit />
          Edit Profile
        </Link>
      </div>

      {/* Profile Overview */}
      <div className={styles.profileOverview}>

        <div className={styles.profileAvatar}>
          {member.image ? (
            <img src={member.image} alt={member.name} />
          ) : (
            <span>
              {member.name?.charAt(0).toUpperCase() || "M"}
            </span>
          )}
        </div>

        <div className={styles.profileOverviewInfo}>
          <h2>{member.name}</h2>
          <p>{member.email}</p>

          <span className={styles.memberBadge}>
            <FaDumbbell />
            Gym Member
          </span>
        </div>

        <div
          className={`${styles.statusBadge} ${
            membershipStatus === "Active"
              ? styles.activeStatus
              : styles.expiredStatus
          }`}
        >
          {membershipStatus === "Active" ? (
            <FaCheckCircle />
          ) : (
            <FaTimesCircle />
          )}

          {membershipStatus}
        </div>

      </div>

      {/* Personal Information */}
      <section className={styles.profileSection}>

        <div className={styles.sectionHeader}>
          <div className={styles.sectionIcon}>
            <FaUser />
          </div>

          <div>
            <h3>Personal Information</h3>
            <p>Your basic personal details</p>
          </div>
        </div>

        <div className={styles.infoGrid}>

          <div className={styles.infoItem}>
            <span><FaUser /> Full Name</span>
            <h4>{member.name || "Not Available"}</h4>
          </div>

          <div className={styles.infoItem}>
            <span><FaEnvelope /> Email Address</span>
            <h4>{member.email || "Not Available"}</h4>
          </div>

          <div className={styles.infoItem}>
            <span><FaPhone /> Phone Number</span>
            <h4>{member.phone || "Not Available"}</h4>
          </div>

          <div className={styles.infoItem}>
            <span><FaVenusMars /> Gender</span>
            <h4>{member.gender || "Not Available"}</h4>
          </div>

          <div className={styles.infoItem}>
            <span><FaMapMarkerAlt /> Address</span>
            <h4>{member.address || "Not Available"}</h4>
          </div>

          <div className={styles.infoItem}>
            <span><FaCalendarAlt /> Joining Date</span>
            <h4>{formatDate(member.joinDate)}</h4>
          </div>

        </div>
      </section>

      {/* Membership Information */}
      <section className={styles.profileSection}>

        <div className={styles.sectionHeader}>
          <div className={styles.sectionIcon}>
            <FaIdCard />
          </div>

          <div>
            <h3>Membership Information</h3>
            <p>Your current gym membership details</p>
          </div>
        </div>

        <div className={styles.membershipGrid}>

          <div className={styles.membershipItem}>
            <span>Membership Plan</span>
            <h4>{membership.name || "Not Available"}</h4>
          </div>

          <div className={styles.membershipItem}>
            <span>Duration</span>
            <h4>
              {membership.month
                ? `${membership.month} Months`
                : "Not Available"}
            </h4>
          </div>

          <div className={styles.membershipItem}>
            <span>Membership Price</span>
            <h4>
              {membership.price !== undefined
                ? `₹${membership.price}`
                : "Not Available"}
            </h4>
          </div>

          <div className={styles.membershipItem}>
            <span>Payment Method</span>
            <h4>{member.payment || "Not Available"}</h4>
          </div>

          <div className={styles.membershipItem}>
            <span>Expiry Date</span>
            <h4>
              {formatDate(member.membershipExpiryDate)}
            </h4>
          </div>

          <div className={styles.membershipItem}>
            <span>Membership Status</span>

            <h4
              className={
                membershipStatus === "Active"
                  ? styles.activeText
                  : styles.expiredText
              }
            >
              {membershipStatus}
            </h4>
          </div>

        </div>
      </section>

      {/* Edit Profile Note */}
      <div className={styles.profileNote}>
        <FaDumbbell />

        <p>
          Want to update your personal details?
          <Link to="/member/edit-profile"> Edit your profile</Link>
        </p>
      </div>

    </div>
  );
};

export default Profile;