"use client";

import {
  createContext,
  useCallback,
  useContext,
  useRef,
  useState,
  type ReactNode,
  type RefObject,
} from "react";
import { site, type MusicTrack } from "../../content/projects";

type MusicPlayerValue = {
  musicRef: RefObject<HTMLAudioElement | null>;
  tracks: MusicTrack[];
  /** The selected track, playing or not. */
  track: MusicTrack;
  trackIndex: number;
  musicPaused: boolean;
  playTrack: (index: number) => void;
  pauseMusic: () => void;
};

const MusicPlayerContext = createContext<MusicPlayerValue | null>(null);

/** Owns the single audio element above the route template, so navigation
 *  keeps the chosen track and its position. Nothing plays until the visitor
 *  picks a track: the source is set and play() called inside that click, so
 *  every browser treats it as a user-started sound. */
export function MusicPlayerProvider({ children }: { children: ReactNode }) {
  const tracks = site.music;
  const musicRef = useRef<HTMLAudioElement>(null);
  const loadedRef = useRef<number | null>(null);
  const [trackIndex, setTrackIndex] = useState(0);
  const [musicPaused, setMusicPaused] = useState(true);

  const playTrack = useCallback((index: number) => {
    const audio = musicRef.current;
    const next = tracks[index];
    if (!audio || !next) return;
    if (loadedRef.current !== index) {
      audio.src = next.src;
      loadedRef.current = index;
    }
    setTrackIndex(index);
    audio.muted = false;
    audio.volume = 1;
    audio.play()
      .then(() => setMusicPaused(false))
      .catch(() => setMusicPaused(true));
  }, [tracks]);

  const pauseMusic = useCallback(() => {
    musicRef.current?.pause();
    setMusicPaused(true);
  }, []);

  const value: MusicPlayerValue = {
    musicRef,
    tracks,
    track: tracks[trackIndex],
    trackIndex,
    musicPaused,
    playTrack,
    pauseMusic,
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
