"use client";

import { useCallback, useRef, useState, type ReactNode } from "react";
import { site, type Project } from "../../content/projects";
import Background from "./Background";
import Deck from "./Deck";
import Flyer from "./Flyer";
import NowPlaying from "./NowPlaying";
import Rack from "./Rack";
import SiteNav from "./SiteNav";
import { useBackgroundMusic } from "./useBackgroundMusic";
import { useRack } from "./useRack";
import { useTurntable } from "./useTurntable";
import styles from "./Hero.module.css";

type HeroStageProps = {
  projects: Project[];
  /** Static intro, rendered on the server and slotted in. */
  intro: ReactNode;
};

function fadeVolume(audio: HTMLAudioElement, target: number, duration: number) {
  const from = audio.volume;
  const started = performance.now();

  return new Promise<void>((resolve) => {
    const step = (now: number) => {
      const progress = Math.max(0, Math.min(1, (now - started) / duration));
      const volume = from + (target - from) * progress;
      audio.volume = Math.max(0, Math.min(1, volume));
      if (progress < 1) requestAnimationFrame(step);
      else resolve();
    };
    requestAnimationFrame(step);
  });
}

/** The interactive part of the hero. `data-playing` on the section is what
 *  every child stylesheet keys its playing state off. */
export default function HeroStage({ projects, intro }: HeroStageProps) {
  const mouthRef = useRef<HTMLSpanElement>(null);
  const musicRef = useRef<HTMLAudioElement>(null);
  const musicPausedRef = useRef(false);
  const musicChangingRef = useRef(false);
  const [musicPaused, setMusicPaused] = useState(false);
  const [musicChanging, setMusicChanging] = useState(false);
  const [musicIndex, setMusicIndex] = useState(0);
  const music = site.music[musicIndex] ?? null;

  const { rackRef, discRefs, settle, step, center } = useRack(projects.length);
  const { docked, display, flight, toggle, eject, land } = useTurntable({
    discRefs,
    mouthRef,
    musicRef,
    settle,
  });
  useBackgroundMusic(musicRef, !musicPaused);

  const toggleMusic = useCallback(() => {
    const music = musicRef.current;
    if (!music) return;

    if (musicPaused) {
      music.play()
        .then(() => {
          musicPausedRef.current = false;
          setMusicPaused(false);
        })
        .catch(() => {
          musicPausedRef.current = true;
          setMusicPaused(true);
        });
    } else {
      music.pause();
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
      await fadeVolume(audio, 0, 280);
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
      await fadeVolume(audio, 1, 360);
    } catch {
      audio.volume = 1;
      musicPausedRef.current = true;
      setMusicPaused(true);
    } finally {
      musicChangingRef.current = false;
      setMusicChanging(false);
    }
  }, [musicIndex]);

  /* The mouse hovering a disc wins; with no mouse (or nothing hovered),
     whichever disc sits centred in the rack stands in for it. */
  const [hovered, setHovered] = useState<number | null>(null);
  const previewIndex = hovered ?? center;

  const active = display === null ? null : projects[display];
  const preview = display === null ? (projects[previewIndex] ?? null) : null;

  /* A click only plays the disc already centred in the rack — clicking any
     other one just brings it to centre, same as the arrow buttons would. */
  const selectDisc = useCallback((i: number) => {
    if (i === center) toggle(i);
    else settle(i);
  }, [center, toggle, settle]);

  return (
    <section className={styles.hero} data-playing={display !== null}>
      <Background active={active} preview={preview} musicRef={musicRef} music={music} />

      {/* Centred on the hero's full height — not just the band between nav
          and rack — so it isn't pulled up by how much room those take. */}
      <div className={styles.idLayer}>{intro}</div>

      <SiteNav
        music={music}
        musicPaused={musicPaused}
        musicChanging={musicChanging}
        onToggleMusic={toggleMusic}
        onChangeMusic={changeMusic}
      />

      <div className={styles.mid}>
        <NowPlaying project={active} />
      </div>

      <Rack
        projects={projects}
        loaded={docked}
        focused={center}
        rackRef={rackRef}
        discRefs={discRefs}
        onSelect={selectDisc}
        onStep={step}
        onHoverChange={setHovered}
        onEject={() => eject()}
      />

      <Deck mouthRef={mouthRef} />

      {flight ? (
        <Flyer flight={flight} project={projects[flight.index]} onLanded={land} />
      ) : null}
    </section>
  );
}
