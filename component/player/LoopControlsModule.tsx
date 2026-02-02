import styles from "./LibraryControls.module.css";

const renderLoopControls = () => {
  return (
    <>
      {/* Placeholder for loop control buttons */}
      <ul>
        <li key={1}>Set Loop Start</li>
        <li key={2}>Set Loop End</li>
        <li key={3}>Clear Loop</li>
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
// any tracks within the loop get a blue highlight in the track list, but still are green when playing and yellow when hovered.
