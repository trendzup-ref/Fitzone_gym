import { useState } from "react";
import { Link } from "react-router-dom";

import {
  FaUserShield,
  FaEnvelope,
  FaLock,
  FaUser,
  FaEye,
  FaEyeSlash,
} from "react-icons/fa";

import style from "./login.module.css";

const login = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    setMessage("");

    if (!isLogin && formData.password !== formData.confirmPassword) {
      setMessage("Passwords do not match!");
      return;
    }

    if (isLogin) {
      console.log("Admin Login:", {
        email: formData.email,
        password: formData.password,
      });

      // Login API will be connected here.
    } else {
      console.log("Admin Registration:", formData);

      // Register API will be connected here.
    }
  };

  const toggleForm = () => {
    setIsLogin(!isLogin);
    setMessage("");
    setShowPassword(false);
    setShowConfirmPassword(false);

    setFormData({
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    });
  };

  return (
    <section className={style.loginSection}>
      <div className={style.loginContainer}>

        {/* Header */}
        <div className={style.loginHeader}>
          <div className={style.logoIcon}>
            <FaUserShield />
          </div>

          <h1>
            Fitzone <span>Gym</span>
          </h1>

          {/* <p>ADMIN PANEL</p> */}
        </div>

        {/* Login / Register Card */}
        <div className={style.loginCard}>

          {/* Toggle Buttons */}
          <div className={style.authTabs}>
            <button
              type="button"
              className={isLogin ? style.activeTab : ""}
              onClick={() => {
                if (!isLogin) toggleForm();
              }}
            >
              Login
            </button>

            <button
              type="button"
              className={!isLogin ? style.activeTab : ""}
              onClick={() => {
                if (isLogin) toggleForm();
              }}
            >
              Register
            </button>
          </div>

          <h2>
            {isLogin ? "Welcome Back!" : "Create User Account"}
          </h2>

          <p className={style.loginDescription}>
            {isLogin
              ? "Login to access your dashboard."
              : "Register to create your account."}
          </p>

          <form onSubmit={handleSubmit}>

            {/* Name - Register Only */}
            {!isLogin && (
              <div className={style.formGroup}>
                <label>Full Name</label>

                <div className={style.inputBox}>
                  <FaUser />

                  <input
                    type="text"
                    name="name"
                    placeholder="Enter your full name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>
            )}

            {/* Email */}
            <div className={style.formGroup}>
              <label>Email Address</label>

              <div className={style.inputBox}>
                <FaEnvelope />

                <input
                  type="email"
                  name="email"
                  placeholder="Enter your email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            {/* Password */}
            <div className={style.formGroup}>
              <label>Password</label>

              <div className={style.inputBox}>
                <FaLock />

                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={handleChange}
                  minLength={6}
                  required
                />

                <button
                  type="button"
                  className={style.passwordToggle}
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
            </div>

            {/* Confirm Password - Register Only */}
            {!isLogin && (
              <div className={style.formGroup}>
                <label>Confirm Password</label>

                <div className={style.inputBox}>
                  <FaLock />

                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    name="confirmPassword"
                    placeholder="Confirm your password"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    required
                  />

                  <button
                    type="button"
                    className={style.passwordToggle}
                    onClick={() =>
                      setShowConfirmPassword(!showConfirmPassword)
                    }
                    aria-label={
                      showConfirmPassword ? "Hide password" : "Show password"
                    }
                  >
                    {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>
              </div>
            )}

            {/* Login Options */}
            {isLogin && (
              <div className={style.loginOptions}>
                {/* <label className={style.rememberMe}>
                  <input type="checkbox" />
                  Remember me
                </label> */}

                <Link to="/admin/forgot-password">
                  Forgot Password?
                </Link>
              </div>
            )}

            {/* Message */}
            {message && (
              <p className={style.errorMessage}>
                {message}
              </p>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              className={style.loginButton}
            >
              {isLogin ? "Sign In" : "Create Account"}
            </button>

          </form>

          {/* Toggle Link */}
          <div className={style.registerText}>
            {isLogin ? (
              <p>
                Don't have an account?
                <button type="button" onClick={toggleForm}>
                  Register Now
                </button>
              </p>
            ) : (
              <p>
                Already have an account?
                <button type="button" onClick={toggleForm}>
                  Login Now
                </button>
              </p>
            )}
          </div>

          {/* Footer */}
          <div className={style.loginFooter}>
            <Link to="/">
              ← Back to Website
            </Link>
          </div>

        </div>

        <p className={style.copyright}>
          © 2026 Fitzone Gym. All Rights Reserved.
        </p>

      </div>
    </section>
  );
};

export default login;