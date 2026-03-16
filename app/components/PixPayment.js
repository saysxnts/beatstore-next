"use client";
import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useStore } from "../context/StoreContext";

const API = process.env.NEXT_PUBLIC_API_URL;
const POLL_INTERVAL = 5000; // 5 segundos

export default function PixPayment({ orderId, qrCodeBase64, copiaECola, expiresAt, total }) {
  const router = useRouter();
  const { clearCart } = useStore();
  const [copied, setCopied] = useState(false);
  const [timeLeft, setTimeLeft] = useState("");
  const [expired, setExpired] = useState(false);

  // ── Countdown ──────────────────────────────────────────────────
  useEffect(() => {
    const expiry = new Date(expiresAt);
    const tick = () => {
      const diff = expiry - Date.now();
      if (diff <= 0) { setExpired(true); setTimeLeft("00:00"); return; }
      const m = String(Math.floor(diff / 60000)).padStart(2, "0");
      const s = String(Math.floor((diff % 60000) / 1000)).padStart(2, "0");
      setTimeLeft(`${m}:${s}`);
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [expiresAt]);

  // ── Polling de status ──────────────────────────────────────────
  const pollStatus = useCallback(async () => {
    if (expired) return;
    try {
      const res = await fetch(`${API}/api/checkout/status/${orderId}`);
      if (!res.ok) return;
      const data = await res.json();
      if (data.status === "PAID") {
        clearCart();
        router.push("/checkout/success");
      }
    } catch { /* ignora erros de rede temporários */ }
  }, [orderId, expired, clearCart, router]);

  useEffect(() => {
    const id = setInterval(pollStatus, POLL_INTERVAL);
    return () => clearInterval(id);
  }, [pollStatus]);

  // ── Copiar copia-e-cola ────────────────────────────────────────
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(copiaECola);
      setCopied(true);
      setTimeout(() => setCopied(false), 3000);
    } catch { /* fallback silencioso */ }
  };

  return (
    <div className="pix-container">
      <div className="pix-header">
        <div className="pix-icon">
          <i className="fas fa-qrcode"></i>
        </div>
        <div>
          <h2 className="pix-title">Pagar com Pix</h2>
          <p className="pix-subtitle">Escaneie o QR code ou use o código copia e cola</p>
        </div>
      </div>

      {/* Timer */}
      <div className={`pix-timer ${expired ? "expired" : ""}`}>
        <i className={`fas ${expired ? "fa-times-circle" : "fa-clock"}`}></i>
        {expired
          ? "QR code expirado — gere um novo pedido"
          : <>Expira em <strong>{timeLeft}</strong></>
        }
      </div>

      {!expired && (
        <>
          {/* QR Code */}
          <div className="pix-qr-wrapper">
            {qrCodeBase64 ? (
              <img
                src={`data:image/png;base64,${qrCodeBase64}`}
                alt="QR Code Pix"
                className="pix-qr-img"
              />
            ) : (
              <div className="pix-qr-placeholder">
                <i className="fas fa-spinner fa-spin"></i>
              </div>
            )}
            <div className="pix-amount">R$ {Number(total).toFixed(2).replace(".", ",")}</div>
          </div>

          {/* Copia e Cola */}
          <div className="pix-copy-section">
            <p className="pix-copy-label">Pix copia e cola</p>
            <div className="pix-copy-row">
              <input
                className="pix-code-input"
                value={copiaECola}
                readOnly
                onClick={(e) => e.target.select()}
              />
              <button className={`pix-copy-btn ${copied ? "copied" : ""}`} onClick={handleCopy}>
                <i className={`fas ${copied ? "fa-check" : "fa-copy"}`}></i>
                {copied ? "Copiado!" : "Copiar"}
              </button>
            </div>
          </div>

          {/* Instruções */}
          <div className="pix-steps">
            <div className="pix-step">
              <span className="step-num">1</span>
              <span>Abra o app do seu banco e vá em <strong>Pix</strong></span>
            </div>
            <div className="pix-step">
              <span className="step-num">2</span>
              <span>Escolha <strong>Pagar com QR code</strong> ou <strong>Copia e Cola</strong></span>
            </div>
            <div className="pix-step">
              <span className="step-num">3</span>
              <span>Confirme o pagamento — o download chega no seu e-mail <strong>automaticamente</strong></span>
            </div>
          </div>

          <div className="pix-polling-note">
            <i className="fas fa-circle-notch fa-spin"></i>
            Aguardando confirmação do pagamento...
          </div>
        </>
      )}

      <style jsx>{`
        .pix-container {
          display: flex;
          flex-direction: column;
          gap: 20px;
          width: 100%;
          max-width: 480px;
          margin: 0 auto;
        }

        .pix-header {
          display: flex;
          align-items: center;
          gap: 14px;
        }

        .pix-icon {
          width: 48px;
          height: 48px;
          background: rgba(50,210,122,0.12);
          color: #32d27a;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.3rem;
          flex-shrink: 0;
        }

        .pix-title {
          font-family: var(--font-display, 'Syne', sans-serif);
          font-size: 1.2rem;
          font-weight: 700;
          color: #fff;
          margin: 0;
        }

        .pix-subtitle {
          font-size: 0.8rem;
          color: #555;
          margin: 3px 0 0;
        }

        .pix-timer {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 11px 16px;
          background: rgba(50,210,122,0.08);
          border: 1px solid rgba(50,210,122,0.2);
          border-radius: 10px;
          font-size: 0.85rem;
          color: #aaa;
        }

        .pix-timer i { color: #32d27a; }
        .pix-timer strong { color: #fff; font-variant-numeric: tabular-nums; }

        .pix-timer.expired {
          background: rgba(255,60,60,0.08);
          border-color: rgba(255,60,60,0.2);
          color: #ff6666;
        }

        .pix-timer.expired i { color: #ff6666; }

        .pix-qr-wrapper {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 12px;
          padding: 24px;
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.06);
          border-radius: 16px;
        }

        .pix-qr-img {
          width: 200px;
          height: 200px;
          border-radius: 8px;
          background: #fff;
          padding: 8px;
        }

        .pix-qr-placeholder {
          width: 200px;
          height: 200px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #444;
          font-size: 2rem;
        }

        .pix-amount {
          font-family: var(--font-display, 'Syne', sans-serif);
          font-size: 1.6rem;
          font-weight: 800;
          color: #fff;
          letter-spacing: -0.5px;
        }

        .pix-copy-section { display: flex; flex-direction: column; gap: 8px; }

        .pix-copy-label {
          font-size: 0.72rem;
          color: #444;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 1px;
        }

        .pix-copy-row { display: flex; gap: 8px; }

        .pix-code-input {
          flex: 1;
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.07);
          border-radius: 8px;
          padding: 10px 14px;
          color: #888;
          font-size: 0.75rem;
          font-family: monospace;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          cursor: pointer;
        }

        .pix-copy-btn {
          background: rgba(50,210,122,0.12);
          border: 1px solid rgba(50,210,122,0.25);
          color: #32d27a;
          padding: 10px 16px;
          border-radius: 8px;
          font-size: 0.82rem;
          font-weight: 600;
          font-family: var(--font-body, 'DM Sans', sans-serif);
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 6px;
          white-space: nowrap;
          transition: all 0.2s;
          flex-shrink: 0;
        }

        .pix-copy-btn:hover { background: rgba(50,210,122,0.2); }

        .pix-copy-btn.copied {
          background: rgba(50,210,122,0.2);
          border-color: rgba(50,210,122,0.5);
        }

        .pix-steps {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        .pix-step {
          display: flex;
          align-items: flex-start;
          gap: 12px;
          font-size: 0.82rem;
          color: #666;
          line-height: 1.4;
        }

        .pix-step strong { color: #aaa; }

        .step-num {
          width: 22px;
          height: 22px;
          background: rgba(255,255,255,0.06);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 0.7rem;
          font-weight: 700;
          color: #555;
          flex-shrink: 0;
          margin-top: 1px;
        }

        .pix-polling-note {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          font-size: 0.75rem;
          color: #333;
          padding-top: 4px;
        }

        .pix-polling-note i { color: #32d27a; }
      `}</style>
    </div>
  );
}
