import { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import {
  FaSearch,
  FaEye,
  FaTrash,
  FaEnvelope,
  FaPhone,
  FaClock,
  FaCheckCircle,
  FaUsers,
} from "react-icons/fa";

import { AdminContext } from "../../context/AdminContext";
import styles from "./Inquiries.module.css";

const Inquiries = () => {
  const navigate = useNavigate();

  const {
    getInquiries,
    updateInquiry,
    deleteInquiry,
  } = useContext(AdminContext);

  const [inquiries, setInquiries] = useState([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [updatingId, setUpdatingId] = useState(null);
  const [deletingId, setDeletingId] = useState(null);

  // Fetch Inquiries
  const fetchInquiries = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await getInquiries();

      if (response.success) {
        setInquiries(response.inquiries || []);
      } else {
        setError(response.message || "Failed to fetch inquiries.");
      }
    } catch (error) {
      console.error("Fetch Inquiry Error:", error);
      setError(error.message || "Failed to fetch inquiries.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInquiries();
    // Fetch once when the page mounts.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Statistics
  const totalInquiries = inquiries.length;

  const pendingInquiries = inquiries.filter(
    (item) => item.status === "Pending"
  ).length;

  const contactedInquiries = inquiries.filter(
    (item) => item.status === "Contacted"
  ).length;

  const resolvedInquiries = inquiries.filter(
    (item) => item.status === "Resolved"
  ).length;

  // Search and Filter
  const filteredInquiries = inquiries.filter((item) => {
    const searchValue = search.toLowerCase().trim();

    const matchesSearch =
      (item.name || "").toLowerCase().includes(searchValue) ||
      (item.email || "").toLowerCase().includes(searchValue) ||
      (item.phone || "").includes(searchValue) ||
      (item.subject || "").toLowerCase().includes(searchValue);

    const matchesStatus =
      statusFilter === "All" || item.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  // Update Inquiry Status
  const handleStatusChange = async (id, newStatus) => {
    try {
      setUpdatingId(id);

      const response = await updateInquiry(id, {
        status: newStatus,
      });

      if (response.success) {
        setInquiries((prev) =>
          prev.map((item) =>
            item._id === id
              ? { ...item, status: newStatus }
              : item
          )
        );

        toast.success("Inquiry status updated successfully!");
      } else {
        toast.error(
          response.message || "Failed to update inquiry status."
        );
      }
    } catch (error) {
      console.error("Update Inquiry Error:", error);

      toast.error(
        error.message || "Failed to update inquiry status."
      );
    } finally {
      setUpdatingId(null);
    }
  };

  // Delete Inquiry
  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this inquiry?"
    );

    if (!confirmDelete) return;

    try {
      setDeletingId(id);

      const response = await deleteInquiry(id);

      if (response.success) {
        setInquiries((prev) =>
          prev.filter((item) => item._id !== id)
        );

        toast.success("Inquiry deleted successfully!");
      } else {
        toast.error(
          response.message || "Failed to delete inquiry."
        );
      }
    } catch (error) {
      console.error("Delete Inquiry Error:", error);

      toast.error(
        error.message || "Failed to delete inquiry."
      );
    } finally {
      setDeletingId(null);
    }
  };

  // View Inquiry
  const handleView = (id) => {
    navigate(`/admin/inquiries/${id}`);
  };

  // Date Format
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
      {/* Header */}
      <div className={styles.header}>
        <div>
          <h2>Inquiries</h2>
          <p>Manage and track customer inquiries.</p>
        </div>
      </div>

      {/* Statistics */}
      <div className={styles.statsGrid}>
        <div className={styles.statCard}>
          <div className={`${styles.statIcon} ${styles.totalIcon}`}>
            <FaUsers />
          </div>

          <div>
            <p>Total Inquiries</p>
            <h3>{totalInquiries}</h3>
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={`${styles.statIcon} ${styles.pendingIcon}`}>
            <FaClock />
          </div>

          <div>
            <p>Pending</p>
            <h3>{pendingInquiries}</h3>
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={`${styles.statIcon} ${styles.contactedIcon}`}>
            <FaPhone />
          </div>

          <div>
            <p>Contacted</p>
            <h3>{contactedInquiries}</h3>
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={`${styles.statIcon} ${styles.resolvedIcon}`}>
            <FaCheckCircle />
          </div>

          <div>
            <p>Resolved</p>
            <h3>{resolvedInquiries}</h3>
          </div>
        </div>
      </div>

      {/* Inquiry Table */}
      <div className={styles.tableCard}>
        <div className={styles.tableHeader}>
          <div>
            <h3>All Inquiries</h3>
            <p>View and manage customer inquiries.</p>
          </div>

          <div className={styles.filters}>
            <div className={styles.searchBox}>
              <FaSearch />

              <input
                type="text"
                placeholder="Search name, email or phone..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="All">All Status</option>
              <option value="Pending">Pending</option>
              <option value="Contacted">Contacted</option>
              <option value="Resolved">Resolved</option>
            </select>
          </div>
        </div>

        {/* Table */}
        <div className={styles.tableWrapper}>
          <table>
            <thead>
              <tr>
                <th>Customer</th>
                <th>Contact</th>
                <th>Service</th>
                <th>Inquiry Date</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="6" className={styles.noData}>
                    Loading inquiries...
                  </td>
                </tr>
              ) : error ? (
                <tr>
                  <td colSpan="6" className={styles.noData}>
                    {error}
                  </td>
                </tr>
              ) : filteredInquiries.length > 0 ? (
                filteredInquiries.map((item) => (
                  <tr key={item._id}>
                    <td>
                      <div className={styles.customer}>
                        <div className={styles.avatar}>
                          {(item.name || "U").charAt(0).toUpperCase()}
                        </div>

                        <span>{item.name}</span>
                      </div>
                    </td>

                    <td>
                      <div className={styles.contact}>
                        <span>
                          <FaEnvelope />
                          {item.email}
                        </span>

                        <span>
                          <FaPhone />
                          {item.phone}
                        </span>
                      </div>
                    </td>

                    <td>{item.subject}</td>

                    <td>{formatDate(item.createdAt)}</td>

                    <td>
                      <select
                        className={`${styles.statusSelect} ${
                          styles[(item.status || "Pending").toLowerCase()]
                        }`}
                        value={item.status}
                        disabled={updatingId === item._id}
                        onChange={(e) =>
                          handleStatusChange(item._id, e.target.value)
                        }
                      >
                        <option value="Pending">Pending</option>
                        <option value="Contacted">Contacted</option>
                        <option value="Resolved">Resolved</option>
                      </select>
                    </td>

                    <td>
                      <div className={styles.actions}>
                        <button
                          className={styles.viewButton}
                          title="View Details"
                          onClick={() => handleView(item._id)}
                        >
                          <FaEye />
                        </button>

                        <button
                          className={styles.deleteButton}
                          title="Delete Inquiry"
                          disabled={deletingId === item._id}
                          onClick={() => handleDelete(item._id)}
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
                    No inquiries found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className={styles.tableFooter}>
          Showing {filteredInquiries.length} of {totalInquiries} inquiries
        </div>
      </div>
    </div>
  );
};

export default Inquiries;