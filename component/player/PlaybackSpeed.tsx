import { useId } from "react";
import styles from "./PlaybackSpeed.module.css";

type Props = {
  value: number;
  onChange: (rate: number) => void;
};

const SPEEDS = [0.5, 0.75, 1, 1.25, 1.5];

export default function PlaybackSpeed({ value, onChange }: Props) {
  const groupName = useId();

  return (
    <div className={styles.wrapper} role="group" aria-label="Playback speed">
      <div className={styles.playbackSpeedSlider}>
        {/* interleave inputs and labels as direct siblings */}
        {SPEEDS.flatMap((rate, i) => {
          const id = `${groupName}-${i}`;
          return [
            <input
              key={`input-${rate}`}
              type="radio"
              id={id}
              name={groupName}
              value={rate}
              checked={value === rate}
              onChange={() => onChange(rate)}
              aria-label={`${rate}×`}
              required
            />,
            <label
              key={`label-${rate}`}
              htmlFor={id}
              data-speed-label={`${rate === 1 ? "Normal" : rate + "x"}`}
              title={`${rate === 1 ? "Normal" : rate + "x"}`}
              className={`${rate === 1 ? styles.normalRate : ""}`}
            />,
          ];
        })}

        {/* moving dot */}
        <span className={styles.pos} />
      </div>
    </div>
  );
}
