/**
 * Blog shared layout — wraps all /blog/* pages.
 * Server component that provides a consistent container.
 */

export default function BlogSharedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className="container">{children}</div>;
}
