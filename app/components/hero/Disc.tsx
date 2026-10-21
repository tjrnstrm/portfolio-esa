import { site, type Project } from "../../content/projects";
import Sparkle from "./Sparkle";
import styles from "./Disc.module.css";

/** One record in the row: the project's artwork as the vinyl, grooves, a
 *  spindle hole (or a coloured label, if it has one). Clicking it plays
 *  the project. A nominated piece mentions the award to screen readers,
 *  and its star turns into "SGA Nominee" on hover. */
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
      </button>
      {/* Title and category share a spot; hovering swaps one for the other.
          A nominee's star becomes "SGA Nominee" underneath. */}
      <span className={styles.caption} aria-hidden="true">
        <span className={styles.title}>
          <span className={styles.titleText}>
            {project.title}
            {project.nominee ? <Sparkle size={8} className={styles.star} /> : null}
          </span>
        </span>
        {project.meta ? <span className={styles.meta}>{project.meta}</span> : null}
        {project.nominee ? (
          <span className={styles.nomineeLine}>
            <Sparkle size={8} />
            SGA Nominee
          </span>
        ) : null}
      </span>
    </div>
  );
}
