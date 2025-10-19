'use client';

import styles from './ControlPanel.module.css';

import { useRef } from 'react';

import {
    PlayIcon,
    SkipForwardIcon,
    SkipBack,
    SquareStopIcon,
    PauseIcon,
} from "lucide-react";

import { TiArrowLoop, TiArrowLoopOutline } from "react-icons/ti";

import { useMediaPlayer } from '@/context/PlayerContext';
import Button from './Button';


export default function ControlPanel() {

    const {
        currentTrack,
        setCurrentTrack,
        isPlaying,
        isPaused,
        setPlaying,
        setPaused,
        setTrackLooping,
        isTrackLooping,
        setPlaylistLooping,
        isPlaylistLooping
    } = useMediaPlayer();

    const ref = useRef<HTMLAudioElement>(null);

    const handlePlay = () => {
        if (!currentTrack) {
            // start playlist
        }

        if (!isPlaying) {
            setPlaying(true);
            setPaused(false);
        }
    };

    const handlePause = () => {
        if (currentTrack) {
            if (!isPaused) {
                setPlaying(false);
                setPaused(true);
            }
        } else {
            console.error('no track is playing');
        }
    };

    const handleStop = () => {
        if (currentTrack) {
            setPaused(false);
            setPlaying(false);
            setCurrentTrack(null)
        } else {
            console.error('no track is playing');
        }

    };

    const handleSkipForward = () => { };
    const handleRestartTrack = () => { };

    const handleLoopTrack = () => setTrackLooping(!isTrackLooping);;

    const handleLoopPlaylist = () => setPlaylistLooping(!isPlaylistLooping);

    return (
        <div className={styles.wrapper}>
            <div className={styles.body}>

                {!isPlaying || isPaused
                    ? <Button title="Play" className="play" action={handlePlay} Icon={PlayIcon} />
                    : <Button title="Pause" className="pause" action={handlePause} Icon={PauseIcon} />
                }
                <Button
                    title="Restart Track"
                    action={() => { }}
                    Icon={SkipBack}
                />

                <Button
                    title="Next Track"
                    action={() => { }}
                    Icon={SkipForwardIcon}
                />

                <Button
                    title="Stop"
                    className={`${isPlaying || isPaused ? 'stop' : ''}`}
                    action={handleStop} Icon={SquareStopIcon}
                />

                <Button
                    title="Loop Track"
                    className={`${isTrackLooping ? 'on' : ''}`}
                    action={handleLoopTrack}
                    Icon={TiArrowLoop}
                />

                <Button
                    title="Loop Playlist"
                    className={`${isPlaylistLooping ? 'on' : ''}`}
                    action={handleLoopPlaylist}
                    Icon={TiArrowLoopOutline}
                />

            </div>
        </div>
    );
}