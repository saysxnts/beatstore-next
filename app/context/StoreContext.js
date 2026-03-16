"use client";
import {
  createContext, useContext, useState, useRef,
  useEffect, useMemo, useCallback,
} from "react";

const StoreContext = createContext();
const API = process.env.NEXT_PUBLIC_API_URL;

export function StoreProvider({ children }) {
  const [currentBeat, setCurrentBeat] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef(null);
  const [volume, setVolume] = useState(0.8);
  const [cart, setCart] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [beats, setBeats] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [fetchError, setFetchError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTag, setSelectedTag] = useState("All");
  const [toast, setToast] = useState(null);

  const showToast = useCallback((msg) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  }, []);

  useEffect(() => {
    setIsLoading(true);
    setFetchError(null);
    fetch(`${API}/api/beats`)
      .then((res) => {
        if (!res.ok) throw new Error(`Erro ${res.status}`);
        return res.json();
      })
      .then((data) => setBeats(data))
      .catch((err) => setFetchError(err.message))
      .finally(() => setIsLoading(false));
  }, []);

  const filteredBeats = useMemo(() => beats.filter((beat) => {
    const matchesSearch =
      beat.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      beat.producer.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTag = selectedTag === "All" || (beat.tags && beat.tags.includes(selectedTag));
    return matchesSearch && matchesTag;
  }), [beats, searchQuery, selectedTag]);

  const allTags = useMemo(() => {
    const tags = new Set(beats.flatMap((b) => b.tags || []));
    return ["All", ...Array.from(tags)];
  }, [beats]);

  useEffect(() => {
    try {
      const raw = localStorage.getItem("beatCart");
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed) && parsed.every((i) => i.id !== undefined && i.name && typeof i.price === "number"))
          setCart(parsed);
        else localStorage.removeItem("beatCart");
      }
    } catch { localStorage.removeItem("beatCart"); }

    try {
      const savedVol = localStorage.getItem("playerVolume");
      if (savedVol) setVolume(parseFloat(savedVol));
    } catch { /* ignore */ }
  }, []);

  useEffect(() => { localStorage.setItem("beatCart", JSON.stringify(cart)); }, [cart]);

  const playBeat = useCallback((beat) => {
    const audioSource = beat.audioUrl || beat.audioPreviewDriveId || beat.audioSrc;
    if (currentBeat?.id === beat.id) setIsPlaying((p) => !p);
    else { setCurrentBeat({ ...beat, audioSrc: audioSource }); setIsPlaying(true); }
  }, [currentBeat]);

  const togglePlay = useCallback(() => setIsPlaying((p) => !p), []);

  const changeVolume = useCallback((val) => {
    const v = parseFloat(val);
    setVolume(v);
    if (audioRef.current) audioRef.current.volume = v;
    localStorage.setItem("playerVolume", v);
  }, []);

  const addToCart = useCallback((item) => {
    const exists = cart.find((i) => i.name === item.name);
    if (exists) { showToast("Item already in cart."); return; }
    setCart((prev) => [...prev, item]);
    setIsCartOpen(true);
  }, [cart, showToast]);

  const removeFromCart = useCallback((index) => {
    setCart((prev) => prev.filter((_, i) => i !== index));
  }, []);

  const clearCart = useCallback(() => setCart([]), []);

  return (
    <StoreContext.Provider value={{
      beats, isLoading, fetchError,
      filteredBeats, searchQuery, setSearchQuery, selectedTag, setSelectedTag, allTags,
      currentBeat, isPlaying, setIsPlaying, audioRef, playBeat, togglePlay,
      volume, changeVolume,
      cart, addToCart, removeFromCart, clearCart, isCartOpen, setIsCartOpen,
      toast, showToast,
    }}>
      {children}

      {toast && (
        <div style={{
          position: "fixed", bottom: "108px", left: "50%",
          transform: "translateX(-50%)",
          background: "rgba(22,22,22,0.95)",
          backdropFilter: "blur(12px)",
          color: "#fff", padding: "10px 22px",
          borderRadius: "99px",
          border: "1px solid rgba(255,255,255,0.1)",
          fontSize: "13px", zIndex: 9999,
          pointerEvents: "none",
          boxShadow: "0 8px 32px rgba(0,0,0,0.5)",
          fontFamily: "var(--font-body)",
          whiteSpace: "nowrap",
        }}>
          {toast}
        </div>
      )}
    </StoreContext.Provider>
  );
}

export const useStore = () => useContext(StoreContext);