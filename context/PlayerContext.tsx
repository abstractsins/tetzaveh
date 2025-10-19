'use client';

//* -------------------------------------- //
//* ----------------IMPORTS--------------- //
//* -------------------------------------- //

//* REACT
import {
    createContext,
    useContext,
    useState,
    ReactNode,
    useMemo,
    useCallback
} from 'react';

//* TYPES
import {
    MediaPlayerContextValue, Track
} from '@types';

const MediaPlayerContext = createContext<MediaPlayerContextValue | undefined>(undefined);



//* -------------------------------------- //
//* ---------------INTERFACE-------------- //
//* -------------------------------------- //

interface PlayerContextProps { children: ReactNode }



//* -------------------------------------- //
//* ----------------EXPORTS--------------- //
//* -------------------------------------- //

export function MediaPlayerProvider({ children }: PlayerContextProps) {

    const testTrack: Track = { src: 'fakefile.mp3', title: 'TEST TRACK', verse: 'Exodus 28:14', wordCount: 10 };

    const [currentTrack, setCurrentTrack] = useState<Track | null>(null);
    const [isPlaying, setPlaying] = useState<boolean>(false);
    const [isPaused, setPaused] = useState<boolean>(false);
    const [isTrackLooping, setTrackLooping] = useState<boolean>(false);
    const [isPlaylistLooping, setPlaylistLooping] = useState<boolean>(false);

    const value: MediaPlayerContextValue = useMemo(() => ({
        currentTrack,
        setCurrentTrack,

        isPlaying,
        setPlaying,

        isPaused,
        setPaused,

        isTrackLooping,
        setTrackLooping,

        isPlaylistLooping,
        setPlaylistLooping,
    }), [
        currentTrack,
        isPlaying,
        isPaused,
        isTrackLooping,
        isPlaylistLooping,
    ]);

    return (
        <MediaPlayerContext.Provider value={value}>
            {children}
        </MediaPlayerContext.Provider>
    )
}

export function useMediaPlayer() {
    const context = useContext(MediaPlayerContext);
    if (!context) {
        throw new Error('MediaPlayerContext must be used within a MediaPlayerProvider');
    }
    return context;
}