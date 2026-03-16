export default function HomeLoading() {
  return (
    <main
      style={{
        maxWidth: "72rem",
        margin: "0 auto",
        padding: "2rem 1.5rem",
      }}
    >
      {/* Hero skeleton */}
      <div
        style={{
          height: "3rem",
          width: "60%",
          backgroundColor: "var(--surface-subtle)",
          borderRadius: "8px",
          marginBottom: "0.75rem",
        }}
      />
      <div
        style={{
          height: "1.25rem",
          width: "40%",
          backgroundColor: "var(--surface-subtle)",
          borderRadius: "6px",
          marginBottom: "2.5rem",
        }}
      />

      {/* Card grid skeleton */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(20rem, 1fr))",
          gap: "1.5rem",
        }}
      >
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            style={{
              backgroundColor: "var(--surface-card)",
              borderRadius: "12px",
              border: "1px solid var(--border-element)",
              padding: "1.5rem",
              display: "flex",
              flexDirection: "column",
              gap: "0.75rem",
            }}
          >
            <div
              style={{
                height: "0.75rem",
                width: "30%",
                backgroundColor: "var(--surface-subtle)",
                borderRadius: "4px",
              }}
            />
            <div
              style={{
                height: "1.25rem",
                width: "80%",
                backgroundColor: "var(--surface-subtle)",
                borderRadius: "6px",
              }}
            />
            <div
              style={{
                height: "1rem",
                width: "100%",
                backgroundColor: "var(--surface-subtle)",
                borderRadius: "4px",
              }}
            />
            <div
              style={{
                height: "1rem",
                width: "65%",
                backgroundColor: "var(--surface-subtle)",
                borderRadius: "4px",
              }}
            />
          </div>
        ))}
      </div>
    </main>
  );
}
