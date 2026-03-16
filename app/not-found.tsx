import Link from "next/link";

export default function NotFound() {
  return (
    <main
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "80vh",
        padding: "2rem",
        textAlign: "center",
        color: "var(--ink-primary)",
      }}
    >
      <p
        style={{
          fontSize: "5rem",
          fontWeight: 700,
          lineHeight: 1,
          color: "var(--color-accent-main)",
          fontFamily: "var(--font-geist-mono)",
        }}
      >
        404
      </p>
      <h1
        style={{
          fontSize: "1.5rem",
          fontWeight: 600,
          marginTop: "1rem",
        }}
      >
        Page not found
      </h1>
      <p
        style={{
          color: "var(--ink-secondary)",
          marginTop: "0.5rem",
          maxWidth: "28rem",
        }}
      >
        The page you are looking for does not exist or has been moved.
      </p>
      <Link
        href="/"
        style={{
          marginTop: "2rem",
          padding: "0.75rem 1.5rem",
          backgroundColor: "var(--color-accent-main)",
          color: "var(--ink-on-accent)",
          borderRadius: "8px",
          textDecoration: "none",
          fontWeight: 500,
          fontSize: "0.875rem",
        }}
      >
        Back to Home
      </Link>
    </main>
  );
}
