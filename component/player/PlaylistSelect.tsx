import { useMediaPlayer } from '@/context/PlayerContext';
import PlaylistItem from './PlaylistItem';
import styles from './PlaylistSelect.module.css';

import { playlists } from '@/data/playlist';
import { Playlist } from '@/type/types';

export default function PlaylistSelect() {


    const { registerPlaylist, currentPlaylist } = useMediaPlayer();

    const handlePlaylistSelect = (playlist: Playlist) => {
        registerPlaylist(playlist);
    };


    return (
        <div className={styles.wrapper}>
            <div className={styles.header}>
                <span>playlists</span>
            </div>

            <div className={styles.body}>
                {playlists.map((p, i) =>
                    <PlaylistItem
                        key={i}
                        title={p.title}
                        numTracks={p.tracks.length}
                        className={`${currentPlaylist?.id === p.id ? 'playing' : ''}`}
                        onClick={() => handlePlaylistSelect(p)}
                    />)
                }
            </div>

        </div>
    );
}