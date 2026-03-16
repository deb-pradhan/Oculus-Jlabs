export default function BlogLoading() {
  return (
    <article
      style={{
        maxWidth: "48rem",
        margin: "0 auto",
        padding: "2rem 1.5rem",
      }}
    >
      {/* Category + reading time skeleton */}
      <div style={{ display: "flex", gap: "0.75rem", marginBottom: "1.25rem" }}>
        <div
          style={{
            height: "1.5rem",
            width: "5rem",
            backgroundColor: "var(--color-accent-subtle)",
            borderRadius: "9999px",
          }}
        />
        <div
          style={{
            height: "1.5rem",
            width: "5rem",
            backgroundColor: "var(--surface-subtle)",
            borderRadius: "9999px",
          }}
        />
      </div>

      {/* Title skeleton */}
      <div
        style={{
          height: "2.25rem",
          width: "90%",
          backgroundColor: "var(--surface-subtle)",
          borderRadius: "8px",
          marginBottom: "0.5rem",
        }}
      />
      <div
        style={{
          height: "2.25rem",
          width: "60%",
          backgroundColor: "var(--surface-subtle)",
          borderRadius: "8px",
          marginBottom: "1.5rem",
        }}
      />

      {/* Date skeleton */}
      <div
        style={{
          height: "1rem",
          width: "8rem",
          backgroundColor: "var(--surface-subtle)",
          borderRadius: "4px",
          marginBottom: "2rem",
        }}
      />

      {/* Body paragraph skeletons */}
      {Array.from({ length: 8 }).map((_, i) => (
        <div
          key={i}
          style={{
            height: "1rem",
            width: `${70 + Math.round(Math.sin(i) * 25)}%`,
            backgroundColor: "var(--surface-subtle)",
            borderRadius: "4px",
            marginBottom: "0.75rem",
          }}
        />
      ))}

      {/* Image placeholder */}
      <div
        style={{
          height: "16rem",
          width: "100%",
          backgroundColor: "var(--surface-subtle)",
          borderRadius: "12px",
          marginTop: "1.5rem",
          marginBottom: "1.5rem",
        }}
      />

      {/* More paragraph skeletons */}
      {Array.from({ length: 5 }).map((_, i) => (
        <div
          key={`b-${i}`}
          style={{
            height: "1rem",
            width: `${65 + Math.round(Math.cos(i) * 30)}%`,
            backgroundColor: "var(--surface-subtle)",
            borderRadius: "4px",
            marginBottom: "0.75rem",
          }}
        />
      ))}
    </article>
  );
}
