import { useMediaPlayer } from '@/context/PlayerContext';
import styles from './TimeReadout.module.css';

export default function TimeReadout() {

    const {
        currentTrack,
        currentTrackPosition,
        currentTrackDuration
    } = useMediaPlayer()

    return (
        <div className={styles.wrapper}>
            {currentTrack 
                ? (<span>
                    {currentTrackPosition?.toFixed(3)} : {currentTrackDuration?.toFixed(3)}
                </span>)
                : (<span>
                    0.000 : 0.000
                </span>)
            }
        </div>
    );
}