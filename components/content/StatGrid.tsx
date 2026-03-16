import styles from "./StatGrid.module.css";

interface StatCell {
  label: string;
  value: string;
  sub: string;
  direction: "up" | "dn" | "nt";
}

interface StatGridProps {
  cells: StatCell[];
}

export default function StatGrid({ cells }: StatGridProps) {
  return (
    <div className={styles.grid}>
      {cells.map((cell, i) => (
        <div key={i} className={styles.cell}>
          <span className={styles.label}>{cell.label}</span>
          <span className={`${styles.value} ${styles[cell.direction]}`}>
            {cell.value}
          </span>
          <span className={`${styles.sub} ${styles[cell.direction]}`}>
            {cell.sub}
          </span>
        </div>
      ))}
    </div>
  );
}
