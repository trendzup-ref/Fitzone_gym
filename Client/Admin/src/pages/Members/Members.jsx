import { useState, useEffect, useContext } from "react";
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
import styles from "./Members.module.css";

const Members = () => {
  const navigate = useNavigate();

  const { getMembers, deleteMember } = useContext(AdminContext);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [deletingId, setDeletingId] = useState(null);

  // Fetch Members
  const fetchMembers = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await getMembers();

      if (response.success) {
        setMembers(
          response.members ||
          response.member ||
          response.data ||
          []
        );
      } else {
        setError(response.message || "Failed to fetch members.");
      }
    } catch (error) {
      setError(error.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  // Fetch members when page loads
  useEffect(() => {
    fetchMembers();
  }, []);

  // Search and Filter
  const filteredMembers = members.filter((member) => {
    const searchValue = search.toLowerCase();

    const matchesSearch =
      member.name?.toLowerCase().includes(searchValue) ||
      member.email?.toLowerCase().includes(searchValue);

    const matchesStatus =
      statusFilter === "All" ||
      member.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  // Statistics
  const totalMembers = members.length;

  const activeMembers = members.filter(
    (member) => member.status === "Active"
  ).length;

  const expiredMembers = members.filter(
    (member) => member.status === "Expired"
  ).length;

  // Delete Member API
  const handleDelete = async (id) => {
    try {
      setDeletingId(id);

      const response = await deleteMember(id);

      if (response.success) {
        setMembers((prev) =>
          prev.filter((member) => member._id !== id)
        );

        toast.success("Member deleted successfully!");
      } else {
        toast.error(
          response.message || "Failed to delete member."
        );
      }
    } catch (error) {
      console.error("Delete Member Error:", error);

      toast.error(
        error.message || "Something went wrong."
      );
    } finally {
      setDeletingId(null);
    }
  };

  // Delete Confirmation Toast
  const confirmDelete = (id) => {
    toast(
      ({ closeToast }) => (
        <div>
          <p>Are you sure you want to delete this member?</p>

          <div style={{ display: "flex", gap: "10px" }}>
            <button
              onClick={() => {
                closeToast();
                handleDelete(id);
              }}
              style={{
                background: "#dc2626",
                color: "#fff",
                border: "none",
                padding: "7px 12px",
                borderRadius: "5px",
                cursor: "pointer",
              }}
            >
              Yes, Delete
            </button>

            <button
              onClick={closeToast}
              style={{
                background: "#6b7280",
                color: "#fff",
                border: "none",
                padding: "7px 12px",
                borderRadius: "5px",
                cursor: "pointer",
              }}
            >
              Cancel
            </button>
          </div>
        </div>
      ),
      {
        autoClose: false,
        closeOnClick: false,
        closeButton: false,
        draggable: false,
      }
    );
  };

  // Navigation
  const handleView = (id) => {
    navigate(`/admin/members/${id}`);
  };

  const handleEdit = (id) => {
    navigate(`/admin/members/edit/${id}`);
  };

  const handleAddMember = () => {
    navigate("/admin/members/add");
  };

  // Format Join Date
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
          <h1>Members Management</h1>
          <p>Manage your gym members and their memberships.</p>
        </div>

        <button
          className={styles.addButton}
          onClick={handleAddMember}
        >
          <FaPlus />
          Add New Member
        </button>
      </div>

      {/* Statistics Cards */}
      <div className={styles.statsGrid}>

        <div className={styles.statCard}>
          <div className={`${styles.statIcon} ${styles.purple}`}>
            <FaUsers />
          </div>

          <div>
            <p>Total Members</p>
            <h2>{totalMembers}</h2>
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={`${styles.statIcon} ${styles.green}`}>
            <FaUserCheck />
          </div>

          <div>
            <p>Active Members</p>
            <h2>{activeMembers}</h2>
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={`${styles.statIcon} ${styles.red}`}>
            <FaUserTimes />
          </div>

          <div>
            <p>Expired Members</p>
            <h2>{expiredMembers}</h2>
          </div>
        </div>

      </div>

      {/* Search and Filter */}
      <div className={styles.toolbar}>
        <div className={styles.searchBox}>
          <FaSearch />

          <input
            type="text"
            placeholder="Search by name or email..."
            value={search}
            autoComplete="off"
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <select
          className={styles.filter}
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="All">All Status</option>
          <option value="Active">Active</option>
          <option value="Expired">Expired</option>
          <option value="Pending">Pending</option>
        </select>
      </div>

      {/* Members Table */}
      <div className={styles.tableContainer}>

        <div className={styles.tableHeader}>
          <div>
            <h2>All Members</h2>
            <p>{filteredMembers.length} members found</p>
          </div>
        </div>

        <div className={styles.tableWrapper}>

          <table className={styles.table}>

            <thead>
              <tr>
                <th>Member</th>
                <th>Phone</th>
                <th>Membership</th>
                <th>Join Date</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>

              {loading ? (
                <tr>
                  <td colSpan="6" className={styles.noData}>
                    Loading members...
                  </td>
                </tr>
              ) : error ? (
                <tr>
                  <td colSpan="6" className={styles.noData}>
                    {error}
                  </td>
                </tr>
              ) : filteredMembers.length > 0 ? (

                filteredMembers.map((member) => {

                  const status = member.status || "N/A";

                  return (
                    <tr key={member._id}>

                      <td>
                        <div className={styles.memberInfo}>

                          <div className={styles.avatar}>
                            {member.name?.charAt(0).toUpperCase()}
                          </div>

                          <div>
                            <h4>{member.name}</h4>
                            <span>{member.email}</span>
                          </div>

                        </div>
                      </td>

                      <td>{member.phone || "N/A"}</td>

                      <td>
                        {member.membership?.name || "N/A"}
                      </td>

                      <td>{formatDate(member.joinDate)}</td>

                      <td>
                        <span
                          className={`${styles.status} ${
                            styles[status.toLowerCase()]
                          }`}
                        >
                          {status}
                        </span>
                      </td>

                      <td>
                        <div className={styles.actions}>

                          <button
                            className={styles.viewAction}
                            onClick={() => handleView(member._id)}
                            title="View Member"
                          >
                            <FaEye />
                          </button>

                          <button
                            className={styles.editAction}
                            onClick={() => handleEdit(member._id)}
                            title="Edit Member"
                          >
                            <FaEdit />
                          </button>

                          <button
                            className={styles.deleteAction}
                            onClick={() => confirmDelete(member._id)}
                            title="Delete Member"
                            disabled={deletingId === member._id}
                          >
                            <FaTrash />
                          </button>

                        </div>
                      </td>

                    </tr>
                  );
                })

              ) : (

                <tr>
                  <td colSpan="6" className={styles.noData}>
                    No members found.
                  </td>
                </tr>

              )}

            </tbody>

          </table>

        </div>
      </div>

    </div>
  );
};

export default Members;