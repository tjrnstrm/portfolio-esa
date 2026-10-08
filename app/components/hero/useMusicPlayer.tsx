"use client";

import { usePathname } from "next/navigation";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
  type RefObject,
} from "react";
import { site, type MusicTrack } from "../../content/projects";
import {
  PAGE_AUDIO_FADE_IN_MS,
  PAGE_AUDIO_FADE_OUT_MS,
  musicTrackForPath,
} from "../pageTransition";
import { useBackgroundMusic } from "./useBackgroundMusic";

type MusicPlayerValue = {
  musicRef: RefObject<HTMLAudioElement | null>;
  music: MusicTrack | null;
  musicPaused: boolean;
  musicChanging: boolean;
  toggleMusic: () => void;
  changeMusic: () => Promise<void>;
  preparePageNavigation: (pathname: string) => void;
};

const MusicPlayerContext = createContext<MusicPlayerValue | null>(null);

function fadeVolume(
  audio: HTMLAudioElement,
  target: number,
  duration: number,
  isCurrent: () => boolean,
) {
  const from = audio.volume;
  const started = performance.now();

  return new Promise<boolean>((resolve) => {
    const step = (now: number) => {
      if (!isCurrent()) {
        resolve(false);
        return;
      }
      const progress = Math.max(0, Math.min(1, (now - started) / duration));
      const volume = from + (target - from) * progress;
      audio.volume = Math.max(0, Math.min(1, volume));
      if (progress < 1) requestAnimationFrame(step);
      else resolve(true);
    };
    requestAnimationFrame(step);
  });
}

/** Owns the single audio element above the route template, so navigation
 *  preserves the selected track and its playback position. */
export function MusicPlayerProvider({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const musicRef = useRef<HTMLAudioElement>(null);
  const musicPausedRef = useRef(false);
  const musicChangingRef = useRef(false);
  const fadeTokenRef = useRef(0);
  const [musicPaused, setMusicPaused] = useState(false);
  const [musicChanging, setMusicChanging] = useState(false);
  const [musicIndex, setMusicIndex] = useState(() => musicTrackForPath(pathname));
  const musicIndexRef = useRef(musicIndex);
  const music = site.music[musicIndex] ?? null;

  const fadeTo = useCallback((audio: HTMLAudioElement, target: number, duration: number) => {
    const token = ++fadeTokenRef.current;
    return fadeVolume(audio, target, duration, () => fadeTokenRef.current === token);
  }, []);

  useBackgroundMusic(musicRef, !musicPaused);

  const selectMusic = useCallback((index: number) => {
    musicIndexRef.current = index;
    setMusicIndex(index);
  }, []);

  /* Change to the destination page's preferred track. When it already
     matches, this effect does nothing and the persistent audio plays on. */
  useEffect(() => {
    const nextIndex = musicTrackForPath(pathname);
    if (nextIndex === musicIndexRef.current) return;

    let cancelled = false;
    const audio = musicRef.current;
    const switchForPage = async () => {
      musicChangingRef.current = true;
      setMusicChanging(true);
      try {
        if (!audio) {
          selectMusic(nextIndex);
          return;
        }

        if (musicPausedRef.current) {
          selectMusic(nextIndex);
          await new Promise<void>((resolve) => requestAnimationFrame(() => resolve()));
          if (!cancelled) {
            audio.load();
            audio.volume = 1;
          }
          return;
        }

        if (audio.volume > 0.01) {
          if (!await fadeTo(audio, 0, PAGE_AUDIO_FADE_OUT_MS)) return;
        }
        if (cancelled) return;

        selectMusic(nextIndex);
        await new Promise<void>((resolve) => requestAnimationFrame(() => resolve()));
        if (cancelled) return;

        audio.load();
        audio.muted = false;
        await audio.play();
        await fadeTo(audio, 1, PAGE_AUDIO_FADE_IN_MS);
      } catch {
        if (audio) audio.volume = 1;
        musicPausedRef.current = true;
        setMusicPaused(true);
      } finally {
        if (!cancelled) {
          musicChangingRef.current = false;
          setMusicChanging(false);
        }
      }
    };

    void switchForPage();
    return () => { cancelled = true; };
  }, [fadeTo, pathname, selectMusic]);

  const preparePageNavigation = useCallback((nextPathname: string) => {
    if (musicTrackForPath(nextPathname) === musicIndexRef.current) return;

    const audio = musicRef.current;
    if (!audio || audio.paused || musicPausedRef.current) return;

    musicChangingRef.current = true;
    setMusicChanging(true);
    void fadeTo(audio, 0, PAGE_AUDIO_FADE_OUT_MS);
  }, [fadeTo]);

  const toggleMusic = useCallback(() => {
    const audio = musicRef.current;
    if (!audio) return;
    fadeTokenRef.current += 1;

    if (musicPausedRef.current) {
      audio.muted = false;
      audio.volume = 1;
      audio.play()
        .then(() => {
          musicPausedRef.current = false;
          setMusicPaused(false);
        })
        .catch(() => {
          musicPausedRef.current = true;
          setMusicPaused(true);
        });
    } else {
      audio.pause();
      musicPausedRef.current = true;
      setMusicPaused(true);
    }
  }, []);

  const changeMusic = useCallback(async () => {
    if (site.music.length < 2 || musicChangingRef.current) return;

    const offset = 1 + Math.floor(Math.random() * (site.music.length - 1));
    const nextIndex = (musicIndexRef.current + offset) % site.music.length;
    const audio = musicRef.current;

    if (!audio || musicPausedRef.current) {
      selectMusic(nextIndex);
      return;
    }

    musicChangingRef.current = true;
    setMusicChanging(true);
    try {
      if (!await fadeTo(audio, 0, 280)) return;
      selectMusic(nextIndex);

      await new Promise<void>((resolve) => {
        requestAnimationFrame(() => resolve());
      });
      audio.load();

      if (musicPausedRef.current) {
        audio.volume = 1;
        return;
      }
      audio.muted = false;
      await audio.play();
      await fadeTo(audio, 1, 360);
    } catch {
      audio.volume = 1;
      musicPausedRef.current = true;
      setMusicPaused(true);
    } finally {
      musicChangingRef.current = false;
      setMusicChanging(false);
    }
  }, [fadeTo, selectMusic]);

  const value: MusicPlayerValue = {
    musicRef,
    music,
    musicPaused,
    musicChanging,
    toggleMusic,
    changeMusic,
    preparePageNavigation,
  };

  return (
    <MusicPlayerContext.Provider value={value}>
      {music ? <audio ref={musicRef} src={music.src} loop preload="auto" /> : null}
      {children}
    </MusicPlayerContext.Provider>
  );
}

export function useMusicPlayer() {
  const player = useContext(MusicPlayerContext);
  if (!player) throw new Error("useMusicPlayer must be used within MusicPlayerProvider");
  return player;
}
