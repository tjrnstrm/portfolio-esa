"use client";

import { useCallback, useEffect, useRef, useState, type CSSProperties } from "react";
import Image from "next/image";
import { site } from "../../content/projects";
import { useMusicPlayer } from "./useMusicPlayer";
import styles from "./MusicPicker.module.css";

/** "Play music" in the header. Opens a short list of the soundtrack's
 *  tracks; picking one plays it, and while one plays the list also offers
 *  to pause. */
export default function MusicPicker() {
  const { tracks, track, trackIndex, musicPaused, playTrack, pauseMusic, volume, setVolume, toggleMute } =
    useMusicPlayer();
  const [open, setOpen] = useState(false);
  const pillRef = useRef<HTMLButtonElement>(null);
  const playing = !musicPaused;

  const close = useCallback(() => {
    setOpen(false);
    pillRef.current?.focus();
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, close]);

  return (
    <div className={styles.picker}>
      <button
        ref={pillRef}
        type="button"
        className={styles.pill}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-controls="music-menu"
        aria-label={playing ? `Background music: ${track.title}. Choose a track` : "Play music: choose a track"}
        onClick={() => setOpen((o) => !o)}
      >
        <span className={styles.sax} aria-hidden="true">
          <Image
            src={playing ? "/saxophonist_alpha.gif" : "/saxophonist_still.webp"}
            alt=""
            width={34}
            height={34}
            unoptimized
            className={playing ? styles.saxOn : undefined}
          />
        </span>
        <span className={styles.pillText}>
          {playing ? `BGM: ${track.title}` : "Play BGM"}
        </span>
        <svg className={styles.chevron} width="10" height="10" viewBox="0 0 12 12" aria-hidden="true">
          <path d="M2.5 4.5 L6 8 L9.5 4.5" fill="none" stroke="currentColor" strokeWidth="1.4" />
        </svg>
      </button>

      {/* Volume: the speaker mutes and unmutes; the slider (wider screens
          only; phones have hardware buttons, and iOS ignores it anyway). */}
      <div className={styles.volume}>
        <button
          type="button"
          className={styles.mute}
          onClick={toggleMute}
          aria-label={volume === 0 ? "Unmute music" : "Mute music"}
          aria-pressed={volume === 0}
        >
          <SpeakerIcon level={volume} />
        </button>
        <input
          className={styles.slider}
          type="range"
          min={0}
          max={1}
          step={0.01}
          value={volume}
          onChange={(e) => setVolume(Number(e.currentTarget.value))}
          aria-label="Music volume"
          aria-valuetext={`${Math.round(volume * 100)}%`}
          style={{ "--vol": `${volume * 100}%` } as CSSProperties}
        />
      </div>

      {open ? (
        <>
          <button type="button" className={styles.backdrop} aria-label="Close music menu" onClick={close} />
          <div id="music-menu" role="menu" aria-label="Background music" className={styles.menu}>
            <p className={styles.album}>{site.musicAlbum}</p>
            {tracks.map((t, i) => {
              const on = playing && i === trackIndex;
              return (
                <button
                  key={t.src}
                  type="button"
                  role="menuitemradio"
                  aria-checked={on}
                  className={`${styles.item} ${on ? styles.itemOn : ""}`}
                  onClick={() => {
                    playTrack(i);
                    close();
                  }}
                >
                  <span className={`${styles.miniDisc} ${on ? styles.spinning : ""}`} aria-hidden="true">
                    <span className={styles.miniLabel} style={{ background: t.labelColor }} />
                  </span>
                  <span className={styles.itemCopy}>
                    <span className={styles.itemTitle}>{t.title}</span>
                    <span className={styles.itemState}>{on ? "Playing" : "Play"}</span>
                  </span>
                  {on ? <Bars /> : null}
                </button>
              );
            })}
            {playing ? (
              <button
                type="button"
                role="menuitem"
                className={styles.pause}
                onClick={() => {
                  pauseMusic();
                  close();
                }}
              >
                <svg width="12" height="12" viewBox="0 0 12 12" aria-hidden="true">
                  <rect x="2.5" y="2" width="2" height="8" fill="currentColor" />
                  <rect x="7.5" y="2" width="2" height="8" fill="currentColor" />
                </svg>
                Pause music
              </button>
            ) : null}
          </div>
        </>
      ) : null}
    </div>
  );
}

/** A small level meter, shown wherever music is playing. */
function Bars() {
  return (
    <span className={styles.bars} aria-hidden="true">
      <span />
      <span />
      <span />
    </span>
  );
}

/** A speaker with up to two sound waves for the level, or a cross when
 *  muted. */
function SpeakerIcon({ level }: { level: number }) {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true">
      <path d="M2 6 H4.5 L8 3 V13 L4.5 10 H2 Z" fill="currentColor" />
      {level === 0 ? (
        <path d="M10.5 6 L14 9.5 M14 6 L10.5 9.5" stroke="currentColor" strokeWidth="1.3" />
      ) : (
        <>
          <path d="M10 6 Q11.5 8 10 10" fill="none" stroke="currentColor" strokeWidth="1.3" />
          {level > 0.5 ? (
            <path d="M12 4 Q15 8 12 12" fill="none" stroke="currentColor" strokeWidth="1.3" />
          ) : null}
        </>
      )}
    </svg>
  );
}
