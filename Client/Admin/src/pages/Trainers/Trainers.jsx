import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import {
  FaUsers,
  FaUserCheck,
  FaUserTimes,
  FaPlus,
  FaSearch,
  FaEye,
  FaEdit,
  FaTrash,
} from "react-icons/fa";

import { AdminContext } from "../../context/AdminContext";
import styles from "./Trainers.module.css";

const Trainers = () => {
  const navigate = useNavigate();

  const { getTrainers, deleteTrainer } = useContext(AdminContext);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  const [trainers, setTrainers] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch Trainers
  const fetchTrainers = async () => {
    try {
      setLoading(true);

      const response = await getTrainers();

      if (response.success) {
        setTrainers(response.trainers || []);
      }
    } catch (error) {
      console.error("Fetch Trainers Error:", error);
      toast.error(error.message || "Failed to fetch trainers");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTrainers();
  }, []);

  // Search and Filter
  const filteredTrainers = trainers.filter((trainer) => {
    const searchMatch =
      trainer.name.toLowerCase().includes(search.toLowerCase()) ||
      trainer.email.toLowerCase().includes(search.toLowerCase());

    const statusMatch =
      statusFilter === "All" || trainer.status === statusFilter;

    return searchMatch && statusMatch;
  });

  // Statistics
  const totalTrainers = trainers.length;

  const activeTrainers = trainers.filter(
    (trainer) => trainer.status === "Active"
  ).length;

  const inactiveTrainers = trainers.filter(
    (trainer) => trainer.status === "Inactive"
  ).length;

  // Delete Trainer
  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this trainer?"
    );

    if (!confirmDelete) return;

    try {
      const response = await deleteTrainer(id);

      if (response.success) {
        setTrainers((prev) =>
          prev.filter((trainer) => trainer._id !== id)
        );

        toast.success("Trainer deleted successfully");
      }
    } catch (error) {
      console.error("Delete Trainer Error:", error);
       toast.error(error.message || "Failed to delete trainer");
    }
  };

  // Format Date
  const formatDate = (date) => {
    if (!date) return "-";

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
          <h1>Trainer Management</h1>
          <p>Manage your gym trainers and their information.</p>
        </div>

        <button
          className={styles.addButton}
          onClick={() => navigate("/admin/trainers/add")}
        >
          <FaPlus /> Add New Trainer
        </button>
      </div>

      {/* Statistics */}
      <div className={styles.statsGrid}>
        <div className={styles.statCard}>
          <div className={`${styles.statIcon} ${styles.purple}`}>
            <FaUsers />
          </div>

          <div>
            <p>Total Trainers</p>
            <h2>{totalTrainers}</h2>
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={`${styles.statIcon} ${styles.green}`}>
            <FaUserCheck />
          </div>

          <div>
            <p>Active Trainers</p>
            <h2>{activeTrainers}</h2>
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={`${styles.statIcon} ${styles.red}`}>
            <FaUserTimes />
          </div>

          <div>
            <p>Inactive Trainers</p>
            <h2>{inactiveTrainers}</h2>
          </div>
        </div>
      </div>

      {/* Trainer Table */}
      <div className={styles.tableCard}>
        <div className={styles.tableHeader}>
          <h3>All Trainers</h3>

          <div className={styles.filters}>
            <div className={styles.searchBox}>
              <FaSearch />

              <input
                type="text"
                placeholder="Search trainer..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="All">All Status</option>
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>
          </div>
        </div>

        <div className={styles.tableWrapper}>
          <table>
            <thead>
              <tr>
                <th>Trainer</th>
                <th>Phone</th>
                <th>Role</th>
                <th>Salary</th>
                <th>Joining Date</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="7" className={styles.emptyState}>
                    Loading trainers...
                  </td>
                </tr>
              ) : filteredTrainers.length > 0 ? (
                filteredTrainers.map((trainer) => (
                  <tr key={trainer._id}>
                    <td>
                      <div className={styles.trainerInfo}>
                        <div className={styles.avatar}>
                          {trainer.image ? (
                            <img
                              src={trainer.image}
                              alt={trainer.name}
                            />
                          ) : (
                            trainer.name.charAt(0)
                          )}
                        </div>

                        <div>
                          <strong>{trainer.name}</strong>
                          <span>{trainer.email}</span>
                        </div>
                      </div>
                    </td>

                    <td>{trainer.phone}</td>

                    <td>{trainer.role}</td>

                    <td>
                      ₹{Number(trainer.salary).toLocaleString("en-IN")}
                    </td>

                    <td>{formatDate(trainer.joinDate)}</td>

                    <td>
                      <span
                        className={`${styles.status} ${
                          trainer.status === "Active"
                            ? styles.active
                            : styles.inactive
                        }`}
                      >
                        {trainer.status}
                      </span>
                    </td>

                    <td>
                      <div className={styles.actions}>
                        <button
                          className={styles.view}
                          title="View"
                          onClick={() =>
                            navigate(`/admin/trainers/${trainer._id}`)
                          }
                        >
                          <FaEye />
                        </button>

                        <button
                          className={styles.edit}
                          title="Edit"
                          onClick={() =>
                            navigate(
                              `/admin/trainers/edit/${trainer._id}`
                            )
                          }
                        >
                          <FaEdit />
                        </button>

                        <button
                          className={styles.delete}
                          title="Delete"
                          onClick={() => handleDelete(trainer._id)}
                        >
                          <FaTrash />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className={styles.emptyState}>
                    No trainers found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className={styles.tableFooter}>
          Showing {filteredTrainers.length} of {totalTrainers} trainers
        </div>
      </div>
    </div>
  );
};

export default Trainers;