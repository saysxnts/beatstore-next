"use client";
import Link from "next/link";

export default function CheckoutError() {
  return (
    <main style={{
      minHeight: "85vh",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: "20px",
    }}>
      <div style={{
        background: "rgba(20,20,20,0.75)",
        border: "1px solid rgba(255,255,255,0.07)",
        borderRadius: "20px",
        padding: "48px 40px",
        textAlign: "center",
        maxWidth: "460px",
        width: "100%",
        backdropFilter: "blur(12px)",
      }}>
        <div style={{
          width: "72px", height: "72px",
          background: "rgba(209,0,0,0.12)",
          borderRadius: "50%",
          display: "flex", alignItems: "center", justifyContent: "center",
          margin: "0 auto 24px",
          fontSize: "1.8rem", color: "#d10000",
        }}>
          <i className="fas fa-exclamation-triangle"></i>
        </div>

        <h1 style={{
          fontFamily: "var(--font-display, 'Syne', sans-serif)",
          fontSize: "1.6rem", fontWeight: 800,
          color: "#fff", marginBottom: "12px",
          letterSpacing: "-0.5px",
        }}>
          Payment Failed
        </h1>

        <p style={{ color: "#666", fontSize: "0.9rem", lineHeight: 1.6, marginBottom: "32px" }}>
          Something went wrong while processing your payment.
          Your card was not charged. Please try again.
        </p>

        <Link href="/checkout" style={{
          display: "block",
          background: "#d10000",
          color: "#fff",
          padding: "14px",
          borderRadius: "10px",
          textDecoration: "none",
          fontWeight: 700,
          fontSize: "0.9rem",
          marginBottom: "12px",
          transition: "all 0.2s",
        }}>
          Try Again
        </Link>

        <Link href="/" style={{
          display: "block",
          color: "#444",
          fontSize: "0.82rem",
          textDecoration: "none",
        }}>
          ← Back to store
        </Link>
      </div>
    </main>
  );
}
