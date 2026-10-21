import styles from "./Sparkle.module.css";

/** The gold award star: twinkles every few seconds, in time with the
 *  shimmer on the nominated shelf heading. Position it with `className`. */
export default function Sparkle({ size = 10, className = "" }: { size?: number; className?: string }) {
  return (
    <svg
      className={`${styles.sparkle} ${className}`}
      width={size}
      height={size}
      viewBox="0 0 10 10"
      aria-hidden="true"
    >
      <path d="M5 0 Q5.6 4.4 10 5 Q5.6 5.6 5 10 Q4.4 5.6 0 5 Q4.4 4.4 5 0 Z" fill="currentColor" />
    </svg>
  );
}
