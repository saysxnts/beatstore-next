"use client";
import { useStore } from "../context/StoreContext";
import { useState, useRef, useCallback } from "react";
import LicenseModal from "./LicenseModal";

export default function BeatItem({ beat }) {
  const { playBeat, currentBeat, isPlaying, showToast } = useStore();
  const [showLicenseModal, setShowLicenseModal] = useState(false);
  const cardRef = useRef(null);
  const glareRef = useRef(null);
  const rafRef = useRef(null);

  const isCurrent = currentBeat?.id === beat.id;
  const beatCover = beat.coverUrl || beat.coverDriveId || beat.cover;

  const TILT_MAX = 15; // graus máximos de inclinação

  const handleMouseMove = useCallback((e) => {
    if (!cardRef.current) return;
    // Cancela o frame anterior para evitar acúmulo
    if (rafRef.current) cancelAnimationFrame(rafRef.current);

    rafRef.current = requestAnimationFrame(() => {
      const card = cardRef.current;
      if (!card) return;
      const rect = card.getBoundingClientRect();
      // Posição relativa do mouse dentro do card (0 a 1)
      const x = (e.clientX - rect.left) / rect.width;
      const y = (e.clientY - rect.top) / rect.height;
      // Converte para rotação (-TILT_MAX a +TILT_MAX)
      const rotateY = (x - 0.5) * TILT_MAX * 2;
      const rotateX = (0.5 - y) * TILT_MAX * 2;

      card.style.transform =
        `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.03, 1.03, 1.03)`;

      // Glare / reflexo de luz
      if (glareRef.current) {
        glareRef.current.style.opacity = "1";
        glareRef.current.style.background =
          `radial-gradient(circle at ${x * 100}% ${y * 100}%, rgba(255,255,255,0.12) 0%, transparent 60%)`;
      }
    });
  }, []);

  const handleMouseLeave = useCallback(() => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    const card = cardRef.current;
    if (!card) return;
    // Volta suavemente para a posição original
    card.style.transform =
      "perspective(800px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)";
    if (glareRef.current) {
      glareRef.current.style.opacity = "0";
    }
  }, []);

  const handleShare = async (e) => {
    e.stopPropagation();
    const url = `${window.location.origin}#${encodeURIComponent(beat.name)}`;
    try {
      await navigator.clipboard.writeText(url);
      showToast(`Link copiado: ${beat.name}`);
    } catch {
      showToast("Não foi possível copiar o link.");
    }
  };

  return (
    <>
      <article
        ref={cardRef}
        className={`beat-row animated-row visible tilt-card ${isCurrent ? "playing" : ""}`}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
      >
        {/* Glare overlay */}
        <div ref={glareRef} className="tilt-glare" />

        <div className="beat-play-cell">
          <button
            className="play-pause-btn"
            onClick={(e) => { e.stopPropagation(); playBeat(beat); }}
            aria-label={isCurrent && isPlaying ? "Pausar" : "Tocar"}
          >
            <i className={`fas ${isCurrent && isPlaying ? "fa-pause" : "fa-play"}`} />
          </button>

          <picture>
            <img src={beatCover} alt={beat.name} className="beat-cover" />
          </picture>

          <div className="beat-share-overlay">
            <button className="action-btn" onClick={handleShare} aria-label="Compartilhar">
              <i className="fas fa-share-alt" />
            </button>
          </div>
        </div>

        <div className="beat-title-cell">
          <span className="beat-name">{beat.name}</span>
          <span className="producer-name">{beat.producer}</span>
        </div>

        <div className="beat-tags-cell">
          {(beat.tags || []).map((tag, i) => (
            <span key={i} className="tag">
              <i className="fas fa-fire" /> {tag}
            </span>
          ))}
        </div>

        <div className="beat-price-cell">
          <button className="price-button" onClick={() => setShowLicenseModal(true)}>
            <i className="fas fa-shopping-bag" />
            ${beat.price?.toFixed(2)}
          </button>
        </div>
      </article>

      {showLicenseModal && (
        <LicenseModal beat={beat} onClose={() => setShowLicenseModal(false)} />
      )}
    </>
  );
}