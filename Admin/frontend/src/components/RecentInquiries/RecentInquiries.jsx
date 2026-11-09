import { FaEye, FaUser } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

import styles from "./RecentInquiries.module.css";

const RecentInquiries = ({ inquiries = [] }) => {
  const navigate = useNavigate();

  const handleView = (id) => {
    navigate(`/inquiries/${id}`);
  };

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
      {/* Header */}

      <div className={styles.header}>
        <div>
          <h2>Recent Inquiries</h2>
          <p>Latest inquiries from potential members</p>
        </div>

        <button
          className={styles.viewAll}
          onClick={() => navigate("/admin/inquiries")}
        >
          View All
        </button>
      </div>

      {/* Table */}

      <div className={styles.tableWrapper}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Name</th>
              <th>Contact</th>
              <th>Date</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {inquiries.length > 0 ? (
              inquiries.map((inquiry) => (
                <tr key={inquiry._id}>
                  {/* Name */}

                  <td>
                    <div className={styles.userInfo}>
                      <div className={styles.avatar}>
                        <FaUser />
                      </div>

                      <div>
                        <h4>{inquiry.name}</h4>
                        <span>{inquiry.email}</span>
                      </div>
                    </div>
                  </td>

                  {/* Contact */}

                  <td>{inquiry.phone}</td>

                  {/* Date */}

                  <td>{formatDate(inquiry.createdAt)}</td>

                  {/* Status */}

                  <td>
                    <span
                      className={`${styles.status} ${
                        styles[inquiry.status?.toLowerCase()]
                      }`}
                    >
                      {inquiry.status}
                    </span>
                  </td>

                  {/* Action */}

                  <td>
                    <button
                      className={styles.viewButton}
                      onClick={() => handleView(inquiry._id)}
                      title="View Inquiry"
                    >
                      <FaEye />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5">No inquiries found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default RecentInquiries;