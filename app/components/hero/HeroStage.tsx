"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { showreel, type Project, type ProjectInfo } from "../../content/projects";
import Background from "./Background";
import Intro from "./Intro";
import Shelves from "./Shelves";
import SiteNav from "./SiteNav";
import Sparkle from "./Sparkle";
import VideoControls from "./VideoControls";
import { useMusicFade } from "./useMusicFade";
import { useMusicPlayer } from "./useMusicPlayer";
import styles from "./Hero.module.css";

/** The home page. While browsing: header, logo with the showreel button,
 *  and the row of discs over a blurred preview. Playing anything fades
 *  all of that out and leaves the video, its controls and a close button.
 *  `data-playing` on the section is what every stylesheet keys off. */
export default function HeroStage({ discs }: { discs: Project[] }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const returnFocusRef = useRef<HTMLElement | null>(null);
  const [active, setActive] = useState<Project | null>(null);
  /* The last thing played; keeps the spinning disc drawn while the player
     fades out after `active` is cleared. */
  const [shown, setShown] = useState<Project | null>(null);
  const [hovered, setHovered] = useState<Project | null>(null);
  const [videoTime, setVideoTime] = useState(0);
  const [videoDuration, setVideoDuration] = useState(0);
  const [videoPaused, setVideoPaused] = useState(true);
  const { musicRef } = useMusicPlayer();
  const fadeMusic = useMusicFade(musicRef);

  const play = useCallback((project: Project) => {
    returnFocusRef.current = document.activeElement as HTMLElement | null;
    setVideoTime(0);
    setVideoDuration(0);
    setActive(project);
    setShown(project);
    fadeMusic(0);
  }, [fadeMusic]);

  const close = useCallback(() => {
    setActive(null);
    fadeMusic(1);
    returnFocusRef.current?.focus();
  }, [fadeMusic]);

  const syncVideoState = useCallback(() => {
    const video = videoRef.current;
    if (!video) return;
    if (video.ended) {
      close();
      return;
    }
    setVideoTime(Number.isFinite(video.currentTime) ? video.currentTime : 0);
    setVideoDuration(Number.isFinite(video.duration) ? video.duration : 0);
    setVideoPaused(video.paused);
  }, [close]);

  const toggleVideo = useCallback(() => {
    const video = videoRef.current;
    if (!video) return;
    if (video.paused) void video.play();
    else video.pause();
  }, []);

  const seekVideo = useCallback((time: number) => {
    const video = videoRef.current;
    if (!video || !Number.isFinite(time)) return;
    video.currentTime = time;
    setVideoTime(time);
  }, []);

  /* Focus moves to Close when a video starts, and Esc closes it. */
  useEffect(() => {
    if (!active) return;
    closeRef.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [active, close]);

  const playing = active !== null;
  const info = shown ? infoAt(shown, videoTime) : undefined;

  return (
    <section className={styles.hero} data-playing={playing}>
      <Background
        active={active}
        preview={playing ? null : (hovered ?? showreel)}
        videoRef={videoRef}
        onVideoStateChange={syncVideoState}
      />

      <SiteNav />
      <Intro onPlayShowreel={() => play(showreel)} />
      <Shelves discs={discs} onPlay={play} onHover={setHovered} />

      {/* The only things left on screen while a video plays: a round close
          button top right, and at the bottom a few lines about the work
          over the playing disc and the video controls. */}
      <div className={styles.player} aria-hidden={!playing}>
        <button
          ref={closeRef}
          type="button"
          className={styles.close}
          onClick={close}
          tabIndex={playing ? 0 : -1}
          aria-label={active ? `Close ${active.title}` : "Close video"}
        >
          <svg width="14" height="14" viewBox="0 0 12 12" aria-hidden="true">
            <path d="M2 2 L10 10 M10 2 L2 10" stroke="currentColor" strokeWidth="1.4" />
          </svg>
        </button>
        <div className={styles.dock}>
          <InfoFade info={info} />
          <div className={styles.deck}>
            {shown ? (
              <span
                className={styles.spinner}
                data-paused={videoPaused}
                aria-hidden="true"
              >
                <span
                  className={styles.spinVinyl}
                  style={{ backgroundImage: `url(${shown.poster})` }}
                />
                {shown.labelColor ? (
                  <span className={styles.spinLabel} style={{ background: shown.labelColor }} />
                ) : null}
                <span className={styles.spinHole} />
              </span>
            ) : null}
            <VideoControls
              visible={playing}
              currentTime={videoTime}
              duration={videoDuration}
              paused={videoPaused}
              onToggle={toggleVideo}
              onSeek={seekVideo}
            />
          </div>
        </div>
      </div>
    </section>
  );
}

/** What to show beside the player: the chapter playing at `time` for a
 *  video made of clips (the showreel), otherwise the project's own info. */
function infoAt(project: Project, time: number): ProjectInfo | undefined {
  if (!project.chapters?.length) return project.info;
  let current: ProjectInfo | undefined;
  for (const chapter of project.chapters) {
    const [m, sec] = chapter.at.split(":").map(Number);
    if (m * 60 + sec <= time) current = chapter.info;
  }
  return current;
}

/** The info beside the player. When it changes (the showreel moving to
 *  its next clip) the old text fades out while the new fades in, in the
 *  same spot. */
function InfoFade({ info }: { info: ProjectInfo | undefined }) {
  const [current, setCurrent] = useState(info);
  const [leaving, setLeaving] = useState<ProjectInfo | undefined>();
  if (info !== current) {
    setLeaving(current);
    setCurrent(info);
  }

  useEffect(() => {
    if (!leaving) return;
    const timer = window.setTimeout(() => setLeaving(undefined), 450);
    return () => window.clearTimeout(timer);
  }, [leaving]);

  if (!current && !leaving) return null;
  return (
    <div className={styles.infoStack}>
      {leaving ? <InfoBlock key={`out-${leaving.game}`} info={leaving} className={styles.infoOut} /> : null}
      {current ? <InfoBlock key={current.game} info={current} className={styles.infoIn} /> : null}
    </div>
  );
}

function InfoBlock({ info, className }: { info: ProjectInfo; className: string }) {
  return (
    <div className={`${styles.info} ${className}`}>
      <p className={styles.infoGame}>{info.game}</p>
      {info.lines.map((line) => (
        <p key={line} className={styles.infoLine}>{line}</p>
      ))}
      {info.work ? (
        <p className={styles.infoWork}>
          <span className={styles.infoLabel}>My work</span>
          {info.work}
        </p>
      ) : null}
      {info.award ? (
        <p className={styles.infoAward}>
          <Sparkle size={11} />
          {info.award}
        </p>
      ) : null}
    </div>
  );
}
