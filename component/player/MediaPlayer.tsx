'use client';

import styles from './MediaPlayer.module.css';
import Link from 'next/link';
import WavesurferPlayer from '@wavesurfer/react';

import { useMediaPlayer } from "@/context/PlayerContext";
import ControlPanel from './ControlPanel';
import VolumeSlider from './VolumeSlider';


export default function MediaPlayer() {

    const {
        currentTrack,
        nextTrackInfo,
        registerWave,
        setVolume,
        handleFinish,
        consumeAutoplay,
        currentTrackDuration, setCurrentTrackDuration,
        currentTrackPosition,
        handlePositionUpdate,
        setCurrentTrackPosition,
        currentVolume
    } = useMediaPlayer();

    const track = currentTrack;

    return (
        <div className={styles.wrapper}>

            <div className={styles.body}>
                <div className={styles.leftSide}>

                    <div className={styles.nowPlayingHeader}>
                        <h2>NOW PLAYING</h2>
                    </div>


                    {/* LEFT SIDE */}

                    {/* TRACK INFO */}
                    <div className={styles.currentTrack}>
                        <div className={styles.currentTrackMeta}>

                            <div className={styles.trackTitle}>
                                {track?.title}
                            </div>
                            <div className={styles.verse}>
                                {track?.verse}
                            </div>
                            <div className={styles.credit}>
                                {track?.creditUrl
                                    ? (<Link href={track?.creditUrl} target='new'>{track?.credit}</Link>)
                                    : (track?.credit)
                                }
                            </div>
                        </div>

                    </div>

                    {/* CONTROL PANEL */}
                    <div className={styles.controlArea}>
                        <ControlPanel />
                    </div>

                </div>


                {/* RIGHT SIDE */}
                <div className={styles.rightSide}>

                    <div className={styles.currentTrackOutput}>
                        <div className={styles.waveWrapper}>
                            <WavesurferPlayer
                                url={track?.src ? `/audio/${track?.src}` : undefined}
                                waveColor="cyan"
                                progressColor="gold"
                                onReady={(ws) => {
                                    registerWave(ws);
                                    setVolume(currentVolume); // default
                                    consumeAutoplay();
                                    setCurrentTrackDuration(ws.getDuration());
                                    setCurrentTrackPosition(0.000);
                                    ws.play();
                                }}
                                onAudioprocess={(ws) => {
                                    handlePositionUpdate(ws.getCurrentTime())
                                }}
                                onFinish={handleFinish}
                            />
                        </div>

                        <div className={styles.subWaveInfo}>

                            <VolumeSlider />

                            <div className={styles.upNext}>
                                {currentTrack &&
                                    <>
                                        <span className={styles.upNextLabel}>up next:</span>
                                        <span className={styles.upNextValue}>{nextTrackInfo?.title}, {nextTrackInfo?.verse}</span>
                                    </>
                                }
                            </div>
                            <div className={styles.timeReadouts}>
                                {currentTrack &&
                                    <span>{currentTrackPosition?.toFixed(3)} : {currentTrackDuration?.toFixed(3)}</span>
                                }
                            </div>
                        </div>

                    </div>
                </div>




            </div>
        </div>
    );
}