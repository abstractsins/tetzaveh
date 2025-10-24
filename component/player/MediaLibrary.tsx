import styles from './MediaLibrary.module.css';
import PlaylistSelect from './PlaylistSelect';
import TrackList from './TrackList';

export default function MediaLibrary() {
    return (
        <div className={styles.wrapper}>
            <PlaylistSelect />
            <TrackList />
        </div>
    );
}