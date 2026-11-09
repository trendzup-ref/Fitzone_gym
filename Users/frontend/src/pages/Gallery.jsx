import { useState } from "react";
import style from "./Gallery.module.css";
import { assest } from "../assets/assests";
import Footer from "../components/home/Footer";

const galleryImages = [
  {
    id: 1,
    title: "Modern Gym Interior",
    category: "Interior",
    image: `${assest.gym1}`,
  },
  {
    id: 2,
    title: "Strength Training Area",
    category: "Interior",
    image: `${assest.gym2}`,
  },
  {
    id: 3,
    title: "Dumbbell Collection",
    category: "Equipment",
    image: `${assest.gym3}`,
  },
  {
    id: 4,
    title: "Cardio Equipment",
    category: "Equipment",
    image: `${assest.gym4}`,
  },
  {
    id: 5,
    title: "Personal Training",
    category: "Training",
    image: `${assest.gym5}`,
  },
  {
    id: 6,
    title: "Strength Workout",
    category: "Training",
    image: `${assest.gym6}`,
  },
  {
    id: 7,
    title: "Gym Machines",
    category: "Equipment",
    image:`${assest.gym7}`,
  },
  {
    id: 8,
    title: "Group Fitness Session",
    category: "Training",
    image: `${assest.gym8}`,
  },
];

const categories = ["All", "Interior", "Equipment", "Training"];

function Gallery() {
  const [activeCategory, setActiveCategory] = useState("All");

  const filteredImages =
    activeCategory === "All"
      ? galleryImages
      : galleryImages.filter(
          (item) => item.category === activeCategory
        );

  return (
    <>
      {/* Gallery Banner */}
      <section className={style.galleryBanner}>
        <div className={style.bannerContent}>
          <h1>
            Our <span>Gallery</span>
          </h1>

          <p>
            <a href="/">Home</a> / <span>Gallery</span>
          </p>
        </div>
      </section>

      {/* Gallery Section */}
      <section className={style.gallerySection}>
        <div className={style.galleryHeading}>
          <span className={style.sectionLabel}>
            OUR FITNESS WORLD
          </span>

          <h2>
            Explore Our <span>Gallery</span>
          </h2>

          <p>
            Take a look inside Fitzone Gym. Explore our modern
            facilities, advanced equipment, and energetic training
            environment.
          </p>
        </div>

        {/* Category Filters */}
        <div className={style.galleryFilters}>
          {categories.map((category) => (
            <button
              key={category}
              className={
                activeCategory === category
                  ? style.activeFilter
                  : style.filterButton
              }
              onClick={() => setActiveCategory(category)}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Gallery Grid */}
        <div className={style.galleryGrid}>
          {filteredImages.map((item) => (
            <div className={style.galleryCard} key={item.id}>
              <img src={item.image} alt={item.title} />

              <div className={style.imageOverlay}>
                <span>{item.category}</span>
                <h3>{item.title}</h3>
              </div>
            </div>
          ))}
        </div>
      </section>

      <Footer /> 
    </>
  );
}

export default Gallery;