import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { FaArrowLeft, FaSave } from "react-icons/fa";

import { AdminContext } from "../../../context/AdminContext";
import styles from "./AddMembership.module.css";

const AddMembership = () => {
  const navigate = useNavigate();

  // Get API function from AdminContext
  const { addMembership } = useContext(AdminContext);

  const [formData, setFormData] = useState({
    name: "",
    month: "",
    price: "",
    description: "",
    status: "Active",
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Submit membership
  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    if (!formData.name.trim() || !formData.month || formData.price === "") {
      setError("Please fill all required fields.");
      return;
    }

    if (Number(formData.month) < 1 || Number(formData.price) < 0) {
      setError("Please enter valid duration and price.");
      return;
    }

    try {
      setLoading(true);

      const membershipData = {
        name: formData.name.trim(),
        month: Number(formData.month),
        price: Number(formData.price),
        description: formData.description.trim(),
        status: formData.status,
      };

      const response = await addMembership(membershipData);

      if (response.success) {
        setSuccess("Membership added successfully!");

        setTimeout(() => {
          navigate("/admin/membership");
        }, 1000);
      } else {
        setError(response.message || "Failed to add membership.");
      }
    } catch (error) {
      setError(error.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>

      {/* Header */}

      <div className={styles.pageHeader}>
        <div>
          <h1>Add Membership Plan</h1>
          <p>Create a new membership plan for your gym.</p>
        </div>

        <button
          className={styles.backButton}
          onClick={() => navigate("/admin/membership")}
        >
          <FaArrowLeft /> Back
        </button>
      </div>

      {/* Form */}

      <div className={styles.formCard}>
        <div className={styles.formHeader}>
          <h2>Membership Information</h2>
          <p>Enter the details of the new membership plan.</p>
        </div>

        <form onSubmit={handleSubmit}>

          <div className={styles.formGrid}>

            {/* Membership Name */}

            <div className={styles.formGroup}>
              <label>
                Membership Name <span>*</span>
              </label>

              <input
                type="text"
                name="name"
                placeholder="Enter membership name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>

            {/* Duration */}

            <div className={styles.formGroup}>
              <label>
                Duration (Months) <span>*</span>
              </label>

              <input
                type="number"
                name="month"
                placeholder="Enter duration"
                min="1"
                value={formData.month}
                onChange={handleChange}
                required
              />
            </div>

            {/* Price */}

            <div className={styles.formGroup}>
              <label>
                Price (₹) <span>*</span>
              </label>

              <input
                type="number"
                name="price"
                placeholder="Enter membership price"
                min="0"
                value={formData.price}
                onChange={handleChange}
                required
              />
            </div>

            {/* Status */}

            <div className={styles.formGroup}>
              <label>Membership Status</label>

              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
              >
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>
            </div>

            {/* Description */}

            <div className={`${styles.formGroup} ${styles.fullWidth}`}>
              <label>Description</label>

              <textarea
                name="description"
                placeholder="Enter membership description..."
                rows="4"
                value={formData.description}
                onChange={handleChange}
              />
            </div>

          </div>

          {/* Error Message */}

          {error && (
            <p className={styles.error}>{error}</p>
          )}

          {/* Success Message */}

          {success && (
            <p style={{ color: "#22c55e", marginTop: "15px" }}>
              {success}
            </p>
          )}

          {/* Buttons */}

          <div className={styles.formActions}>

            <button
              type="button"
              className={styles.cancelButton}
              onClick={() => navigate("/admin/membership")}
              disabled={loading}
            >
              Cancel
            </button>

            <button
              type="submit"
              className={styles.submitButton}
              disabled={loading}
            >
              <FaSave />
              {loading ? " Saving..." : " Save Membership"}
            </button>

          </div>

        </form>
      </div>

    </div>
  );
};

export default AddMembership;