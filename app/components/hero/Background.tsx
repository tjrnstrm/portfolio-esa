import type { RefObject } from "react";
import type { Project } from "../../content/projects";
import Preview from "./Preview";
import styles from "./Background.module.css";

/** The blurred preview behind everything before a disc is loaded, the
 *  playing project's video faded in over it, and the scrim that keeps the
 *  type readable. */
export default function Background({
  active,
  preview,
  videoRef,
  onVideoStateChange,
}: {
  active: Project | null;
  /** The hovered-or-centred project, shown blurred while idle. */
  preview: Project | null;
  videoRef: RefObject<HTMLVideoElement | null>;
  onVideoStateChange: () => void;
}) {
  return (
    <>
      <div className={styles.bg}>
        {!active && preview ? <Preview project={preview} /> : null}

        <div className={`${styles.project} ${active ? styles.projectOn : ""}`}>
          {active ? (
            <ProjectPlayer
              project={active}
              videoRef={videoRef}
              onVideoStateChange={onVideoStateChange}
            />
          ) : null}
        </div>
      </div>
      <div className={styles.scrim} />
    </>
  );
}

function ProjectPlayer({
  project,
  videoRef,
  onVideoStateChange,
}: {
  project: Project;
  videoRef: RefObject<HTMLVideoElement | null>;
  onVideoStateChange: () => void;
}) {
  if (!project.video) {
    /* eslint-disable-next-line @next/next/no-img-element */
    return <img className={styles.player} src={project.poster} alt={project.title} />;
  }

  /* Built only when a disc is loaded. Playback and scrubbing live above the
     rack instead of covering the footage with native controls. */
  return (
    <video
      ref={videoRef}
      key={project.video}
      className={styles.player}
      src={project.video}
      poster={project.poster}
      preload="metadata"
      autoPlay
      playsInline
      onLoadedMetadata={onVideoStateChange}
      onDurationChange={onVideoStateChange}
      onTimeUpdate={onVideoStateChange}
      onPlay={onVideoStateChange}
      onPause={onVideoStateChange}
      onEnded={onVideoStateChange}
    />
  );
}
