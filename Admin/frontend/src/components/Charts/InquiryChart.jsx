import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

import styles from "./InquiryChart.module.css";

const InquiryChart = ({ inquiries = {} }) => {
  const inquiryData = [
    {
      name: "Pending",
      value: inquiries.pending || 0,
      color: "#f59e0b",
    },
    {
      name: "Contacted",
      value: inquiries.contacted || 0,
      color: "#3b82f6",
    },
    {
      name: "Resolved",
      value: inquiries.resolved || 0,
      color: "#22c55e",
    },
  ];

  const totalInquiries =
    inquiries.total ??
    inquiryData.reduce((sum, item) => sum + item.value, 0);

  const hasData = totalInquiries > 0;

  return (
    <div className={styles.chartContainer}>
      <div className={styles.chartHeader}>
        <div>
          <h2>Inquiry Status</h2>
          <p>Overview of all gym inquiries</p>
        </div>
        <span className={styles.badge}>Live</span>
      </div>

      {/* Wrapper solely for the donut chart so centerText stays locked to 50%/50% */}
      <div className={styles.chartWrapper}>
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={
                hasData
                  ? inquiryData
                  : [{ name: "No Inquiries", value: 1, color: "#1f2937" }]
              }
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              innerRadius="64%"
              outerRadius="88%"
              paddingAngle={hasData ? 4 : 0}
              cornerRadius={6}
              stroke="none"
            >
              {(hasData
                ? inquiryData
                : [{ color: "#1f2937" }]
              ).map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>

            {hasData && (
              <Tooltip
                contentStyle={{
                  backgroundColor: "#1f2937",
                  border: "1px solid #374151",
                  borderRadius: "8px",
                  color: "#f9fafb",
                  fontSize: "13px",
                  boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.4)",
                }}
                itemStyle={{ color: "#f9fafb", fontWeight: 500 }}
                cursor={false}
              />
            )}
          </PieChart>
        </ResponsiveContainer>

        <div className={styles.centerText}>
          <h3>{totalInquiries.toLocaleString()}</h3>
          <span>Total</span>
        </div>
      </div>

      {/* Custom responsive legend for cleaner wrapping & value display */}
      <div className={styles.legendGrid}>
        {inquiryData.map((item) => (
          <div key={item.name} className={styles.legendItem}>
            <div className={styles.legendLabel}>
              <span
                className={styles.dot}
                style={{ backgroundColor: item.color }}
              />
              <span>{item.name}</span>
            </div>
            <strong className={styles.legendValue}>{item.value}</strong>
          </div>
        ))}
      </div>
    </div>
  );
};

export default InquiryChart;