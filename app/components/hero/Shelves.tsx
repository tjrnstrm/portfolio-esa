import type { Project } from "../../content/projects";
import Disc from "./Disc";
import styles from "./Shelves.module.css";

/** The discs at the bottom of the home page under "Portfolio": one row on
 *  wider screens, two by two on phones. Every disc is visible at once, so
 *  there's nothing to scroll or step through. */
export default function Shelves({
  discs,
  onPlay,
  onHover,
}: {
  discs: Project[];
  onPlay: (project: Project) => void;
  onHover: (project: Project | null) => void;
}) {
  return (
    <section className={styles.shelves} aria-labelledby="portfolio-heading" onMouseLeave={() => onHover(null)}>
      <h2 id="portfolio-heading" className={styles.title}>Portfolio</h2>
      <div className={styles.row}>
        {discs.map((p) => (
          <Disc
            key={p.title}
            project={p}
            onPlay={() => onPlay(p)}
            onHoverStart={() => onHover(p)}
          />
        ))}
      </div>
    </section>
  );
}
