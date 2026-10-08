import styles from "./VideoControls.module.css";

export default function VideoControls({
  visible,
  currentTime,
  duration,
  paused,
  onToggle,
  onSeek,
}: {
  visible: boolean;
  currentTime: number;
  duration: number;
  paused: boolean;
  onToggle: () => void;
  onSeek: (time: number) => void;
}) {
  return (
    <div className={`${styles.controls} ${visible ? styles.visible : ""}`}>
      <button
        type="button"
        className={styles.playButton}
        onClick={onToggle}
        aria-label={paused ? "Play video" : "Pause video"}
      >
        <span
          className={paused ? styles.playIcon : styles.pauseIcon}
          aria-hidden="true"
        />
      </button>
      <input
        className={styles.timeline}
        type="range"
        min="0"
        max={duration || 0}
        step="0.1"
        value={Math.min(currentTime, duration || 0)}
        onChange={(event) => onSeek(Number(event.currentTarget.value))}
        aria-label="Video position"
        tabIndex={visible ? 0 : -1}
      />
      <span className={styles.time}>
        {formatTime(currentTime)} / {formatTime(duration)}
      </span>
    </div>
  );
}

function formatTime(seconds: number) {
  if (!Number.isFinite(seconds) || seconds < 0) return "0:00";
  const minutes = Math.floor(seconds / 60);
  const remaining = Math.floor(seconds % 60);
  return `${minutes}:${remaining.toString().padStart(2, "0")}`;
}
