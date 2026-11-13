import { useState } from "react";

import {
  FaMapMarkerAlt,
  FaPhoneAlt,
  FaEnvelope,
  FaClock,
  FaPaperPlane,
} from "react-icons/fa";

import { toast } from "react-toastify"

import style from "./Contact.module.css";
import Footer from "../components/home/Footer";

const Contact = () => {
  const BASE_URL = "https://fitzone-gym-one-peach.vercel.app/api";

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });

  
  const [loading, setLoading] = useState(false);

  // Handle Input Change
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Submit Inquiry
 const handleSubmit = async (e) => {
  e.preventDefault();

  try {
    setLoading(true);

    const response = await fetch(`${BASE_URL}/api/inquiry/add`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    });

    const data = await response.json();

    if (!response.ok || !data.success) {
      throw new Error(
        data.message || "Something went wrong. Please try again."
      );
    }

    // Success Toast
    toast.success(data.message || "Your inquiry has been submitted successfully!");

    // Reset Form
    setFormData({
      name: "",
      email: "",
      phone: "",
      subject: "",
      message: "",
    });

  } catch (error) {
    console.error("Inquiry Submission Error:", error);

    // Error Toast
    toast.error(error.message || "Failed to connect to the server.");

  } finally {
    setLoading(false);
  }
};

  return (
    <>
      {/* Contact Banner */}
      <section className={style.contactBanner}>
        <div className={style.bannerContent}>
          <h1>
            Contact <span>Us</span>
          </h1>

          <p>
            <a href="/">Home</a> / <span>Contact</span>
          </p>
        </div>
      </section>

      {/* Contact Section */}
      <section className={style.contactSection}>
        <div className={style.contactHeading}>
          <span className={style.sectionLabel}>GET IN TOUCH</span>

          <h2>
            Let's Start Your <span>Fitness Journey</span>
          </h2>

          <p>
            Have questions about memberships, training programs,
            or our facilities? Contact us today.
          </p>
        </div>

        <div className={style.contactContainer}>

          {/* Contact Information */}
          <div className={style.contactInfo}>
            <h3>Contact Information</h3>

            <p className={style.contactInfoText}>
              Get in touch with our team. We are always ready
              to help you achieve your fitness goals.
            </p>

            <div className={style.contactInfoItem}>
              <div className={style.contactInfoIcon}>
                <FaMapMarkerAlt />
              </div>

              <div>
                <h4>Our Location</h4>
                <p>Enter Your Gym Address Here</p>
              </div>
            </div>

            <div className={style.contactInfoItem}>
              <div className={style.contactInfoIcon}>
                <FaPhoneAlt />
              </div>

              <div>
                <h4>Phone Number</h4>
                <p>+91 7290864710</p>
              </div>
            </div>

            <div className={style.contactInfoItem}>
              <div className={style.contactInfoIcon}>
                <FaEnvelope />
              </div>

              <div>
                <h4>Email Address</h4>
                <p>info@Fitzonegym.com</p>
              </div>
            </div>

            <div className={style.contactInfoItem}>
              <div className={style.contactInfoIcon}>
                <FaClock />
              </div>

              <div>
                <h4>Opening Hours</h4>
                <p>Monday - Saturday</p>
                <p>6:00 AM - 10:00 PM</p>
              </div>
            </div>
          </div>

          {/* Inquiry Form */}
          <div className={style.contactFormContainer}>
            <h3>Send Us a Message</h3>

            <p>
              Fill out the form and our team will contact you.
            </p>

            <form onSubmit={handleSubmit}>

              <div className={style.formRow}>
                <div className={style.formGroup}>
                  <label>Your Name</label>

                  <input
                    type="text"
                    name="name"
                    placeholder="Enter your name"
                    autoComplete="off"
                    value={formData.name}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className={style.formGroup}>
                  <label>Email Address</label>

                  <input
                    type="email"
                    name="email"
                    placeholder="Enter your email"
                    autoComplete="off"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div className={style.formRow}>
                <div className={style.formGroup}>
                  <label>Phone Number</label>

                  <input
                    type="tel"
                    name="phone"
                    placeholder="Enter phone number"
                    autoComplete="off"
                    value={formData.phone}
                    onChange={handleChange}
                    pattern="[0-9]{10}"
                    maxLength="10"
                    required
                  />
                </div>

                <div className={style.formGroup}>
                  <label>Subject</label>

                  <select
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Select Subject</option>

                    <option value="Membership Inquiry">
                      Membership Inquiry
                    </option>

                    <option value="Personal Training">
                      Personal Training
                    </option>

                    <option value="Fitness Programs">
                      Fitness Programs
                    </option>

                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>

              <div className={style.formGroup}>
                <label>Your Message</label>

                <textarea
                  name="message"
                  rows="5"
                  placeholder="Write your message..."
                  value={formData.message}
                  onChange={handleChange}
                  required
                />
              </div>

              <button
                type="submit"
                className={style.contactSubmitBtn}
                disabled={loading}
              >
                {loading ? "Sending..." : "Send Message"}

                {!loading && <FaPaperPlane />}
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* Google Maps */}
      <section className={style.contactMapSection}>
        <div className={style.mapHeading}>
          <span className={style.sectionLabel}>FIND US</span>

          <h2>
            Visit Our <span>Gym</span>
          </h2>
        </div>

        <div className={style.mapContainer}>
          <iframe
            title="Gym Location"
            src="https://www.google.com/maps?q=India&output=embed"
            width="100%"
            height="400"
            style={{ border: 0 }}
            loading="lazy"
            allowFullScreen
          />
        </div>
      </section>

      <Footer />
    </>
  );
};

export default Contact;