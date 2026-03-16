"use client";
import { useEffect } from "react";
import { useStore } from "../../context/StoreContext";
import Link from "next/link";

export default function SuccessPage() {
  const { clearCart } = useStore();

  // clearCart está envolvido em useCallback no StoreContext,
  // então é seguro incluir nas dependências sem loop infinito.
  useEffect(() => {
    clearCart();
  }, [clearCart]);

  return (
    <main className="success-container">
      <div className="success-card fade-in-up">
        <div className="glow-effect"></div>

        <div className="icon-wrapper">
          <i className="fas fa-check"></i>
        </div>

        <h1 className="title">PAYMENT SUCCESSFUL</h1>
        <p className="subtitle">Welcome to the family.</p>

        <div className="divider"></div>

        <div className="info-box">
          <p className="main-info">
            <i className="fas fa-envelope-open-text"></i>
            Your download links have been sent to your{" "}
            <strong>PayPal email address</strong>.
          </p>
          <p className="spam-note">
            (Check your spam folder if you don't see it within 2 minutes)
          </p>
        </div>

        <Link href="/" className="back-btn">
          RETURN TO STORE
        </Link>
      </div>

      <style jsx>{`
        .success-container {
          min-height: 85vh;
          display: flex;
          align-items: center;
          justify-content: center;
          background: radial-gradient(circle at center, #1a1a1a 0%, #0f0f0f 100%);
          padding: 20px;
          position: relative;
          overflow: hidden;
        }
        .success-container::before {
          content: "";
          position: absolute;
          top: 0; left: 0; width: 100%; height: 100%;
          background: url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23181818' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/G%3E%3C/svg%3E");
        }
        .success-card {
          background: rgba(24, 24, 24, 0.8);
          backdrop-filter: blur(10px);
          padding: 50px 40px;
          border-radius: 20px;
          text-align: center;
          max-width: 500px;
          width: 100%;
          border: 1px solid rgba(255, 255, 255, 0.05);
          box-shadow: 0 20px 50px rgba(0,0,0,0.5);
          position: relative;
          z-index: 2;
        }
        .glow-effect {
          position: absolute;
          top: -50px;
          left: 50%;
          transform: translateX(-50%);
          width: 150px;
          height: 150px;
          background: #680000;
          filter: blur(80px);
          opacity: 0.4;
          z-index: -1;
        }
        .icon-wrapper {
          width: 90px;
          height: 90px;
          background: linear-gradient(135deg, #680000 0%, #3a0000 100%);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 25px;
          font-size: 2.5rem;
          color: white;
          box-shadow: 0 10px 20px rgba(104, 0, 0, 0.3);
          border: 2px solid rgba(255,255,255,0.1);
        }
        .title {
          font-family: 'Inter', sans-serif;
          font-size: 2.2rem;
          font-weight: 800;
          margin-bottom: 5px;
          color: #fff;
          letter-spacing: -1px;
          text-transform: uppercase;
        }
        .subtitle {
          color: #888;
          font-size: 1.1rem;
          margin-bottom: 30px;
        }
        .divider {
          height: 1px;
          background: linear-gradient(90deg, transparent, #333, transparent);
          margin-bottom: 30px;
        }
        .info-box {
          background: rgba(0, 0, 0, 0.3);
          padding: 20px;
          border-radius: 10px;
          border: 1px solid #222;
          margin-bottom: 35px;
        }
        .main-info {
          color: #ccc;
          font-size: 1rem;
          line-height: 1.6;
          margin-bottom: 8px;
        }
        .main-info i {
          color: #680000;
          margin-right: 10px;
        }
        .main-info strong { color: #fff; }
        .spam-note {
          font-size: 0.85rem;
          color: #666;
          font-style: italic;
        }
        .back-btn {
          display: block;
          width: 100%;
          background: #f1f1f1;
          color: #0f0f0f;
          padding: 16px;
          border-radius: 8px;
          text-decoration: none;
          font-weight: 800;
          text-transform: uppercase;
          letter-spacing: 1px;
          transition: all 0.3s ease;
        }
        .back-btn:hover {
          background: #680000;
          color: white;
          transform: translateY(-2px);
          box-shadow: 0 10px 20px rgba(104, 0, 0, 0.2);
        }
        .fade-in-up {
          animation: fadeInUp 0.8s cubic-bezier(0.2, 0.8, 0.2, 1) forwards;
          opacity: 0;
          transform: translateY(30px);
        }
        @keyframes fadeInUp {
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </main>
  );
}