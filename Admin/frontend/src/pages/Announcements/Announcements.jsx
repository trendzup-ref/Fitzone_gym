import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

import {
  FaBullhorn,
  FaCheckCircle,
  FaFileAlt,
  FaPlus,
  FaSearch,
  FaEdit,
  FaTrash,
  FaTimes,
  FaArrowLeft,
} from "react-icons/fa";

import styles from "./Announcements.module.css";

const API_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:4000/api";

const initialForm = {
  title: "",
  description: "",
  category: "Important",
  status: "Published",
  expiryDate: "",
};

const Announcements = () => {
  const [announcements, setAnnouncements] = useState([]);

  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  const [showModal, setShowModal] = useState(false);
  const [editId, setEditId] = useState(null);

  const [formData, setFormData] = useState(initialForm);

  const navigate = useNavigate();

  // Fetch Announcements
  const fetchAnnouncements = async () => {
    try {
      setLoading(true);

      const response = await fetch(
        `${API_URL}/announcements/list`,
        {
          method: "GET",
          credentials: "include",
        }
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || "Failed to fetch announcements");
      }

      setAnnouncements(data.announcements || []);
    } catch (error) {
      console.error("Fetch Announcements Error:", error);
      toast.error(error.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  // Statistics
  const totalAnnouncements = announcements.length;

  const publishedAnnouncements = announcements.filter(
    (item) => item.status === "Published"
  ).length;

  const draftAnnouncements = announcements.filter(
    (item) => item.status === "Draft"
  ).length;

  // Search and Filter
  const filteredAnnouncements = announcements.filter((item) => {
    const searchValue = search.toLowerCase();

    const matchesSearch =
      item.title?.toLowerCase().includes(searchValue) ||
      item.description?.toLowerCase().includes(searchValue);

    const matchesCategory =
      categoryFilter === "All" ||
      item.category === categoryFilter;

    return matchesSearch && matchesCategory;
  });

  // Open Add Modal
  const handleAdd = () => {
    setEditId(null);
    setFormData(initialForm);
    setShowModal(true);
  };

  // Open Edit Modal
  const handleEdit = (announcement) => {
    setEditId(announcement._id);

    setFormData({
      title: announcement.title || "",
      description: announcement.description || "",
      category: announcement.category || "Important",
      status: announcement.status || "Published",
      expiryDate: announcement.expiryDate
        ? new Date(announcement.expiryDate)
            .toISOString()
            .split("T")[0]
        : "",
    });

    setShowModal(true);
  };

  // Handle Input
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Create / Update Announcement
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.title.trim() || !formData.description.trim()) {
      return toast.error("Please fill all required fields");
    }

    try {
      setSaving(true);

      const url = editId
        ? `${API_URL}/announcements/${editId}`
        : `${API_URL}/announcements/create`;

      const response = await fetch(url, {
        method: editId ? "PUT" : "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          expiryDate: formData.expiryDate || null,
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || "Operation failed");
      }

      toast.success(
        editId
          ? "Announcement updated successfully!"
          : "Announcement created successfully!"
      );

      setShowModal(false);
      setFormData(initialForm);
      setEditId(null);

      fetchAnnouncements();
    } catch (error) {
      console.error("Save Announcement Error:", error);
      toast.error(error.message || "Something went wrong");
    } finally {
      setSaving(false);
    }
  };

  // Delete Announcement
  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this announcement?"
    );

    if (!confirmDelete) return;

    try {
      setDeletingId(id);

      const response = await fetch(
        `${API_URL}/announcements/${id}`,
        {
          method: "DELETE",
          credentials: "include",
        }
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || "Failed to delete announcement");
      }

      setAnnouncements((prev) =>
        prev.filter((item) => item._id !== id)
      );

      toast.success("Announcement deleted successfully!");
    } catch (error) {
      console.error("Delete Announcement Error:", error);
      toast.error(error.message || "Something went wrong");
    } finally {
      setDeletingId(null);
    }
  };

  // Format Date
  const formatDate = (date) => {
    if (!date) return "N/A";

    return new Date(date).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <div className={styles.container}>

      {/* Page Header */}
      <div className={styles.pageHeader}>
  <div>
    <h1>Announcements Management</h1>
    <p>Manage gym news, offers and important updates.</p>
  </div>

  <div className={styles.headerActions}>
    {/* <button
      className={styles.backButton}
      onClick={() => navigate(-1)}
    >
      <FaArrowLeft />
      Back
    </button> */}

    <button
      className={styles.addButton}
      onClick={handleAdd}
    >
      <FaPlus />
      Add Announcement
    </button>
  </div>
</div>

      {/* Statistics */}
      <div className={styles.statsGrid}>

        <div className={styles.statCard}>
          <div className={`${styles.statIcon} ${styles.purple}`}>
            <FaBullhorn />
          </div>

          <div>
            <p>Total Announcements</p>
            <h2>{totalAnnouncements}</h2>
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={`${styles.statIcon} ${styles.green}`}>
            <FaCheckCircle />
          </div>

          <div>
            <p>Published</p>
            <h2>{publishedAnnouncements}</h2>
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={`${styles.statIcon} ${styles.red}`}>
            <FaFileAlt />
          </div>

          <div>
            <p>Draft Announcements</p>
            <h2>{draftAnnouncements}</h2>
          </div>
        </div>

      </div>

      {/* Search and Filter */}
      <div className={styles.toolbar}>

        <div className={styles.searchBox}>
          <FaSearch />

          <input
            type="text"
            placeholder="Search announcements..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <select
          className={styles.filter}
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
        >
          <option value="All">All Categories</option>
          <option value="Important">Important</option>
          <option value="Offer">Offer</option>
          <option value="Event">Event</option>
        </select>

      </div>

      {/* Announcements Table */}
      <div className={styles.tableContainer}>

        <div className={styles.tableHeader}>
          <div>
            <h2>All Announcements</h2>
            <p>{filteredAnnouncements.length} announcements found</p>
          </div>
        </div>

        <div className={styles.tableWrapper}>

          <table className={styles.table}>

            <thead>
              <tr>
                <th>Title</th>
                <th>Category</th>
                <th>Published Date</th>
                <th>Expiry Date</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>

              {loading ? (
                <tr>
                  <td colSpan="6" className={styles.noData}>
                    Loading announcements...
                  </td>
                </tr>
              ) : filteredAnnouncements.length > 0 ? (

                filteredAnnouncements.map((item) => (
                  <tr key={item._id}>

                    <td>
                      <div className={styles.memberInfo}>
                        <div className={styles.avatar}>
                          <FaBullhorn />
                        </div>

                        <div>
                          <h4>{item.title}</h4>
                          <span>
                            {item.description?.slice(0, 35)}
                            {item.description?.length > 35 ? "..." : ""}
                          </span>
                        </div>
                      </div>
                    </td>

                    <td>{item.category}</td>

                    <td>{formatDate(item.publishedAt)}</td>

                    <td>{formatDate(item.expiryDate)}</td>

                    <td>
                      <span
                        className={`${styles.status} ${
                          item.status === "Published"
                            ? styles.active
                            : styles.pending
                        }`}
                      >
                        {item.status}
                      </span>
                    </td>

                    <td>
                      <div className={styles.actions}>

                        <button
                          className={styles.editAction}
                          onClick={() => handleEdit(item)}
                          title="Edit Announcement"
                        >
                          <FaEdit />
                        </button>

                        <button
                          className={styles.deleteAction}
                          onClick={() => handleDelete(item._id)}
                          disabled={deletingId === item._id}
                          title="Delete Announcement"
                        >
                          <FaTrash />
                        </button>

                      </div>
                    </td>

                  </tr>
                ))

              ) : (

                <tr>
                  <td colSpan="6" className={styles.noData}>
                    No announcements found.
                  </td>
                </tr>

              )}

            </tbody>

          </table>

        </div>
      </div>

      {/* Add / Edit Modal */}
      {showModal && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal}>

            <div className={styles.modalHeader}>
              <h2>
                {editId ? "Edit Announcement" : "Add Announcement"}
              </h2>

              <button
                type="button"
                onClick={() => setShowModal(false)}
              >
                <FaTimes />
              </button>
            </div>

            <form onSubmit={handleSubmit}>

              <div className={styles.formGroup}>
                <label>Announcement Title *</label>

                <input
                  type="text"
                  name="title"
                  placeholder="Enter announcement title"
                  value={formData.title}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className={styles.formGroup}>
                <label>Description *</label>

                <textarea
                  name="description"
                  placeholder="Enter announcement details"
                  value={formData.description}
                  onChange={handleChange}
                  rows="5"
                  required
                />
              </div>

              <div className={styles.formGrid}>

                <div className={styles.formGroup}>
                  <label>Category</label>

                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                  >
                    <option value="Important">Important</option>
                    <option value="Offer">Offer</option>
                    <option value="Event">Event</option>
                  </select>
                </div>

                <div className={styles.formGroup}>
                  <label>Status</label>

                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleChange}
                  >
                    <option value="Published">Published</option>
                    <option value="Draft">Draft</option>
                  </select>
                </div>

              </div>

              <div className={styles.formGroup}>
                <label>Expiry Date (Optional)</label>

                <input
                  type="date"
                  name="expiryDate"
                  value={formData.expiryDate}
                  onChange={handleChange}
                />
              </div>

              <div className={styles.modalActions}>
                <button
                  type="button"
                  className={styles.cancelButton}
                  onClick={() => setShowModal(false)}
                  disabled={saving}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className={styles.saveButton}
                  disabled={saving}
                >
                  {saving
                    ? "Saving..."
                    : editId
                    ? "Update Announcement"
                    : "Create Announcement"}
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

    </div>
  );
};

export default Announcements;