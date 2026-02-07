import styles from "./LibraryControls.module.css";

import { useMediaPlayer } from "@/context/PlayerContext";

const renderLoopControls = () => {
  const {
    isSelectingLoop,
    setIsSelectingLoop,
    clearLoopPoints,
    currentPlaylist,
    loopPointsSet,
  } = useMediaPlayer();

  return (
    <>
      {/* Placeholder for loop control buttons */}
      <ul className={styles.loopControlsList}>
        <li
          key={1}
          className={`${styles.loopControlListItem} ${isSelectingLoop ? styles.loopSelectionActive : ""}`}
          onClick={() => setIsSelectingLoop(true)}
          aria-disabled={!currentPlaylist}
        >
          Select Points
        </li>
        <li
          key={2}
          className={`${styles.loopControlListItem} ${isSelectingLoop ? styles.loopSelectionActive : ""}`}
          onClick={clearLoopPoints}
          aria-disabled={
            !currentPlaylist || (!isSelectingLoop && !loopPointsSet)
          }
        >
          {isSelectingLoop ? "Cancel" : "Clear"}
        </li>
      </ul>
    </>
  );
};

export default function LoopControlsModule() {
  return (
    <div className={styles.wrapper}>
      <div className={styles.header}>
        <span>Loop Controls</span>
      </div>

      <div className={styles.body}>{renderLoopControls()}</div>
    </div>
  );
}

// if a loop start AND end is set while playing, it will default to the loop even if that means it changes the current track playing
// if only a loop start is set while playing, nothing will happen.
// if only a loop end is set while playing, nothing will happen.
// if loop points are set while paused, nothing will happen until playback is started.
// if loop points are cleared while playing, playback continues normally.
// if loop points are cleared while paused, nothing will happen until playback is started.
// changing playlists while loop points are set will clear the loop points.
// any tracks within the loop get a blue highlight in the track list, but still are green when playing and yellow when hovered.
