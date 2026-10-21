import { site, type Project } from "../../content/projects";
import styles from "./Disc.module.css";

/** One record on a shelf: the project's artwork as the vinyl, grooves, a
 *  spindle hole (or a coloured label, for the soundtrack discs) and, on a
 *  nominated piece, a "Nominee" pill. Clicking it plays the project. */
export default function Disc({
  project,
  onPlay,
  onHoverStart,
}: {
  project: Project;
  onPlay: () => void;
  /** A mouse or keyboard focus reaching the disc; the background follows it. */
  onHoverStart?: () => void;
}) {
  const label = `Play ${project.title}. ${project.note}${project.nominee ? ` ${site.award}.` : ""}`;

  return (
    <div className={styles.slot}>
      <button
        type="button"
        className={styles.disc}
        onClick={onPlay}
        onMouseEnter={onHoverStart}
        onFocus={onHoverStart}
        aria-label={label}
        title={project.nominee ? site.award : undefined}
      >
        <span
          className={styles.vinyl}
          style={{ backgroundImage: `url(${project.poster})` }}
        />
        <span className={styles.grooves} />
        {project.labelColor ? (
          <span className={styles.label} style={{ background: project.labelColor }} />
        ) : null}
        <span className={styles.hole} />
        {project.nominee ? (
          <span className={styles.nominee}>
            <svg className={styles.sparkle} width="9" height="9" viewBox="0 0 10 10" aria-hidden="true">
              <path d="M5 0 Q5.6 4.4 10 5 Q5.6 5.6 5 10 Q4.4 5.6 0 5 Q4.4 4.4 5 0 Z" fill="currentColor" />
            </svg>
            <span className={styles.nomineeText}>SGA Nominee</span>
          </span>
        ) : null}
      </button>
      <span className={`${styles.caption} ${project.nominee ? styles.captionNominee : ""}`}>
        <span className={styles.title}>{project.title}</span>
      </span>
    </div>
  );
}
