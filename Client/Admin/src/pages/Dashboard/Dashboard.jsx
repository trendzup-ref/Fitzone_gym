import { useEffect, useState } from "react";
import {
  FaUsers,
  FaDumbbell,
  FaComments,
} from "react-icons/fa";

import styles from "./Dashboard.module.css";
import API from "../../api/axios.js";

import DashboardCard from "../../components/dashboardCard/DashboardCard.jsx";
import InquiryChart from "../../components/Charts/InquiryChart.jsx";
import MembershipChart from "../../components/Charts/MembershipChart.jsx";
import RecentMembers from "../../components/RecentMembers/RecentMembers.jsx";
import RecentInquiries from "../../components/RecentInquiries/RecentInquiries.jsx";

const Dashboard = () => {
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchDashboardStats = async () => {
    try {
      setLoading(true);
      const response = await API.get("/dashboard/stats");
      setDashboard(response.data.dashboard);
    } catch (error) {
      console.error("Dashboard API Error:", error);
      setError(
        error.response?.data?.message ||
        "Failed to fetch dashboard statistics."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  if (error) {
    return (
      <div className={styles.dashboard}>
        <div className={styles.chartBox}>
          <h2>Error</h2>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.dashboard}>
      {/* Statistics */}
      <div className={styles.stats}>
        {loading ? (
          <>
            <div className={styles.skeletonCard}>
              <div>
                <div className={`${styles.skeletonPulse} ${styles.skeletonLine}`} />
                <div className={`${styles.skeletonPulse} ${styles.skeletonLineShort}`} />
              </div>
            </div>
            <div className={styles.skeletonCard}>
              <div>
                <div className={`${styles.skeletonPulse} ${styles.skeletonLine}`} />
                <div className={`${styles.skeletonPulse} ${styles.skeletonLineShort}`} />
              </div>
            </div>
            <div className={styles.skeletonCard}>
              <div>
                <div className={`${styles.skeletonPulse} ${styles.skeletonLine}`} />
                <div className={`${styles.skeletonPulse} ${styles.skeletonLineShort}`} />
              </div>
            </div>
          </>
        ) : (
          <>
            <DashboardCard
              title="Total Members"
              count={dashboard?.members?.total ?? 0}
              icon={<FaUsers />}
              color="#eee5ff"
            />
            <DashboardCard
              title="Total Trainers"
              count={dashboard?.trainers?.total ?? 0}
              icon={<FaDumbbell />}
              color="#e0efff"
            />
            <DashboardCard
              title="Pending Inquiries"
              count={dashboard?.inquiries?.pending ?? 0}
              icon={<FaComments />}
              color="#ffeadc"
            />
          </>
        )}
      </div>

      {/* Charts Section */}
      <div className={styles.chartSection}>
        {loading ? (
          <>
            <div className={styles.skeletonBoxLarge}>
              <div className={`${styles.skeletonPulse} ${styles.skeletonLine}`} style={{ width: '30%' }} />
              <div className={`${styles.skeletonPulse}`} style={{ height: '200px', marginTop: '20px' }} />
            </div>
            <div className={styles.skeletonBoxLarge}>
              <div className={`${styles.skeletonPulse} ${styles.skeletonLine}`} style={{ width: '30%' }} />
              <div className={`${styles.skeletonPulse}`} style={{ height: '200px', marginTop: '20px' }} />
            </div>
          </>
        ) : (
          <>
            <MembershipChart membershipData={dashboard?.membershipOverview || []} />
            <InquiryChart inquiries={dashboard?.inquiries || {}} />
          </>
        )}
      </div>

      {/* Recent Members & Inquiries */}
      <div className={styles.bottomSection}>
        {loading ? (
          <>
            <div className={styles.skeletonBoxLarge}>
              <div className={`${styles.skeletonPulse} ${styles.skeletonLine}`} style={{ width: '40%' }} />
              <div className={`${styles.skeletonPulse}`} style={{ height: '180px', marginTop: '20px' }} />
            </div>
            <div className={styles.skeletonBoxLarge}>
              <div className={`${styles.skeletonPulse} ${styles.skeletonLine}`} style={{ width: '40%' }} />
              <div className={`${styles.skeletonPulse}`} style={{ height: '180px', marginTop: '20px' }} />
            </div>
          </>
        ) : (
          <>
            <RecentMembers members={dashboard?.recentMembers || []} />
            <RecentInquiries inquiries={dashboard?.recentInquiries || []} />
          </>
        )}
      </div>
    </div>
  );
};

export default Dashboard;