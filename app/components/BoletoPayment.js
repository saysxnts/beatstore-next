"use client";
import { useState } from "react";

export default function BoletoPayment({ boletoUrl, barcode, expiresAt, total }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(barcode);
      setCopied(true);
      setTimeout(() => setCopied(false), 3000);
    } catch { /* ignora */ }
  };

  const expiryDate = new Date(expiresAt).toLocaleDateString("pt-BR", {
    day: "2-digit", month: "long", year: "numeric"
  });

  return (
    <div className="boleto-container">
      <div className="boleto-header">
        <div className="boleto-icon">
          <i className="fas fa-barcode"></i>
        </div>
        <div>
          <h2 className="boleto-title">Boleto Bancário</h2>
          <p className="boleto-subtitle">Pague em qualquer banco, lotérica ou app</p>
        </div>
      </div>

      {/* Valor e vencimento */}
      <div className="boleto-info-row">
        <div className="boleto-info-block">
          <span className="boleto-info-label">Valor</span>
          <span className="boleto-info-value">
            R$ {Number(total).toFixed(2).replace(".", ",")}
          </span>
        </div>
        <div className="boleto-info-block">
          <span className="boleto-info-label">Vencimento</span>
          <span className="boleto-info-value">{expiryDate}</span>
        </div>
      </div>

      {/* Aviso importante */}
      <div className="boleto-warning">
        <i className="fas fa-exclamation-triangle"></i>
        <p>
          O pagamento pode levar até <strong>3 dias úteis</strong> para ser confirmado.
          Os links de download serão enviados ao seu e-mail assim que o pagamento
          for identificado.
        </p>
      </div>

      {/* PDF do boleto */}
      <a
        href={boletoUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="boleto-pdf-btn"
      >
        <i className="fas fa-file-pdf"></i>
        Abrir / Imprimir Boleto
      </a>

      {/* Linha digitável */}
      {barcode && (
        <div className="boleto-barcode-section">
          <p className="boleto-barcode-label">Linha digitável</p>
          <div className="boleto-barcode-row">
            <input
              className="boleto-barcode-input"
              value={barcode}
              readOnly
              onClick={(e) => e.target.select()}
            />
            <button
              className={`boleto-copy-btn ${copied ? "copied" : ""}`}
              onClick={handleCopy}
            >
              <i className={`fas ${copied ? "fa-check" : "fa-copy"}`}></i>
              {copied ? "Copiado!" : "Copiar"}
            </button>
          </div>
        </div>
      )}

      {/* Instruções */}
      <div className="boleto-steps">
        <div className="boleto-step">
          <span className="step-num">1</span>
          <span>Abra o boleto em PDF ou copie a linha digitável</span>
        </div>
        <div className="boleto-step">
          <span className="step-num">2</span>
          <span>Pague no app do seu banco, lotérica ou caixa eletrônico</span>
        </div>
        <div className="boleto-step">
          <span className="step-num">3</span>
          <span>
            Após a compensação (até 3 dias úteis), os downloads chegam
            no seu <strong>e-mail automaticamente</strong>
          </span>
        </div>
      </div>

      <style jsx>{`
        .boleto-container {
          display: flex;
          flex-direction: column;
          gap: 18px;
          width: 100%;
          max-width: 480px;
          margin: 0 auto;
        }

        .boleto-header {
          display: flex;
          align-items: center;
          gap: 14px;
        }

        .boleto-icon {
          width: 48px;
          height: 48px;
          background: rgba(255,255,255,0.05);
          color: #aaa;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.3rem;
          flex-shrink: 0;
        }

        .boleto-title {
          font-family: var(--font-display, 'Syne', sans-serif);
          font-size: 1.2rem;
          font-weight: 700;
          color: #fff;
          margin: 0;
        }

        .boleto-subtitle { font-size: 0.8rem; color: #555; margin: 3px 0 0; }

        .boleto-info-row {
          display: flex;
          gap: 12px;
        }

        .boleto-info-block {
          flex: 1;
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.06);
          border-radius: 10px;
          padding: 14px 16px;
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .boleto-info-label {
          font-size: 0.68rem;
          color: #444;
          text-transform: uppercase;
          letter-spacing: 1px;
          font-weight: 600;
        }

        .boleto-info-value {
          font-family: var(--font-display, 'Syne', sans-serif);
          font-size: 1rem;
          font-weight: 700;
          color: #fff;
        }

        .boleto-warning {
          display: flex;
          gap: 12px;
          padding: 14px 16px;
          background: rgba(255,160,0,0.07);
          border: 1px solid rgba(255,160,0,0.18);
          border-radius: 10px;
          font-size: 0.8rem;
          color: #888;
          line-height: 1.5;
        }

        .boleto-warning i { color: #ffa000; font-size: 0.9rem; margin-top: 2px; flex-shrink: 0; }
        .boleto-warning strong { color: #ccc; }

        .boleto-pdf-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          padding: 15px;
          background: rgba(255,255,255,0.05);
          border: 1px solid rgba(255,255,255,0.12);
          border-radius: 12px;
          color: #fff;
          font-size: 0.9rem;
          font-weight: 600;
          font-family: var(--font-body, 'DM Sans', sans-serif);
          transition: all 0.2s;
          text-decoration: none;
        }

        .boleto-pdf-btn i { color: #ff4444; font-size: 1rem; }
        .boleto-pdf-btn:hover { background: rgba(255,255,255,0.09); border-color: rgba(255,255,255,0.2); }

        .boleto-barcode-section { display: flex; flex-direction: column; gap: 8px; }

        .boleto-barcode-label {
          font-size: 0.72rem;
          color: #444;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 1px;
        }

        .boleto-barcode-row { display: flex; gap: 8px; }

        .boleto-barcode-input {
          flex: 1;
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.07);
          border-radius: 8px;
          padding: 10px 14px;
          color: #666;
          font-size: 0.72rem;
          font-family: monospace;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          cursor: pointer;
        }

        .boleto-copy-btn {
          background: rgba(255,255,255,0.05);
          border: 1px solid rgba(255,255,255,0.1);
          color: #aaa;
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

        .boleto-copy-btn:hover { background: rgba(255,255,255,0.1); color: #fff; }
        .boleto-copy-btn.copied { background: rgba(50,210,122,0.12); border-color: rgba(50,210,122,0.3); color: #32d27a; }

        .boleto-steps { display: flex; flex-direction: column; gap: 10px; }

        .boleto-step {
          display: flex;
          align-items: flex-start;
          gap: 12px;
          font-size: 0.82rem;
          color: #555;
          line-height: 1.4;
        }

        .boleto-step strong { color: #888; }

        .step-num {
          width: 22px;
          height: 22px;
          background: rgba(255,255,255,0.05);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 0.7rem;
          font-weight: 700;
          color: #444;
          flex-shrink: 0;
          margin-top: 1px;
        }
      `}</style>
    </div>
  );
}
