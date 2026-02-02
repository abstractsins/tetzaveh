import styles from "./page.module.css";

import { Tetzaveh2 } from "@/data/aliyah";
import { Tetzaveh2Clips } from "@/data/playlist";
import VerseClips from "@/component/VerseClips";
import Aliyah from "@/component/Aliyah";

export default function Home() {
  return (
    <div className={styles.body}>
      <Aliyah aliyah={Tetzaveh2} />
      <VerseClips clips={Tetzaveh2Clips} />
    </div>
  );
}
