import { useState, useEffect, useContext } from "react";
import { useNavigate, useParams } from "react-router-dom";

import {
  FaArrowLeft,
  FaSave,
  FaUser,
  FaEnvelope,
  FaPhone,
  FaMapMarkerAlt,
  FaBriefcase,
  FaMoneyBillWave,
  FaCalendarAlt,
  FaCamera,
} from "react-icons/fa";

import { AdminContext } from "../../../context/AdminContext";
import styles from "./EditTrainer.module.css";

const initialFormData = {
  name: "",
  email: "",
  phone: "",
  gender: "",
  address: "",
  role: "",
  salary: "",
  joinDate: "",
  status: "Active",
  image: null,
};

const EditTrainer = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const { getTrainerById, updateTrainer } = useContext(AdminContext);

  const [formData, setFormData] = useState(initialFormData);
  const [preview, setPreview] = useState("");

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [notFound, setNotFound] = useState(false);

  // Format date for HTML date input using local date
  const formatDate = (date) => {
    if (!date) return "";

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) return "";

    const year = parsedDate.getFullYear();
    const month = String(parsedDate.getMonth() + 1).padStart(2, "0");
    const day = String(parsedDate.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
  };

  // Fetch trainer details
  useEffect(() => {
    const fetchTrainer = async () => {
      try {
        setFetching(true);
        setNotFound(false);

        const response = await getTrainerById(id);

        if (response.success && response.trainer) {
          const trainer = response.trainer;

          setFormData({
            name: trainer.name || "",
            email: trainer.email || "",
            phone: trainer.phone || "",
            gender: trainer.gender || "",
            address: trainer.address || "",
            role: trainer.role || "",
            salary: trainer.salary ?? "",
            joinDate: formatDate(trainer.joinDate),
            status: trainer.status || "Active",
            image: null,
          });

          setPreview(trainer.image || "");
        } else {
          setNotFound(true);
        }
      } catch (error) {
        console.error("Fetch Trainer Error:", error);

        if (error.response?.status === 404) {
          setNotFound(true);
        } else {
          setErrors({
            submit:
              error.message ||
              "Unable to fetch trainer details. Please try again.",
          });
        }
      } finally {
        setFetching(false);
      }
    };

    if (id) {
      fetchTrainer();
    }
  }, [id, getTrainerById]);

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

    setPreview(URL.createObjectURL(file));

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
      newErrors.name = "Name is required.";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required.";
    } else if (
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())
    ) {
      newErrors.email = "Enter a valid email.";
    }

    if (!/^[6-9]\d{9}$/.test(formData.phone)) {
      newErrors.phone = "Enter a valid 10-digit Indian number.";
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

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  // Submit updated trainer
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
      trainerData.append("status", formData.status);

      // Send image only if a new image is selected
      if (formData.image instanceof File) {
        trainerData.append("image", formData.image);
      }

      const response = await updateTrainer(id, trainerData);

      if (response.success) {
        toast.success("Trainer details updated successfully!");

        navigate("/admin/trainers");
      }
    } catch (error) {
      console.error("Update Trainer Error:", error);

      setErrors((prev) => ({
        ...prev,
        submit:
          error.message ||
          error.response?.data?.message ||
          "Unable to update trainer. Please try again.",
      }));
    } finally {
      setLoading(false);
    }
  };

  // Loading state
  if (fetching) {
    return (
      <div className={styles.container}>
        <p>Loading trainer details...</p>
      </div>
    );
  }

  // Trainer not found
  if (notFound) {
    return (
      <div className={styles.notFound}>
        <h2>Trainer Not Found</h2>

        <button onClick={() => navigate("/admin/trainers")}>
          Back to Trainers
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
            type="button"
            className={styles.backButton}
            onClick={() => navigate("/admin/trainers")}
          >
            <FaArrowLeft />
            Back to Trainers
          </button>

          <h2>Edit Trainer</h2>

          <p>Update trainer personal and professional details.</p>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        {/* Profile Image */}

        <div className={styles.card}>
          <h3>Profile Picture</h3>

          <div className={styles.imageSection}>
            <div className={styles.imagePreview}>
              {preview ? (
                <img src={preview} alt="Trainer" />
              ) : (
                <FaUser />
              )}
            </div>

            <div>
              <label className={styles.uploadButton}>
                <FaCamera />
                Change Photo

                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  hidden
                />
              </label>

              <p>JPG, PNG or WEBP (Maximum 5MB)</p>

              {errors.image && (
                <span className={styles.error}>
                  {errors.image}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Personal Information */}

        <div className={styles.card}>
          <h3>Personal Information</h3>

          <div className={styles.formGrid}>
            <div className={styles.formGroup}>
              <label>Full Name</label>

              <div className={styles.inputWrapper}>
                <FaUser />

                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Enter trainer name"
                />
              </div>

              {errors.name && (
                <span className={styles.error}>{errors.name}</span>
              )}
            </div>

            <div className={styles.formGroup}>
              <label>Email Address</label>

              <div className={styles.inputWrapper}>
                <FaEnvelope />

                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter email"
                />
              </div>

              {errors.email && (
                <span className={styles.error}>{errors.email}</span>
              )}
            </div>

            <div className={styles.formGroup}>
              <label>Phone Number</label>

              <div className={styles.inputWrapper}>
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

              {errors.phone && (
                <span className={styles.error}>{errors.phone}</span>
              )}
            </div>

            <div className={styles.formGroup}>
              <label>Gender</label>

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

            <div className={styles.formGroup}>
              <label>Address</label>

              <div className={styles.inputWrapper}>
                <FaMapMarkerAlt />

                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  placeholder="Enter address"
                />
              </div>

              {errors.address && (
                <span className={styles.error}>{errors.address}</span>
              )}
            </div>

            <div className={styles.formGroup}>
              <label>Joining Date</label>

              <div className={styles.inputWrapper}>
                <FaCalendarAlt />

                <input
                  type="date"
                  name="joinDate"
                  value={formData.joinDate}
                  onChange={handleChange}
                />
              </div>

              {errors.joinDate && (
                <span className={styles.error}>
                  {errors.joinDate}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Professional Information */}

        <div className={styles.card}>
          <h3>Professional Information</h3>

          <div className={styles.formGrid}>
            <div className={styles.formGroup}>
              <label>Trainer Role</label>

              <div className={styles.inputWrapper}>
                <FaBriefcase />

                <select
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                >
                  <option value="">Select Role</option>
                  <option value="Personal Trainer">
                    Personal Trainer
                  </option>
                  <option value="Fitness Trainer">
                    Fitness Trainer
                  </option>
                  <option value="Strength Trainer">
                    Strength Trainer
                  </option>
                  <option value="Yoga Trainer">Yoga Trainer</option>
                  <option value="Cardio Trainer">Cardio Trainer</option>
                  <option value="Zumba Trainer">Zumba Trainer</option>
                </select>
              </div>

              {errors.role && (
                <span className={styles.error}>{errors.role}</span>
              )}
            </div>

            <div className={styles.formGroup}>
              <label>Monthly Salary (₹)</label>

              <div className={styles.inputWrapper}>
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

              {errors.salary && (
                <span className={styles.error}>{errors.salary}</span>
              )}
            </div>

            <div className={styles.formGroup}>
              <label>Trainer Status</label>

              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
              >
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>
            </div>
          </div>
        </div>

        {/* API Error */}

        {errors.submit && (
          <div className={styles.card}>
            <span className={styles.error}>{errors.submit}</span>
          </div>
        )}

        {/* Actions */}

        <div className={styles.actions}>
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
            className={styles.saveButton}
            disabled={loading}
          >
            <FaSave />
            {loading ? "Saving Changes..." : "Save Changes"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditTrainer;