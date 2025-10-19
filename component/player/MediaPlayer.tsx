'use client';

import styles from './MediaPlayer.module.css';

import WavesurferPlayer from '@wavesurfer/react';

import { useMediaPlayer } from "@/context/PlayerContext";
import ControlPanel from './ControlPanel';
import { useState } from 'react';
import { Track } from '@/type/types';


export default function MediaPlayer() {

    const { currentTrack } = useMediaPlayer();

    const [wavesurfer, setWavesurfer] = useState<any>(null);

    const emptyTrack: Track = {
        title: '',
        verse: '',
        wordCount: 0,
        src: ''
    }

    const track = currentTrack ?? emptyTrack;

    return (
        <div className={styles.wrapper}>
            <div className={styles.nowPlayingHeader}>
                <h2>NOW PLAYING</h2>
            </div>


            <div className={styles.body}>

                <div className={styles.currentTrack}>
                    <div className={styles.currentTrackMeta}>

                        <div className={styles.trackTitle}>
                            {track.title}
                        </div>
                        <div className={styles.verse}>
                            {track.verse}
                        </div>
                    </div>
                    <div className={styles.currentTrackOutput}>
                        <WavesurferPlayer
                            url={`/audio/${track.src}`}
                            height={100}
                            waveColor="slategray"
                            progressColor="gold"
                            onReady={ws => setWavesurfer(ws)}
                            width='100%'
                        />
                    </div>
                </div>

                <div className={styles.controlArea}>
                    <ControlPanel />
                </div>


            </div>
        </div>
    );
}