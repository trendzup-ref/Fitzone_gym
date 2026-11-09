import {
  FaDumbbell,
  FaRunning,
  FaSpa,
  FaMusic,
} from "react-icons/fa";

import "./Programs.css";
import Footer from "../components/home/Footer";

function Programs() {
  const programs = [
    {
      icon: <FaDumbbell />,
      title: "Strength Training",
      description:
        "Build strength, increase muscle mass, and improve overall body power with structured strength workouts.",
      benefits: "Muscle Building • Strength • Fitness",
    },
    {
      icon: <FaRunning />,
      title: "Cardio Training",
      description:
        "Improve stamina, burn calories, and keep your heart healthy with effective cardio workouts.",
      benefits: "Fat Loss • Stamina • Heart Health",
    },
    {
      icon: <FaSpa />,
      title: "Yoga",
      description:
        "Improve flexibility, balance, posture, and mental relaxation with guided yoga sessions.",
      benefits: "Flexibility • Balance • Relaxation",
    },
    {
      icon: <FaMusic />,
      title: "Zumba",
      description:
        "Enjoy energetic dance-based workouts that help burn calories while keeping your fitness journey fun.",
      benefits: "Fat Burn • Energy • Fun Workout",
    },
  ];

  return (
    <>
      {/* Programs Banner */}
      <section className="programs-banner">
        <div className="programs-banner-content">
          <h1>
            Our <span>Programs</span>
          </h1>

          <p>
            <a href="/">Home</a> / <span>Programs</span>
          </p>
        </div>
      </section>

      {/* Fitness Programs */}
      <section className="fitness-programs">
        <div className="programs-heading">
          <span className="section-label">WHAT WE OFFER</span>

          <h2>
            Fitness <span>Programs</span>
          </h2>

          <p>
            Choose the right fitness program and take the next step
            towards a stronger, healthier, and more confident you.
          </p>
        </div>

        <div className="programs-container">
          {programs.map((program, index) => (
            <div className="program-card" key={index}>
              <div className="program-icon">
                {program.icon}
              </div>

              <h3>{program.title}</h3>

              <p>{program.description}</p>

              <div className="program-benefits">
                {program.benefits}
              </div>

              <a href="/contact" className="program-btn">
                Join Now
              </a>
            </div>
          ))}
        </div>
      </section>

      <Footer /> 
    </>
  );
}

export default Programs;