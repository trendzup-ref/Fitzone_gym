import { useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

import styles from "./MembershipChart.module.css";

const MembershipChart = ({ membershipData = [] }) => {
  const [filter, setFilter] = useState("6");

  // Safely slice based on filter count, falling back gracefully if data is shorter
  const sliceCount = filter === "6" ? 6 : 12;
  const filteredData = membershipData.slice(-sliceCount);

  return (
    <div className={styles.chartContainer}>
      <div className={styles.chartHeader}>
        <div>
          <h2>Membership Overview</h2>
          <p>New members joined in the last {filter} months</p>
        </div>

        <select
          className={styles.filter}
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          aria-label="Filter Membership Data by Timeframe"
        >
          <option value="6">Last 6 Months</option>
          <option value="12">Last 12 Months</option>
        </select>
      </div>

      <div className={styles.chart}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={filteredData}
            margin={{
              top: 15,
              right: 15,
              left: -15,
              bottom: 5,
            }}
          >
            <CartesianGrid
              strokeDasharray="3 3"
              vertical={false}
              stroke="#1f2937" /* Subdued dark mode grid lines */
            />

            <XAxis
              dataKey="month"
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#9ca3af", fontSize: 12 }}
              dy={8}
            />

            <YAxis
              allowDecimals={false}
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#9ca3af", fontSize: 12 }}
            />

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
              cursor={{ fill: "rgba(139, 92, 246, 0.08)" }} /* Subtle purple highlight on hover */
            />

            <Bar
              dataKey="members"
              name="New Members"
              fill="#8b5cf6"
              radius={[6, 6, 0, 0]}
              barSize={filter === "6" ? 35 : 22} /* Thinner bars when showing 12 months to avoid crowding */
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default MembershipChart;