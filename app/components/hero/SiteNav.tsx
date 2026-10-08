"use client";

import { useState } from "react";
import Link from "next/link";
import { site } from "../../content/projects";
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

export default function SiteNav() {
  /* Only one of these is ever open at once — opening either closes the
     other, same as clicking the backdrop does. */
  const [menuOpen, setMenuOpen] = useState(false);
  const [contactOpen, setContactOpen] = useState(false);
  const closeAll = () => { setMenuOpen(false); setContactOpen(false); };

  return (
    <nav className={styles.nav}>
      <Link className={styles.brand} href="/">{site.name}</Link>

      {/* Desktop: the plain links inline, Contact as its own dropdown. */}
      <span className={styles.links}>
        {site.nav.map((l) => (
          <a key={l.label} href={l.href}>{l.label}</a>
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
            <a key={l.label} href={l.href} onClick={closeAll}>{l.label}</a>
          ))}
          <span className={styles.menuContactLabel}>Contact</span>
          <ContactLinks onNavigate={closeAll} />
        </div>
      ) : null}
    </nav>
  );
}
