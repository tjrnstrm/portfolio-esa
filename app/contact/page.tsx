import type { Metadata } from 'next';
import Image from 'next/image';
import { ViewTransition } from 'react';
import PageMusicHeader from '../components/hero/PageMusicHeader';
import Preview from '../components/hero/Preview';
import { projects, site } from '../content/projects';
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
        <Preview project={projects[0]} />
      </div>
      <div className={styles.scrim} />

      <PageMusicHeader />

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
          </div>
        </ViewTransition>

        <ViewTransition enter="content-fall" default="none">
          <ContactForm />
        </ViewTransition>
      </section>
    </main>
  );
}
