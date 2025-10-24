
//* ------------------------------------------------ //
//* -------------------- IMPORT -------------------- //
//* ------------------------------------------------ //

// STYLE
import styles from './TrackOutput.module.css';

// CONTEXT
import { useMediaPlayer } from '@/context/PlayerContext';

// REACT
import {
    useMemo,
    useRef,
    useEffect,
    useCallback,
    useState
} from 'react';

// WAVESURFER
import WavesurferPlayer from '@wavesurfer/react';
import WaveSurfer from 'wavesurfer.js';
import Timeline from 'wavesurfer.js/dist/plugins/timeline.esm.js';


//* -------------------- TYPES -------------------- //

type TimelineOptions = Parameters<typeof Timeline.create>[0];
type TimelineInstance = ReturnType<typeof Timeline.create>;



//* ------------------------------------------------ //
//* -------------------- EXPORT -------------------- //
//* ------------------------------------------------ //

export default function TrackOutput() {

    const {
        handleFinish,
        registerWave,
        setVolume,
        consumeAutoplay,
        setCurrentTrackDuration,
        handlePositionUpdate,
        setCurrentTrackPosition,
        currentTrack,
        currentVolume
    } = useMediaPlayer();

    const createdRef = useRef(false); // prevent double-create in React StrictMode

    // ----- Wavesurfer Timeline -----
    const timelineConfig: TimelineOptions = useMemo(
        () => ({
            height: 10,
            timeInterval: 0.1,
            primaryLabelInterval: 1,
            style: {
                fontSize: '10px',
                color: 'rgba(255, 20, 146, .4)'
            },
        }), []
    );

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

    const [timeline, setTimeline] = useState<TimelineInstance | null>(null);


    // Memoize the array so its identity doesn't change
    const plugins = useMemo(() => (timeline ? [timeline] : undefined), [timeline]);


    // ----- Stable props for Wavesurfer -----
    const url = useMemo(() => {
        const s = currentTrack?.src?.trim();
        if (!s) return undefined;
        if (s.startsWith('http://') || s.startsWith('https://') || s.startsWith('/')) return s;
        return `/audio/${s}`; // assumes files live in /public/audio
    }, [currentTrack?.src]);


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
        <div className={styles.currentTrackOutput}>
            <div className={styles.waveWrapper}>
                {url && plugins && (
                    <WavesurferPlayer
                        key={playerKey}
                        url={url}
                        waveColor={waveGradient}
                        progressColor={progressGradient}
                        barWidth={2}
                        barGap={1}
                        barRadius={5}
                        plugins={plugins}
                        onReady={handleReady}
                        onAudioprocess={handleProcess}
                        onFinish={handleFinish}
                        onError={(e: unknown) => {
                            // WaveSurfer (v7) forwards aborts as a generic TypeError in dev
                            const err = e as any;
                            const name = err?.name ?? (err instanceof DOMException ? err.name : '');
                            if (name === 'AbortError') return; // dev StrictMode double-mount
                            console.error('wavesurfer fetch failed for URL:', url, e);
                        }}
                    />
                )}
            </div>
        </div>
    );
}