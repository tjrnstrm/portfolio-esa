"use client";

import { useState } from "react";
import { site, type MusicTrack } from "../../content/projects";
import TransitionLink from "../TransitionLink";
import NowListening from "./NowListening";
import styles from "./SiteNav.module.css";

/** Email + LinkedIn — the same two links wherever Contact opens, on
 *  desktop or phone. */
function ContactLinks({ onNavigate }: { onNavigate?: () => void }) {
  return (
    <>
      <a href={`mailto:${site.email}`} onClick={onNavigate}>{site.email}</a>
      <a href={site.linkedin} target="_blank" rel="noreferrer" onClick={onNavigate}>
        LinkedIn
      </a>
    </>
  );
}

export default function SiteNav({
  music = null,
  musicPaused = false,
  musicChanging = false,
  onToggleMusic,
  onChangeMusic,
}: {
  music?: MusicTrack | null;
  musicPaused?: boolean;
  musicChanging?: boolean;
  onToggleMusic?: () => void;
  onChangeMusic?: () => void;
}) {
  /* Only one of these is ever open at once — opening either closes the
     other, same as clicking the backdrop does. */
  const [menuOpen, setMenuOpen] = useState(false);
  const [contactOpen, setContactOpen] = useState(false);
  const closeAll = () => { setMenuOpen(false); setContactOpen(false); };

  return (
    <nav className={styles.nav}>
      {music && onToggleMusic && onChangeMusic ? (
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

      {/* Desktop: the plain links inline, Contact as its own dropdown. */}
      <span className={styles.links}>
        {site.nav.map((l) => (
          <TransitionLink key={l.label} href={l.href}>{l.label}</TransitionLink>
        ))}
        <span className={styles.contact}>
          <button
            type="button"
            className={styles.cta}
            aria-expanded={contactOpen}
            aria-controls="contact-panel"
            onClick={() => { setContactOpen((o) => !o); setMenuOpen(false); }}
          >
            Contact
          </button>
          {contactOpen ? (
            <span id="contact-panel" className={styles.contactPanel}>
              <ContactLinks onNavigate={closeAll} />
            </span>
          ) : null}
        </span>
      </span>

      {/* Phone: one button opens a panel with everything above in it. */}
      <button
        type="button"
        className={styles.burger}
        aria-expanded={menuOpen}
        aria-controls="mobile-menu"
        aria-label={menuOpen ? "Close menu" : "Open menu"}
        onClick={() => { setMenuOpen((o) => !o); setContactOpen(false); }}
      >
        <span className={styles.burgerBar} />
        <span className={styles.burgerBar} />
        <span className={styles.burgerBar} />
      </button>

      {menuOpen || contactOpen ? (
        <button
          type="button"
          className={styles.backdrop}
          aria-label="Close menu"
          onClick={closeAll}
        />
      ) : null}

      {menuOpen ? (
        <div id="mobile-menu" className={styles.menu}>
          {site.nav.map((l) => (
            <TransitionLink key={l.label} href={l.href} onClick={closeAll}>
              {l.label}
            </TransitionLink>
          ))}
          <span className={styles.menuContactLabel}>Contact</span>
          <ContactLinks onNavigate={closeAll} />
        </div>
      ) : null}
    </nav>
  );
}
