import type { ReactNode } from "react";
import styles from "./CalloutBox.module.css";

interface CalloutBoxProps {
  variant?: "default" | "red" | "green" | "amber" | "blue";
  children: ReactNode;
}

export default function CalloutBox({
  variant = "default",
  children,
}: CalloutBoxProps) {
  return (
    <div className={`${styles.callout} ${styles[variant]}`}>{children}</div>
  );
}
