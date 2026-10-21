import type { Project, Shelf } from "../../content/projects";
import Disc from "./Disc";
import styles from "./Shelves.module.css";

/** The rows of discs at the bottom of the home page: stacked on phones,
 *  side by side with a divider on wider screens. Every disc is visible at
 *  once, so there's nothing to scroll or step through. */
export default function Shelves({
  shelves,
  onPlay,
  onHover,
}: {
  shelves: Shelf[];
  onPlay: (project: Project) => void;
  onHover: (project: Project | null) => void;
}) {
  return (
    <div className={styles.shelves} onMouseLeave={() => onHover(null)}>
      <h2 className={styles.title}>Portfolio</h2>
      <div className={styles.list}>
        {shelves.map((shelf) => (
          <section key={shelf.title} className={styles.shelf} aria-label={shelf.title}>
            <h3 className={styles.heading}>{shelf.title}</h3>
            <div className={styles.row}>
              {shelf.projects.map((p) => (
                <Disc
                  key={p.title}
                  project={p}
                  onPlay={() => onPlay(p)}
                  onHoverStart={() => onHover(p)}
                />
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
