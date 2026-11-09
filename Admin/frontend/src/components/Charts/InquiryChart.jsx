import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

import styles from "./InquiryChart.module.css";

const InquiryChart = ({ inquiries = {} }) => {

  // Dynamic data from backend
  const inquiryData = [
    {
      name: "Pending",
      value: inquiries.pending || 0,
    },
    {
      name: "Contacted",
      value: inquiries.contacted || 0,
    },
    {
      name: "Resolved",
      value: inquiries.resolved || 0,
    },
  ];

  const COLORS = ["#f59e0b", "#3b82f6", "#22c55e"];

  const totalInquiries = inquiries.total || 0;

  return (
    <div className={styles.chartContainer}>

      <div className={styles.chartHeader}>
        <div>
          <h2>Inquiry Status</h2>
          <p>Overview of all gym inquiries</p>
        </div>
      </div>

      <div className={styles.chart}>

        <ResponsiveContainer width="100%" height="100%">

          <PieChart>

            <Pie
              data={inquiryData}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              innerRadius={65}
              outerRadius={95}
              paddingAngle={4}
              stroke="none"
            >

              {inquiryData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index]}
                />
              ))}

            </Pie>

            <Tooltip />

            <Legend
              verticalAlign="bottom"
              height={36}
              iconType="circle"
            />

          </PieChart>

        </ResponsiveContainer>

        <div className={styles.centerText}>
          <h3>{totalInquiries}</h3>
          <span>Total Inquiries</span>
        </div>

      </div>

    </div>
  );
};

export default InquiryChart;