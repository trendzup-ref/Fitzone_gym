import { useState, useEffect, useContext } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { FaArrowLeft, FaSave } from "react-icons/fa";

import { AdminContext } from "../../../context/AdminContext";
import styles from "./EditMembership.module.css";

const EditMembership = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const { getMembershipById, updateMembership } =
    useContext(AdminContext);

  const [formData, setFormData] = useState({
    name: "",
    month: "",
    price: "",
    description: "",
    status: "Active",
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Fetch Existing Membership
  useEffect(() => {
    const fetchMembership = async () => {
      try {
        setLoading(true);

        const response = await getMembershipById(id);

        if (response.success) {
          const membership =
            response.membership || response.memberships;

          setFormData({
            name: membership.name || "",
            month: membership.month || "",
            price: membership.price ?? "",
            description: membership.description || "",
            status: membership.status || "Active",
          });
        } else {
          setError(response.message || "Membership not found.");
        }
      } catch (error) {
        setError(error.message || "Failed to fetch membership.");
      } finally {
        setLoading(false);
      }
    };

    fetchMembership();
  }, [id]);

  // Handle Input Changes
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Update Membership
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
      setSaving(true);

      const membershipData = {
        name: formData.name.trim(),
        month: Number(formData.month),
        price: Number(formData.price),
        description: formData.description.trim(),
        status: formData.status,
      };

      const response = await updateMembership(id, membershipData);

      if (response.success) {
        setSuccess("Membership updated successfully!");

        setTimeout(() => {
          navigate("/admin/membership");
        }, 1000);
      } else {
        setError(response.message || "Failed to update membership.");
      }
    } catch (error) {
      setError(error.message || "Something went wrong.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className={styles.container}>Loading membership...</div>;
  }

  if (error && !formData.name) {
    return (
      <div className={styles.container}>
        <p className={styles.error}>{error}</p>
        <button onClick={() => navigate("/admin/membership")}>
          Back to Memberships
        </button>
      </div>
    );
  }

  return (
    <div className={styles.container}>

      {/* Header */}

      <div className={styles.pageHeader}>
        <div>
          <h1>Edit Membership Plan</h1>
          <p>Update your gym membership plan details.</p>
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
          <p>Update the details of your membership plan.</p>
        </div>

        <form onSubmit={handleSubmit}>

          <div className={styles.formGrid}>

            <div className={styles.formGroup}>
              <label>
                Membership Name <span>*</span>
              </label>

              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>

            <div className={styles.formGroup}>
              <label>
                Duration (Months) <span>*</span>
              </label>

              <input
                type="number"
                name="month"
                min="1"
                value={formData.month}
                onChange={handleChange}
                required
              />
            </div>

            <div className={styles.formGroup}>
              <label>
                Price (₹) <span>*</span>
              </label>

              <input
                type="number"
                name="price"
                min="0"
                value={formData.price}
                onChange={handleChange}
                required
              />
            </div>

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

            <div className={`${styles.formGroup} ${styles.fullWidth}`}>
              <label>Description</label>

              <textarea
                name="description"
                rows="4"
                value={formData.description}
                onChange={handleChange}
              />
            </div>

          </div>

          {error && <p className={styles.error}>{error}</p>}

          {success && <p className={styles.success}>{success}</p>}

          <div className={styles.formActions}>

            <button
              type="button"
              className={styles.cancelButton}
              onClick={() => navigate("/admin/membership")}
              disabled={saving}
            >
              Cancel
            </button>

            <button
              type="submit"
              className={styles.submitButton}
              disabled={saving}
            >
              <FaSave />
              {saving ? " Updating..." : " Update Membership"}
            </button>

          </div>

        </form>
      </div>

    </div>
  );
};

export default EditMembership;