import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";

import {
  FaArrowLeft,
  FaUser,
  FaEnvelope,
  FaPhone,
  FaMapMarkerAlt,
  FaCalendarAlt,
  FaMoneyBillWave,
  FaImage,
  FaBriefcase,
} from "react-icons/fa";

import { AdminContext } from "../../../context/AdminContext";
import styles from "./AddTrainer.module.css";
import { toast } from "react-toastify";

const AddTrainer = () => {
  const navigate = useNavigate();

  const { addTrainer } = useContext(AdminContext);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    gender: "",
    address: "",
    role: "",
    salary: "",
    joinDate: "",
    image: null,
  });

  const [imagePreview, setImagePreview] = useState("");
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    setErrors((prev) => ({
      ...prev,
      [name]: "",
      submit: "",
    }));
  };

  // Handle image upload
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
      submit: "",
    }));
  };

  // Form validation
  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "Trainer name is required.";
    }

    if (
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())
    ) {
      newErrors.email = "Enter a valid email address.";
    }

    if (!/^[6-9]\d{9}$/.test(formData.phone)) {
      newErrors.phone = "Enter a valid 10-digit phone number.";
    }

    if (!formData.gender) {
      newErrors.gender = "Please select gender.";
    }

    if (!formData.address.trim()) {
      newErrors.address = "Address is required.";
    }

    if (!formData.role) {
      newErrors.role = "Please select trainer role.";
    }

    if (!formData.salary || Number(formData.salary) <= 0) {
      newErrors.salary = "Enter a valid salary.";
    }

    if (!formData.joinDate) {
      newErrors.joinDate = "Joining date is required.";
    }

    if (!formData.image) {
      newErrors.image = "Trainer image is required.";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  // Submit form
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      setLoading(true);

      const trainerData = new FormData();

      trainerData.append("name", formData.name.trim());
      trainerData.append("email", formData.email.trim());
      trainerData.append("phone", formData.phone);
      trainerData.append("gender", formData.gender);
      trainerData.append("address", formData.address.trim());
      trainerData.append("role", formData.role);
      trainerData.append("salary", formData.salary);
      trainerData.append("joinDate", formData.joinDate);
      trainerData.append("image", formData.image);

      const response = await addTrainer(trainerData);

      if (response.success) {
        toast.success("Trainer added successfully!");

        navigate("/admin/trainers");
      }
    } catch (error) {
      console.error("Add Trainer Error:", error);

      setErrors((prev) => ({
        ...prev,
        submit:
          error.message ||
          error.response?.data?.message ||
          "Something went wrong. Please try again.",
      }));
    } finally {
      setLoading(false);
    }
  };

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

          <h1>Add New Trainer</h1>
          <p>Add a new trainer to your gym team.</p>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        {/* Personal Information */}

        <div className={styles.formCard}>
          <div className={styles.sectionHeader}>
            <FaUser />
            <h3>Personal Information</h3>
          </div>

          <div className={styles.formGrid}>
            <div className={styles.formGroup}>
              <label>Full Name *</label>

              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter trainer name"
              />

              {errors.name && <small>{errors.name}</small>}
            </div>

            <div className={styles.formGroup}>
              <label>Email Address *</label>

              <div className={styles.inputIcon}>
                <FaEnvelope />

                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter email address"
                />
              </div>

              {errors.email && <small>{errors.email}</small>}
            </div>

            <div className={styles.formGroup}>
              <label>Phone Number *</label>

              <div className={styles.inputIcon}>
                <FaPhone />

                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="Enter phone number"
                  maxLength="10"
                />
              </div>

              {errors.phone && <small>{errors.phone}</small>}
            </div>

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

              {errors.gender && <small>{errors.gender}</small>}
            </div>

            <div className={`${styles.formGroup} ${styles.fullWidth}`}>
              <label>Address *</label>

              <div className={styles.inputIcon}>
                <FaMapMarkerAlt />

                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  placeholder="Enter trainer address"
                />
              </div>

              {errors.address && <small>{errors.address}</small>}
            </div>
          </div>
        </div>

        {/* Professional Information */}

        <div className={styles.formCard}>
          <div className={styles.sectionHeader}>
            <FaBriefcase />
            <h3>Professional Information</h3>
          </div>

          <div className={styles.formGrid}>
            <div className={styles.formGroup}>
              <label>Trainer Role *</label>

              <select
                name="role"
                value={formData.role}
                onChange={handleChange}
              >
                <option value="">Select Role</option>
                <option value="Personal Trainer">Personal Trainer</option>
                <option value="Fitness Trainer">Fitness Trainer</option>
                <option value="Strength Trainer">Strength Trainer</option>
                <option value="Yoga Trainer">Yoga Trainer</option>
                <option value="Cardio Trainer">Cardio Trainer</option>
                <option value="Zumba Trainer">Zumba Trainer</option>
              </select>

              {errors.role && <small>{errors.role}</small>}
            </div>

            <div className={styles.formGroup}>
              <label>Monthly Salary (₹) *</label>

              <div className={styles.inputIcon}>
                <FaMoneyBillWave />

                <input
                  type="number"
                  name="salary"
                  value={formData.salary}
                  onChange={handleChange}
                  placeholder="Enter monthly salary"
                  min="1"
                />
              </div>

              {errors.salary && <small>{errors.salary}</small>}
            </div>

            <div className={styles.formGroup}>
              <label>Joining Date *</label>

              <div className={styles.inputIcon}>
                <FaCalendarAlt />

                <input
                  type="date"
                  name="joinDate"
                  value={formData.joinDate}
                  onChange={handleChange}
                />
              </div>

              {errors.joinDate && <small>{errors.joinDate}</small>}
            </div>
          </div>
        </div>

        {/* Trainer Image */}

        <div className={styles.formCard}>
          <div className={styles.sectionHeader}>
            <FaImage />
            <h3>Trainer Profile Image</h3>
          </div>

          <div className={styles.uploadArea}>
            {imagePreview ? (
              <img
                src={imagePreview}
                alt="Trainer Preview"
                className={styles.previewImage}
              />
            ) : (
              <div className={styles.imagePlaceholder}>
                <FaUser />
              </div>
            )}

            <label className={styles.uploadButton}>
              Upload Image

              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                hidden
              />
            </label>

            <p>JPG, PNG or WEBP (Maximum 5MB)</p>

            {errors.image && <small>{errors.image}</small>}
          </div>
        </div>

        {/* API Error */}

        {errors.submit && (
          <div className={styles.formCard}>
            <small>{errors.submit}</small>
          </div>
        )}

        {/* Form Actions */}

        <div className={styles.formActions}>
          <button
            type="button"
            className={styles.cancelButton}
            onClick={() => navigate("/admin/trainers")}
            disabled={loading}
          >
            Cancel
          </button>

          <button
            type="submit"
            className={styles.submitButton}
            disabled={loading}
          >
            {loading ? "Adding Trainer..." : "Add Trainer"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddTrainer;