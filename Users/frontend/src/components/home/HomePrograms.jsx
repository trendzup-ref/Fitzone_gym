import {
  FaDumbbell,
  FaRunning,
  FaSpa,
  FaMusic,
  FaArrowRight,
} from "react-icons/fa";

import style from "./HomeProgram.module.css";
    
function HomePrograms() {
  const programs = [
    {
      icon: <FaDumbbell />,
      title: "Strength Training",
      description:
        "Build muscle, increase strength and improve your overall fitness with professional equipment.",
    },
    {
      icon: <FaRunning />,
      title: "Cardio Training",
      description:
        "Improve your stamina, heart health and endurance with effective cardio workouts.",
    },
    {
      icon: <FaSpa />,
      title: "Yoga",
      description:
        "Improve flexibility, balance and mental wellness through guided yoga sessions.",
    },
    {
      icon: <FaMusic />,
      title: "Zumba",
      description:
        "Enjoy energetic dance workouts that help you stay active and burn calories.",
    },
  ];

  return (
    <section className={style.programsSection}>
      <div className={style.programsHeading}>
        <div className={style.sectionLabel}>
          <span></span>
          OUR PROGRAM
          <span></span>
        </div>

        <h2>
          Choose Your <span>Fitness Program</span>
        </h2>

        <p>
          Find the right workout program and start your journey
          towards a healthier and stronger lifestyle.
        </p>
      </div>

      <div className={style.programsContainer}>
        {programs.map((program, index) => (
          <div className={style.programCard} key={index}>
            <div className={style.programIcon}>
              {program.icon}
            </div>

            <h3>{program.title}</h3>

            <p>{program.description}</p>

            <button className={style.programLink}>
              Learn More <FaArrowRight />
            </button>
          </div>
        ))}
      </div>
    </section>
  );
}

export default HomePrograms;