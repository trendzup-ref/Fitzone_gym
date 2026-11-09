import {
  FaDumbbell,
  FaRunning,
  FaSpa,
  FaHeartbeat,
  FaAward,
} from "react-icons/fa";

import "./Trainers.css";
import { assest } from "../assets/assests";
import Footer from "../components/home/Footer";

function Trainers() {
  const trainers = [
    {
      id: 1,
      name: "Rahul Sharma",
      role: "Head Fitness Trainer",
      experience: "8+ Years Experience",
      specialization: "Strength Training & Muscle Building",
      description:
        "Specialist in strength development, muscle building, and personalized workout programs.",
      image: `${assest.men1}`,
      icon: <FaDumbbell />,
    },
    {
      id: 2,
      name: "Priya Verma",
      role: "Yoga Instructor",
      experience: "6+ Years Experience",
      specialization: "Yoga & Flexibility",
      description:
        "Helps members improve flexibility, balance, posture, and mental wellness through yoga.",
      image: `${assest.women}` ,
      icon: <FaSpa />,
    },
    {
      id: 3,
      name: "Aman Singh",
      role: "Cardio Fitness Trainer",
      experience: "5+ Years Experience",
      specialization: "Cardio & Weight Management",
      description:
        "Focuses on cardiovascular fitness, endurance development, and effective weight management.",
      image: `${assest.men2}`,
      icon: <FaRunning />,
    },
    {
      id: 4,
      name: "Neha Gupta",
      role: "Fitness & Zumba Instructor",
      experience: "4+ Years Experience",
      specialization: "Zumba & Group Fitness",
      description:
        "Makes fitness enjoyable through energetic dance workouts and engaging group sessions.",
      image: `${assest.women2}`,
      icon: <FaHeartbeat />,
    },
  ];

  return (
    <>
      {/* Trainers Banner */}
      <section className="trainers-banner">
        <div className="trainers-banner-content">
          <h1>
            Our <span>Trainers</span>
          </h1>

          <p>
            <a href="/">Home</a> / <span>Trainers</span>
          </p>
        </div>
      </section>

      {/* Trainers Section */}
      <section className="trainers-page">
        <div className="trainers-heading">
          <span className="section-label">OUR PROFESSIONAL TEAM</span>

          <h2>
            Meet Our <span>Expert Trainers</span>
          </h2>

          <p>
            Our experienced fitness professionals are here to guide,
            motivate, and support you throughout your fitness journey.
          </p>
        </div>

        <div className="trainers-page-container">
          {trainers.map((trainer) => (
            <div className="trainer-profile-card" key={trainer.id}>
              <div className="trainer-profile-image">
                <img src={trainer.image} alt={trainer.name} />
              </div>

              <div className="trainer-profile-content">
                <span className="trainer-role">{trainer.role}</span>

                <h3>{trainer.name}</h3>

                <div className="trainer-experience">
                  <FaAward />
                  <span>{trainer.experience}</span>
                </div>

                <div className="trainer-specialization">
                  <div className="specialization-icon">
                    {trainer.icon}
                  </div>

                  <div>
                    <h4>Specialization</h4>
                    <p>{trainer.specialization}</p>
                  </div>
                </div>

                <p className="trainer-description">
                  {trainer.description}
                </p>

                <a href="/contact" className="trainer-contact-btn">
                  Join With Trainer
                </a>
              </div>
            </div>
          ))}
        </div>
      </section>

      <Footer />
    </>
  );
}

export default Trainers;