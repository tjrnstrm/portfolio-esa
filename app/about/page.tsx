import type { Metadata } from 'next';
import Image from 'next/image';
import { ViewTransition } from 'react';
import SiteNav from '../components/hero/SiteNav';
import Preview from '../components/hero/Preview';
import { showreel, site } from '../content/projects';
import styles from './page.module.css';

export const metadata: Metadata = {
  title: `About ${site.fullName} | ${site.name}`,
  description: `${site.fullName} is a game-audio student, musician and sound designer.`,
};

export default function AboutPage() {
  return (
    <main className={styles.page}>
      <div className={styles.background} aria-hidden="true">
        <Preview project={showreel} />
      </div>
      <div className={styles.scrim} />

      <SiteNav />

      <section className={styles.content} aria-labelledby="about-heading">
        <ViewTransition enter="content-fall" default="none">
          <div className={styles.portraitFrame}>
            <Image
              className={styles.portrait}
              src="/img/ESA-profile.jpg"
              alt={`Portrait of ${site.fullName}`}
              fill
              priority
              sizes="(min-width: 641px) 360px, 72vw"
            />
          </div>
        </ViewTransition>

        <ViewTransition enter="content-fall" default="none">
          <div className={styles.copy}>
            <h1 id="about-heading" className={styles.heading}>
              {site.about.heading}
            </h1>
            <p className={styles.role}>{site.stack}</p>
            <div className={styles.nomination}>
              <svg width="20" height="20" viewBox="0 0 16 16" aria-hidden="true">
                <circle cx="8" cy="6" r="4" fill="none" stroke="currentColor" strokeWidth="1.3" />
                <path
                  d="M5.6 9.3 L4.5 14.5 L8 12.8 L11.5 14.5 L10.4 9.3"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.3"
                  strokeLinejoin="round"
                />
              </svg>
              <p>
                <span className={styles.nominationKicker}>{site.nomination.kicker}</span>
                <span className={styles.nominationDetail}>{site.nomination.detail}</span>
              </p>
            </div>
            <ul className={styles.facts}>
              {site.about.points.map((point) => (
                <li key={point}>{point}</li>
              ))}
            </ul>
          </div>
        </ViewTransition>
      </section>
    </main>
  );
}
