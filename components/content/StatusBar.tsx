import styles from "./StatusBar.module.css";

interface StatusItem {
  label: string;
  value: string;
  highlight?: boolean;
}

interface StatusBarProps {
  items: StatusItem[];
}

export default function StatusBar({ items }: StatusBarProps) {
  return (
    <div className={styles.bar}>
      {items.map((item, i) => (
        <div key={i} className={styles.item}>
          <span className={styles.label}>{item.label}</span>
          <span
            className={`${styles.value} ${item.highlight ? styles.highlight : ""}`}
          >
            {item.value}
          </span>
        </div>
      ))}
    </div>
  );
}
