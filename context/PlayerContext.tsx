// TODO
// * styling for current track in list

'use client';

import {
    useState,
    ReactNode,
    useMemo,
    useCallback,
    useRef,
    useEffect,
    createContext, useContext,
} from 'react';

import type WaveSurfer from 'wavesurfer.js';
import { MediaPlayerContextValue, TrackFullMeta, Track, Playlist } from '@types';

const MediaPlayerContext = createContext<MediaPlayerContextValue | undefined>(undefined);

interface PlayerContextProps {
    children: ReactNode;
}

export function MediaPlayerProvider({ children }: PlayerContextProps) {
    const [currentTrack, setCurrentTrack] = useState<TrackFullMeta | null>(null);
    const [isPlaying, setPlaying] = useState(false);
    const [isPaused, setPaused] = useState(false);
    const [isTrackLooping, setTrackLooping] = useState(false);
    const [isAutoPlay, setAutoPlay] = useState(true);

    const [currentTrackDuration, setCurrentTrackDuration] = useState<number | null>(null);
    const [currentTrackPosition, setCurrentTrackPosition] = useState<number>(0.000);
    const [nextTrackInfo, setNextTrackInfo] = useState<Track | null>(null)

    const [playlist, setPlaylist] = useState<TrackFullMeta[]>([]);
    const [index, setIndex] = useState(-1);

    const [currentVolume, setCurrentVolume] = useState<number>(.85);

    // identify a track uniquely
    const keyOf = (t: TrackFullMeta | null) => t?.src || `${t?.title}|${t?.verse}`;

    const waveRef = useRef<WaveSurfer | null>(null);
    const shouldAutoplayRef = useRef(false);

    // loop flags
    const loopTrackRef = useRef(isTrackLooping);
    const loopListRef = useRef(isAutoPlay);
    useEffect(() => { loopTrackRef.current = isTrackLooping; }, [isTrackLooping]);
    useEffect(() => { loopListRef.current = isAutoPlay; }, [isAutoPlay]);

    // keep index synced when selecting tracks manually
    useEffect(() => {
        if (!currentTrack || playlist.length === 0) return;
        const i = playlist.findIndex((t) => keyOf(t) === keyOf(currentTrack));
        if (i !== -1) setIndex(i);
    }, [currentTrack, playlist]);

    // register new wavesurfer instance
    const registerWave = useCallback((ws: WaveSurfer | null) => {
        waveRef.current?.unAll?.();
        waveRef.current = ws;
        if (!ws) return;

        ws.on('play', () => { setPlaying(true); setPaused(false); });
        ws.on('pause', () => { setPlaying(false); setPaused(true); });
    }, []);

    // --- transport controls
    const play = useCallback(() => { waveRef.current?.play(); }, []);

    const pause = useCallback(() => { waveRef.current?.pause(); }, []);

    const stop = useCallback(() => {
        if (!waveRef.current) return;
        waveRef.current.pause();
        waveRef.current.seekTo(0);
        setPlaying(false);
        setPaused(false);
    }, []);

    const restartTrack = useCallback(() => {
        if (!waveRef.current) return;
        waveRef.current.seekTo(0);
        waveRef.current.play();
    }, []);

    // playlist setup
    const registerPlaylist = useCallback((playlist: Playlist | null) => {
        const tracks = playlist?.tracks ?? [];
        setPlaylist(tracks);
        if (!currentTrack && tracks.length > 0) {
            setCurrentTrack(tracks[0]);
            setNextTrackInfo(tracks[1]);
            setIndex(0);
        } else if (currentTrack) {
            const i = tracks.findIndex((t) => keyOf(t) === keyOf(currentTrack));
            if (i !== -1) setIndex(i);
        }
    }, [currentTrack]);

    // navigation
    const playTrackAt = useCallback((i: number) => {
        if (i < 0 || i >= playlist.length) return;
        // if we’re playing, arm for autoplay when WS is ready
        shouldAutoplayRef.current = isPlaying || isAutoPlay;
        const t = playlist[i];
        setCurrentTrack(t);
        setNextTrackInfo(playlist[i + 1] || playlist[0]);
        setIndex(i);
    }, [playlist, isPlaying, isAutoPlay]);

    const nextTrack = useCallback(() => {
        if (playlist.length === 0) return;
        shouldAutoplayRef.current = isPlaying || isAutoPlay;
        console.log(index);
        if (index < 0) { // failsafe
            playTrackAt(0);
            return;
        }
        const last = playlist.length - 1;
        if (index < last) playTrackAt(index + 1);
        else if (loopListRef.current) playTrackAt(0);
        else { setPlaying(false); setPaused(false); }

    }, [index, playlist, isPlaying, isAutoPlay, playTrackAt]);

    const prevTrack = useCallback(() => {
        if (playlist.length === 0) return;
        shouldAutoplayRef.current = isPlaying;
        if (index > 0) playTrackAt(index - 1);
        else if (loopListRef.current) playTrackAt(playlist.length - 1);
    }, [index, playlist, isPlaying, playTrackAt]);

    const seekToZero = useCallback(() => {
        waveRef.current?.seekTo(0);
        setCurrentTrackPosition(0.000);
    }, []);

    // finish behavior
    const handleFinish = useCallback(() => {
        if (!waveRef.current) return;
        if (isTrackLooping) {
            restartTrack();
            return;
        }

        if (isAutoPlay) nextTrack();
        else seekToZero();

    }, [isTrackLooping, nextTrack, restartTrack, isAutoPlay, seekToZero]);


    const handlePositionUpdate = useCallback((currentTime: number) => {
        setCurrentTrackPosition(currentTime || 0.000);
    }, []);


    // consume autoplay once WS instance is ready
    const consumeAutoplay = useCallback(() => {
        if (shouldAutoplayRef.current && waveRef.current) {
            waveRef.current.play();
            shouldAutoplayRef.current = false;
        } else if (isPlaying && waveRef.current) {
            waveRef.current.play();
            shouldAutoplayRef.current = false;
        }
    }, [isPlaying]);

    // volume
    const setVolume = useCallback((v: number) => { // 0.00 - 1
        waveRef.current?.setVolume(v);
        setCurrentVolume(v);
    }, []);
    const getVolume = useCallback(() => waveRef.current?.getVolume?.() ?? 1, []);

    // useEffect(() => {
    //     setCurrentVolume(getVolume());
    // }, [currentVolume, getVolume]);



    const value: MediaPlayerContextValue = useMemo(() => ({
        currentTrack, setCurrentTrack,
        isPlaying, setPlaying,
        isPaused, setPaused,
        isTrackLooping, setTrackLooping,
        isAutoPlay, setAutoPlay,
        wavesurfer: waveRef.current,
        registerWave, registerPlaylist,
        play, pause, stop, nextTrack, prevTrack, restartTrack,
        setVolume, getVolume,
        playTrackAt, handleFinish, seekToZero,
        consumeAutoplay,
        currentTrackDuration,
        setCurrentTrackPosition,
        handlePositionUpdate, currentTrackPosition, setCurrentTrackDuration,
        nextTrackInfo,
        currentVolume, index, setIndex
    }), [
        currentTrack, isPlaying, isPaused, isTrackLooping, isAutoPlay,
        registerPlaylist, registerWave, play, pause, stop, restartTrack,
        setVolume, getVolume, playTrackAt, handleFinish, seekToZero,
        setCurrentTrackPosition,
        nextTrack, prevTrack, consumeAutoplay, currentTrackDuration, currentTrackPosition, handlePositionUpdate, setCurrentTrackDuration,
        nextTrackInfo,
        currentVolume, index, setIndex
    ]);

    return (
        <MediaPlayerContext.Provider value={value}>
            {children}
        </MediaPlayerContext.Provider>
    );
}

export function useMediaPlayer() {
    const context = useContext(MediaPlayerContext);
    if (!context) throw new Error('MediaPlayerContext must be used within a MediaPlayerProvider');
    return context;
}
