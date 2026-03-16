"use client";
import { useStore } from "../context/StoreContext";

export default function LicenseModal({ beat, onClose }) {
  const { addToCart } = useStore();
  const beatCover = beat.coverUrl || beat.cover;

  const handleAdd = () => {
    const license = {
      id: beat.id,
      name: `${beat.name} - WAV`,
      beatName: beat.name,
      licenseType: "WAV",
      price: beat.price,
      image: beatCover,
      audioSrc: beat.audioSrc || beat.audioPreviewDriveId,
      downloadUrl: beat.downloadUrl
    };

    addToCart(license);
    onClose();
  };

  return (
    <div className="modal-backdrop visible" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>×</button>
        <div className="modal-header">
          <img src={beatCover} alt="Cover" style={{ width: 70, height: 70, borderRadius: 6, objectFit: "cover" }} />
          <h3>{beat.name}</h3>
        </div>

        <div className="modal-licenses-list">
          <div className="license-option" onClick={handleAdd}>
            <div className="license-info">
              <h5>WAV</h5>
              <p>WAV LICENSE (Lease)</p>
            </div>
            <button className="license-add-btn">
              ${beat.price}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}