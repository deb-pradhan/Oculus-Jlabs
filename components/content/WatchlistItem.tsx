import styles from "./WatchlistItem.module.css";

interface WatchlistItemProps {
  event: string;
  detail: string;
  severity: "red" | "amber" | "green";
}

function WatchlistItem({ event, detail, severity }: WatchlistItemProps) {
  return (
    <div className={styles.item}>
      <span className={styles.event}>{event}</span>
      <span className={styles.detail}>{detail}</span>
      <span className={`${styles.tag} ${styles[severity]}`}>{severity}</span>
    </div>
  );
}

interface WatchlistProps {
  children: React.ReactNode;
}

function Watchlist({ children }: WatchlistProps) {
  return <div className={styles.watchlist}>{children}</div>;
}

export { WatchlistItem, Watchlist };
export default WatchlistItem;
