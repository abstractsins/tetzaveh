import styles from "./TrackItem.module.css";

interface Props {
  title: string;
  src: string;
  verse: string;
  wordCount: number;
  className: string;
  onClick: () => void;
}

export default function TrackItem({
  title,
  verse,
  className,
  wordCount,
  onClick,
}: Props) {
  return (
    <div
      className={`${styles.wrapper} ${className ? styles[className] : ""}`}
      onClick={onClick}
    >
      <div className={styles.trackTitleVerse}>
        <h2>{title}</h2>
        <span>{verse}</span>
      </div>
      <div className={styles.wordCountWrapper}>
        <span className={styles.wordCountLabel}>Words</span>
        <span className={styles.wordCountValue}>{wordCount}</span>
      </div>
    </div>
  );
}
