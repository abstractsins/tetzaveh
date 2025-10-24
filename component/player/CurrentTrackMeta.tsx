import { useMediaPlayer } from '@/context/PlayerContext';
import styles from './CurrentTrackMeta.module.css';

import Link from 'next/link';

export default function CurrentTrackMeta() {

    const { currentTrack } = useMediaPlayer();

    return (
        <div className={styles.currentTrackMeta}>
            <div className={styles.trackTitle}>{currentTrack?.title}</div>
            <div className={styles.verse}>{currentTrack?.verse}</div>
            <div className={styles.credit}>
                {currentTrack?.creditUrl ? (
                    <Link href={currentTrack.creditUrl} target="new">
                        {currentTrack.credit}
                    </Link>
                ) : (
                    currentTrack?.credit
                )}
            </div>
        </div>
    );
}