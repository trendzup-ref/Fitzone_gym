
import { useState, useEffect, useContext } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";

import {
  FaArrowLeft,
  FaUser,
  FaEnvelope,
  FaPhone,
  FaCalendarAlt,
  FaClipboardList,
  FaCheckCircle,
  FaClock,
  FaCommentDots,
  FaSave,
} from "react-icons/fa";

import { AdminContext } from "../../../context/AdminContext";
import styles from "./InquiryDetails.module.css";

const InquiryDetails = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const { getInquiryById, updateInquiry } = useContext(AdminContext);

  const [inquiry, setInquiry] = useState(null);
  const [status, setStatus] = useState("Pending");
  const [adminNote, setAdminNote] = useState("");

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  // Fetch Inquiry Details
  useEffect(() => {
    const fetchInquiry = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await getInquiryById(id);

        if (response.success && response.inquiry) {
          setInquiry(response.inquiry);

          setStatus(response.inquiry.status || "Pending");

          // Load existing admin note from database
          setAdminNote(response.inquiry.adminNote || "");
        } else {
          setError("Inquiry not found.");
        }
      } catch (error) {
        console.error("Fetch Inquiry Error:", error);

        setError(
          error.message || "Failed to fetch inquiry details."
        );
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchInquiry();
    }
  }, [id, getInquiryById]);

  // Date Format
  const formatDate = (date) => {
    if (!date) return "N/A";

    return new Date(date).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
  };

  // Save Inquiry Status and Admin Note
  const handleSave = async () => {
    try {
      setSaving(true);
      setError("");

      const response = await updateInquiry(id, {
        status,
        adminNote,
      });

      if (response.success && response.inquiry) {
        setInquiry(response.inquiry);

        setStatus(response.inquiry.status || "Pending");

        setAdminNote(response.inquiry.adminNote || "");

        toast.success("Inquiry details and admin note saved successfully!");

        navigate("/admin/inquiries");
      } else {
        toast.error(response.message || "Failed to update inquiry.");
      }
    } catch (error) {
      console.error("Update Inquiry Error:", error);

      toast.error(error.message || "Failed to update inquiry.");
    } finally {
      setSaving(false);
    }
  };

  // Loading
  if (loading) {
    return (
      <div className={styles.notFound}>
        <h2>Loading Inquiry Details...</h2>
      </div>
    );
  }

  // Error or Not Found
  if (error || !inquiry) {
    return (
      <div className={styles.notFound}>
        <h2>
          {error ? "Something Went Wrong" : "Inquiry Not Found"}
        </h2>

        <p>
          {error || "The requested inquiry is unavailable."}
        </p>

        <button onClick={() => navigate("/admin/inquiries")}>
          Back to Inquiries
        </button>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      {/* Header */}
      <div className={styles.header}>
        <div>
          <button
            className={styles.backButton}
            onClick={() => navigate("/admin/inquiries")}
          >
            <FaArrowLeft />
            Back to Inquiries
          </button>

          <h2>Inquiry Details</h2>

          <p>View and manage customer inquiry information.</p>
        </div>

        <span
          className={`${styles.statusBadge} ${
            styles[status.toLowerCase()]
          }`}
        >
          {status}
        </span>
      </div>

      <div className={styles.contentGrid}>
        {/* Customer Information */}
        <div className={styles.mainContent}>
          <div className={styles.card}>
            <div className={styles.cardHeader}>
              <FaUser />
              <h3>Customer Information</h3>
            </div>

            <div className={styles.profile}>
              <div className={styles.avatar}>
                {(inquiry.name || "U").charAt(0).toUpperCase()}
              </div>

              <div>
                <h3>{inquiry.name}</h3>
                <p>Customer Inquiry</p>
              </div>
            </div>

            <div className={styles.infoGrid}>
              <div className={styles.infoItem}>
                <span>
                  <FaEnvelope />
                  Email Address
                </span>

                <p>{inquiry.email}</p>
              </div>

              <div className={styles.infoItem}>
                <span>
                  <FaPhone />
                  Phone Number
                </span>

                <p>{inquiry.phone}</p>
              </div>

              <div className={styles.infoItem}>
                <span>
                  <FaClipboardList />
                  Interested Service
                </span>

                <p>{inquiry.subject}</p>
              </div>

              <div className={styles.infoItem}>
                <span>
                  <FaCalendarAlt />
                  Inquiry Date
                </span>

                <p>{formatDate(inquiry.createdAt)}</p>
              </div>
            </div>
          </div>

          {/* Customer Message */}
          <div className={styles.card}>
            <div className={styles.cardHeader}>
              <FaCommentDots />
              <h3>Customer Message</h3>
            </div>

            <div className={styles.messageBox}>
              <p>{inquiry.message}</p>
            </div>
          </div>
        </div>

        {/* Right Sidebar */}
        <div className={styles.sideContent}>
          {/* Status Update and Admin Notes */}
          <div className={styles.card}>
            <div className={styles.cardHeader}>
              <FaCheckCircle />
              <h3>Manage Inquiry</h3>
            </div>

            <div className={styles.formGroup}>
              <label>Inquiry Status</label>

              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                disabled={saving}
              >
                <option value="Pending">Pending</option>
                <option value="Contacted">Contacted</option>
                <option value="Resolved">Resolved</option>
              </select>
            </div>

            {/* Admin Note */}
            <div className={styles.formGroup}>
              <label>Admin Note</label>

              <textarea
                rows="5"
                placeholder="Add internal notes about this inquiry..."
                value={adminNote}
                onChange={(e) => setAdminNote(e.target.value)}
                disabled={saving}
              />
            </div>

            <button
              className={styles.saveButton}
              onClick={handleSave}
              disabled={saving}
            >
              <FaSave />

              {saving ? "Saving..." : "Save Changes"}
            </button>
          </div>

          {/* Inquiry Timeline */}
          <div className={styles.card}>
            <div className={styles.cardHeader}>
              <FaClock />
              <h3>Inquiry Information</h3>
            </div>

            <div className={styles.timeline}>
              <div className={styles.timelineItem}>
                <span className={styles.timelineDot}></span>

                <div>
                  <h4>Inquiry Received</h4>
                  <p>{formatDate(inquiry.createdAt)}</p>
                </div>
              </div>

              {status !== "Pending" && (
                <div className={styles.timelineItem}>
                  <span className={styles.timelineDot}></span>

                  <div>
                    <h4>Inquiry Contacted</h4>
                    <p>Contact status updated by admin.</p>
                  </div>
                </div>
              )}

              {status === "Resolved" && (
                <div className={styles.timelineItem}>
                  <span className={styles.timelineDot}></span>

                  <div>
                    <h4>Inquiry Resolved</h4>
                    <p>Inquiry marked as resolved.</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InquiryDetails;