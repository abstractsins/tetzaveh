import { exportPages } from 'next/dist/export/worker';
import styles from './VolumeSlider.module.css';

import { useMediaPlayer } from '@/context/PlayerContext';
import { useEffect, useRef } from 'react';

export default function VolumeSlider() {

    const ref = useRef<HTMLInputElement>(null);

    const { currentVolume, setVolume } = useMediaPlayer();

    console.log(currentVolume);

    useEffect(() => {
        const volume = Number(ref.current?.value);
        setVolume(volume/100);
    }, [setVolume]);

    const handleChange = () => {
        const volume = Number(ref.current?.value); // 0-100
        setVolume(volume/100);
    };

    return (
        <div className={styles.wrapper}>
            <input
                ref={ref}
                max={100}
                min={0}
                type='range'
                defaultValue={85}
                className={styles.input}
                onChange={handleChange}
            />
            <div className={styles.volumeReadout}>
                <span>{String(Math.round(currentVolume*100))}</span>
            </div>
        </div>
    );
}