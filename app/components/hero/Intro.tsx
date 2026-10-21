"use client";

import Image from 'next/image';
import { useLayoutEffect, useRef } from 'react';
import { showreel, site } from '../../content/projects';
import styles from './Intro.module.css';

/** The logo and the showreel, as one button: clicking either the logo or
 *  the pill under it plays the reel. Uses a copy of the logo trimmed to its
 *  visible artwork, so the gap to the pill is the gap you actually see.
 *
 *  The logo itself is centred on the whole screen, with the pill hanging
 *  below it. The intro is laid out in the space between header and shelves,
 *  then shifted so the logo lands on the screen's middle, but never so far
 *  that it would run into the header or the shelves. */
export default function Intro({ onPlayShowreel }: { onPlayShowreel: () => void }) {
  const introRef = useRef<HTMLDivElement>(null);
  const reelRef = useRef<HTMLButtonElement>(null);
  const logoRef = useRef<HTMLImageElement>(null);

  useLayoutEffect(() => {
    const intro = introRef.current;
    const reel = reelRef.current;
    const logo = logoRef.current;
    const hero = intro?.offsetParent as HTMLElement | null;
    if (!intro || !reel || !logo || !hero) return;

    const place = () => {
      const pad = getComputedStyle(intro);
      const naturalTop = intro.offsetTop + reel.offsetTop;
      const highest = intro.offsetTop + parseFloat(pad.paddingTop);
      const lowest =
        intro.offsetTop + intro.clientHeight - parseFloat(pad.paddingBottom) - reel.offsetHeight;
      const centred = hero.clientHeight / 2 - logo.offsetHeight / 2;
      const top = Math.max(highest, Math.min(centred, lowest));
      reel.style.setProperty('--shift', `${top - naturalTop}px`);
      reel.dataset.placed = 'true';
    };

    place();
    const observer = new ResizeObserver(place);
    observer.observe(hero);
    observer.observe(intro);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={introRef} className={styles.intro}>
      <h1 className={styles.visuallyHidden}>
        {site.name} Sound Production, {site.fullName}
      </h1>
      <button
        ref={reelRef}
        type="button"
        className={styles.reel}
        onClick={onPlayShowreel}
        aria-label={`Play showreel, ${showreel.length}`}
      >
        <Image
          ref={logoRef}
          className={styles.logo}
          src="/img/logo-white-trim.png"
          alt=""
          width={1019}
          height={613}
          priority
          sizes="(min-width: 641px) 270px, 190px"
        />
        <span className={styles.pill} aria-hidden="true">
          <svg width="10" height="10" viewBox="0 0 12 12">
            <path d="M3 1.5 L10.5 6 L3 10.5 Z" fill="currentColor" />
          </svg>
          <span className={styles.pillText}>Play showreel</span>
          <span className={styles.pillTime}>{showreel.length}</span>
        </span>
      </button>
    </div>
  );
}
