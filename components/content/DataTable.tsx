import type { ReactNode } from "react";
import styles from "./DataTable.module.css";

interface Column {
  key: string;
  label: string;
  align?: "left" | "right" | "center";
}

interface DataTableProps {
  columns: Column[];
  data: Record<string, ReactNode>[];
  ariaLabel?: string;
}

export default function DataTable({ columns, data, ariaLabel }: DataTableProps) {
  return (
    <div className={styles.wrapper}>
      <table className={styles.table} aria-label={ariaLabel}>
        <thead>
          <tr>
            {columns.map((col, i) => (
              <th
                key={col.key}
                className={`${styles.th} ${i === 0 ? styles.sticky : ""}`}
                style={{ textAlign: col.align ?? "left" }}
              >
                {col.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, rowIdx) => (
            <tr key={rowIdx} className={styles.row}>
              {columns.map((col, colIdx) => (
                <td
                  key={col.key}
                  className={`${styles.td} ${colIdx === 0 ? styles.sticky : ""}`}
                  style={{ textAlign: col.align ?? "left" }}
                >
                  {row[col.key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
