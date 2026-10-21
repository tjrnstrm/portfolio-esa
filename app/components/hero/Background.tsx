import type { RefObject } from "react";
import type { Project } from "../../content/projects";
import Preview from "./Preview";
import styles from "./Background.module.css";

/** The blurred preview behind everything while browsing, the playing
 *  project's video faded in over it, and the scrim that keeps the type
 *  readable. */
export default function Background({
  active,
  preview,
  videoRef,
  onVideoStateChange,
}: {
  active: Project | null;
  /** The hovered (or default) project, shown blurred while browsing. */
  preview: Project | null;
  videoRef: RefObject<HTMLVideoElement | null>;
  onVideoStateChange: () => void;
}) {
  return (
    <>
      <div className={styles.bg}>
        {!active && preview ? <Preview project={preview} /> : null}

        <div className={`${styles.project} ${active?.video ? styles.projectOn : ""}`}>
          {/* No poster: the frame stays black until the video's first frame
              arrives, instead of flashing the disc artwork full screen. */}
          {active?.video ? (
            <video
              ref={videoRef}
              key={active.video}
              className={styles.player}
              src={active.video}
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
          ) : null}
        </div>
      </div>
      <div className={styles.scrim} />
    </>
  );
}
