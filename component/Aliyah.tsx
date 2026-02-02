"use client";

import styles from "./Aliyah.module.css";

import Link from "next/link";
import { useRef } from "react";

import AudioControls from "./AudioControls";

import { AliyahTrack } from "@/type/types";

interface Props {
  aliyah: AliyahTrack;
}

export default function Aliyah({ aliyah }: Props) {
  const ref = useRef<HTMLAudioElement>(null);

  return (
    <div className={styles.body}>
      <h2 className="section-title">Whole Clip</h2>
      <div className={styles.clipBody}>
        <div className={styles.header}>
          <div className={styles.headerTitles}>
            <h2>{aliyah.label}</h2>
            <Link href={aliyah.creditUrl}>{aliyah.credit}</Link>
          </div>

          <AudioControls ref={ref} src={aliyah.src} />
        </div>

        <audio controls ref={ref} src={aliyah.src}></audio>
      </div>
    </div>
  );
}
