"use client";
import { useStore } from "../context/StoreContext";
import { useRouter } from "next/navigation";

const API = process.env.NEXT_PUBLIC_API_URL;

export default function Cart() {
  const { cart, removeFromCart, isCartOpen, setIsCartOpen } = useStore();
  const router = useRouter();
  const total = cart.reduce((acc, item) => acc + item.price, 0);

  const handleCheckout = () => {
    if (cart.length === 0) return;
    setIsCartOpen(false);
    router.push("/checkout");
  };

  return (
    <aside className={`cart ${isCartOpen ? "show" : ""}`}>
      <div className="cart-header">
        <h3>Your Cart</h3>
        <button className="close-cart-btn" onClick={() => setIsCartOpen(false)}>×</button>
      </div>

      {cart.length === 0 ? (
        <p className="cart-empty-message">Your cart is empty.</p>
      ) : (
        <ul id="cart-items">
          {cart.map((item, i) => (
            <li key={i} className="cart-item">
              <img src={item.image || item.cover} alt={item.name} className="cart-item-image" />
              <div className="cart-item-info">
                <span className="cart-item-name">{item.name}</span>
                <span className="cart-item-price">${item.price.toFixed(2)}</span>
              </div>
              <button
                className="remove-item-btn"
                onClick={() => removeFromCart(i)}
                aria-label={`Remover ${item.name}`}
              >
                <i className="fas fa-times"></i>
              </button>
            </li>
          ))}
        </ul>
      )}

      <div className="cart-footer">
        <div className="cart-total">
          <span>Total</span>
          <span>${total.toFixed(2)}</span>
        </div>
        <button
          className="checkout-button"
          onClick={handleCheckout}
          disabled={cart.length === 0}
        >
          <i className="fas fa-arrow-right"></i> Review Order
        </button>
      </div>
    </aside>
  );
}