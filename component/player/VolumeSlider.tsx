'use client';
import styles from './VolumeSlider.module.css';
import { useRef } from 'react';
import { useMediaPlayer } from '@/context/PlayerContext';

import React from 'react';

export default function VolumeSlider() {

    const ref = useRef<HTMLInputElement>(null);

    const { getVolume, setVolume } = useMediaPlayer();

    const volume: number = getVolume() * 10000;

    console.log(volume);

    return (
        <div className={styles.volumeWrapper}>

            <form
                style={{ ['--min' as any]: 0, ['--max' as any]: 100, ['--val' as any]: volume }}
                onChange={() => {
                    console.log(ref.current?.value);
                    setVolume(Number(ref.current?.value) / 100);
                }}
            >
                <input
                    ref={ref}
                    type="range" min="0" max="100" defaultValue="80" list="rangeList" />
                <div className={styles.datalist} id="rangeList">
                    <option label="min" value="0" />
                    <option label="max" value="100" />
                </div>
            </form>
        </div>
    );
}
