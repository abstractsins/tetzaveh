import { Tetzaveh2Clips } from '@/data/playlist';
import VerseClips from '@/component/VerseClips';
import { Playlist } from '@/type/types';

import styles from './TrackList.module.css';
import TrackItem from './TrackItem';
import { useMediaPlayer } from '@/context/PlayerContext';

export default function TrackList() {

    const { currentTrack, setCurrentTrack } = useMediaPlayer()

    return (
        <div className={styles.wrapper}>
            <div className={styles.body}>
                {Tetzaveh2Clips.tracks.map((track, i) =>
                    <TrackItem
                        onClick={() => setCurrentTrack(track)}
                        key={`Tetzaveh-2-${i}`}
                        title={track.title}
                        src={track.src}
                        verse={track.verse}
                        wordCount={track.wordCount}
                    />
                )}
            </div>
        </div>
    );
}