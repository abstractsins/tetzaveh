"use client";

import { useRef } from 'react';

import styles from './AudioClips.module.css';
import AudioControls from './AudioControls';


interface Props {
    title: string;
    src: string;
    verse: string;
}

export default function AudioClip({ title, src, verse }: Props) {

    const ref = useRef<HTMLAudioElement>(null);

    return (
        <div className={styles.body}>

            <div className={styles.header} >
                <div className={styles.headerTitles}>
                    <h2>{title}</h2>
                    <span>{verse}</span>
                </div>
                <AudioControls ref={ref} src={src} />
            </div>
            <div className={styles.clipBody}>
                <audio controls ref={ref} src={`/audio/${src}`} />
            </div>
        </div>
    );
} 