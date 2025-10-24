'use client';

//* ------------------------------------------------ //
//* -------------------- IMPORT -------------------- //
//* ------------------------------------------------ //

// STYLE
import styles from './MediaPlayer.module.css';

// COMPONENTS
import VolumeSlider from './VolumeSlider';
import ControlPanel from './ControlPanel';
import TimeReadout from './TimeReadout';
import TrackOutput from './TrackOutput';
import CurrentTrackMeta from './CurrentTrackMeta';
import PlaybackSpeed from './PlaybackSpeed';
import { useMediaPlayer } from '@/context/PlayerContext';


//* ------------------------------------------------ //
//* -------------------- EXPORT -------------------- //
//* ------------------------------------------------ //

export default function MediaPlayer() {

    const { setPlaybackRate, playbackRate } = useMediaPlayer();


    const onChange = (x: number) => {
        setPlaybackRate(x);
    }

    return (
        <div className={`${styles.wrapper}`}>
            <div className={styles.body}>
                <div className={styles.leftSide}>
                    <div className={styles.nowPlayingHeader}>
                        <h2>NOW PLAYING</h2>
                    </div>

                    <div className={styles.currentTrack}>
                        <CurrentTrackMeta />
                    </div>

                    {/* CONTROL PANEL */}
                    <div className={styles.controlArea}>
                        <ControlPanel />
                    </div>
                </div>

                {/* RIGHT SIDE */}
                <div className={styles.rightSide}>

                    <TrackOutput />

                    <div className={styles.subWaveInfo}>

                        <VolumeSlider />

                        <PlaybackSpeed value={playbackRate} onChange={onChange} />

                        <TimeReadout />

                    </div>
                </div>
            </div>
        </div>
    );
}
