import { useEffect } from "react";
import { Tetzaveh2Clips } from '@/data/playlist';
import VerseClips from '@/component/VerseClips';
import { Playlist } from '@/type/types';

import styles from './TrackList.module.css';
import TrackItem from './TrackItem';
import { useMediaPlayer } from '@/context/PlayerContext';

export default function TrackList() {

    const { registerPlaylist, currentTrack, playTrackAt } = useMediaPlayer();


    const { setCurrentTrack } = useMediaPlayer()

    const tracks = Tetzaveh2Clips.tracks;

    useEffect(() => {
    }, [registerPlaylist, tracks]);

    return (
        <div className={styles.wrapper}>
            <div className={styles.body}>
                {tracks.map((track, i) =>
                    <div key={track.src || `${track.title}|${track.verse}`} onClick={() => playTrackAt(i)}>
                        <TrackItem
                            onClick={() => {
                                registerPlaylist(Tetzaveh2Clips);
                                setCurrentTrack(track);
                            }}
                            key={`Tetzaveh-2-${i}`}
                            title={track.title}
                            src={track.src}
                            verse={track.verse}
                            wordCount={track.wordCount}
                        />
                    </div>
                )}
            </div>
        </div>
    );
}