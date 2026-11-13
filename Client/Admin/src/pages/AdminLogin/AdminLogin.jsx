import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";

import {
  FaEnvelope,
  FaLock,
  FaEye,
  FaEyeSlash,
  FaDumbbell,
  FaArrowRight,
} from "react-icons/fa";

import { AdminContext } from "../../context/AdminContext";

import styles from "./AdminLogin.module.css";

const AdminLogin = () => {
  const navigate = useNavigate();

  const { login } = useContext(AdminContext);

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState({});

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
      general: "",
    }));
  };

  // Form validation
  const validateForm = () => {
    const newErrors = {};

    if (!formData.email.trim()) {
      newErrors.email = "Email is required.";
    } else if (
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)
    ) {
      newErrors.email = "Enter a valid email address.";
    }

    if (!formData.password.trim()) {
      newErrors.password = "Password is required.";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters.";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  // Handle login
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      setLoading(true);
      setErrors({});

      const response = await login(
        formData.email.trim(),
        formData.password
      );

      if (response.success) {
        navigate("/admin/dashboard", { replace: true });
      }
    } catch (error) {
      console.error("Admin login error:", error);

      setErrors({
        general:
          error.response?.data?.message ||
          "Login failed. Please check your credentials.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.loginContainer}>
      {/* Left Side */}
      <div className={styles.leftSection}>
        <div className={styles.brand}>
          <div className={styles.brandIcon}>
            <FaDumbbell />
          </div>

          <h2>FitZone</h2>
        </div>

        <div className={styles.leftContent}>
          <span className={styles.tagline}>
            GYM MANAGEMENT SYSTEM
          </span>

          <h1>
            Manage Your Gym.
            <br />
            <span>Grow Your Business.</span>
          </h1>

          <p>
            Manage members, trainers, memberships and inquiries
            from one powerful dashboard.
          </p>

          <div className={styles.features}>
            <div>
              <span>✓</span>
              Member Management
            </div>

            <div>
              <span>✓</span>
              Trainer Management
            </div>

            <div>
              <span>✓</span>
              Reports & Analytics
            </div>
          </div>
        </div>

        <p className={styles.copyright}>
          © 2026 FitZone. All rights reserved.
        </p>
      </div>

      {/* Right Side */}
      <div className={styles.rightSection}>
        <div className={styles.loginCard}>
          <div className={styles.mobileLogo}>
            <FaDumbbell />
            <span>FitZone</span>
          </div>

          <div className={styles.loginHeader}>
            <h2>Welcome Back!</h2>
            <p>Login to access your admin dashboard.</p>
          </div>

          <form onSubmit={handleSubmit}>
            {/* Email */}
            <div className={styles.formGroup}>
              <label>Email Address</label>

              <div
                className={`${styles.inputWrapper} ${
                  errors.email ? styles.inputError : ""
                }`}
              >
                <FaEnvelope />

                <input
                  type="email"
                  name="email"
                  autoComplete="off"
                  autoCorrect="off"
                  autoCapitalize="off"
                  spellCheck="false"
                  placeholder="Enter your email"
                  value={formData.email}
                  onChange={handleChange}
                />
              </div>

              {errors.email && (
                <span className={styles.error}>
                  {errors.email}
                </span>
              )}
            </div>

            {/* Password */}
            <div className={styles.formGroup}>
              <label>Password</label>

              <div
                className={`${styles.inputWrapper} ${
                  errors.password ? styles.inputError : ""
                }`}
              >
                <FaLock />

                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="Enter your password"
                  autoComplete="off"
                  value={formData.password}
                  onChange={handleChange}
                />

                <button
                  type="button"
                  className={styles.eyeButton}
                  onClick={() =>
                    setShowPassword((prev) => !prev)
                  }
                  aria-label={
                    showPassword ? "Hide password" : "Show password"
                  }
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>

              {errors.password && (
                <span className={styles.error}>
                  {errors.password}
                </span>
              )}
            </div>

            {/* General Error */}
            {errors.general && (
              <p className={styles.error}>
                {errors.general}
              </p>
            )}

            {/* Login Button */}
            <button
              type="submit"
              className={styles.loginButton}
              disabled={loading}
            >
              {loading ? "Signing In..." : "Sign In"}

              {!loading && <FaArrowRight />}
            </button>
          </form>

          <div className={styles.loginFooter}>
            <p>Secure Admin Access</p>

            <span>
              Only authorized administrators can access this panel.
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;