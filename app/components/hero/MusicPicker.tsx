"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { site } from "../../content/projects";
import { useMusicPlayer } from "./useMusicPlayer";
import styles from "./MusicPicker.module.css";

/** "Play music" in the header. Opens a short list of the soundtrack's
 *  tracks; picking one plays it, and while one plays the list also offers
 *  to pause. */
export default function MusicPicker() {
  const { tracks, track, trackIndex, musicPaused, playTrack, pauseMusic } = useMusicPlayer();
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
