import {
  FaDumbbell,
  FaLock,
  FaShower,
  FaSnowflake,
  FaCar,
  FaWifi,
} from "react-icons/fa";

import "./Facilities.css";

function Facilities() {

  const facilities = [
    {
      icon: <FaDumbbell />,
      title: "Modern Equipment",
      description: "Train with advanced fitness equipment."
    },
    {
      icon: <FaLock />,
      title: "Locker Room",
      description: "Secure lockers for your personal belongings."
    },
    {
      icon: <FaShower />,
      title: "Shower Facility",
      description: "Freshen up after your workout."
    },
    {
      icon: <FaSnowflake />,
      title: "AC Gym",
      description: "Enjoy comfortable indoor workouts."
    },
    {
      icon: <FaCar />,
      title: "Parking Area",
      description: "Convenient parking for our members."
    },
    {
      icon: <FaWifi />,
      title: "Free Wi-Fi",
      description: "Stay connected during your workout."
    },
  ];

  return (
    <section className="facilities-section">

      <div className="facilities-heading">

        <div className="section-label">
          <span></span>
          OUR FACILITIES
          <span></span>
        </div>

        <h2>World-Class Gym Facilities</h2>

        <p>
          We provide a suitable environment with modern
          equipment for your fitness journey.
        </p>

      </div>

      <div className="facilities-container">

        {facilities.map((facility, index) => (

          <div className="facility-card" key={index}>

            <div className="facility-icon">
              {facility.icon}
            </div>

            <h3>{facility.title}</h3>

            <p>{facility.description}</p>

          </div>

        ))}

      </div>

    </section>
  );
}

export default Facilities;