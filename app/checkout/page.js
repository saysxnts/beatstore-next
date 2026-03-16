"use client";
import { useState } from "react";
import { useStore } from "../context/StoreContext";
import Link from "next/link";

const API = process.env.NEXT_PUBLIC_API_URL;

const PAYMENT_METHODS = [
  {
    id: "paypal",
    name: "PayPal",
    desc: "Available worldwide",
    icon: "fab fa-paypal",
    color: "#4b9cf5",
    bg: "rgba(0,112,243,0.12)",
    available: true,
    region: "Global",
  },
  {
    id: "card",
    name: "Credit / Debit Card",
    desc: "Visa, Mastercard, Amex · via Stripe",
    icon: "fas fa-credit-card",
    color: "#888",
    bg: "rgba(255,255,255,0.05)",
    available: false,
    region: "Global",
  },
  {
    id: "googlepay",
    name: "Google Pay",
    desc: "One-tap checkout",
    icon: "fas fa-mobile-alt",
    color: "#888",
    bg: "rgba(255,255,255,0.05)",
    available: false,
    region: "Global",
  },
  {
    id: "applepay",
    name: "Apple Pay",
    desc: "Fast checkout on Apple devices",
    icon: "fab fa-apple",
    color: "#888",
    bg: "rgba(255,255,255,0.05)",
    available: false,
    region: "Global",
  },
  {
    id: "crypto",
    name: "Crypto",
    desc: "BTC, ETH, USDT",
    icon: "fab fa-bitcoin",
    color: "#f7931a",
    bg: "rgba(247,147,26,0.08)",
    available: false,
    region: "Global",
  },
  {
    id: "pix",
    name: "Pix",
    desc: "Instant payment · Brazil",
    icon: "fas fa-qrcode",
    color: "#32d27a",
    bg: "rgba(50,210,122,0.1)",
    available: false,
    region: "Brasil",
  },
  {
    id: "boleto",
    name: "Boleto Bancário",
    desc: "Bank slip · Brazil",
    icon: "fas fa-barcode",
    color: "#aaa",
    bg: "rgba(255,255,255,0.05)",
    available: false,
    region: "Brasil",
  },
  {
    id: "mercadopago",
    name: "Mercado Pago",
    desc: "Installments · BR / AR / MX",
    icon: "fas fa-wallet",
    color: "#00b1ea",
    bg: "rgba(0,177,234,0.1)",
    available: false,
    region: "América Latina",
  },
  {
    id: "ideal",
    name: "iDEAL",
    desc: "Online banking · Netherlands",
    icon: "fas fa-university",
    color: "#cc0066",
    bg: "rgba(204,0,102,0.1)",
    available: false,
    region: "Europe",
  },
  {
    id: "klarna",
    name: "Klarna",
    desc: "Buy now, pay later · EU / US",
    icon: "fas fa-tags",
    color: "#ffb3c7",
    bg: "rgba(255,179,199,0.08)",
    available: false,
    region: "Europe",
  },
  {
    id: "sepa",
    name: "SEPA Direct Debit",
    desc: "Bank transfer · European Union",
    icon: "fas fa-landmark",
    color: "#888",
    bg: "rgba(255,255,255,0.05)",
    available: false,
    region: "Europe",
  },
  {
    id: "cashapp",
    name: "Cash App Pay",
    desc: "United States only",
    icon: "fas fa-dollar-sign",
    color: "#00d632",
    bg: "rgba(0,214,50,0.08)",
    available: false,
    region: "USA",
  },
  {
    id: "venmo",
    name: "Venmo",
    desc: "United States only",
    icon: "fas fa-mobile-alt",
    color: "#3d95ce",
    bg: "rgba(61,149,206,0.1)",
    available: false,
    region: "USA",
  },
];

const REGIONS = ["All", "Global", "Brasil", "América Latina", "Europe", "USA"];

