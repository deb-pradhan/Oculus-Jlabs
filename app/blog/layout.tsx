/**
 * Blog shared layout — wraps all /blog/* pages.
 * Includes the site header (logo, search, theme toggle) and footer.
 */

import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";

export default function BlogSharedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Header />
      <div className="container">{children}</div>
      <Footer />
    </>
  );
}
