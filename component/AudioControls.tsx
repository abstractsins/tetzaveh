"use client";

import { TfiLoop } from "react-icons/tfi";
import { useState, useEffect, RefObject } from "react";
import styles from "./AudioControls.module.css";

interface Props {
  src: string | undefined;
  ref: RefObject<HTMLAudioElement | null>;
}

export default function AudioControls({ ref, src }: Props) {
  const [loop, setLoop] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem(`loop:${src}`) === "1";
    setLoop(saved);
    if (ref.current) ref.current.loop = saved;
  }, [src, ref]);

  const toggleLoop = () => {
    const next = !loop;
    setLoop(next);
    if (ref.current) ref.current.loop = next;
    localStorage.setItem(`loop:${src}`, next ? "1" : "0");
  };

  return (
    <div className={styles.headerControls}>
      <div
        className={`${styles.loopBtn} ${loop ? styles.looping : ""}`}
        onClick={toggleLoop}
        aria-pressed={loop}
        title="Toggle loop"
      >
        <span className={styles.buttonLabel}>
          <TfiLoop />
        </span>
      </div>
    </div>
  );
}
