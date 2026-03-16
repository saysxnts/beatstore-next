"use client";
import { useStore } from "../context/StoreContext";
import { useEffect, useState } from "react";

export default function Player() {
  const { currentBeat, isPlaying, setIsPlaying, audioRef, togglePlay, volume, changeVolume } = useStore();
  const [progress, setProgress] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  const currentCover = currentBeat?.coverUrl || currentBeat?.coverDriveId || currentBeat?.cover || null;

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    if (currentBeat) {
      if (audio.getAttribute("src") !== currentBeat.audioSrc) {
        audio.src = currentBeat.audioSrc;
        audio.load();
        if (isPlaying) audio.play().catch(() => { });
      } else {
        if (isPlaying) audio.play().catch(() => { });
        else audio.pause();
      }
    }
  }, [currentBeat, isPlaying]);

  useEffect(() => {
    if (audioRef.current) audioRef.current.volume = volume;
  }, [volume]);

  const handleTimeUpdate = () => {
    const audio = audioRef.current;
    if (audio) {
      setCurrentTime(audio.currentTime);
      setDuration(audio.duration || 0);
      setProgress((audio.currentTime / (audio.duration || 1)) * 100);
    }
  };

  const handleSeek = (e) => {
    const audio = audioRef.current;
    if (!audio || !audio.duration) return;
    const width = e.currentTarget.clientWidth;
    const clickX = e.nativeEvent.offsetX;
    audio.currentTime = (clickX / width) * audio.duration;
  };

  const formatTime = (s) =>
    `${Math.floor((s || 0) / 60)}:${String(Math.floor((s || 0) % 60)).padStart(2, '0')}`;

  const getVolumeIcon = () => {
    if (volume === 0) return "fa-volume-mute";
    if (volume < 0.5) return "fa-volume-down";
    return "fa-volume-up";
  };

  // Gera o gradiente do slider de volume baseado no valor atual
  const volumePct = Math.round(volume * 100);
  const volumeSliderStyle = {
    background: `linear-gradient(to right, #ffffff ${volumePct}%, rgba(255,255,255,0.15) ${volumePct}%)`,
  };

  return (
    <div className={`sticky-player ${!currentBeat ? "idle" : ""}`} id="sticky-player">
      <audio
        ref={audioRef}
        onTimeUpdate={handleTimeUpdate}
        onEnded={() => setIsPlaying(false)}
        onLoadedMetadata={(e) => setDuration(e.target.duration)}
        preload="none"
      />

      <div className="player-left">
        <img
          id="player-cover"
          src={currentCover}
          alt="Cover"
          style={{ display: currentBeat ? 'block' : 'none' }}
        />
        <div className="player-info">
          <h4 id="player-title">{currentBeat?.name || ""}</h4>
          <p id="player-producer">{currentBeat ? "saysxnts" : ""}</p>
        </div>
      </div>

      <div className="player-center">
        <div className="custom-player-controls">
          <button className="control-button" onClick={togglePlay}>
            <i className={`fas ${isPlaying ? "fa-pause" : "fa-play"}`}></i>
          </button>

          <span className="time-display">{formatTime(currentTime)}</span>
          <div className="timeline" onClick={handleSeek}>
            <div className="progress" style={{ width: `${progress}%` }}></div>
          </div>
          <span className="time-display">{formatTime(duration)}</span>

          <button className="control-button" onClick={() => changeVolume(volume === 0 ? 0.8 : 0)}>
            <i className={`fas ${getVolumeIcon()}`}></i>
          </button>
          <input
            type="range"
            className="volume-slider"
            min="0" max="1" step="0.01"
            value={volume}
            style={volumeSliderStyle}
            onChange={(e) => changeVolume(e.target.value)}
          />
        </div>
      </div>
    </div>
  );
}