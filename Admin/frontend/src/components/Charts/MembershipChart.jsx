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

  const filteredData = membershipData.slice(
    filter === "6" ? -6 : -12
  );

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
              stroke="#e5e7eb"
            />

            <XAxis
              dataKey="month"
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#64748b", fontSize: 12 }}
            />

            <YAxis
              allowDecimals={false}
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#64748b", fontSize: 12 }}
            />

            <Tooltip cursor={{ fill: "#f3e8ff" }} />

            <Bar
              dataKey="members"
              name="New Members"
              fill="#8b5cf6"
              radius={[6, 6, 0, 0]}
              barSize={35}
            />

          </BarChart>

        </ResponsiveContainer>
      </div>

    </div>
  );
};

export default MembershipChart;