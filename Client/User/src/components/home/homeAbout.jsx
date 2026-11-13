import { FaCheckCircle } from "react-icons/fa";
import "./homeAbout.css";
import { assest } from "../../assets/assests";

function About() {
const features = [
"Certified and experienced trainers",
"Modern gym equipment",
"Personalized workout plans",
"Friendly and motivating environment",
];

return (
     <section className="about-section"> 
     <div className="about-container">
         <div className="about-image"> 
            <img src={assest.abouthomeImg} alt="FitZone Gym" /> 
            <div className="about-experience">
                 <h2>5+</h2> 
                 <p>Years of Experience</p> 
                 </div> 
                 </div>


    <div className="about-content">
      <span className="about-label">ABOUT FITZONE</span>

      <h2>
        We Help You Build Your <span>Best Body</span>
      </h2>

      <p className="about-description">
        At FitZone Gym, we believe fitness is not just about looking
        good; it's about feeling stronger, healthier and more confident.
        Our goal is to help every member achieve their fitness goals.
      </p>

      <div className="about-features">
        {features.map((feature, index) => (
          <div className="about-feature" key={index}>
            <FaCheckCircle />
            <span>{feature}</span>
          </div>
        ))}
      </div>

      <a href="/contact" className="about-button">
        Join Our Gym
      </a>
    </div>
  </div>
</section>


);
}

export default About;
