"use client";

import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { site } from "../../content/projects";
import {
  PAGE_AUDIO_FADE_IN_MS,
  PAGE_AUDIO_FADE_OUT_MS,
  PAGE_AUDIO_TRANSITION_KEY,
  PAGE_LEAVE_EVENT,
} from "../pageTransition";
import { useBackgroundMusic } from "./useBackgroundMusic";

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

/** Shared ambient-player state for pages that use the header music control. */
export function useMusicPlayer(initialIndex = 0) {
  const musicRef = useRef<HTMLAudioElement>(null);
  const musicPausedRef = useRef(false);
  const musicChangingRef = useRef(false);
  const fadeTokenRef = useRef(0);
  const pageFadeInRef = useRef(false);
  const [musicPaused, setMusicPaused] = useState(false);
  const [musicChanging, setMusicChanging] = useState(false);
  const [musicIndex, setMusicIndex] = useState(() => (
    Math.max(0, Math.min(initialIndex, site.music.length - 1))
  ));
  const music = site.music[musicIndex] ?? null;

  const fadeTo = useCallback((audio: HTMLAudioElement, target: number, duration: number) => {
    const token = ++fadeTokenRef.current;
    return fadeVolume(audio, target, duration, () => fadeTokenRef.current === token);
  }, []);

  /* A transition link leaves a flag for the new page. Set volume before
     passive effects attempt playback, then bring the new page's track in. */
  useLayoutEffect(() => {
    const audio = musicRef.current;
    const requested =
      pageFadeInRef.current || sessionStorage.getItem(PAGE_AUDIO_TRANSITION_KEY) === "1";
    if (!audio || !requested) return;

    pageFadeInRef.current = true;
    sessionStorage.removeItem(PAGE_AUDIO_TRANSITION_KEY);
    audio.volume = 0;
    const frame = requestAnimationFrame(() => {
      void fadeTo(audio, 1, PAGE_AUDIO_FADE_IN_MS);
    });
    return () => cancelAnimationFrame(frame);
  }, [fadeTo]);

  useBackgroundMusic(musicRef, !musicPaused);

  useEffect(() => {
    const fadeBeforeNavigation = () => {
      const audio = musicRef.current;
      if (!audio || audio.paused) return;
      void fadeTo(audio, 0, PAGE_AUDIO_FADE_OUT_MS);
    };
    window.addEventListener(PAGE_LEAVE_EVENT, fadeBeforeNavigation);
    return () => window.removeEventListener(PAGE_LEAVE_EVENT, fadeBeforeNavigation);
  }, [fadeTo]);

  const toggleMusic = useCallback(() => {
    const audio = musicRef.current;
    if (!audio) return;
    fadeTokenRef.current += 1;

    if (musicPaused) {
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
  }, [musicPaused]);

  const changeMusic = useCallback(async () => {
    if (site.music.length < 2 || musicChangingRef.current) return;

    const offset = 1 + Math.floor(Math.random() * (site.music.length - 1));
    const nextIndex = (musicIndex + offset) % site.music.length;
    const audio = musicRef.current;

    if (!audio || musicPausedRef.current) {
      setMusicIndex(nextIndex);
      return;
    }

    musicChangingRef.current = true;
    setMusicChanging(true);
    try {
      if (!await fadeTo(audio, 0, 280)) return;
      setMusicIndex(nextIndex);

      /* Let React commit the new `src` before loading it. Mutating `src`
         here as well makes the two updates race and can abort `play()`. */
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
  }, [fadeTo, musicIndex]);

  return {
    musicRef,
    music,
    musicPaused,
    musicChanging,
    toggleMusic,
    changeMusic,
  };
}
