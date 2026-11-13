import { assest } from "../../assets/assests";
import "./homeTrainers.css";

function Trainers() {
  const trainers = [
    {
      name: "Rahul Sharma",
      role: "Strength & Fitness Coach",
      experience: "5+ Years Experience",
      image: `${assest.men1}`,
    },
    {
      name: "Priya Singh",
      role: "Yoga & Zumba Instructor",
      experience: "4+ Years Experience",
      image: `${assest.women2}`,
    },
    {
      name: "Aman Verma",
      role: "Personal Fitness Trainer",
      experience: "6+ Years Experience",
      image: `${assest.men2}`,
    },
  ];

  return (
    <section className="trainers-section">
      <div className="trainers-heading">
        <span>OUR EXPERT TEAM</span>
        <h2>
          Meet Our <strong>Professional Trainers</strong>
        </h2>
        <p>
          Our experienced trainers are here to guide and motivate
          you throughout your fitness journey.
        </p>
      </div>

      <div className="trainers-container">
        {trainers.map((trainer, index) => (
          <div className="trainer-card" key={index}>
            <div className="trainer-image">
              <img src={trainer.image} alt={trainer.name} />
            </div>

            <div className="trainer-info">
              <h3>{trainer.name}</h3>
              <p className="trainer-role">{trainer.role}</p>
              <p className="trainer-experience">
                {trainer.experience}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export default Trainers;