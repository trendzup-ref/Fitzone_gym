import styles from "./DashboardCard.module.css";

const DashboardCard = ({ title, count, icon, color, growth }) => {
  return (
    <div className={styles.card}>
      <div
        className={styles.icon}
        style={{ backgroundColor: color }}
      >
        {icon}
      </div>

      <div className={styles.content}>
        <p>{title}</p>
        <h2>{count}</h2>
      </div>

      <span className={styles.growth}>
        {growth}
      </span>
    </div>
  );
};

export default DashboardCard;