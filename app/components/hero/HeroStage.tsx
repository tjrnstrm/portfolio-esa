"use client";

import { useCallback, useRef, useState, type ReactNode } from "react";
import type { Project } from "../../content/projects";
import Background from "./Background";
import Deck from "./Deck";
import Flyer from "./Flyer";
import Rack from "./Rack";
import SiteNav from "./SiteNav";
import VideoControls from "./VideoControls";
import { useMusicPlayer } from "./useMusicPlayer";
import { useRack } from "./useRack";
import { useTurntable } from "./useTurntable";
import styles from "./Hero.module.css";

type HeroStageProps = {
  projects: Project[];
  /** Static intro, rendered on the server and slotted in. */
  intro: ReactNode;
};

/** The interactive part of the hero. `data-playing` on the section is what
 *  every child stylesheet keys its playing state off. */
export default function HeroStage({ projects, intro }: HeroStageProps) {
  const mouthRef = useRef<HTMLSpanElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [videoTime, setVideoTime] = useState(0);
  const [videoDuration, setVideoDuration] = useState(0);
  const [videoPaused, setVideoPaused] = useState(true);
  const [videoSource, setVideoSource] = useState<string | null>(null);
  const {
    musicRef,
    music,
    musicPaused,
    musicChanging,
    toggleMusic,
    changeMusic,
  } = useMusicPlayer();

  const { rackRef, discRefs, settle, step, center } = useRack(projects.length);
  const { docked, display, flight, toggle, eject, land } = useTurntable({
    discRefs,
    mouthRef,
    musicRef,
    settle,
  });
  /* The mouse hovering a disc wins; with no mouse (or nothing hovered),
     whichever disc sits centred in the rack stands in for it. */
  const [hovered, setHovered] = useState<number | null>(null);
  const previewIndex = hovered ?? center;

  const active = display === null ? null : projects[display];
  const preview = display === null ? (projects[previewIndex] ?? null) : null;
  const currentVideoPaused = videoSource === active?.video ? videoPaused : true;

  const syncVideoState = useCallback(() => {
    const video = videoRef.current;
    if (!video) return;
    setVideoSource(active?.video ?? null);
    setVideoTime(Number.isFinite(video.currentTime) ? video.currentTime : 0);
    setVideoDuration(Number.isFinite(video.duration) ? video.duration : 0);
    setVideoPaused(video.paused);
  }, [active?.video]);

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

  /* A click only plays the disc already centred in the rack — clicking any
     other one just brings it to centre, same as the arrow buttons would. */
  const selectDisc = useCallback((i: number) => {
    if (i === center) toggle(i);
    else settle(i);
  }, [center, toggle, settle]);

  return (
    <section id="work" className={styles.hero} data-playing={display !== null}>
      <Background
        active={active}
        preview={preview}
        videoRef={videoRef}
        onVideoStateChange={syncVideoState}
      />

      {/* Centred on the hero's full height — not just the band between nav
          and rack — so it isn't pulled up by how much room those take. */}
      <div className={styles.idLayer}>{intro}</div>

      <SiteNav
        music={music}
        musicPaused={musicPaused}
        musicChanging={musicChanging}
        project={active}
        onToggleMusic={toggleMusic}
        onChangeMusic={changeMusic}
      />

      <p className={styles.projectDescription}>{active?.note ?? ""}</p>

      <div className={styles.mid} />

      <div className={styles.videoControlsWrap}>
        <VideoControls
          visible={Boolean(active?.video)}
          currentTime={videoSource === active?.video ? videoTime : 0}
          duration={videoSource === active?.video ? videoDuration : 0}
          paused={currentVideoPaused}
          onToggle={toggleVideo}
          onSeek={seekVideo}
        />
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
