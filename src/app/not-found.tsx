import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Page Not Found",
  description: "The page you are looking for does not exist.",
  robots: { index: false, follow: false },
};

export default function NotFound() {
  return (
    <html lang="en">
      <body style={{ fontFamily: "sans-serif", textAlign: "center", padding: "4rem 1rem" }}>
        <h1 style={{ fontSize: "6rem", margin: 0, color: "#f05a5b" }}>404</h1>
        <h2 style={{ fontSize: "1.5rem", marginBottom: "1rem" }}>Page Not Found</h2>
        <p style={{ color: "#666", marginBottom: "2rem" }}>
          The page you are looking for does not exist or has been moved.
        </p>
        <Link
          href="/en"
          style={{
            display: "inline-block",
            backgroundColor: "#f05a5b",
            color: "#fff",
            padding: "0.75rem 2rem",
            borderRadius: "0.5rem",
            textDecoration: "none",
            fontWeight: 600,
          }}
        >
          Go Home
        </Link>
      </body>
    </html>
  );
}
