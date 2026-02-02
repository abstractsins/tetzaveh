import styles from "./VerseClips.module.css";
import AudioClip from "./AudioClip";

import { Playlist } from "@/type/types";

interface Props {
  clips: Playlist;
}

export default function VerseClips({ clips }: Props) {
  return (
    <div className={styles.clipsBody}>
      <h2 className="section-title">Verse Clips</h2>
      <div className={styles.clipArea}>
        {clips.tracks.map((track, i) => (
          <AudioClip
            key={`Tetzaveh-2-${i}`}
            title={track.title}
            src={track.src}
            verse={track.verse}
          />
        ))}
      </div>
    </div>
  );
}
