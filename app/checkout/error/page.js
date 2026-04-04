"use client";
import Link from "next/link";

export default function CheckoutError() {
  return (
    <main className="err-page">
      <div className="err-card">
        <div className="err-accent"></div>
        <div className="err-accent-v"></div>

        <div className="err-icon">
          <i className="fas fa-times"></i>
        </div>

        <h1 className="err-title">PAYMENT FAILED</h1>
        <p className="err-sub">
          Something went wrong while processing your payment.
          Your card was not charged.
        </p>

        <div className="err-divider"></div>

        <Link href="/checkout" className="err-retry">
          TRY AGAIN
        </Link>

        <Link href="/" className="err-back">
          ← Back to store
        </Link>
      </div>

      <style jsx>{`
        .err-page {
          min-height: 85vh;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 20px;
        }

        .err-card {
          background: rgba(19,19,19,0.9);
          border: 1px solid rgba(255,255,255,0.06);
          backdrop-filter: blur(16px);
          padding: 48px 40px;
          text-align: center;
          max-width: 440px;
          width: 100%;
          position: relative;
          overflow: hidden;
          animation: errReveal 0.6s cubic-bezier(0.16,1,0.3,1) both;
        }

        @keyframes errReveal {
          from { opacity: 0; transform: translateY(30px) scale(0.97); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }

        .err-accent {
          position: absolute;
          top: 0; left: 0;
          width: 50px; height: 2px;
          background: #d10000;
        }

        .err-accent-v {
          position: absolute;
          top: 0; left: 0;
          width: 2px; height: 50px;
          background: #d10000;
        }

        .err-icon {
          width: 72px; height: 72px;
          border: 1px solid rgba(209,0,0,0.3);
          display: flex; align-items: center; justify-content: center;
          margin: 0 auto 24px;
          font-size: 1.6rem;
          color: #d10000;
          position: relative;
        }

        .err-icon::after {
          content: '';
          position: absolute;
          inset: -8px;
          border: 1px solid rgba(209,0,0,0.08);
        }

        .err-title {
          font-family: var(--font-display, 'Syne', sans-serif);
          font-size: 1.6rem;
          font-weight: 800;
          color: #fff;
          margin-bottom: 12px;
          letter-spacing: 4px;
        }

        .err-sub {
          color: #555;
          font-size: 0.82rem;
          line-height: 1.7;
          margin-bottom: 28px;
          letter-spacing: 0.3px;
        }

        .err-divider {
          height: 1px;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.06), transparent);
          margin-bottom: 28px;
        }

        .err-retry {
          display: block;
          background: #d10000;
          color: #fff;
          padding: 15px;
          text-decoration: none;
          font-weight: 700;
          font-size: 0.75rem;
          letter-spacing: 3px;
          text-transform: uppercase;
          margin-bottom: 16px;
          transition: all 0.3s cubic-bezier(0.16,1,0.3,1);
          position: relative;
          overflow: hidden;
        }

        .err-retry::after {
          content: '';
          position: absolute;
          top: 0; left: -100%;
          width: 60%; height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent);
          transition: left 0.5s;
        }

        .err-retry:hover {
          background: #ff2020;
          box-shadow: 0 0 50px rgba(209,0,0,0.3);
          transform: translateY(-1px);
        }

        .err-retry:hover::after { left: 120%; }

        .err-back {
          display: block;
          color: #333;
          font-size: 0.7rem;
          text-decoration: none;
          letter-spacing: 2px;
          text-transform: uppercase;
          transition: color 0.2s;
        }

        .err-back:hover { color: #d10000; }
      `}</style>
    </main>
  );
}