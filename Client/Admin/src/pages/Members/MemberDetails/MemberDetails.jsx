import { useState, useEffect, useContext } from "react";
import { useNavigate, useParams } from "react-router-dom";

import {
  FaArrowLeft,
  FaEdit,
  FaEnvelope,
  FaPhone,
  FaMapMarkerAlt,
  FaCalendarAlt,
  FaCreditCard,
  FaUser,
  FaIdCard,
} from "react-icons/fa";

import { AdminContext } from "../../../context/AdminContext";
import styles from "./MemberDetails.module.css";

const MemberDetails = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const { getMemberById } = useContext(AdminContext);

  const [member, setMember] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Fetch Member Details
  const fetchMemberDetails = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await getMemberById(id);

      if (response.success) {
        setMember(response.member || response.data?.member || null);
      } else {
        setError(response.message || "Failed to fetch member details.");
      }
    } catch (error) {
      setError(
        error.response?.data?.message ||
        error.message ||
        "Something went wrong."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMemberDetails();
  }, [id]);

  // Format Date
  const formatDate = (date) => {
    if (!date) return "N/A";

    return new Date(date).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  // Loading
  if (loading) {
    return (
      <div className={styles.notFound}>
        <h2>Loading member details...</h2>
      </div>
    );
  }

  // Error
  if (error || !member) {
    return (
      <div className={styles.notFound}>
        <h2>{error ? "Something Went Wrong" : "Member Not Found"}</h2>

        <p>
          {error || "The requested member details are unavailable."}
        </p>

        <button onClick={() => navigate("/admin/members")}>
          Back to Members
        </button>
      </div>
    );
  }

  // Membership can be a populated object or an ID
  const membershipName =
    typeof member.membership === "object"
      ? member.membership?.name
      : "N/A";

  // Calculate Next Billing Date
  const calculateNextBillDate = () => {
    if (!member.joinDate || !member.membership) return null;

    const months =
      typeof member.membership === "object"
        ? Number(member.membership.month)
        : 0;

    if (!months) return null;

    const nextDate = new Date(member.joinDate);
    nextDate.setMonth(nextDate.getMonth() + months);

    return nextDate;
  };

  const nextBillDate = calculateNextBillDate();

  // Membership Status
  const membershipStatus =
    nextBillDate && nextBillDate >= new Date()
      ? "Active"
      : "Expired";

  return (
    <div className={styles.container}>

      {/* Page Header */}

      <div className={styles.pageHeader}>
        <div>
          <button
            className={styles.backButton}
            onClick={() => navigate("/admin/members")}
          >
            <FaArrowLeft /> Back to Members
          </button>

          <h1>Member Details</h1>
          <p>View complete information about this gym member.</p>
        </div>

        <button
          className={styles.editButton}
          onClick={() => navigate(`/admin/members/edit/${member._id}`)}
        >
          <FaEdit /> Edit Member
        </button>
      </div>

      {/* Profile Card */}

      <div className={styles.profileCard}>
        <div className={styles.profileInfo}>
          <div className={styles.avatar}>
            {member.image ? (
              <img src={member.image} alt={member.name} />
            ) : (
              <FaUser />
            )}
          </div>

          <div>
            <h2>{member.name}</h2>
            <p>Member ID: #{member._id}</p>

            <span
              className={`${styles.status} ${
                membershipStatus === "Active"
                  ? styles.active
                  : styles.expired
              }`}
            >
              {membershipStatus}
            </span>
          </div>
        </div>
      </div>

      {/* Information Sections */}

      <div className={styles.detailsGrid}>

        {/* Personal Information */}

        <div className={styles.detailsCard}>
          <div className={styles.cardHeader}>
            <FaUser />
            <h3>Personal Information</h3>
          </div>

          <div className={styles.infoList}>

            <div className={styles.infoItem}>
              <FaUser />
              <div>
                <span>Full Name</span>
                <strong>{member.name || "N/A"}</strong>
              </div>
            </div>

            <div className={styles.infoItem}>
              <FaEnvelope />
              <div>
                <span>Email Address</span>
                <strong>{member.email || "N/A"}</strong>
              </div>
            </div>

            <div className={styles.infoItem}>
              <FaPhone />
              <div>
                <span>Phone Number</span>
                <strong>{member.phone || "N/A"}</strong>
              </div>
            </div>

            <div className={styles.infoItem}>
              <FaIdCard />
              <div>
                <span>Gender</span>
                <strong>{member.gender || "N/A"}</strong>
              </div>
            </div>

            <div className={styles.infoItem}>
              <FaMapMarkerAlt />
              <div>
                <span>Address</span>
                <strong>{member.address || "N/A"}</strong>
              </div>
            </div>

          </div>
        </div>

        {/* Membership Information */}

        <div className={styles.detailsCard}>
          <div className={styles.cardHeader}>
            <FaCreditCard />
            <h3>Membership Information</h3>
          </div>

          <div className={styles.infoList}>

            <div className={styles.infoItem}>
              <FaCreditCard />
              <div>
                <span>Membership Plan</span>
                <strong>{membershipName || "N/A"}</strong>
              </div>
            </div>

            <div className={styles.infoItem}>
              <FaCalendarAlt />
              <div>
                <span>Joining Date</span>
                <strong>{formatDate(member.joinDate)}</strong>
              </div>
            </div>

            <div className={styles.infoItem}>
              <FaCalendarAlt />
              <div>
                <span>Next Billing Date</span>
                <strong>
                  {nextBillDate ? formatDate(nextBillDate) : "N/A"}
                </strong>
              </div>
            </div>

            <div className={styles.infoItem}>
              <FaCreditCard />
              <div>
                <span>Payment Method</span>
                <strong>{member.payment || "N/A"}</strong>
              </div>
            </div>

            <div className={styles.infoItem}>
              <FaIdCard />
              <div>
                <span>Membership Status</span>
                <strong
                  className={
                    membershipStatus === "Active"
                      ? styles.activeText
                      : styles.expiredText
                  }
                >
                  {membershipStatus}
                </strong>
              </div>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
};

export default MemberDetails;