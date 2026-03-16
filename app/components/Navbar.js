"use client";
import { useState } from "react";
import { useStore } from "../context/StoreContext";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const { cart, setIsCartOpen, isCartOpen } = useStore();
  const toggle = () => setIsOpen((p) => !p);

  return (
    <>
      <nav className="top-navbar">
        <span className="navbar-logo">
          SAYS<span>X</span>NTS
        </span>

        <div className="navbar-links">
          <a href="#">beats</a>
          <a href="https://www.instagram.com/saysxnts" target="_blank" rel="noopener noreferrer">instagram</a>
          <a href="https://www.youtube.com/@saysxnts" target="_blank" rel="noopener noreferrer">youtube</a>
        </div>

        <div className="navbar-right">
          <div className="navbar-socials">
            <a href="https://www.instagram.com/saysxnts" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
              <i className="fab fa-instagram"></i>
            </a>
            <a href="https://www.youtube.com/@saysxnts" target="_blank" rel="noopener noreferrer" aria-label="YouTube">
              <i className="fab fa-youtube"></i>
            </a>
          </div>

          {/* Carrinho integrado na navbar */}
          <button
            className="navbar-cart-btn"
            onClick={() => setIsCartOpen(!isCartOpen)}
            aria-label="Abrir carrinho"
          >
            <i className="fas fa-shopping-bag"></i>
            {cart.length > 0 && (
              <span className="navbar-cart-count">{cart.length}</span>
            )}
          </button>

          {/* Mobile hamburger */}
          <button className="hamburger-icon" onClick={toggle} aria-label="Menu">
            <i className={`fas ${isOpen ? "fa-times" : "fa-bars"}`}></i>
          </button>
        </div>
      </nav>

      <div className={`side-menu ${isOpen ? "open" : ""}`}>
        <a href="#" onClick={toggle}>beats</a>
        <a href="https://www.instagram.com/saysxnts" target="_blank" rel="noopener noreferrer" onClick={toggle}>instagram</a>
        <a href="https://www.youtube.com/@saysxnts" target="_blank" rel="noopener noreferrer" onClick={toggle}>youtube</a>
      </div>

      <div className={`backdrop ${isOpen ? "active" : ""}`} onClick={toggle} />
    </>
  );
}