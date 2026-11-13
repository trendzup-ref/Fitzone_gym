import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import {
  FaDumbbell,
  FaUser,
  FaEnvelope,
  FaPhone,
  FaLock,
  FaMapMarkerAlt,
  FaEye,
  FaEyeSlash,
} from "react-icons/fa";

import styles from "./Register.module.css";

const API_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:4000/api";

const Register = () => {
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    gender: "",
    address: "",
    password: "",
    confirmPassword: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Register Member
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (loading) return;

    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match!");
      return;
    }

    if (formData.password.length < 8) {
      toast.warning("Password must be at least 8 characters long");
      return;
    }

    try {
      setLoading(true);

      const response = await fetch(`${API_URL}/member-auth/register`, {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
        },

        credentials: "include",

        body: JSON.stringify({
          name: formData.name.trim(),
          email: formData.email.trim().toLowerCase(),
          phone: formData.phone.trim(),
          gender: formData.gender,
          address: formData.address.trim(),
          password: formData.password,
          confirmPassword: formData.confirmPassword,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Registration failed");
      }

      toast.success(data.message || "Registration successful!");

      // Redirect to Login Page
      navigate("/member/login");

    } catch (error) {
      console.error("Registration Error:", error);

      toast.error(error.message || "Something went wrong. Please try again.");

    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.registerPage}>
      <div className={styles.registerContainer}>

        {/* Left Section */}
        <div className={styles.registerLeft}>

          <Link to="/" className={styles.registerLogo}>
            <FaDumbbell />

            <span>
              Fitzone <strong>Gym</strong>
            </span>
          </Link>

          <div className={styles.registerLeftContent}>
            <span className={styles.registerTag}>
              START YOUR FITNESS JOURNEY
            </span>

            <h1>
              Build Your <span>Body.</span>
              <br />
              Transform Your <span>Life.</span>
            </h1>

            <p>
              Join Fitzone Gym and take the first step towards
              a healthier, stronger and more confident you.
            </p>

            <div className={styles.registerFeatures}>
              <div>
                <FaDumbbell />
                <span>Professional Training</span>
              </div>

              <div>
                <FaUser />
                <span>Expert Trainers</span>
              </div>
            </div>
          </div>

          <p className={styles.registerCopyright}>
            © 2026 Fitzone Gym. All rights reserved.
          </p>

        </div>

        {/* Right Section */}
        <div className={styles.registerRight}>

          <div className={styles.registerFormHeader}>
            <span className={styles.registerTag}>
              CREATE ACCOUNT
            </span>

            <h2>Join Our Gym</h2>

            <p>
              Create your account and start your fitness journey.
            </p>
          </div>

          <form onSubmit={handleSubmit}>

            {/* Full Name */}
            <div className={styles.registerInputGroup}>
              <label>Full Name</label>

              <div className={styles.registerInput}>
                <FaUser />

                <input
                  type="text"
                  name="name"
                  placeholder="Enter your full name"
                  autoComplete="off"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            {/* Email and Phone */}
            <div className={styles.registerRow}>

              <div className={styles.registerInputGroup}>
                <label>Email Address</label>

                <div className={styles.registerInput}>
                  <FaEnvelope />

                  <input
                    type="email"
                    name="email"
                    autoComplete="off"
                    placeholder="Enter email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div className={styles.registerInputGroup}>
                <label>Phone Number</label>

                <div className={styles.registerInput}>
                  <FaPhone />

                  <input
                    type="tel"
                    name="phone"
                    autoComplete="off"
                    placeholder="Enter phone"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

            </div>

            {/* Gender and Address */}
            <div className={styles.registerRow}>

              <div className={styles.registerInputGroup}>
                <label>Gender</label>

                <select
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select Gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div className={styles.registerInputGroup}>
                <label>Address</label>

                <div className={styles.registerInput}>
                  <FaMapMarkerAlt />

                  <input
                    type="text"
                    name="address"
                    autoComplete="off"
                    
                    placeholder="Enter address"
                    value={formData.address}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

            </div>

            {/* Password */}
            <div className={styles.registerInputGroup}>
              <label>Password</label>

              <div className={styles.registerInput}>
                <FaLock />

                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="Create password"
                  autoComplete="off"
                  value={formData.password}
                  onChange={handleChange}
                  minLength={8}
                  required
                />

                <button
                  type="button"
                  className={styles.passwordToggle}
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
            </div>

            {/* Confirm Password */}
            <div className={styles.registerInputGroup}>
              <label>Confirm Password</label>

              <div className={styles.registerInput}>
                <FaLock />

                <input
                  type={showConfirmPassword ? "text" : "password"}
                  name="confirmPassword"
                  placeholder="Confirm password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  minLength={8}
                  required
                />

                <button
                  type="button"
                  className={styles.passwordToggle}
                  onClick={() =>
                    setShowConfirmPassword(!showConfirmPassword)
                  }
                >
                  {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              className={styles.registerSubmit}
              disabled={loading}
            >
              {loading ? "Creating Account..." : "Create Account"}
              {!loading && <span> →</span>}
            </button>

          </form>

          {/* Login Link */}
          <div className={styles.registerLoginLink}>
            Already have an account?

            <Link to="/member/login">
              Login
            </Link>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Register;