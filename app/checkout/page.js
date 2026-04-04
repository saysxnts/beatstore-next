"use client";
import { useState } from "react";
import { useStore } from "../context/StoreContext";
import Link from "next/link";

const API = process.env.NEXT_PUBLIC_API_URL;

const PAYMENT_METHODS = [
  { id: "paypal", name: "PayPal", desc: "Available worldwide", icon: "fab fa-paypal", color: "#4b9cf5", bg: "rgba(0,112,243,0.12)", available: true, region: "Global" },
  { id: "card", name: "Credit / Debit Card", desc: "Visa, Mastercard, Amex · via Stripe", icon: "fas fa-credit-card", color: "#888", bg: "rgba(255,255,255,0.05)", available: false, region: "Global" },
  { id: "googlepay", name: "Google Pay", desc: "One-tap checkout", icon: "fas fa-mobile-alt", color: "#888", bg: "rgba(255,255,255,0.05)", available: false, region: "Global" },
  { id: "applepay", name: "Apple Pay", desc: "Fast checkout on Apple devices", icon: "fab fa-apple", color: "#888", bg: "rgba(255,255,255,0.05)", available: false, region: "Global" },
  { id: "crypto", name: "Crypto", desc: "BTC, ETH, USDT", icon: "fab fa-bitcoin", color: "#f7931a", bg: "rgba(247,147,26,0.08)", available: false, region: "Global" },
  { id: "pix", name: "Pix", desc: "Instant payment · Brazil", icon: "fas fa-qrcode", color: "#32d27a", bg: "rgba(50,210,122,0.1)", available: false, region: "Brasil" },
  { id: "boleto", name: "Boleto Bancário", desc: "Bank slip · Brazil", icon: "fas fa-barcode", color: "#aaa", bg: "rgba(255,255,255,0.05)", available: false, region: "Brasil" },
  { id: "mercadopago", name: "Mercado Pago", desc: "Installments · BR / AR / MX", icon: "fas fa-wallet", color: "#00b1ea", bg: "rgba(0,177,234,0.1)", available: false, region: "América Latina" },
  { id: "ideal", name: "iDEAL", desc: "Online banking · Netherlands", icon: "fas fa-university", color: "#cc0066", bg: "rgba(204,0,102,0.1)", available: false, region: "Europe" },
  { id: "klarna", name: "Klarna", desc: "Buy now, pay later · EU / US", icon: "fas fa-tags", color: "#ffb3c7", bg: "rgba(255,179,199,0.08)", available: false, region: "Europe" },
  { id: "sepa", name: "SEPA Direct Debit", desc: "Bank transfer · European Union", icon: "fas fa-landmark", color: "#888", bg: "rgba(255,255,255,0.05)", available: false, region: "Europe" },
  { id: "cashapp", name: "Cash App Pay", desc: "United States only", icon: "fas fa-dollar-sign", color: "#00d632", bg: "rgba(0,214,50,0.08)", available: false, region: "USA" },
  { id: "venmo", name: "Venmo", desc: "United States only", icon: "fas fa-mobile-alt", color: "#3d95ce", bg: "rgba(61,149,206,0.1)", available: false, region: "USA" },
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
      <div className="ck-empty">
        <div className="ck-empty-icon"><i className="fas fa-shopping-bag"></i></div>
        <p className="ck-empty-title">EMPTY CART</p>
        <p className="ck-empty-sub">Add some beats to get started.</p>
        <Link href="/" className="ck-empty-link">← Back to store</Link>
        <style jsx>{`
          .ck-empty {
            min-height: 70vh;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            gap: 12px;
            animation: ckReveal 0.6s cubic-bezier(0.16,1,0.3,1) both;
          }
          .ck-empty-icon {
            width: 80px; height: 80px;
            border: 1px solid rgba(255,255,255,0.06);
            display: flex; align-items: center; justify-content: center;
            font-size: 1.8rem; color: #333;
            margin-bottom: 8px;
          }
          .ck-empty-title {
            font-family: var(--font-display, 'Syne', sans-serif);
            font-size: 1.4rem; font-weight: 800;
            color: #fff; letter-spacing: 4px;
          }
          .ck-empty-sub { font-size: 0.8rem; color: #444; letter-spacing: 1px; }
          .ck-empty-link {
            font-size: 0.75rem; color: #555; text-decoration: none;
            letter-spacing: 2px; text-transform: uppercase;
            margin-top: 16px; transition: color 0.2s;
          }
          .ck-empty-link:hover { color: var(--accent, #d10000); }
          @keyframes ckReveal {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
          }
        `}</style>
      </div>
    );
  }

  return (
    <div className="ck-page">
      <div className="ck-grid">

        {/* ── LEFT: Order Summary ── */}
        <div className="ck-panel ck-reveal" style={{ animationDelay: '0.1s' }}>
          <div className="ck-panel-accent"></div>
          <div className="ck-label">Order Summary</div>

          <div className="ck-items">
            {cart.map((item, i) => (
              <div key={i} className="ck-item">
                <img src={item.image || item.cover} alt={item.name} className="ck-item-img" />
                <div className="ck-item-info">
                  <span className="ck-item-name">{item.name}</span>
                  <span className="ck-item-license">
                    <i className="fas fa-file-audio"></i> WAV License (lease)
                  </span>
                </div>
                <span className="ck-item-price">${item.price.toFixed(2)}</span>
              </div>
            ))}
          </div>

          <div className="ck-line">
            <span>Subtotal ({cart.length} {cart.length === 1 ? "item" : "items"})</span>
            <span>${total.toFixed(2)}</span>
          </div>
          <div className="ck-line">
            <span>Tax</span>
            <span className="ck-green">Included</span>
          </div>
          <div className="ck-total">
            <span>Total</span>
            <span>${total.toFixed(2)}</span>
          </div>

          <div className="ck-note">
            <i className="fas fa-bolt"></i>
            Download links sent to your email instantly after payment.
          </div>
        </div>

        {/* ── RIGHT: Payment ── */}
        <div className="ck-panel ck-reveal" style={{ animationDelay: '0.2s' }}>
          <div className="ck-panel-accent"></div>
          <div className="ck-label">Payment Method</div>

          <div className="ck-region-tabs">
            {REGIONS.map((r) => (
              <button
                key={r}
                className={`ck-region ${regionFilter === r ? "active" : ""}`}
                onClick={() => setRegionFilter(r)}
              >
                {r}
              </button>
            ))}
          </div>

          <div className="ck-methods">
            {filtered.map((method) => (
              <button
                key={method.id}
                className={`ck-method ${!method.available ? "disabled" : ""} ${paymentMethod === method.id && method.available ? "active" : ""}`}
                onClick={() => method.available && setPaymentMethod(method.id)}
                disabled={!method.available}
              >
                <div className="ck-method-icon" style={{ background: method.bg, color: method.color }}>
                  <i className={method.icon}></i>
                </div>
                <div className="ck-method-info">
                  <span className="ck-method-name">{method.name}</span>
                  <span className="ck-method-desc">{method.desc}</span>
                </div>
                <div className="ck-method-right">
                  {method.available
                    ? <div className={`ck-radio ${paymentMethod === method.id ? "checked" : ""}`} />
                    : <span className="ck-badge">Soon</span>
                  }
                </div>
              </button>
            ))}
          </div>

          {error && (
            <div className="ck-error">
              <i className="fas fa-exclamation-triangle"></i> {error}
            </div>
          )}

          <button
            className="ck-pay-btn"
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

          <div className="ck-secure">
            <i className="fas fa-lock"></i>
            Secured · 256-bit SSL encryption
          </div>

          <Link href="/" className="ck-back">← Back to store</Link>
        </div>
      </div>

      <style jsx>{`
        .ck-page {
          min-height: 85vh;
          display: flex;
          align-items: flex-start;
          justify-content: center;
          padding: 40px 20px 100px;
        }

        .ck-grid {
          display: grid;
          grid-template-columns: 400px 1fr;
          gap: 3px;
          width: 100%;
          max-width: 960px;
          align-items: start;
        }

        .ck-reveal {
          animation: ckReveal 0.7s cubic-bezier(0.16,1,0.3,1) both;
        }

        @keyframes ckReveal {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .ck-panel {
          background: rgba(19,19,19,0.9);
          border: 1px solid rgba(255,255,255,0.06);
          padding: 28px;
          backdrop-filter: blur(16px);
          display: flex;
          flex-direction: column;
          position: relative;
          overflow: hidden;
        }

        .ck-panel-accent {
          position: absolute;
          top: 0; left: 0;
          width: 40px; height: 2px;
          background: #d10000;
        }

        .ck-label {
          font-family: var(--font-body, 'DM Sans', sans-serif);
          font-size: 0.65rem;
          font-weight: 600;
          color: #444;
          letter-spacing: 3px;
          text-transform: uppercase;
          margin-bottom: 22px;
        }

        .ck-items { display: flex; flex-direction: column; gap: 14px; margin-bottom: 24px; }

        .ck-item {
          display: flex;
          align-items: center;
          gap: 14px;
          padding: 10px;
          border: 1px solid rgba(255,255,255,0.04);
          transition: all 0.25s;
        }

        .ck-item:hover {
          border-color: rgba(255,255,255,0.08);
          background: rgba(255,255,255,0.02);
        }

        .ck-item-img {
          width: 50px; height: 50px;
          object-fit: cover;
          border: 1px solid rgba(255,255,255,0.06);
          flex-shrink: 0;
        }

        .ck-item-info { flex: 1; min-width: 0; display: flex; flex-direction: column; gap: 3px; }

        .ck-item-name {
          font-family: var(--font-display, 'Syne', sans-serif);
          font-size: 0.88rem; font-weight: 700;
          color: #fff;
          white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
        }

        .ck-item-license { font-size: 0.68rem; color: #444; letter-spacing: 1px; text-transform: uppercase; }
        .ck-item-license i { margin-right: 4px; color: #d10000; }
        .ck-item-price { font-size: 0.88rem; font-weight: 700; color: #fff; white-space: nowrap; letter-spacing: 1px; }

        .ck-line {
          display: flex;
          justify-content: space-between;
          font-size: 0.78rem;
          color: #444;
          padding: 10px 0;
          border-top: 1px solid rgba(255,255,255,0.04);
          letter-spacing: 0.5px;
        }

        .ck-green { color: #3a9c5a; font-weight: 600; }

        .ck-total {
          display: flex;
          justify-content: space-between;
          align-items: baseline;
          padding: 16px 0 0;
          border-top: 1px solid rgba(255,255,255,0.08);
        }

        .ck-total span:first-child {
          font-size: 0.75rem; color: #555;
          letter-spacing: 2px; text-transform: uppercase;
        }

        .ck-total span:last-child {
          font-family: var(--font-display, 'Syne', sans-serif);
          font-size: 2rem; font-weight: 800;
          color: #fff; letter-spacing: -1px;
        }

        .ck-note {
          margin-top: 20px;
          padding: 14px 16px;
          background: rgba(209,0,0,0.06);
          border-left: 2px solid #d10000;
          font-size: 0.75rem;
          color: #666;
          line-height: 1.6;
          letter-spacing: 0.3px;
        }

        .ck-note i { color: #d10000; margin-right: 6px; }

        .ck-region-tabs { display: flex; flex-wrap: wrap; gap: 4px; margin-bottom: 16px; }

        .ck-region {
          background: transparent;
          border: 1px solid rgba(255,255,255,0.06);
          color: #444;
          padding: 6px 14px;
          font-size: 0.65rem;
          font-weight: 600;
          font-family: var(--font-body, 'DM Sans', sans-serif);
          letter-spacing: 1.5px;
          text-transform: uppercase;
          cursor: pointer;
          transition: all 0.25s;
        }

        .ck-region:hover { color: #888; border-color: rgba(255,255,255,0.12); }

        .ck-region.active {
          background: rgba(209,0,0,0.12);
          border-color: rgba(209,0,0,0.4);
          color: #ff4444;
        }

        .ck-methods {
          display: flex;
          flex-direction: column;
          gap: 4px;
          margin-bottom: 20px;
          max-height: 340px;
          overflow-y: auto;
          padding-right: 2px;
        }

        .ck-methods::-webkit-scrollbar { width: 3px; }
        .ck-methods::-webkit-scrollbar-thumb { background: #d10000; }

        .ck-method {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 12px 14px;
          background: rgba(255,255,255,0.02);
          border: 1px solid rgba(255,255,255,0.04);
          cursor: pointer;
          transition: all 0.25s;
          text-align: left;
          width: 100%;
          color: #fff;
        }

        .ck-method:hover:not(.disabled) {
          border-color: rgba(209,0,0,0.3);
          background: rgba(209,0,0,0.04);
          padding-left: 18px;
        }

        .ck-method.active {
          border-color: rgba(209,0,0,0.5);
          background: rgba(209,0,0,0.07);
          border-left: 2px solid #d10000;
        }

        .ck-method.disabled { opacity: 0.2; cursor: not-allowed; }

        .ck-method-icon {
          width: 36px; height: 36px;
          display: flex; align-items: center; justify-content: center;
          font-size: 0.95rem;
          flex-shrink: 0;
        }

        .ck-method-info { flex: 1; display: flex; flex-direction: column; gap: 2px; min-width: 0; }
        .ck-method-name { font-size: 0.85rem; font-weight: 600; color: #fff; }
        .ck-method-desc { font-size: 0.68rem; color: #444; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; letter-spacing: 0.3px; }
        .ck-method-right { display: flex; align-items: center; flex-shrink: 0; }

        .ck-radio {
          width: 16px; height: 16px;
          border: 2px solid #2a2a2a;
          transition: all 0.25s;
        }

        .ck-radio.checked {
          border-color: #d10000;
          background: #d10000;
          box-shadow: 0 0 12px rgba(209,0,0,0.5);
        }

        .ck-badge {
          font-size: 0.58rem; font-weight: 700;
          color: #444;
          background: rgba(255,255,255,0.04);
          padding: 3px 8px;
          letter-spacing: 1px;
          text-transform: uppercase;
        }

        .ck-error {
          padding: 12px 16px;
          background: rgba(255,60,60,0.06);
          border-left: 2px solid #ff4444;
          color: #ff6666;
          font-size: 0.78rem;
          margin-bottom: 14px;
          letter-spacing: 0.3px;
        }

        .ck-pay-btn {
          width: 100%;
          padding: 17px;
          background: #d10000;
          color: #fff;
          border: none;
          font-size: 0.8rem;
          font-weight: 700;
          font-family: var(--font-body, 'DM Sans', sans-serif);
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          transition: all 0.3s cubic-bezier(0.16,1,0.3,1);
          margin-bottom: 14px;
          letter-spacing: 2px;
          text-transform: uppercase;
          position: relative;
          overflow: hidden;
        }

        .ck-pay-btn::after {
          content: '';
          position: absolute;
          top: 0; left: -100%;
          width: 60%; height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent);
          transition: left 0.5s;
        }

        .ck-pay-btn:hover:not(:disabled) {
          background: #ff2020;
          box-shadow: 0 0 50px rgba(209,0,0,0.4);
          transform: translateY(-1px);
        }

        .ck-pay-btn:hover:not(:disabled)::after { left: 120%; }
        .ck-pay-btn:disabled { opacity: 0.25; cursor: not-allowed; background: #333; }

        .ck-secure {
          text-align: center;
          font-size: 0.65rem;
          color: #333;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
          margin-bottom: 18px;
          letter-spacing: 2px;
          text-transform: uppercase;
        }

        .ck-secure i { color: #3a9c5a; }

        .ck-back {
          display: block;
          text-align: center;
          font-size: 0.7rem;
          color: #333;
          transition: color 0.2s;
          letter-spacing: 2px;
          text-transform: uppercase;
        }

        .ck-back:hover { color: #d10000; }

        @media (max-width: 820px) {
          .ck-grid { grid-template-columns: 1fr; }
          .ck-page { padding: 20px 12px 100px; }
          .ck-methods { max-height: none; }
        }
      `}</style>
    </div>
  );
}