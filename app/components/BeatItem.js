"use client";
import { useStore } from "../context/StoreContext";
import { useState } from "react";
import LicenseModal from "./LicenseModal";

export default function BeatItem({ beat }) {
  const { playBeat, currentBeat, isPlaying, showToast } = useStore();
  const [showLicenseModal, setShowLicenseModal] = useState(false);

  const isCurrent = currentBeat?.id === beat.id;
  const beatCover = beat.coverUrl || beat.coverDriveId || beat.cover;

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
      <article className={`beat-row animated-row visible ${isCurrent ? "playing" : ""}`}>
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