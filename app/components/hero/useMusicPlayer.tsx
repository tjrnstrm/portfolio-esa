"use client";

import {
  createContext,
  useCallback,
  useContext,
  useRef,
  useState,
  useSyncExternalStore,
  type ReactNode,
} from "react";
import { site, type MusicTrack } from "../../content/projects";

type MusicPlayerValue = {
  tracks: MusicTrack[];
  /** The selected track, playing or not. */
  track: MusicTrack;
  trackIndex: number;
  musicPaused: boolean;
  playTrack: (index: number) => void;
  pauseMusic: () => void;
  /** The listener's volume, 0 to 1. Remembered between visits. */
  volume: number;
  setVolume: (volume: number) => void;
  /** Mute, or back to the volume from before muting. */
  toggleMute: () => void;
  /** Ramps the music down (0) or back up (1) around a video, on top of
   *  the listener's volume. */
  fadeMusic: (target: number, duration?: number) => void;
};

const MusicPlayerContext = createContext<MusicPlayerValue | null>(null);
const STORAGE_KEY = "esa-bgm-volume";
const DEFAULT_VOLUME = 0.8;

/* The listener's volume lives in localStorage so it's remembered between
   visits; this small store lets React read it (the server, which has no
   storage, renders the default). */
const volumeListeners = new Set<() => void>();
let storedVolume: number | null = null;

function readVolume(): number {
  if (storedVolume === null) {
    storedVolume = DEFAULT_VOLUME;
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved !== null && Number.isFinite(Number(saved))) {
        storedVolume = Math.max(0, Math.min(1, Number(saved)));
      }
    } catch {}
  }
  return storedVolume;
}

function writeVolume(v: number) {
  storedVolume = v;
  try {
    localStorage.setItem(STORAGE_KEY, String(v));
  } catch {}
  volumeListeners.forEach((listener) => listener());
}

function subscribeVolume(listener: () => void) {
  volumeListeners.add(listener);
  return () => volumeListeners.delete(listener);
}

/** Owns the single audio element above the route template, so navigation
 *  keeps the chosen track and its position. Nothing plays until the visitor
 *  picks a track: the source is set and play() called inside that click, so
 *  every browser treats it as a user-started sound.
 *
 *  What you hear is the listener's volume times a fade factor that videos
 *  ramp down and up, so playing a disc never loses the chosen level. */
export function MusicPlayerProvider({ children }: { children: ReactNode }) {
  const tracks = site.music;
  const musicRef = useRef<HTMLAudioElement>(null);
  const loadedRef = useRef<number | null>(null);
  const [trackIndex, setTrackIndex] = useState(0);
  const [musicPaused, setMusicPaused] = useState(true);
  const volume = useSyncExternalStore(subscribeVolume, readVolume, () => DEFAULT_VOLUME);
  const lastAudibleRef = useRef(DEFAULT_VOLUME);
  const fadeRef = useRef(1);
  const fadeTokenRef = useRef(0);

  /* iOS ignores the volume setter (the hardware buttons control the real
     level), so a silent level also sets `muted`, which iOS does respect. */
  const apply = useCallback(() => {
    const audio = musicRef.current;
    if (!audio) return;
    const level = readVolume() * fadeRef.current;
    audio.volume = Math.max(0, Math.min(1, level));
    audio.muted = level === 0;
  }, []);

  const setVolume = useCallback((next: number) => {
    writeVolume(Math.max(0, Math.min(1, next)));
    apply();
  }, [apply]);

  const toggleMute = useCallback(() => {
    const current = readVolume();
    if (current > 0) lastAudibleRef.current = current;
    setVolume(current > 0 ? 0 : lastAudibleRef.current);
  }, [setVolume]);

  const fadeMusic = useCallback((target: number, duration = 620) => {
    const token = ++fadeTokenRef.current;
    const from = fadeRef.current;
    const start = performance.now();
    const step = (now: number) => {
      if (fadeTokenRef.current !== token) return;
      const t = Math.max(0, Math.min(1, (now - start) / duration));
      fadeRef.current = from + (target - from) * t;
      apply();
      if (t < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [apply]);

  const playTrack = useCallback((index: number) => {
    const audio = musicRef.current;
    const next = tracks[index];
    if (!audio || !next) return;
    if (loadedRef.current !== index) {
      audio.src = next.src;
      loadedRef.current = index;
    }
    setTrackIndex(index);
    // Picking a track while muted means you want to hear it.
    if (readVolume() === 0) setVolume(lastAudibleRef.current);
    apply();
    audio.play()
      .then(() => setMusicPaused(false))
      .catch(() => setMusicPaused(true));
  }, [tracks, apply, setVolume]);

  const pauseMusic = useCallback(() => {
    musicRef.current?.pause();
    setMusicPaused(true);
  }, []);

  const value: MusicPlayerValue = {
    tracks,
    track: tracks[trackIndex],
    trackIndex,
    musicPaused,
    playTrack,
    pauseMusic,
    volume,
    setVolume,
    toggleMute,
    fadeMusic,
  };

  return (
    <MusicPlayerContext.Provider value={value}>
      <audio ref={musicRef} loop preload="none" />
      {children}
    </MusicPlayerContext.Provider>
  );
}

export function useMusicPlayer() {
  const player = useContext(MusicPlayerContext);
  if (!player) throw new Error("useMusicPlayer must be used within MusicPlayerProvider");
  return player;
}
