import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import {
  FaUser,
  FaPhone,
  FaMapMarkerAlt,
  FaVenusMars,
  FaCamera,
  FaArrowLeft,
  FaSave,
  FaEnvelope,
} from "react-icons/fa";

import styles from "./EditProfile.module.css";

const API_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:4000/api";

const EditProfile = () => {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [preview, setPreview] = useState("");
  const [image, setImage] = useState(null);

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    gender: "",
    address: "",
    email: "",
  });

  // =====================================
  // FETCH MEMBER PROFILE
  // =====================================

  useEffect(() => {
    fetchProfile();
  }, []);

  // Clean up temporary image preview URLs
  useEffect(() => {
    return () => {
      if (preview.startsWith("blob:")) {
        URL.revokeObjectURL(preview);
      }
    };
  }, [preview]);

  const fetchProfile = async () => {
    try {
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

      const member =
        data.member ||
        data.profile ||
        data.data?.member ||
        data.data?.profile ||
        data.data ||
        data;

      setFormData({
        name: member.name || "",
        phone: member.phone || "",
        gender: member.gender || "",
        address: member.address || "",
        email: member.email || "",
      });

      setPreview(member.image || "");
    } catch (error) {
      console.error("Fetch Profile Error:", error);
      toast.error(error.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  // =====================================
  // HANDLE INPUT CHANGE
  // =====================================

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // =====================================
  // HANDLE IMAGE CHANGE
  // =====================================

  const handleImageChange = (e) => {
    const file = e.target.files[0];

    if (!file) return;

    // Validate image type
    if (!file.type.startsWith("image/")) {
      toast.error("Please select a valid image");
      e.target.value = "";
      return;
    }

    // Validate image size (5 MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image size should not exceed 5 MB");
      e.target.value = "";
      return;
    }

    setImage(file);
    setPreview(URL.createObjectURL(file));
  };

  // =====================================
  // UPDATE MEMBER PROFILE
  // =====================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (saving) return;

    // Validate fields
    if (
      !formData.name.trim() ||
      !formData.phone.trim() ||
      !formData.gender ||
      !formData.address.trim()
    ) {
      toast.error("Please fill all required fields");
      return;
    }

    if (!/^[0-9]{10}$/.test(formData.phone.trim())) {
      toast.error("Please enter a valid 10-digit phone number");
      return;
    }

    try {
      setSaving(true);

      const payload = new FormData();

      payload.append("name", formData.name.trim());
      payload.append("phone", formData.phone.trim());
      payload.append("gender", formData.gender);
      payload.append("address", formData.address.trim());

      if (image) {
        payload.append("image", image);
      }

      const response = await fetch(
        `${API_URL}/member-dashboard/profile`,
        {
          method: "PUT",
          credentials: "include",
          body: payload,
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Profile update failed");
      }

      toast.success(
        data.message || "Profile updated successfully!"
      );

      navigate("/member/profile", {
        replace: true,
      });

    } catch (error) {
      console.error("Update Profile Error:", error);
      toast.error(error.message || "Unable to update profile");
    } finally {
      setSaving(false);
    }
  };

  // =====================================
  // LOADING
  // =====================================

  if (loading) {
    return (
      <div className={styles.loading}>
        <div className={styles.loader}></div>
        <p>Loading your profile...</p>
      </div>
    );
  }

  // =====================================
  // EDIT PROFILE UI
  // =====================================

  return (
    <div className={styles.editPage}>
      <div className={styles.editContainer}>

        {/* Back Button */}
        <button
          type="button"
          className={styles.backButton}
          onClick={() => navigate("/member/profile")}
        >
          <FaArrowLeft />
          Back to Profile
        </button>

        {/* Heading */}
        <div className={styles.heading}>
          <h1>
            Edit <span>Profile</span>
          </h1>

          <p>
            Update your personal information and profile photo.
          </p>
        </div>

        <form onSubmit={handleSubmit}>

          {/* Profile Image */}
          <div className={styles.imageSection}>
            <div className={styles.avatar}>
              {preview ? (
                <img
                  src={preview}
                  alt="Member Profile"
                />
              ) : (
                <FaUser />
              )}
            </div>

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

            <p className={styles.imageInfo}>
              JPG, PNG or WEBP (Maximum 5 MB)
            </p>
          </div>

          {/* Form Fields */}
          <div className={styles.formGrid}>

            {/* Full Name */}
            <div className={styles.formGroup}>
              <label htmlFor="name">
                Full Name
              </label>

              <div className={styles.inputWrapper}>
                <FaUser />

                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Enter your full name"
                  maxLength={60}
                  required
                />
              </div>
            </div>

            {/* Email */}
            <div className={styles.formGroup}>
              <label htmlFor="email">
                Email Address
              </label>

              <div className={styles.inputWrapper}>
                <FaEnvelope />

                <input
                  type="email"
                  id="email"
                  value={formData.email}
                  disabled
                  readOnly
                />
              </div>

              <small className={styles.helperText}>
                Email address cannot be changed.
              </small>
            </div>

            {/* Phone */}
            <div className={styles.formGroup}>
              <label htmlFor="phone">
                Phone Number
              </label>

              <div className={styles.inputWrapper}>
                <FaPhone />

                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="Enter phone number"
                  maxLength={10}
                  required
                />
              </div>
            </div>

            {/* Gender */}
            <div className={styles.formGroup}>
              <label htmlFor="gender">
                Gender
              </label>

              <div className={styles.inputWrapper}>
                <FaVenusMars />

                <select
                  id="gender"
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                  required
                >
                  <option value="">
                    Select Gender
                  </option>

                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </div>

            {/* Address */}
            <div
              className={`${styles.formGroup} ${styles.fullWidth}`}
            >
              <label htmlFor="address">
                Address
              </label>

              <div className={styles.inputWrapper}>
                <FaMapMarkerAlt />

                <textarea
                  id="address"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  placeholder="Enter your address"
                  rows="4"
                  maxLength={300}
                  required
                />
              </div>
            </div>

          </div>

          {/* Save Button */}
          <button
            type="submit"
            className={styles.saveButton}
            disabled={saving}
          >
            <FaSave />

            {saving ? "Saving Changes..." : "Save Changes"}
          </button>

        </form>
      </div>
    </div>
  );
};

export default EditProfile;
