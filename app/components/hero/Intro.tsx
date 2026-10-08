import Image from 'next/image';
import { site } from '../../content/projects';
import styles from './Intro.module.css';

/** Branded logo, tech stack and award — shown while nothing is playing. */
export default function Intro() {
  return (
    <div className={styles.id}>
      <h1 className={styles.wordmark}>
        <Image
          className={styles.logo}
          src="/img/logo-white.png"
          alt={`${site.name} Sound Production — ${site.fullName}`}
          fill
          priority
          sizes="(min-width: 641px) 58vw, 88vw"
        />
      </h1>
      <p className={styles.stack}>{site.stack}</p>

      <p className={styles.award}>{site.award}</p>
    </div>
  );
}

// <p className={styles.statement}>{site.statement}</p>
// "Sound design and implementation for games"
