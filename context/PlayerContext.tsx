"use client";

//* ------------------------------------------------ //
//* -------------------- IMPORT -------------------- //
//* ------------------------------------------------ //

// REACT
import {
  useState,
  ReactNode,
  useMemo,
  useCallback,
  useRef,
  useEffect,
  createContext,
  useContext,
} from "react";

// WAVESURFER
import type WaveSurfer from "wavesurfer.js";

// TYPES
import {
  MediaPlayerContextValue,
  TrackFullMeta,
  Track,
  Playlist,
} from "@types";

const MediaPlayerContext = createContext<MediaPlayerContextValue | undefined>(
  undefined,
);

interface PlayerContextProps {
  children: ReactNode;
}

//* ------------------------------------------------ //
//* -------------------- EXPORT -------------------- //
//* ------------------------------------------------ //

export function MediaPlayerProvider({ children }: PlayerContextProps) {
  const [currentTrack, setCurrentTrack] = useState<TrackFullMeta | null>(null);
  const [currentPlaylist, setCurrentPlaylist] = useState<Playlist>();

  const [currentTrackDuration, setCurrentTrackDuration] = useState<
    number | null
  >(0.0);
  const [currentTrackPosition, setCurrentTrackPosition] = useState<number>(0.0);

  const [isPlaying, setPlaying] = useState(false);
  const [isPaused, setPaused] = useState(false);

  const [isTrackLooping, setTrackLooping] = useState(false);
  const [isAutoPlay, setAutoPlay] = useState(true);

  const [nextTrackInfo, setNextTrackInfo] = useState<Track | null>(null);

  const [playbackRate, setPlaybackRate] = useState<number>(1);
  const [currentVolume, setCurrentVolume] = useState<number>(0.85);

  const [index, setIndex] = useState(-1);

  // LOOP POINTS
  const [isSelectingLoop, setIsSelectingLoop] = useState<boolean>(false);
  const [loopStartTrack, setLoopStartTrack] = useState<Track | null>(null);
  const [loopEndTrack, setLoopEndTrack] = useState<Track | null>(null);
  const [loopPointsSet, setLoopPointsSet] = useState<boolean>(false);

  // identify a track uniquely
  const keyOf = (t: TrackFullMeta | null) =>
    t?.src || `${t?.title}|${t?.verse}`;

  const clearLoopPoints = useCallback(() => {
    setLoopStartTrack(null);
    setLoopEndTrack(null);
    setIsSelectingLoop(false);
    setLoopPointsSet(false);
  }, []);

  // Calculate loop range indices
  const loopRange = useMemo(() => {
    if (
      !loopPointsSet ||
      !currentPlaylist ||
      !loopStartTrack ||
      !loopEndTrack
    ) {
      return null;
    }
    const startIdx = currentPlaylist.tracks.findIndex(
      (t) => keyOf(t) === keyOf(loopStartTrack),
    );
    const endIdx = currentPlaylist.tracks.findIndex(
      (t) => keyOf(t) === keyOf(loopEndTrack),
    );
    if (startIdx === -1 || endIdx === -1 || startIdx > endIdx) {
      return null;
    }
    return { start: startIdx, end: endIdx };
  }, [loopPointsSet, currentPlaylist, loopStartTrack, loopEndTrack]);

  const waveRef = useRef<WaveSurfer | null>(null);
  const shouldAutoplayRef = useRef(false);

  // loop flags
  const loopTrackRef = useRef(isTrackLooping);
  const loopListRef = useRef(isAutoPlay);
  useEffect(() => {
    loopTrackRef.current = isTrackLooping;
  }, [isTrackLooping]);
  useEffect(() => {
    loopListRef.current = isAutoPlay;
  }, [isAutoPlay]);

  // keep index synced when selecting tracks manually
  useEffect(() => {
    if (!currentPlaylist) return;
    if (!currentTrack || currentPlaylist.tracks.length === 0) return;
    const i = currentPlaylist?.tracks.findIndex(
      (t) => keyOf(t) === keyOf(currentTrack),
    );
    if (i !== -1) setIndex(i);
  }, [currentTrack, currentPlaylist]);

  // register new wavesurfer instance
  const registerWave = useCallback(
    (ws: WaveSurfer | null) => {
      waveRef.current?.unAll?.();
      waveRef.current = ws;
      if (!ws) return;

      ws.on("play", () => {
        setPlaying(true);
        setPaused(false);
      });
      ws.on("pause", () => {
        setPlaying(false);
        setPaused(true);
      });

      const onReady = () => {
        ws.setPlaybackRate(playbackRate);
      };
      ws.on("ready", onReady);
    },
    [playbackRate],
  );

  // --- transport controls
  const play = useCallback(() => {
    waveRef.current?.play();
  }, []);

  const pause = useCallback(() => {
    waveRef.current?.pause();
  }, []);

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
  const registerPlaylist = useCallback(
    (playlist: Playlist | null) => {
      if (playlist) {
        clearLoopPoints();
        setCurrentPlaylist(playlist);
        if (!currentTrack && playlist.tracks.length > 0) {
          setCurrentTrack(playlist.tracks[0]);
          setNextTrackInfo(playlist.tracks[1]);
          setIndex(0);
        } else if (currentTrack) {
          const i = playlist.tracks.findIndex(
            (t) => keyOf(t) === keyOf(currentTrack),
          );
          if (i !== -1) setIndex(i);
        }
      }
    },
    [currentTrack],
  );

  // navigation
  const playTrackAt = useCallback(
    (i: number) => {
      if (!currentPlaylist) return;
      if (i < 0 || i >= currentPlaylist.tracks.length) return;
      // if we’re playing, arm for autoplay when WS is ready
      shouldAutoplayRef.current = isPlaying || isAutoPlay;
      const t = currentPlaylist.tracks[i];
      setCurrentTrack(t);
      setNextTrackInfo(
        currentPlaylist.tracks[i + 1] || currentPlaylist.tracks[0],
      );
      setIndex(i);
    },
    [currentPlaylist, isPlaying, isAutoPlay],
  );

  const nextTrack = useCallback(() => {
    if (!currentPlaylist) return;
    if (currentPlaylist.tracks.length === 0) return;
    shouldAutoplayRef.current = isPlaying || isAutoPlay;
    if (index < 0) {
      // failsafe
      playTrackAt(0);
      return;
    }

    // Check if we're in a loop
    if (loopRange) {
      // If we're at the loop end, jump back to loop start
      if (index >= loopRange.end) {
        playTrackAt(loopRange.start);
        return;
      }
      // If we're within the loop, proceed to next track
      if (index >= loopRange.start && index < loopRange.end) {
        playTrackAt(index + 1);
        return;
      }
    }

    // Normal behavior (no loop)
    const last = currentPlaylist.tracks.length - 1;
    if (index < last) playTrackAt(index + 1);
    else if (loopListRef.current) playTrackAt(0);
    else {
      setPlaying(false);
      setPaused(false);
    }
  }, [index, currentPlaylist, isPlaying, isAutoPlay, playTrackAt, loopRange]);

  const prevTrack = useCallback(() => {
    if (!currentPlaylist) return;
    if (currentPlaylist.tracks.length === 0) return;
    shouldAutoplayRef.current = isPlaying;

    // Check if we're in a loop
    if (loopRange) {
      // If we're at the loop start, jump to loop end
      if (index <= loopRange.start) {
        playTrackAt(loopRange.end);
        return;
      }
      // If we're within the loop, go to previous track
      if (index > loopRange.start && index <= loopRange.end) {
        playTrackAt(index - 1);
        return;
      }
    }

    // Normal behavior (no loop)
    if (index > 0) playTrackAt(index - 1);
    else if (loopListRef.current)
      playTrackAt(currentPlaylist.tracks.length - 1);
  }, [index, currentPlaylist, isPlaying, playTrackAt, loopRange]);

  const seekToZero = useCallback(() => {
    waveRef.current?.seekTo(0);
    setCurrentTrackPosition(0.0);
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
    setCurrentTrackPosition(currentTime || 0.0);
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
  const setVolume = useCallback((v: number) => {
    // 0.00 - 1
    waveRef.current?.setVolume(v);
    setCurrentVolume(v);
  }, []);

  const getVolume = useCallback(() => waveRef.current?.getVolume?.() ?? 1, []);

  useEffect(() => {
    if (!waveRef.current) return;
    waveRef.current?.setPlaybackRate(playbackRate);
  }, [playbackRate]);

  useEffect(() => {
    if (!currentPlaylist) {
      clearLoopPoints();
      return;
    }
    setCurrentTrack(currentPlaylist?.tracks[0]);
  }, [currentPlaylist]);

  // Handle loop activation - jump to loop start if current track is outside loop
  useEffect(() => {
    if (loopPointsSet && loopRange && isPlaying) {
      if (index < loopRange.start || index > loopRange.end) {
        playTrackAt(loopRange.start);
      }
    }
  }, [loopPointsSet, loopRange, isPlaying, index, playTrackAt]);

  const value: MediaPlayerContextValue = useMemo(
    () => ({
      currentTrack,
      setCurrentTrack,
      currentPlaylist,
      setCurrentPlaylist,
      isPlaying,
      setPlaying,
      isPaused,
      setPaused,
      isTrackLooping,
      setTrackLooping,
      isAutoPlay,
      setAutoPlay,
      wavesurfer: waveRef.current,
      registerWave,
      registerPlaylist,
      play,
      pause,
      stop,
      nextTrack,
      prevTrack,
      restartTrack,
      setVolume,
      getVolume,
      playTrackAt,
      handleFinish,
      seekToZero,
      consumeAutoplay,
      currentTrackDuration,
      setCurrentTrackPosition,
      handlePositionUpdate,
      currentTrackPosition,
      setCurrentTrackDuration,
      nextTrackInfo,
      currentVolume,
      index,
      setIndex,
      setPlaybackRate,
      playbackRate,
      loopStartTrack,
      setLoopStartTrack,
      loopEndTrack,
      setLoopEndTrack,
      clearLoopPoints,
      isSelectingLoop,
      setIsSelectingLoop,
      loopPointsSet,
      setLoopPointsSet,
      loopRange,
    }),
    [
      currentTrack,
      currentPlaylist,
      setCurrentPlaylist,
      isPlaying,
      isPaused,
      isTrackLooping,
      isAutoPlay,
      registerPlaylist,
      registerWave,
      play,
      pause,
      stop,
      restartTrack,
      setVolume,
      getVolume,
      playTrackAt,
      handleFinish,
      seekToZero,
      setCurrentTrackPosition,
      nextTrack,
      prevTrack,
      consumeAutoplay,
      currentTrackDuration,
      currentTrackPosition,
      handlePositionUpdate,
      setCurrentTrackDuration,
      nextTrackInfo,
      currentVolume,
      index,
      setIndex,
      setPlaybackRate,
      playbackRate,
      loopStartTrack,
      loopEndTrack,
      clearLoopPoints,
      isSelectingLoop,
      setIsSelectingLoop,
      loopPointsSet,
      setLoopPointsSet,
      loopRange,
    ],
  );

  return (
    <MediaPlayerContext.Provider value={value}>
      {children}
    </MediaPlayerContext.Provider>
  );
}

export function useMediaPlayer() {
  const context = useContext(MediaPlayerContext);
  if (!context)
    throw new Error(
      "MediaPlayerContext must be used within a MediaPlayerProvider",
    );
  return context;
}
