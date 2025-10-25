'use client';

import styles from './ControlPanel.module.css';

import { Tetzaveh2Clips } from '@/data/playlist';

import {
    PlayIcon,
    SkipForwardIcon,
    SkipBack,
    SquareStopIcon,
    PauseIcon,
    ArrowLeftToLine
} from "lucide-react";

import { TiArrowLoop, TiArrowLoopOutline } from "react-icons/ti";

import { useMediaPlayer } from '@/context/PlayerContext';
import Button from './Button';


export default function ControlPanel() {

    const {
        currentTrack, setCurrentTrack,
        registerPlaylist, setCurrentPlaylist,
        isPlaying, isPaused,
        setPlaying, setPaused,
        setTrackLooping, isTrackLooping,
        setAutoPlay, isAutoPlay,
        play, pause, stop, restartTrack, nextTrack, prevTrack,
        seekToZero, setIndex: setCurrentTrackIndex
    } = useMediaPlayer();


    const handlePlay = () => {
        if (!currentTrack) {
            // start playlist
            registerPlaylist(Tetzaveh2Clips);
            setCurrentTrack(Tetzaveh2Clips.tracks[0]);
        }

        if (!isPlaying) {
            setPlaying(true);
            setPaused(false);
        }
        play();
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
        pause();
    };

    const handleStop = () => {
        console.log(currentTrack);
        if (currentTrack) {
            setPaused(false);
            setPlaying(false);
            setCurrentTrack(null);
            setCurrentTrackIndex(-1);
            setCurrentPlaylist(undefined);
        } else {
            console.error('no track is playing');
        }
        stop();
    };

    const handleSkipForward = () => { nextTrack(); };
    const handleSkipBack = () => { prevTrack(); };

    const handleLoopTrack = () => setTrackLooping(!isTrackLooping);;

    const handleAutoPlay = () => setAutoPlay(!isAutoPlay);

    return (

        <div className={styles.wrapper}>
            <div className={styles.body}>

                {!isPlaying || isPaused
                    ? <Button title="Play" className="play" action={handlePlay} Icon={PlayIcon} />
                    : <Button title="Pause" className="pause" action={handlePause} Icon={PauseIcon} />
                }

                <Button
                    title="Restart Track"
                    className='restartTrack'
                    action={() => {
                        if (isPlaying) restartTrack();
                        else seekToZero();
                    }}
                    Icon={ArrowLeftToLine}
                    disabled={!currentTrack}
                />

                <Button
                    title="Previous Track"
                    className='prevTrack'
                    action={handleSkipBack}
                    Icon={SkipBack}
                    disabled={!currentTrack}
                />

                <Button
                    title="Next Track"
                    className='nextTrack'
                    action={handleSkipForward}
                    Icon={SkipForwardIcon}
                    disabled={!currentTrack}
                />

                <Button
                    title="Stop"
                    className={'stop'}
                    action={handleStop} Icon={SquareStopIcon}
                    disabled={!currentTrack}
                />

                <Button
                    title="Loop Track"
                    className={`${isTrackLooping ? 'on' : ''}`}
                    action={handleLoopTrack}
                    Icon={TiArrowLoop}
                    disabled={!currentTrack}
                />

                <Button
                    title="Autoplay"
                    className={`${isAutoPlay ? 'on' : ''}`}
                    action={handleAutoPlay}
                    Icon={TiArrowLoopOutline}
                />

            </div>
        </div>
    );
}