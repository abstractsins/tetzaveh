import { useEffect, useRef } from "react";
import { Tetzaveh2Clips } from '@/data/playlist';
import { useMediaPlayer } from '@/context/PlayerContext';
import TrackItem from './TrackItem';
import styles from './TrackList.module.css';

export default function TrackList() {
    const {
        currentPlaylist,
        playTrackAt,
        setCurrentTrack,
        index: currentTrackIndex
    } = useMediaPlayer();

    const tracks = currentPlaylist?.tracks;

    // create a ref array for all track items
    const itemRefs = useRef<(HTMLDivElement | null)[]>([]);

    const setItemRef = (el: HTMLDivElement | null, index: number) => {
        itemRefs.current[index] = el;
    };

    // scroll current track into view when index changes
    useEffect(() => {
        const el = itemRefs.current[currentTrackIndex];
        if (el) {
            el.scrollIntoView({
                behavior: 'smooth',
                block: 'center',
            });
        }
    }, [currentTrackIndex]);

    return (
        <div className={styles.wrapper}>
            <div className={styles.body}>
                {tracks?.map((track, i) => (
                    <div
                        key={track.src || `${track.title}|${track.verse}`}
                        ref={el => setItemRef(el, i)}
                    >
                        <TrackItem
                            onClick={() => {
                                setCurrentTrack(track);
                                playTrackAt(i);
                            }}
                            key={`Tetzaveh-2-${i}`}
                            title={track.title}
                            src={track.src}
                            verse={track.verse}
                            wordCount={track.wordCount}
                            className={`${i === currentTrackIndex ? 'playing' : ''}`}
                        />
                    </div>
                ))}
            </div>
        </div>
    );
}