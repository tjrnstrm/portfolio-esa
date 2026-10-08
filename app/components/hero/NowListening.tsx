"use client";

import Image from "next/image";
import type { MusicTrack } from "../../content/projects";
import styles from "./NowListening.module.css";

/** The ambient track control: its animation and audio pause together. */
export default function NowListening({
  music,
  paused,
  changing,
  onToggle,
  onChange,
}: {
  music: MusicTrack | null;
  paused: boolean;
  changing: boolean;
  onToggle: () => void;
  onChange: () => void;
}) {
  if (!music) return null;
  return (
    <div className={`${styles.control} ${styles.musicControl}`}>
      <button
        type="button"
        className={styles.animationButton}
        onClick={onToggle}
        aria-label={paused ? "Resume background music" : "Pause background music"}
        aria-pressed={paused}
      >
        <Image
          className={styles.saxophonist}
          src={paused ? "/saxophonist_still.webp" : "/saxophonist_alpha.gif"}
          alt=""
          width={40}
          height={40}
          unoptimized
        />
      </button>
      <button
        type="button"
        className={styles.copy}
        onClick={onChange}
        disabled={changing}
        aria-label="Play another background track"
        aria-live="polite"
      >
        <span className={styles.kicker}>
          {changing ? "Next song" : paused ? "Paused" : "Now playing"}
        </span>
        <span className={styles.title}>{music.title}</span>
      </button>
    </div>
  );
}
