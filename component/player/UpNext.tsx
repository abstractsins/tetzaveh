import { useMediaPlayer } from '@/context/PlayerContext';
import styles from './UpNext.module.css';

export default function UpNext() {

    const { currentTrack, nextTrackInfo } = useMediaPlayer();

    return (
        <div className={styles.upNext}>
            {currentTrack && (
                <>
                    <span className={styles.upNextLabel}>up next:</span>
                    <span className={styles.upNextValue}>
                        {nextTrackInfo?.title}, {nextTrackInfo?.verse}
                    </span>
                </>
            )}
        </div>
    );
}