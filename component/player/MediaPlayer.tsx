'use client';

import styles from './MediaPlayer.module.css';
import Link from 'next/link';

import WavesurferPlayer from '@wavesurfer/react';
import Timeline from 'wavesurfer.js/dist/plugins/timeline.esm.js';

import { useMediaPlayer } from '@/context/PlayerContext';
import ControlPanel from './ControlPanel';
import VolumeSlider from './VolumeSlider';

import { useEffect, useMemo, useState, useCallback, useRef } from 'react';
import WaveSurfer from 'wavesurfer.js';

type TimelineOptions = Parameters<typeof Timeline.create>[0];
type TimelineInstance = ReturnType<typeof Timeline.create>;

export default function MediaPlayer() {
    // ----- Wavesurfer Timeline -----
    const timelineConfig: TimelineOptions = useMemo(
        () => ({
            height: 10,
            timeInterval: 0.1,
            primaryLabelInterval: 1,
            style: {
                fontSize: '10px',
                color: 'rgba(255, 20, 146, .4)'
                // color: 'white'
            },
        }), []
    );

    const [timeline, setTimeline] = useState<TimelineInstance | null>(null);
    const createdRef = useRef(false); // prevent double-create in React StrictMode

    useEffect(() => {
        if (typeof window === 'undefined') return;
        if (createdRef.current) return;
        createdRef.current = true;

        const p = Timeline.create(timelineConfig);
        setTimeline(p);

        return () => {
            p?.destroy?.();
        };
    }, [timelineConfig]);

    // Memoize the array so its identity doesn't change
    const plugins = useMemo(() => (timeline ? [timeline] : undefined), [timeline]);

    // ----- Player Context -----
    const {
        currentTrack,
        nextTrackInfo,
        registerWave,
        setVolume,
        handleFinish,
        consumeAutoplay,
        currentTrackDuration,
        setCurrentTrackDuration,
        currentTrackPosition,
        handlePositionUpdate,
        setCurrentTrackPosition,
        currentVolume,
    } = useMediaPlayer();

    // ----- Stable props for Wavesurfer -----
    const url = useMemo(
        () => (currentTrack?.src ? `/audio/${currentTrack.src}` : undefined),
        [currentTrack?.src]
    );
    const playerKey = url ?? 'no-url';

    const waveGradient = useMemo(
        () => ['darkcyan', 'cyan', 'lightcyan', 'rgba(0,255,255,0.5)'],
        []
    );
    const progressGradient = useMemo(
        () => ['gold', 'goldenrod', 'lightgoldenrodyellow', 'yellow', 'lightyellow'],
        []
    );

    const handleReady = useCallback(
        (ws: WaveSurfer) => {
            registerWave(ws);
            setVolume(currentVolume);
            consumeAutoplay();
            setCurrentTrackDuration(ws.getDuration());
            setCurrentTrackPosition(0);
            consumeAutoplay();
        }, [
        registerWave,
        setVolume,
        currentVolume,
        consumeAutoplay,
        setCurrentTrackDuration,
        setCurrentTrackPosition,
    ]);

    const handleProcess = useCallback(
        (ws: WaveSurfer) => {
            handlePositionUpdate(ws.getCurrentTime());
        },
        [handlePositionUpdate]
    );

    return (
        <div className={`${styles.wrapper}`}>
            <div className={styles.body}>
                <div className={styles.leftSide}>
                    <div className={styles.nowPlayingHeader}>
                        <h2>NOW PLAYING</h2>
                    </div>

                    {/* TRACK INFO */}
                    <div className={styles.currentTrack}>
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
                            {url && plugins && (
                                <WavesurferPlayer
                                    key={playerKey}                 // remounts only when the track URL changes
                                    url={url}
                                    waveColor={waveGradient}
                                    progressColor={progressGradient}
                                    barWidth={2}
                                    barGap={1}
                                    barRadius={5}
                                    plugins={plugins}              // stable reference; no mid-play reinit
                                    onReady={handleReady}
                                    onAudioprocess={handleProcess}
                                    onFinish={handleFinish}
                                    onError={(e) => console.debug('wavesurfer error', e)}
                                />
                            )}
                        </div>
                    </div>

                    <div className={styles.subWaveInfo}>
                        <VolumeSlider />

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

                        <div className={styles.timeReadouts}>
                            {currentTrack && (
                                <span>
                                    {currentTrackPosition?.toFixed(3)} : {currentTrackDuration?.toFixed(3)}
                                </span>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