export default function CheckoutPage() {
  const { cart } = useStore();
  const [paymentMethod, setPaymentMethod] = useState("paypal");
  const [regionFilter, setRegionFilter] = useState("All");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const total = cart.reduce((acc, item) => acc + item.price, 0);
  const filtered = PAYMENT_METHODS.filter(
    (m) => regionFilter === "All" || m.region === regionFilter
  );
  const selected = PAYMENT_METHODS.find((m) => m.id === paymentMethod);

  const handlePayPal = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${API}/api/checkout/create`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(cart.map((i) => i.id)),
      });
      if (res.ok) window.location.href = await res.text();
      else setError(await res.text());
    } catch {
      setError("Connection error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handlePay = () => {
    if (!selected?.available || loading) return;
    if (paymentMethod === "paypal") handlePayPal();
  };

  if (cart.length === 0) {
    return (
      <div className="checkout-empty">
        <i className="fas fa-shopping-bag"></i>
        <p>Your cart is empty.</p>
        <Link href="/" className="checkout-back-link">← Back to store</Link>
      </div>
    );
  }

  return (
    <div className="checkout-page">
      <div className="checkout-container">

        {/* ── Left: Order Summary ── */}
        <div className="checkout-panel">
          <div className="checkout-section-label">Order Summary</div>

          <div className="checkout-items">
            {cart.map((item, i) => (
              <div key={i} className="checkout-item">
                <img src={item.image || item.cover} alt={item.name} className="checkout-item-cover" />
                <div className="checkout-item-info">
                  <span className="checkout-item-name">{item.name}</span>
                  <span className="checkout-item-license">
                    <i className="fas fa-file-audio"></i> WAV License (lease)
                  </span>
                </div>
                <span className="checkout-item-price">${item.price.toFixed(2)}</span>
              </div>
            ))}
          </div>

          <div className="checkout-summary-line">
            <span>Subtotal ({cart.length} {cart.length === 1 ? "item" : "items"})</span>
            <span>${total.toFixed(2)}</span>
          </div>
          <div className="checkout-summary-line">
            <span>Tax</span>
            <span className="checkout-free">Included</span>
          </div>
          <div className="checkout-total-line">
            <span>Total</span>
            <span>${total.toFixed(2)}</span>
          </div>

          <div className="checkout-delivery-note">
            <i className="fas fa-bolt"></i>
            Download links sent to your email instantly after payment.
          </div>
        </div>

        {/* ── Right: Payment ── */}
        <div className="checkout-panel">
          <div className="checkout-section-label">Payment Method</div>

          <div className="region-tabs">
            {REGIONS.map((r) => (
              <button
                key={r}
                className={`region-tab ${regionFilter === r ? "active" : ""}`}
                onClick={() => setRegionFilter(r)}
              >
                {r}
              </button>
            ))}
          </div>

          <div className="checkout-methods">
            {filtered.map((method) => (
              <button
                key={method.id}
                className={`checkout-method ${!method.available ? "disabled" : ""} ${paymentMethod === method.id && method.available ? "active" : ""}`}
                onClick={() => method.available && setPaymentMethod(method.id)}
                disabled={!method.available}
              >
                <div className="method-icon" style={{ background: method.bg, color: method.color }}>
                  <i className={method.icon}></i>
                </div>
                <div className="method-info">
                  <span className="method-name">{method.name}</span>
                  <span className="method-desc">{method.desc}</span>
                </div>
                <div className="method-right">
                  {method.available
                    ? <div className={`method-radio ${paymentMethod === method.id ? "checked" : ""}`} />
                    : <span className="method-badge">Soon</span>
                  }
                </div>
              </button>
            ))}
          </div>

          {error && (
            <div className="checkout-error">
              <i className="fas fa-exclamation-triangle"></i> {error}
            </div>
          )}

          <button
            className="checkout-pay-btn"
            onClick={handlePay}
            disabled={loading || !selected?.available}
          >
            {loading ? (
              <><i className="fas fa-spinner fa-spin"></i> Processing...</>
            ) : selected?.available ? (
              <><i className={selected.icon}></i> Pay ${total.toFixed(2)} with {selected.name}</>
            ) : (
              <><i className="fas fa-lock"></i> Select an available method</>
            )}
          </button>

          <div className="checkout-secure">
            <i className="fas fa-lock"></i>
            Secured · 256-bit SSL encryption
          </div>

          <Link href="/" className="checkout-back-link">← Back to store</Link>
        </div>
      </div>

      <style jsx>{`
        .checkout-page {
          min-height: 85vh;
          display: flex;
          align-items: flex-start;
          justify-content: center;
          padding: 40px 20px 100px;
        }

        .checkout-container {
          display: grid;
          grid-template-columns: 400px 1fr;
          gap: 24px;
          width: 100%;
          max-width: 960px;
          align-items: start;
        }

        .checkout-empty {
          min-height: 60vh;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 16px;
          color: #555;
        }

        .checkout-empty i { font-size: 3rem; color: #333; }

        .checkout-panel {
          background: rgba(20,20,20,0.75);
          border: 1px solid rgba(255,255,255,0.07);
          border-radius: 20px;
          padding: 28px;
          backdrop-filter: blur(12px);
          display: flex;
          flex-direction: column;
          gap: 0;
        }

        .checkout-section-label {
          font-family: var(--font-display, 'Syne', sans-serif);
          font-size: 0.68rem;
          font-weight: 700;
          color: #444;
          letter-spacing: 2.5px;
          text-transform: uppercase;
          margin-bottom: 20px;
        }

        .checkout-items { display: flex; flex-direction: column; gap: 14px; margin-bottom: 24px; }
        .checkout-item { display: flex; align-items: center; gap: 14px; }

        .checkout-item-cover {
          width: 52px;
          height: 52px;
          border-radius: 10px;
          object-fit: cover;
          border: 1px solid rgba(255,255,255,0.07);
          flex-shrink: 0;
        }

        .checkout-item-info { flex: 1; min-width: 0; display: flex; flex-direction: column; gap: 3px; }

        .checkout-item-name {
          font-family: var(--font-display, 'Syne', sans-serif);
          font-size: 0.9rem;
          font-weight: 700;
          color: #fff;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .checkout-item-license { font-size: 0.72rem; color: #555; }
        .checkout-item-license i { margin-right: 4px; color: #d10000; }
        .checkout-item-price { font-size: 0.9rem; font-weight: 700; color: #fff; white-space: nowrap; }

        .checkout-summary-line {
          display: flex;
          justify-content: space-between;
          font-size: 0.82rem;
          color: #555;
          padding: 9px 0;
          border-top: 1px solid rgba(255,255,255,0.05);
        }

        .checkout-free { color: #3a9c5a; font-weight: 500; }

        .checkout-total-line {
          display: flex;
          justify-content: space-between;
          align-items: baseline;
          padding: 14px 0 0;
          border-top: 1px solid rgba(255,255,255,0.1);
        }

        .checkout-total-line span:first-child { font-size: 0.85rem; color: #666; }
        .checkout-total-line span:last-child {
          font-family: var(--font-display, 'Syne', sans-serif);
          font-size: 2.2rem;
          font-weight: 800;
          color: #fff;
          letter-spacing: -1.5px;
        }

        .checkout-delivery-note {
          margin-top: 20px;
          padding: 13px 16px;
          background: rgba(209,0,0,0.07);
          border: 1px solid rgba(209,0,0,0.18);
          border-radius: 10px;
          font-size: 0.78rem;
          color: #888;
          line-height: 1.5;
        }

        .checkout-delivery-note i { color: #d10000; margin-right: 6px; }

        .region-tabs { display: flex; flex-wrap: wrap; gap: 6px; margin-bottom: 16px; }

        .region-tab {
          background: transparent;
          border: 1px solid rgba(255,255,255,0.07);
          color: #555;
          padding: 5px 13px;
          border-radius: 99px;
          font-size: 0.72rem;
          font-weight: 600;
          font-family: var(--font-body, 'DM Sans', sans-serif);
          letter-spacing: 0.5px;
          text-transform: uppercase;
          cursor: pointer;
          transition: all 0.2s;
        }

        .region-tab:hover { color: #aaa; border-color: rgba(255,255,255,0.18); }
        .region-tab.active {
          background: rgba(209,0,0,0.15);
          border-color: rgba(209,0,0,0.45);
          color: #ff4444;
        }

        .checkout-methods {
          display: flex;
          flex-direction: column;
          gap: 8px;
          margin-bottom: 20px;
          max-height: 340px;
          overflow-y: auto;
          padding-right: 2px;
        }

        .checkout-methods::-webkit-scrollbar { width: 4px; }
        .checkout-methods::-webkit-scrollbar-thumb { background: #222; border-radius: 99px; }

        .checkout-method {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 13px 14px;
          background: rgba(255,255,255,0.025);
          border: 1px solid rgba(255,255,255,0.06);
          border-radius: 12px;
          cursor: pointer;
          transition: all 0.2s;
          text-align: left;
          width: 100%;
          color: #fff;
        }

        .checkout-method:hover:not(.disabled) {
          border-color: rgba(209,0,0,0.35);
          background: rgba(209,0,0,0.04);
        }

        .checkout-method.active {
          border-color: rgba(209,0,0,0.55);
          background: rgba(209,0,0,0.08);
          box-shadow: 0 0 0 1px rgba(209,0,0,0.18);
        }

        .checkout-method.disabled { opacity: 0.28; cursor: not-allowed; }

        .method-icon {
          width: 38px;
          height: 38px;
          border-radius: 9px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1rem;
          flex-shrink: 0;
        }

        .method-info { flex: 1; display: flex; flex-direction: column; gap: 2px; min-width: 0; }
        .method-name { font-size: 0.88rem; font-weight: 600; color: #fff; }
        .method-desc { font-size: 0.72rem; color: #444; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
        .method-right { display: flex; align-items: center; flex-shrink: 0; }

        .method-radio {
          width: 17px;
          height: 17px;
          border-radius: 50%;
          border: 2px solid #2a2a2a;
          transition: all 0.2s;
        }

        .method-radio.checked {
          border-color: #d10000;
          background: #d10000;
          box-shadow: 0 0 8px rgba(209,0,0,0.5);
        }

        .method-badge {
          font-size: 0.62rem;
          font-weight: 700;
          color: #444;
          background: rgba(255,255,255,0.05);
          padding: 3px 8px;
          border-radius: 99px;
          letter-spacing: 0.5px;
          text-transform: uppercase;
        }

        .checkout-error {
          padding: 12px 16px;
          background: rgba(255,60,60,0.08);
          border: 1px solid rgba(255,60,60,0.2);
          border-radius: 10px;
          color: #ff6666;
          font-size: 0.82rem;
          margin-bottom: 14px;
        }

        .checkout-pay-btn {
          width: 100%;
          padding: 17px;
          background: #d10000;
          color: #fff;
          border: none;
          border-radius: 12px;
          font-size: 0.95rem;
          font-weight: 700;
          font-family: var(--font-body, 'DM Sans', sans-serif);
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          transition: all 0.25s;
          margin-bottom: 13px;
        }

        .checkout-pay-btn:hover:not(:disabled) {
          background: #ff2020;
          box-shadow: 0 8px 32px rgba(209,0,0,0.4);
          transform: translateY(-1px);
        }

        .checkout-pay-btn:disabled { opacity: 0.35; cursor: not-allowed; background: #333; }

        .checkout-secure {
          text-align: center;
          font-size: 0.7rem;
          color: #333;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
          margin-bottom: 18px;
        }

        .checkout-secure i { color: #3a9c5a; }

        .checkout-back-link {
          display: block;
          text-align: center;
          font-size: 0.8rem;
          color: #333;
          transition: color 0.2s;
        }

        .checkout-back-link:hover { color: #666; }

        @media (max-width: 820px) {
          .checkout-container { grid-template-columns: 1fr; }
          .checkout-page { padding: 20px 14px 100px; }
          .checkout-methods { max-height: none; }
        }
      `}</style>
    </div>
  );
}