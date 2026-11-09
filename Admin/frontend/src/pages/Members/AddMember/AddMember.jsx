import { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AdminContext } from "../../../context/AdminContext";

import {
  FaUser,
  FaEnvelope,
  FaPhone,
  FaMapMarkerAlt,
  FaCalendarAlt,
  FaImage,
  FaArrowLeft,
} from "react-icons/fa";

import styles from "./AddMember.module.css";

const AddMember = () => {
  const navigate = useNavigate();

  const { addMember, getMemberships } = useContext(AdminContext);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    gender: "",
    address: "",
    joinDate: "",
    membership: "",
    payment: "",
    image: null,
  });

  const [memberships, setMemberships] = useState([]);
  const [imagePreview, setImagePreview] = useState(null);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  // Fetch Membership Plans
  useEffect(() => {
    const fetchMemberships = async () => {
      try {
        const response = await getMemberships();

        const plans =
          response.memberships ||
          response.membership ||
          response.data?.memberships ||
          response.data?.membership ||
          [];

        setMemberships(
  Array.isArray(plans)
    ? plans.filter(
        (membership) => membership.status === "Active"
      )
    : []
);
      } catch (error) {
        console.error("Membership fetch error:", error);
      }
    };

    fetchMemberships();
  }, []);

  // Input Change
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    setErrors((prev) => ({
      ...prev,
      [name]: "",
    }));
  };

  // Image Upload
  const handleImageChange = (e) => {
    const file = e.target.files[0];

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setErrors((prev) => ({
        ...prev,
        image: "Please select a valid image.",
      }));
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setErrors((prev) => ({
        ...prev,
        image: "Image size must be less than 5MB.",
      }));
      return;
    }

    setFormData((prev) => ({
      ...prev,
      image: file,
    }));

    setImagePreview(URL.createObjectURL(file));

    setErrors((prev) => ({
      ...prev,
      image: "",
    }));
  };

  // Form Validation
  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "Full name is required.";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required.";
    } else if (
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)
    ) {
      newErrors.email = "Enter a valid email address.";
    }

    if (!/^[6-9]\d{9}$/.test(formData.phone)) {
      newErrors.phone =
        "Enter a valid 10-digit Indian mobile number.";
    }

    if (!formData.gender) {
      newErrors.gender = "Please select gender.";
    }

    if (!formData.address.trim()) {
      newErrors.address = "Address is required.";
    }

    if (!formData.joinDate) {
      newErrors.joinDate = "Join date is required.";
    }

    if (!formData.membership) {
      newErrors.membership = "Please select membership.";
    }

    if (!formData.payment) {
      newErrors.payment = "Please select payment method.";
    }

    if (!formData.image) {
      newErrors.image = "Please upload member image.";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  // Form Submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      setLoading(true);

      const data = new FormData();

      data.append("name", formData.name);
      data.append("email", formData.email);
      data.append("phone", formData.phone);
      data.append("gender", formData.gender);
      data.append("address", formData.address);
      data.append("joinDate", formData.joinDate);
      data.append("membership", formData.membership);
      data.append("payment", formData.payment);
      data.append("image", formData.image);

      const response = await addMember(data);

      if (response.success) {
        alert("Member added successfully!");
        navigate("/admin/members");
      } else {
        alert(response.message || "Failed to add member.");
      }
    } catch (error) {
      console.error("Add member error:", error);

      alert(error.message || "Failed to add member.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      {/* Header */}
      <div className={styles.pageHeader}>
        <div>
          <button
            className={styles.backButton}
            onClick={() => navigate("/admin/members")}
          >
            <FaArrowLeft />
            Back to Members
          </button>

          <h1>Add New Member</h1>

          <p>Register a new member in your gym.</p>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        {/* Personal Information */}
        <div className={styles.formCard}>
          <div className={styles.sectionHeader}>
            <div className={styles.sectionIcon}>
              <FaUser />
            </div>

            <div>
              <h2>Personal Information</h2>
              <p>Enter member's personal details.</p>
            </div>
          </div>

          <div className={styles.formGrid}>
            {/* Name */}
            <div className={styles.formGroup}>
              <label>Full Name *</label>

              <input
                type="text"
                name="name"
                placeholder="Enter full name"
                value={formData.name}
                onChange={handleChange}
              />

              {errors.name && (
                <span className={styles.error}>{errors.name}</span>
              )}
            </div>

            {/* Email */}
            <div className={styles.formGroup}>
              <label>Email Address *</label>

              <input
                type="email"
                name="email"
                placeholder="Enter email address"
                value={formData.email}
                onChange={handleChange}
              />

              {errors.email && (
                <span className={styles.error}>{errors.email}</span>
              )}
            </div>

            {/* Phone */}
            <div className={styles.formGroup}>
              <label>Phone Number *</label>

              <input
                type="tel"
                name="phone"
                placeholder="Enter 10-digit phone number"
                value={formData.phone}
                maxLength={10}
                onChange={handleChange}
              />

              {errors.phone && (
                <span className={styles.error}>{errors.phone}</span>
              )}
            </div>

            {/* Gender */}
            <div className={styles.formGroup}>
              <label>Gender *</label>

              <select
                name="gender"
                value={formData.gender}
                onChange={handleChange}
              >
                <option value="">Select Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Transgender">Transgender</option>
              </select>

              {errors.gender && (
                <span className={styles.error}>{errors.gender}</span>
              )}
            </div>

            {/* Address */}
            <div className={`${styles.formGroup} ${styles.fullWidth}`}>
              <label>Address *</label>

              <textarea
                name="address"
                placeholder="Enter complete address"
                rows="3"
                value={formData.address}
                onChange={handleChange}
              />

              {errors.address && (
                <span className={styles.error}>{errors.address}</span>
              )}
            </div>
          </div>
        </div>

        {/* Membership Information */}
        <div className={styles.formCard}>
          <div className={styles.sectionHeader}>
            <div className={styles.sectionIcon}>
              <FaCalendarAlt />
            </div>

            <div>
              <h2>Membership Information</h2>
              <p>Select membership plan and payment method.</p>
            </div>
          </div>

          <div className={styles.formGrid}>
            {/* Join Date */}
            <div className={styles.formGroup}>
              <label>Join Date *</label>

              <input
                type="date"
                name="joinDate"
                value={formData.joinDate}
                onChange={handleChange}
              />

              {errors.joinDate && (
                <span className={styles.error}>{errors.joinDate}</span>
              )}
            </div>

            {/* Membership */}
            <div className={styles.formGroup}>
              <label>Membership Plan *</label>

              <select
                name="membership"
                value={formData.membership}
                onChange={handleChange}
              >
                <option value="">Select Membership</option>

                {memberships.map((membership) => (
                  <option
                    key={membership._id}
                    value={membership._id}
                  >
                    {membership.name} - ₹{membership.price}
                  </option>
                ))}
              </select>

              {errors.membership && (
                <span className={styles.error}>
                  {errors.membership}
                </span>
              )}
            </div>

            {/* Payment */}
            <div className={styles.formGroup}>
              <label>Payment Method *</label>

              <select
                name="payment"
                value={formData.payment}
                onChange={handleChange}
              >
                <option value="">Select Payment Method</option>
                <option value="Cash">Cash</option>
                <option value="Online">Online</option>
              </select>

              {errors.payment && (
                <span className={styles.error}>{errors.payment}</span>
              )}
            </div>
          </div>
        </div>

        {/* Profile Image */}
        <div className={styles.formCard}>
          <div className={styles.sectionHeader}>
            <div className={styles.sectionIcon}>
              <FaImage />
            </div>

            <div>
              <h2>Member Profile Image</h2>
              <p>Upload member's profile photograph.</p>
            </div>
          </div>

          <div className={styles.uploadArea}>
            {imagePreview ? (
              <img
                src={imagePreview}
                alt="Member Preview"
                className={styles.previewImage}
              />
            ) : (
              <div className={styles.uploadIcon}>
                <FaImage />
              </div>
            )}

            <label
              htmlFor="memberImage"
              className={styles.uploadButton}
            >
              Choose Image
            </label>

            <input
              id="memberImage"
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              hidden
            />

            <p>JPG, PNG or WEBP (Maximum 5MB)</p>

            {errors.image && (
              <span className={styles.error}>{errors.image}</span>
            )}
          </div>
        </div>

        {/* Form Actions */}
        <div className={styles.formActions}>
          <button
            type="button"
            className={styles.cancelButton}
            onClick={() => navigate("/admin/members")}
          >
            Cancel
          </button>

          <button
            type="submit"
            className={styles.submitButton}
            disabled={loading}
          >
            {loading ? "Adding..." : "Add Member"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddMember;