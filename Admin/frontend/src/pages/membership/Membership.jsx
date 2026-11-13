import { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import {
  FaIdCard,
  FaCheckCircle,
  FaTimesCircle,
  FaPlus,
  FaSearch,
  FaEdit,
  FaTrash,
} from "react-icons/fa";

import { AdminContext } from "../../context/AdminContext";
import styles from "./Membership.module.css";

const Membership = () => {
  const navigate = useNavigate();

  const { getMemberships, deleteMembership } = useContext(AdminContext);

  const [memberships, setMemberships] = useState([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Fetch Memberships
  const fetchMemberships = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await getMemberships();

      if (response.success) {
        setMemberships(response.membership || response.memberships || []);
      } else {
        setError(response.message || "Failed to fetch memberships.");
      }
    } catch (error) {
      setError(error.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  // Load memberships when page opens
  useEffect(() => {
    fetchMemberships();
  }, []);

  // Search and Filter
  const filteredMemberships = memberships.filter((membership) => {
    const searchMatch = membership.name
      .toLowerCase()
      .includes(search.toLowerCase());

    const statusMatch =
      statusFilter === "All" ||
      membership.status === statusFilter;

    return searchMatch && statusMatch;
  });

  // Statistics
  const totalMemberships = memberships.length;

  const activeMemberships = memberships.filter(
    (membership) => membership.status === "Active"
  ).length;

  const inactiveMemberships = memberships.filter(
    (membership) => membership.status === "Inactive"
  ).length;

  // Delete Membership
  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this membership?"
    );

    if (!confirmDelete) return;

    try {
      const response = await deleteMembership(id);

      if (response.success) {
        setMemberships((prev) =>
          prev.filter((membership) => membership._id !== id)
        );

        toast.success("Membership deleted successfully!");
      } else {
        toast.error(response.message || "Failed to delete membership.");
      }
    } catch (error) {
      toast.error(error.message || "Something went wrong.");
    }
  };

  return (
    <div className={styles.container}>

      {/* Page Header */}

      <div className={styles.pageHeader}>
        <div>
          <h1>Membership Management</h1>
          <p>Manage your gym membership plans and pricing.</p>
        </div>

        <button
          className={styles.addButton}
          onClick={() => navigate("/admin/membership/add")}
        >
          <FaPlus /> Add New Membership
        </button>
      </div>

      {/* Statistics */}

      <div className={styles.statsGrid}>

        <div className={styles.statCard}>
          <div className={`${styles.statIcon} ${styles.purple}`}>
            <FaIdCard />
          </div>

          <div>
            <p>Total Memberships</p>
            <h2>{totalMemberships}</h2>
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={`${styles.statIcon} ${styles.green}`}>
            <FaCheckCircle />
          </div>

          <div>
            <p>Active Memberships</p>
            <h2>{activeMemberships}</h2>
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={`${styles.statIcon} ${styles.red}`}>
            <FaTimesCircle />
          </div>

          <div>
            <p>Inactive Memberships</p>
            <h2>{inactiveMemberships}</h2>
          </div>
        </div>

      </div>

      {/* Membership Table */}

      <div className={styles.tableCard}>

        <div className={styles.tableHeader}>
          <h3>All Membership Plans</h3>

          <div className={styles.filters}>

            <div className={styles.searchBox}>
              <FaSearch />

              <input
                type="text"
                placeholder="Search membership..."
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
                <th>Membership Plan</th>
                <th>Duration</th>
                <th>Price</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>

              {loading ? (
                <tr>
                  <td colSpan="5" className={styles.emptyState}>
                    Loading memberships...
                  </td>
                </tr>
              ) : error ? (
                <tr>
                  <td colSpan="5" className={styles.emptyState}>
                    {error}
                  </td>
                </tr>
              ) : filteredMemberships.length > 0 ? (
                filteredMemberships.map((membership) => (

                  <tr key={membership._id}>

                    <td>
                      <div className={styles.membershipInfo}>
                        <div className={styles.avatar}>
                          <FaIdCard />
                        </div>

                        <strong>{membership.name}</strong>
                      </div>
                    </td>

                    <td>
                      {membership.month}{" "}
                      {membership.month === 1 ? "Month" : "Months"}
                    </td>

                    <td>
                      ₹{Number(membership.price).toLocaleString("en-IN")}
                    </td>

                    <td>
                      <span
                        className={`${styles.status} ${
                          membership.status === "Active"
                            ? styles.active
                            : styles.inactive
                        }`}
                      >
                        {membership.status}
                      </span>
                    </td>

                    <td>
                      <div className={styles.actions}>

                        <button
                          className={styles.edit}
                          title="Edit Membership"
                          onClick={() =>
                            navigate(
                              `/admin/membership/edit/${membership._id}`
                            )
                          }
                        >
                          <FaEdit />
                        </button>

                        <button
                          className={styles.delete}
                          title="Delete Membership"
                          onClick={() => handleDelete(membership._id)}
                        >
                          <FaTrash />
                        </button>

                      </div>
                    </td>

                  </tr>

                ))
              ) : (

                <tr>
                  <td colSpan="5" className={styles.emptyState}>
                    No memberships found.
                  </td>
                </tr>

              )}

            </tbody>

          </table>

        </div>

        <div className={styles.tableFooter}>
          Showing {filteredMemberships.length} of {totalMemberships} memberships
        </div>

      </div>

    </div>
  );
};

export default Membership;