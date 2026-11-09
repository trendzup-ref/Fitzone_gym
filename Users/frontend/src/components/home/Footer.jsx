import { Link } from "react-router-dom";
import {
  FaDumbbell,
  FaMapMarkerAlt,
  FaPhoneAlt,
  FaEnvelope,
  FaFacebookF,
  FaInstagram,
  FaYoutube,
  FaTwitter,
} from "react-icons/fa";

import "./Footer.css";

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-container">

        {/* About */}
        <div className="footer-about">
          <h2>
            <FaDumbbell /> Fit<span>zone</span>
          </h2>

          <p>
            Transform your body and build a healthier lifestyle
            with Fitzone Gym. Your fitness journey starts here.
          </p>

          <div className="footer-socials">
            <a href="#" aria-label="Facebook"><FaFacebookF /></a>
            <a href="#" aria-label="Instagram"><FaInstagram /></a>
            <a href="#" aria-label="YouTube"><FaYoutube /></a>
            <a href="#" aria-label="Twitter"><FaTwitter /></a>
          </div>
        </div>

        {/* Quick Links */}
        <div className="footer-links">
          <h3>Quick Links</h3>
          <ul>
            <li><Link to="/">Home</Link></li>
            <li><Link to="/about">About Us</Link></li>
            <li><Link to="/programs">Programs</Link></li>
            <li><Link to="/trainers">Trainers</Link></li>
            <li><Link to="/gallery">Gallery</Link></li>
            <li><Link to="/contact">Contact</Link></li>
          </ul>
        </div>

        {/* Programs */}
        <div className="footer-links">
          <h3>Our Programs</h3>
          <ul>
            <li><a href="/programs">Strength Training</a></li>
            <li><a href="/programs">Cardio Training</a></li>
            <li><a href="/programs">Yoga</a></li>
            <li><a href="/programs">Zumba</a></li>
          </ul>
        </div>

        {/* Contact */}
        <div className="footer-contact">
          <h3>Contact Us</h3>

          <p>
            <FaMapMarkerAlt />
            <span>Your Gym Address, India</span>
          </p>

          <p>
            <FaPhoneAlt />
            <span>+91 98765 43210</span>
          </p>

          <p>
            <FaEnvelope />
            <span>info@Fitzonegym.com</span>
          </p>
        </div>

      </div>

      <div className="footer-bottom">
        <p>
          © {new Date().getFullYear()} Fitzone Gym.
          All Rights Reserved.
        </p>
      </div>
    </footer>
  );
}

export default Footer;