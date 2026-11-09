import {
  FaDumbbell,
  FaUsers,
  FaMedal,
  FaLayerGroup,
  FaBullseye,
  FaEye,
  FaLock,
  FaShower,
  FaSnowflake,
  FaCar,
  FaWifi,
} from "react-icons/fa";

import "./About.css";
import { assest } from "../assets/assests";
import Footer from "../components/home/Footer";


function About() {
  return (
    <>
      {/* About Banner */}
      <section className="about-banner">
        <div className="about-banner-content">
          <h1>
            About <span>Us</span>
          </h1>

          <p>
            <a href="/">Home</a> / <span>About</span>
          </p>
        </div>
      </section>

      {/* Gym Overview */}
      <section className="gym-overview">
        <div className="overview-container">

          <div className="overview-image">
            <img
              src={assest.abouthomeImg}
              alt="Fitzone Gym Interior"
            />
          </div>

          <div className="overview-content">
            <span className="section-label">OUR GYM</span>

            <h2>
              Gym <span>Overview</span>
            </h2>

            <p>
              Fitzone Gym is a modern fitness center dedicated
              to helping people achieve a healthier, stronger,
              and more confident lifestyle.

              We provide a safe, motivating, and well-equipped
              environment for all fitness levels, from beginners
              to advanced athletes.
            </p>

            <div className="overview-stats">

              <div className="stat-item">
                <FaDumbbell />
                <h3>5+</h3>
                <p>Years of Excellence</p>
              </div>

              <div className="stat-item">
                <FaUsers />
                <h3>500+</h3>
                <p>Active Members</p>
              </div>

              <div className="stat-item">
                <FaMedal />
                <h3>20+</h3>
                <p>Expert Trainers</p>
              </div>

              <div className="stat-item">
                <FaLayerGroup />
                <h3>10+</h3>
                <p>Fitness Programs</p>
              </div>

            </div>
          </div>

        </div>
      </section>

      {/* Mission & Vision */}
      <section className="mission-vision">

        <div className="mission-card">

          <div className="mission-icon">
            <FaBullseye />
          </div>

          <div className="mission-content">
            <h2>Our Mission</h2>

            <p>
              Our mission is to make fitness accessible,
              enjoyable and effective for everyone by providing
              expert guidance, modern facilities and
              personalized training.
            </p>
          </div>

        </div>

        <div className="mission-card">

          <div className="mission-icon">
            <FaEye />
          </div>

          <div className="mission-content">
            <h2>Our Vision</h2>

            <p>
              To be a leading fitness destination known for
              transforming lives, building a healthy community
              and promoting lifelong wellness.
            </p>
          </div>

        </div>

      </section>

      {/* Facilities */}
      
<section className="about-facilities">

  <div className="facilities-heading">
    <span>OUR FACILITIES</span>

    <h2>
      World-Class Gym <strong>Facilities</strong>
    </h2>

    <p>
      Train in a comfortable, safe and fully equipped
      environment designed for your fitness journey.
    </p>
  </div>

  <div className="about-facilities-container">

    <div className="about-facility-card">
      <div className="about-facility-icon">
        <FaDumbbell />
      </div>
      <h3>Modern Equipment</h3>
      <p>
        Latest and well-maintained gym equipment for
        effective workouts.
      </p>
    </div>

    <div className="about-facility-card">
      <div className="about-facility-icon">
        <FaLock />
      </div>
      <h3>Locker Room</h3>
      <p>
        Secure and spacious lockers for our gym members.
      </p>
    </div>

    <div className="about-facility-card">
      <div className="about-facility-icon">
        <FaShower />
      </div>
      <h3>Shower Facility</h3>
      <p>
        Freshen up with clean and hygienic shower areas.
      </p>
    </div>

    <div className="about-facility-card">
      <div className="about-facility-icon">
        <FaSnowflake />
      </div>
      <h3>AC Gym</h3>
      <p>
        Train comfortably in a fully air-conditioned space.
      </p>
    </div>

    <div className="about-facility-card">
      <div className="about-facility-icon">
        <FaCar />
      </div>
      <h3>Parking Area</h3>
      <p>
        Convenient and safe parking facility for members.
      </p>
    </div>

    <div className="about-facility-card">
      <div className="about-facility-icon">
        <FaWifi />
      </div>
      <h3>Free Wi-Fi</h3>
      <p>
        Stay connected during your workout sessions.
      </p>
    </div>

  </div>

</section>

<Footer />
    </>
  );
}

export default About;