import styles from './VolumeSlider.module.css';
import { useMediaPlayer } from '@/context/PlayerContext';
import { useEffect, useRef } from 'react';

export default function VolumeSlider() {
    const ref = useRef<HTMLInputElement>(null);
    const { currentVolume, setVolume } = useMediaPlayer();

    // Initialize slider fill on mount
    useEffect(() => {
        const el = ref.current;
        if (!el) return;
        const volume = Number(el.value);
        setVolume(volume / 100);
        el.style.setProperty('--value-percent', `${volume}%`);
    }, [setVolume]);

    // Update both volume + CSS fill as user slides
    const handleChange = () => {
        const el = ref.current;
        if (!el) return;
        const volume = Number(el.value);
        setVolume(volume / 100);
        const percent = (volume / Number(el.max)) * 100;
        el.style.setProperty('--value-percent', `${percent}%`);
    };

    return (
        <div className={styles.wrapper}>
            <input
                ref={ref}
                max={100}
                min={0}
                type="range"
                defaultValue={85}
                className={styles.input}
                onChange={handleChange}
                title='volume'
            />
            <div className={styles.volumeReadout}>
                <span>{Math.round(currentVolume * 100)}</span>
            </div>
        </div>
    );
}
