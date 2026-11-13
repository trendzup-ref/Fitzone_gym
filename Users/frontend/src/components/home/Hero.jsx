import { Link } from "react-router-dom";
import {
  FaUsers,
  FaDumbbell,
  FaMedal,
  FaCalendarAlt,
} from "react-icons/fa";

import "./Hero.css";
import { assest } from "../../assets/assests.js";

function Hero() {
  const stats = [
    {
      icon: <FaUsers />,
      number: "500+",
      label: "Active Members",
    },
    {
      icon: <FaDumbbell />,
      number: "20+",
      label: "Expert Trainers",
    },
    {
      icon: <FaMedal />,
      number: "10+",
      label: "Fitness Programs",
    },
    {
      icon: <FaCalendarAlt />,
      number: "5+",
      label: "Years of Excellence",
    },
  ];

  return (
    <section
      className="hero"
      style={{ backgroundImage: `url(${assest.heroimg})` }}
    >
      <div className="hero-overlay">
        <div className="hero-container">
          <div className="hero-content">
            <span className="hero-tag">
              WELCOME TO FITZONE GYM
            </span>

            <h1>
              Transform Your Body,
              <span> Transform Your Life</span>
            </h1>

            <p>
              Join our gym and take the first step towards
              a healthier, stronger and more confident you.
            </p>

            <div className="hero-buttons">
              <Link to="/contact" className="btn-primary">
                Join Now <span>→</span>
              </Link>

              <Link to="/programs" className="btn-outline">
                Explore Programs
              </Link>
            </div>
          </div>
        </div>

        {/* Statistics */}
        <div className="hero-stats">
          {stats.map((stat, index) => (
            <div className="stat-item" key={index}>
              <span className="stat-icon">
                {stat.icon}
              </span>

              <div>
                <h3>{stat.number}</h3>
                <p>{stat.label}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Hero;