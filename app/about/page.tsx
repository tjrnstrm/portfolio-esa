import type { Metadata } from 'next';
import Image from 'next/image';
import { ViewTransition } from 'react';
import { PiMedalThin } from 'react-icons/pi';
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
              <p className={styles.nominationKicker}>
                <PiMedalThin className={styles.medal} aria-hidden="true" />
                {site.nomination.kicker}
              </p>
              <p className={styles.nominationDetail}>{site.nomination.detail}</p>
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
