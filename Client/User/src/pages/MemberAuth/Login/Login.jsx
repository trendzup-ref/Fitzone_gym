import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import {
  FaDumbbell,
  FaEnvelope,
  FaLock,
  FaEye,
  FaEyeSlash,
  FaArrowRight,
} from "react-icons/fa";

import styles from "./Login.module.css";

const API_URL =
  import.meta.env.VITE_BACKEND_URL || "http://localhost:4000/api";

const Login = () => {
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Member Login
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (loading) return;

    try {
      setLoading(true);

      const response = await fetch(`${API_URL}/member-auth/login`, {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
        },

        credentials: "include",

        body: JSON.stringify({
          email: formData.email.trim().toLowerCase(),
          password: formData.password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Login failed");
      }

      toast.success(data.message || "Login successful!");

      // Redirect to Member Dashboard
      navigate("/member/dashboard", { replace: true });

    } catch (error) {
      console.error("Member Login Error:", error);

      toast.error(error.message || "Something went wrong. Please try again.");

    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.loginPage}>
      <div className={styles.loginContainer}>

        {/* Left Section */}
        <div className={styles.loginLeft}>

          <Link to="/" className={styles.loginLogo}>
            <FaDumbbell />

            <span>
              Fitzone <strong>Gym</strong>
            </span>
          </Link>

          <div className={styles.loginLeftContent}>
            <span className={styles.loginTag}>
              WELCOME BACK
            </span>

            <h1>
              Your Fitness
              <br />
              Journey <span>Continues.</span>
            </h1>

            <p>
              Stay consistent, stay strong and keep pushing
              towards your fitness goals.
            </p>

            <div className={styles.loginQuote}>
              "The only bad workout is the one that didn't happen."
            </div>
          </div>

          <p className={styles.loginCopyright}>
            © 2026 Fitzone Gym. All rights reserved.
          </p>

        </div>

        {/* Right Section */}
        <div className={styles.loginRight}>

          <div className={styles.loginFormHeader}>
            <span className={styles.loginTag}>
              MEMBER PORTAL
            </span>

            <h2>Welcome Back!</h2>

            <p>
              Login to access your gym membership and dashboard.
            </p>
          </div>

          <form onSubmit={handleSubmit}>

            {/* Email */}
            <div className={styles.loginInputGroup}>
              <label>Email Address</label>

              <div className={styles.loginInput}>
                <FaEnvelope />

                <input
                  type="email"
                  name="email"
                  placeholder="Enter your email"
                  value={formData.email}
                  onChange={handleChange}
                  autoComplete="off"
                  
                  required
                />
              </div>
            </div>

            {/* Password */}
            <div className={styles.loginInputGroup}>
              <label>Password</label>

              <div className={styles.loginInput}>
                <FaLock />

                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={handleChange}
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

            {/* Forgot Password */}
            {/* <div className={styles.loginOptions}>
              <Link to="/member/forgot-password">
                Forgot Password?
              </Link>
            </div> */}

            {/* Login Button */}
            <button
              type="submit"
              className={styles.loginSubmit}
              disabled={loading}
            >
              {loading ? "Logging in..." : "Login to Account"}

              {!loading && <FaArrowRight />}
            </button>

          </form>

          {/* Register Link */}
          <div className={styles.loginRegisterLink}>
            Don't have an account?

            <Link to="/member/register">
              Create Account
            </Link>
          </div>

          <Link to="/" className={styles.backToHome}>
            ← Back to Home
          </Link>

        </div>

      </div>
    </div>
  );
};

export default Login;