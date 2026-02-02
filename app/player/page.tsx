"use client";

import MediaPlayer from "@/component/player/MediaPlayer";
import styles from "./page.module.css";
import MediaLibrary from "@/component/player/MediaLibrary";

export default function Home() {
  return (
    <div className={styles.body}>
      <MediaPlayer />
      <MediaLibrary />
    </div>
  );
}
