"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import { site, type MusicTrack, type Project } from "../../content/projects";
import TransitionLink from "../TransitionLink";
import NowListening from "./NowListening";
import styles from "./SiteNav.module.css";

export default function SiteNav({
  music = null,
  musicPaused = false,
  musicChanging = false,
  project = null,
  onToggleMusic,
  onChangeMusic,
}: {
  music?: MusicTrack | null;
  musicPaused?: boolean;
  musicChanging?: boolean;
  project?: Project | null;
  onToggleMusic?: () => void;
  onChangeMusic?: () => void;
}) {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const [menuClosing, setMenuClosing] = useState(false);
  const [hoveredLink, setHoveredLink] = useState<number | null>(null);
  const activeLink = Math.max(0, site.nav.findIndex((link) => (
    link.href === "/" ? pathname === "/" : pathname.startsWith(link.href)
  )));
  const indicatorLink = hoveredLink ?? activeLink;
  const closeMenu = (immediate = false) => {
    setHoveredLink(null);
    if (immediate) {
      setMenuOpen(false);
      setMenuClosing(false);
    } else {
      setMenuClosing(true);
    }
  };
  const toggleMenu = () => {
    if (menuOpen && !menuClosing) {
      closeMenu();
    } else {
      setMenuOpen(true);
      setMenuClosing(false);
    }
  };

  return (
    <nav className={styles.nav}>
      {project ? (
        <div className={styles.projectTitle} aria-live="polite">
          {project.title}
        </div>
      ) : music && onToggleMusic && onChangeMusic ? (
        <NowListening
          music={music}
          paused={musicPaused}
          changing={musicChanging}
          onToggle={onToggleMusic}
          onChange={onChangeMusic}
        />
      ) : (
        <TransitionLink className={styles.brand} href="/" aria-label={`${site.name} home`}>
          {site.name}
        </TransitionLink>
      )}

      {/* Desktop: all primary routes sit inline. */}
      <span className={styles.links}>
        {site.nav.map((l) => (
          <TransitionLink key={l.label} href={l.href}>{l.label}</TransitionLink>
        ))}
      </span>

      {/* Phone: one button opens a panel with everything above in it. */}
      <button
        type="button"
        className={`${styles.burger} ${menuOpen && !menuClosing ? styles.burgerOpen : ""}`}
        aria-expanded={menuOpen && !menuClosing}
        aria-controls="mobile-menu"
        aria-label={menuOpen ? "Close menu" : "Open menu"}
        onClick={toggleMenu}
      >
        <span className={styles.burgerBar} />
        <span className={styles.burgerBar} />
        <span className={styles.burgerBar} />
      </button>

      {menuOpen ? (
        <button
          type="button"
          className={styles.backdrop}
          aria-label="Close menu"
          onClick={() => closeMenu()}
        />
      ) : null}

      {menuOpen ? (
        <div
          id="mobile-menu"
          className={`${styles.menu} ${menuClosing ? styles.menuClosing : ""}`}
          onMouseLeave={() => setHoveredLink(null)}
          onAnimationEnd={() => {
            if (menuClosing) {
              setMenuOpen(false);
              setMenuClosing(false);
            }
          }}
        >
          {site.nav.map((l, index) => (
            <TransitionLink
              key={l.label}
              href={l.href}
              onClick={() => closeMenu(true)}
              onMouseEnter={() => setHoveredLink(index)}
              onFocus={() => setHoveredLink(index)}
              onBlur={() => setHoveredLink(null)}
            >
              {l.label}
            </TransitionLink>
          ))}
          <span
            className={styles.menuIndicator}
            data-index={indicatorLink}
            aria-hidden="true"
          />
        </div>
      ) : null}
    </nav>
  );
}
