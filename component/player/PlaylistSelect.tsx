import PlaylistItem from './PlaylistItem';
import styles from './PlaylistSelect.module.css';

import { playlists } from '@/data/playlist';

export default function PlaylistSelect() {

    return (
        <div className={styles.wrapper}>
            {playlists.map((p, i) => <PlaylistItem key={i} title={p.title} />)}
        </div>
    );
}