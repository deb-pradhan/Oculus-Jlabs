import styles from "./VolumeBar.module.css";

interface Bar {
  label: string;
  value: number;
  displayValue: string;
  highlight?: boolean;
}

interface VolumeBarProps {
  bars: Bar[];
}

export default function VolumeBar({ bars }: VolumeBarProps) {
  const max = Math.max(...bars.map((b) => b.value), 1);

  return (
    <div className={styles.container}>
      {bars.map((bar, i) => {
        const pct = (bar.value / max) * 100;
        return (
          <div key={i} className={styles.row}>
            <span className={styles.label}>{bar.label}</span>
            <div className={styles.track}>
              <div
                className={`${styles.fill} ${bar.highlight ? styles.highlight : ""}`}
                style={{ width: `${pct}%` }}
              />
            </div>
            <span
              className={`${styles.value} ${bar.highlight ? styles.highlight : ""}`}
            >
              {bar.displayValue}
              {bar.highlight && " ★"}
            </span>
          </div>
        );
      })}
    </div>
  );
}
