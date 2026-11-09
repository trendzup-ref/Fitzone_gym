import { FaEye, FaUsers } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

import styles from "./RecentMembers.module.css";

const RecentMembers = ({ members = [] }) => {
  const navigate = useNavigate();

  const handleView = (id) => {
    navigate(`/members/${id}`);
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
          <h2>Recent Members</h2>
          <p>Recently joined gym members</p>
        </div>

        <button
          className={styles.viewAll}
          onClick={() => navigate("/admin/members")}
        >
          View All
        </button>
      </div>

      {/* Table */}

      <div className={styles.tableWrapper}>
        <table className={styles.table}>

          <thead>
            <tr>
              <th>Member</th>
              <th>Membership</th>
              <th>Join Date</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>

            {members.length > 0 ? (

              members.map((member) => (

                <tr key={member._id}>

                  <td>
                    <div className={styles.memberInfo}>

                      <div className={styles.avatar}>
                        {member.image ? (
                          <img
                            src={member.image}
                            alt={member.name}
                          />
                        ) : (
                          <FaUsers />
                        )}
                      </div>

                      <div>
                        <h4>{member.name}</h4>
                        <span>{member.email}</span>
                      </div>

                    </div>
                  </td>

                  <td>
                    {member.membership?.name || "-"}
                  </td>

                  <td>
                    {formatDate(member.joinDate)}
                  </td>

                  <td>
                    <span
                      className={`${styles.status} ${
                        styles[member.status?.toLowerCase()]
                      }`}
                    >
                      {member.status}
                    </span>
                  </td>

                  <td>
                    <button
                      className={styles.viewButton}
                      onClick={() => handleView(member._id)}
                      title="View Member"
                    >
                      <FaEye />
                    </button>
                  </td>

                </tr>

              ))

            ) : (

              <tr>
                <td colSpan="5">
                  No members found.
                </td>
              </tr>

            )}

          </tbody>

        </table>
      </div>

    </div>
  );
};

export default RecentMembers;