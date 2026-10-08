import type { Metadata } from 'next';
import Image from 'next/image';
import Preview from '../components/hero/Preview';
import { projects, site } from '../content/projects';
import AboutMusicHeader from './AboutMusicHeader';
import styles from './page.module.css';

export const metadata: Metadata = {
  title: `About ${site.fullName} | ${site.name}`,
  description: `${site.fullName} is a game-audio student, musician and sound designer.`,
};

export default function AboutPage() {
  const showreel = projects[0];

  return (
    <main className={styles.page}>
      <div className={styles.background} aria-hidden="true">
        <Preview project={showreel} />
      </div>
      <div className={styles.scrim} />

      <AboutMusicHeader />

      <section className={styles.content} aria-labelledby="about-heading">
        <div className={styles.portraitFrame}>
          <Image
            className={styles.portrait}
            src="/img/IMG_20220718_002828_557.jpg"
            alt={`Portrait of ${site.fullName}`}
            fill
            priority
            sizes="(min-width: 641px) 360px, 72vw"
          />
        </div>

        <div className={styles.copy}>
          <h1 id="about-heading" className={styles.heading}>
            {site.about.heading}
          </h1>
          <ul className={styles.facts}>
            {site.about.points.map((point) => (
              <li key={point}>{point}</li>
            ))}
          </ul>
        </div>
      </section>
    </main>
  );
}
