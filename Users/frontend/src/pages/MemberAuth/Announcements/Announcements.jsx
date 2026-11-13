import { useState, useEffect } from "react";

import {
  FaBullhorn,
  FaCalendarAlt,
  FaArrowRight,
  FaSearch,
} from "react-icons/fa";

import { toast } from "react-toastify";

import styles from "./Announcements.module.css";

const API_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:4000/api";

const Announcements = () => {
  const [announcements, setAnnouncements] = useState([]);

  const [activeFilter, setActiveFilter] = useState("All");
  const [search, setSearch] = useState("");

  const [loading, setLoading] = useState(true);

  const filters = ["All", "Important", "Offer", "Event"];

  // Fetch Published Announcements
  const fetchAnnouncements = async () => {
    try {
      setLoading(true);

      const response = await fetch(
        `${API_URL}/announcements/published`,
        {
          method: "GET",
          credentials: "include",
        }
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(
          data.message || "Failed to fetch announcements"
        );
      }

      setAnnouncements(data.announcements || []);
    } catch (error) {
      console.error("Announcement Error:", error);

      toast.error(
        error.message || "Unable to load announcements"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  // Search and Category Filter
  const filteredAnnouncements = announcements.filter((item) => {
    const matchesCategory =
      activeFilter === "All" ||
      item.category === activeFilter;

    const matchesSearch =
      item.title?.toLowerCase().includes(search.toLowerCase()) ||
      item.description?.toLowerCase().includes(search.toLowerCase());

    return matchesCategory && matchesSearch;
  });

  // Format Date
  const formatDate = (date) => {
    if (!date) return "Date unavailable";

    return new Date(date).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <div className={styles.announcementPage}>

      {/* Header */}
      <div className={styles.header}>
        <div>
          <span className={styles.subHeading}>
            STAY UPDATED
          </span>

          <h1>
            Gym <span>Announcements</span>
          </h1>

          <p>
            Stay informed about the latest news and updates from Fitzone Gym.
          </p>
        </div>

        <div className={styles.headerIcon}>
          <FaBullhorn />
        </div>
      </div>

      {/* Toolbar */}
      <div className={styles.toolbar}>

        <div className={styles.filters}>
          {filters.map((filter) => (
            <button
              key={filter}
              className={
                activeFilter === filter
                  ? styles.activeFilter
                  : styles.filterButton
              }
              onClick={() => setActiveFilter(filter)}
            >
              {filter}
            </button>
          ))}
        </div>

        <div className={styles.searchBox}>
          <FaSearch />

          <input
            type="text"
            placeholder="Search announcements..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

      </div>

      {/* Announcement List */}
      <div className={styles.announcementList}>

        {loading ? (

          <div className={styles.emptyState}>
            <p>Loading announcements...</p>
          </div>

        ) : filteredAnnouncements.length > 0 ? (

          filteredAnnouncements.map((item) => (
            <div
              className={styles.announcementCard}
              key={item._id}
            >

              <div className={styles.cardTop}>

                <span className={styles.category}>
                  {item.category}
                </span>

                <span className={styles.date}>
                  <FaCalendarAlt />
                  {formatDate(item.publishedAt)}
                </span>

              </div>

              <h2>{item.title}</h2>

              <p>{item.description}</p>

              <button
                type="button"
                className={styles.readMore}
                onClick={() => {
                  toast.info(item.description);
                }}
              >
                Read More <FaArrowRight />
              </button>

            </div>
          ))

        ) : (

          <div className={styles.emptyState}>
            <FaBullhorn />

            <h3>No Announcements Found</h3>

            <p>
              There are no announcements matching your search.
            </p>
          </div>

        )}

      </div>

    </div>
  );
};

export default Announcements;