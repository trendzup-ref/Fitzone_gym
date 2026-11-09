import { useState, useEffect, useContext } from "react";
import { useNavigate, useParams } from "react-router-dom";

import {
  FaArrowLeft,
  FaEdit,
  FaUser,
  FaEnvelope,
  FaPhone,
  FaMapMarkerAlt,
  FaCalendarAlt,
  FaMoneyBillWave,
  FaBriefcase,
  FaIdCard,
} from "react-icons/fa";

import { AdminContext } from "../../../context/AdminContext";
import styles from "./TrainerDetails.module.css";

const TrainerDetails = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const { getTrainerById } = useContext(AdminContext);

  const [trainer, setTrainer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Fetch trainer details
  useEffect(() => {
    const fetchTrainer = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await getTrainerById(id);

        if (response.success && response.trainer) {
          setTrainer(response.trainer);
        } else {
          setTrainer(null);
        }
      } catch (error) {
        console.error("Error fetching trainer:", error);
        setError(error.message || "Failed to fetch trainer details.");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchTrainer();
    }
  }, [id, getTrainerById]);

  // Format date
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
        <h2>Loading Trainer Details...</h2>
      </div>
    );
  }

  // Error
  if (error) {
    return (
      <div className={styles.notFound}>
        <h2>Something Went Wrong</h2>
        <p>{error}</p>

        <button onClick={() => navigate("/admin/trainers")}>
          Back to Trainers
        </button>
      </div>
    );
  }

  // Trainer not found
  if (!trainer) {
    return (
      <div className={styles.notFound}>
        <h2>Trainer Not Found</h2>
        <p>The requested trainer details are unavailable.</p>

        <button onClick={() => navigate("/admin/trainers")}>
          Back to Trainers
        </button>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      {/* Page Header */}
      <div className={styles.pageHeader}>
        <div>
          <button
            className={styles.backButton}
            onClick={() => navigate("/admin/trainers")}
          >
            <FaArrowLeft /> Back to Trainers
          </button>

          <h1>Trainer Details</h1>
          <p>View complete information about this trainer.</p>
        </div>

        <button
          className={styles.editButton}
          onClick={() =>
            navigate(`/admin/trainers/edit/${trainer._id}`)
          }
        >
          <FaEdit /> Edit Trainer
        </button>
      </div>

      {/* Trainer Profile */}
      <div className={styles.profileCard}>
        <div className={styles.profileInfo}>
          <div className={styles.avatar}>
            {trainer.image ? (
              <img src={trainer.image} alt={trainer.name} />
            ) : (
              <FaUser />
            )}
          </div>

          <div>
            <h2>{trainer.name}</h2>
            <p>{trainer.role}</p>

            <span
              className={`${styles.status} ${
                trainer.status === "Active"
                  ? styles.active
                  : styles.inactive
              }`}
            >
              {trainer.status}
            </span>
          </div>
        </div>
      </div>

      {/* Details Grid */}
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
                <strong>{trainer.name || "N/A"}</strong>
              </div>
            </div>

            <div className={styles.infoItem}>
              <FaEnvelope />
              <div>
                <span>Email Address</span>
                <strong>{trainer.email || "N/A"}</strong>
              </div>
            </div>

            <div className={styles.infoItem}>
              <FaPhone />
              <div>
                <span>Phone Number</span>
                <strong>{trainer.phone || "N/A"}</strong>
              </div>
            </div>

            <div className={styles.infoItem}>
              <FaIdCard />
              <div>
                <span>Gender</span>
                <strong>{trainer.gender || "N/A"}</strong>
              </div>
            </div>

            <div className={styles.infoItem}>
              <FaMapMarkerAlt />
              <div>
                <span>Address</span>
                <strong>{trainer.address || "N/A"}</strong>
              </div>
            </div>
          </div>
        </div>

        {/* Professional Information */}
        <div className={styles.detailsCard}>
          <div className={styles.cardHeader}>
            <FaBriefcase />
            <h3>Professional Information</h3>
          </div>

          <div className={styles.infoList}>
            <div className={styles.infoItem}>
              <FaBriefcase />
              <div>
                <span>Trainer Role</span>
                <strong>{trainer.role || "N/A"}</strong>
              </div>
            </div>

            <div className={styles.infoItem}>
              <FaMoneyBillWave />
              <div>
                <span>Monthly Salary</span>
                <strong>
                  ₹{Number(trainer.salary || 0).toLocaleString("en-IN")}
                </strong>
              </div>
            </div>

            <div className={styles.infoItem}>
              <FaCalendarAlt />
              <div>
                <span>Joining Date</span>
                <strong>{formatDate(trainer.joinDate)}</strong>
              </div>
            </div>

            <div className={styles.infoItem}>
              <FaIdCard />
              <div>
                <span>Trainer ID</span>
                <strong>#{trainer._id}</strong>
              </div>
            </div>

            <div className={styles.infoItem}>
              <FaIdCard />
              <div>
                <span>Employment Status</span>
                <strong
                  className={
                    trainer.status === "Active"
                      ? styles.activeText
                      : styles.inactiveText
                  }
                >
                  {trainer.status || "N/A"}
                </strong>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrainerDetails;