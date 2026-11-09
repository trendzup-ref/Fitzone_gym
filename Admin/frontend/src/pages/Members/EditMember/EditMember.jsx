import { useState, useEffect, useContext } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { AdminContext } from "../../../context/AdminContext";

import {
  FaArrowLeft,
  FaUser,
  FaEnvelope,
  FaPhone,
  FaMapMarkerAlt,
  FaCalendarAlt,
  FaCreditCard,
  FaImage,
} from "react-icons/fa";

import styles from "./EditMember.module.css";

const EditMember = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const { getMemberById, updateMember, getMemberships } =
    useContext(AdminContext);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    gender: "",
    address: "",
    membership: "",
    joinDate: "",
    payment: "",
    image: null,
  });

  const [memberships, setMemberships] = useState([]);
  const [imagePreview, setImagePreview] = useState("");
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [notFound, setNotFound] = useState(false);

  // Fetch Member and Membership Plans
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        const [memberResponse, membershipResponse] =
          await Promise.all([
            getMemberById(id),
            getMemberships(),
          ]);

        const member =
          memberResponse.member ||
          memberResponse.data?.member ||
          memberResponse;

        if (!member || !member._id) {
          setNotFound(true);
          return;
        }

        const plans =
          membershipResponse.memberships ||
          membershipResponse.membership ||
          membershipResponse.data?.memberships ||
          membershipResponse.data?.membership ||
          [];

        const membershipId =
          typeof member.membership === "object"
            ? member.membership?._id
            : member.membership;

        const activePlans = Array.isArray(plans)
          ? plans.filter(
              (plan) =>
                plan.status === "Active" ||
                plan._id === membershipId
            )
          : [];

        setMemberships(activePlans);

        setFormData({
          name: member.name || "",
          email: member.email || "",
          phone: member.phone || "",
          gender: member.gender || "",
          address: member.address || "",
          membership: membershipId || "",
          joinDate: member.joinDate
            ? new Date(member.joinDate).toISOString().split("T")[0]
            : "",
          payment: member.payment || "",
          image: null,
        });

        setImagePreview(member.image || "");
      } catch (error) {
        console.error("Fetch member error:", error);
        setNotFound(true);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  // Handle Input Changes
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

  // Handle Image Upload
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
      newErrors.name = "Name is required.";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required.";
    } else if (
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)
    ) {
      newErrors.email = "Enter a valid email.";
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

    if (!formData.joinDate) {
      newErrors.joinDate = "Joining date is required.";
    }

    if (!formData.membership) {
      newErrors.membership = "Select membership plan.";
    }

    if (!formData.payment) {
      newErrors.payment = "Select payment method.";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  // Submit Updated Member
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      setSaving(true);

      const data = new FormData();

      data.append("name", formData.name);
      data.append("email", formData.email);
      data.append("phone", formData.phone);
      data.append("gender", formData.gender);
      data.append("address", formData.address);
      data.append("joinDate", formData.joinDate);
      data.append("membership", formData.membership);
      data.append("payment", formData.payment);

      // Send image only if a new image is selected
      if (formData.image) {
        data.append("image", formData.image);
      }

      const response = await updateMember(id, data);

      if (response.success) {
        alert("Member details updated successfully!");

        navigate(`/admin/members/${id}`);
      } else {
        alert(response.message || "Failed to update member.");
      }
    } catch (error) {
      console.error("Update member error:", error);

      alert(error.message || "Failed to update member.");
    } finally {
      setSaving(false);
    }
  };

  // Loading
  if (loading) {
    return <div className={styles.container}>Loading member details...</div>;
  }

  // Member Not Found
  if (notFound) {
    return (
      <div className={styles.notFound}>
        <h2>Member Not Found</h2>

        <button onClick={() => navigate("/admin/members")}>
          Back to Members
        </button>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      {/* Header */}
      <div className={styles.pageHeader}>
        <div>
          <button
            className={styles.backButton}
            onClick={() => navigate(`/admin/members`)}
          >
            <FaArrowLeft /> Back to Details
          </button>

          <h1>Edit Member</h1>
          <p>Update member information and membership details.</p>
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
                placeholder="Enter full name"
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
                  placeholder="Enter email"
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
                  placeholder="Enter address"
                />
              </div>

              {errors.address && <small>{errors.address}</small>}
            </div>
          </div>
        </div>

        {/* Membership Information */}
        <div className={styles.formCard}>
          <div className={styles.sectionHeader}>
            <FaCreditCard />
            <h3>Membership Information</h3>
          </div>

          <div className={styles.formGrid}>
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

            <div className={styles.formGroup}>
              <label>Membership Plan *</label>

              <select
                name="membership"
                value={formData.membership}
                onChange={handleChange}
              >
                <option value="">Select Membership</option>

                {memberships.map((membership) => (
                  <option key={membership._id} value={membership._id}>
                    {membership.name} - ₹{membership.price}
                  </option>
                ))}
              </select>

              {errors.membership && <small>{errors.membership}</small>}
            </div>

            <div className={styles.formGroup}>
              <label>Payment Method *</label>

              <select
                name="payment"
                value={formData.payment}
                onChange={handleChange}
              >
                <option value="">Select Payment</option>
                <option value="Cash">Cash</option>
                <option value="Online">Online</option>
              </select>

              {errors.payment && <small>{errors.payment}</small>}
            </div>
          </div>
        </div>

        {/* Profile Image */}
        <div className={styles.formCard}>
          <div className={styles.sectionHeader}>
            <FaImage />
            <h3>Member Profile Image</h3>
          </div>

          <div className={styles.uploadArea}>
            {imagePreview ? (
              <img
                src={imagePreview}
                alt="Member Preview"
                className={styles.previewImage}
              />
            ) : (
              <div className={styles.imagePlaceholder}>
                <FaUser />
              </div>
            )}

            <label className={styles.uploadButton}>
              Change Image

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

        {/* Buttons */}
        <div className={styles.formActions}>
          <button
            type="button"
            className={styles.cancelButton}
            onClick={() => navigate(`/admin/members/${id}`)}
          >
            Cancel
          </button>

          <button
            type="submit"
            className={styles.submitButton}
            disabled={saving}
          >
            {saving ? "Updating..." : "Save Changes"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditMember;