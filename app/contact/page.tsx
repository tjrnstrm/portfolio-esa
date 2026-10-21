import type { Metadata } from 'next';
import Image from 'next/image';
import { ViewTransition } from 'react';
import Preview from '../components/hero/Preview';
import { showreel, site } from '../content/projects';
import ContactForm from './ContactForm';
import styles from './page.module.css';

export const metadata: Metadata = {
  title: `Contact ${site.fullName} | ${site.name}`,
  description: `Contact ${site.fullName} about sound design, music and game-audio projects.`,
};

export default function ContactPage() {
  return (
    <main className={styles.page}>
      <div className={styles.background} aria-hidden="true">
        <Preview project={showreel} />
      </div>
      <div className={styles.scrim} />

      <section className={styles.content} aria-labelledby="contact-heading">
        <ViewTransition enter="content-fall" default="none">
          <div className={styles.intro}>
            <h1 id="contact-heading">{site.contact.heading}</h1>
            <p className={styles.lede}>{site.contact.intro}</p>

            <div className={styles.directLinks}>
              <a
                className={styles.linkedinLink}
                href={site.linkedin}
                target="_blank"
                rel="noreferrer"
                aria-label="Emelie Strand Adolfsson on LinkedIn"
              >
                <Image
                  className={styles.linkedinLogo}
                  src="/img/LinkedIn-logo.webp"
                  alt=""
                  width={34}
                  height={34}
                />
              </a>{' '}
              <a href={`mailto:${site.email}`}>
                <span>Email</span>
                {site.email}
              </a>
            </div>

            <a
              className={styles.resume}
              href={site.resume}
              target="_blank"
              rel="noreferrer"
              aria-label="View resume (PDF, opens in a new tab)"
            >
              <svg width="14" height="16" viewBox="0 0 14 16" aria-hidden="true">
                <path
                  d="M2 1.5h6.5L12 5v9.5H2z M8.5 1.5V5H12 M4.5 8.5h5 M4.5 11h5"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.3"
                  strokeLinejoin="round"
                />
              </svg>
              View resume
              <svg className={styles.resumeArrow} width="10" height="10" viewBox="0 0 10 10" aria-hidden="true">
                <path d="M2.5 7.5 L7.5 2.5 M3.5 2.5 H7.5 V6.5" fill="none" stroke="currentColor" strokeWidth="1.3" />
              </svg>
            </a>
          </div>
        </ViewTransition>

        <ViewTransition enter="content-fall" default="none">
          <ContactForm />
        </ViewTransition>
      </section>
    </main>
  );
}
