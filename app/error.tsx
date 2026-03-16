"use client";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
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
      <div
        style={{
          width: "3.5rem",
          height: "3.5rem",
          borderRadius: "50%",
          backgroundColor: "var(--signal-error-subtle)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          marginBottom: "1.5rem",
          fontSize: "1.5rem",
          color: "var(--signal-error)",
          fontWeight: 700,
        }}
      >
        !
      </div>
      <h1
        style={{
          fontSize: "1.5rem",
          fontWeight: 600,
        }}
      >
        Something went wrong
      </h1>
      <p
        style={{
          color: "var(--ink-secondary)",
          marginTop: "0.5rem",
          maxWidth: "28rem",
          fontSize: "0.9375rem",
        }}
      >
        {error.message || "An unexpected error occurred. Please try again."}
      </p>
      {error.digest && (
        <code
          style={{
            display: "block",
            marginTop: "0.75rem",
            fontSize: "0.75rem",
            color: "var(--ink-tertiary)",
            fontFamily: "var(--font-geist-mono)",
          }}
        >
          Error ID: {error.digest}
        </code>
      )}
      <button
        onClick={reset}
        style={{
          marginTop: "2rem",
          padding: "0.75rem 1.5rem",
          backgroundColor: "var(--color-accent-main)",
          color: "var(--ink-on-accent)",
          border: "none",
          borderRadius: "8px",
          cursor: "pointer",
          fontWeight: 500,
          fontSize: "0.875rem",
        }}
      >
        Try again
      </button>
    </main>
  );
}
