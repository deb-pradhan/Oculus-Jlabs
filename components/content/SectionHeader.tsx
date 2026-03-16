import styles from "./SectionHeader.module.css";

interface SectionHeaderProps {
  number: string;
  title: string;
  sourceTag?: string;
  live?: boolean;
}

export default function SectionHeader({
  number,
  title,
  sourceTag,
  live,
}: SectionHeaderProps) {
  return (
    <div className={styles.header}>
      <div className={styles.left}>
        <span className={styles.number}>{number}</span>
        <h3 className={styles.title}>{title}</h3>
      </div>
      {sourceTag && (
        <span className={`${styles.tag} ${live ? styles.live : ""}`}>
          {sourceTag}
        </span>
      )}
    </div>
  );
}
