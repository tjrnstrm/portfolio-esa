"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import { site } from "../../content/projects";
import TransitionLink from "../TransitionLink";
import MusicPicker from "./MusicPicker";
import styles from "./SiteNav.module.css";

/** The header on every page (rendered once, in the root layout): the music (with its volume) on the left, the
 *  page links in one row at the centre on desktop, and a menu button on
 *  the right on phones. */
export default function SiteNav() {
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
    <nav className={styles.nav} data-site-nav>
      <MusicPicker />

      {/* Desktop only. */}
      <span className={styles.links}>
        {site.nav.map((l, index) => (
          <TransitionLink
            key={l.label}
            href={l.href}
            aria-current={index === activeLink ? "page" : undefined}
          >
            {l.label}
          </TransitionLink>
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
