"use client";
import { useEffect } from "react";
import { useStore } from "../../context/StoreContext";
import Link from "next/link";

export default function SuccessPage() {
  const { clearCart } = useStore();

  useEffect(() => {
    clearCart();
  }, [clearCart]);

  return (
    <main className="suc-page">
      <div className="suc-card">
        <div className="suc-accent"></div>
        <div className="suc-accent-v"></div>
        <div className="suc-accent-br"></div>
        <div className="suc-accent-br-v"></div>

        <div className="suc-glow"></div>

        <div className="suc-icon">
          <i className="fas fa-check"></i>
          <div className="suc-icon-ring"></div>
        </div>

        <h1 className="suc-title">PAYMENT SUCCESSFUL</h1>
        <p className="suc-sub">Welcome to the family.</p>

        <div className="suc-divider"></div>

        <div className="suc-info">
          <div className="suc-info-accent"></div>
          <p className="suc-info-main">
            <i className="fas fa-envelope-open-text"></i>
            Your download links have been sent to your{" "}
            <strong>PayPal email address</strong>.
          </p>
          <p className="suc-info-note">
            (Check your spam folder if you don't see it within 2 minutes)
          </p>
        </div>

        <Link href="/" className="suc-btn">
          RETURN TO STORE
        </Link>
      </div>

      <style jsx>{`
        .suc-page {
          min-height: 85vh;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 20px;
          position: relative;
        }

        .suc-card {
          background: rgba(19,19,19,0.9);
          border: 1px solid rgba(255,255,255,0.06);
          backdrop-filter: blur(16px);
          padding: 52px 40px;
          text-align: center;
          max-width: 500px;
          width: 100%;
          position: relative;
          overflow: hidden;
          animation: sucReveal 0.8s cubic-bezier(0.16,1,0.3,1) both;
        }

        @keyframes sucReveal {
          from { opacity: 0; transform: translateY(30px) scale(0.97); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }

        /* Corner accents — L shapes */
        .suc-accent {
          position: absolute;
          top: 0; left: 0;
          width: 50px; height: 2px;
          background: #d10000;
        }
        .suc-accent-v {
          position: absolute;
          top: 0; left: 0;
          width: 2px; height: 50px;
          background: #d10000;
        }
        .suc-accent-br {
          position: absolute;
          bottom: 0; right: 0;
          width: 50px; height: 2px;
          background: #d10000;
        }
        .suc-accent-br-v {
          position: absolute;
          bottom: 0; right: 0;
          width: 2px; height: 50px;
          background: #d10000;
        }

        .suc-glow {
          position: absolute;
          top: -60px; left: 50%;
          transform: translateX(-50%);
          width: 200px; height: 200px;
          background: rgba(209,0,0,0.06);
          filter: blur(80px);
          pointer-events: none;
        }

        .suc-icon {
          width: 80px; height: 80px;
          background: linear-gradient(135deg, #d10000, #8a0000);
          display: flex; align-items: center; justify-content: center;
          margin: 0 auto 28px;
          font-size: 2rem;
          color: #fff;
          position: relative;
          box-shadow: 0 0 40px rgba(209,0,0,0.3);
        }

        .suc-icon-ring {
          position: absolute;
          inset: -10px;
          border: 1px solid rgba(209,0,0,0.2);
          animation: ringPulse 2s ease-in-out infinite;
        }

        @keyframes ringPulse {
          0%, 100% { opacity: 0.3; transform: scale(1); }
          50% { opacity: 0.6; transform: scale(1.05); }
        }

        .suc-title {
          font-family: var(--font-display, 'Syne', sans-serif);
          font-size: 1.8rem;
          font-weight: 800;
          color: #fff;
          margin-bottom: 8px;
          letter-spacing: 4px;
          animation: sucTitleIn 0.6s cubic-bezier(0.16,1,0.3,1) 0.3s both;
        }

        @keyframes sucTitleIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .suc-sub {
          color: #555;
          font-size: 0.95rem;
          margin-bottom: 28px;
          letter-spacing: 1px;
          font-style: italic;
        }

        .suc-divider {
          height: 1px;
          background: linear-gradient(90deg, transparent, rgba(209,0,0,0.2), transparent);
          margin-bottom: 28px;
        }

        .suc-info {
          background: rgba(0,0,0,0.3);
          padding: 20px;
          border: 1px solid rgba(255,255,255,0.04);
          margin-bottom: 32px;
          text-align: left;
          position: relative;
        }

        .suc-info-accent {
          position: absolute;
          top: 0; left: 0;
          width: 2px; height: 100%;
          background: #d10000;
        }

        .suc-info-main {
          color: #999;
          font-size: 0.88rem;
          line-height: 1.7;
          margin-bottom: 8px;
        }

        .suc-info-main i { color: #d10000; margin-right: 10px; }
        .suc-info-main strong { color: #fff; }

        .suc-info-note {
          font-size: 0.78rem;
          color: #444;
          font-style: italic;
          padding-left: 26px;
        }

        .suc-btn {
          display: block;
          width: 100%;
          background: #fff;
          color: #060606;
          padding: 16px;
          text-decoration: none;
          font-weight: 800;
          font-size: 0.75rem;
          text-transform: uppercase;
          letter-spacing: 3px;
          transition: all 0.3s cubic-bezier(0.16,1,0.3,1);
          position: relative;
          overflow: hidden;
        }

        .suc-btn::after {
          content: '';
          position: absolute;
          top: 0; left: -100%;
          width: 60%; height: 100%;
          background: linear-gradient(90deg, transparent, rgba(209,0,0,0.15), transparent);
          transition: left 0.5s;
        }

        .suc-btn:hover {
          background: #d10000;
          color: #fff;
          box-shadow: 0 0 50px rgba(209,0,0,0.3);
          transform: translateY(-2px);
        }

        .suc-btn:hover::after { left: 120%; }

        @media (max-width: 640px) {
          .suc-card { padding: 40px 24px; }
          .suc-title { font-size: 1.4rem; letter-spacing: 2px; }
        }
      `}</style>
    </main>
  );
}