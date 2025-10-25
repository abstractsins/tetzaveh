import { useMediaPlayer } from '@/context/PlayerContext';
import styles from './PlaylistItem.module.css';

interface Props {
    title: string;
    numTracks: number;
    className?: string;
    onClick: () => void;
}

export default function PlaylistItem({ title, onClick, numTracks, className }: Props) {

    return (
        <div className={`${styles.wrapper} ${className ? styles[className] : ''}`} onClick={onClick}>
            <div className={styles.body}>
                <span className={styles.title}>{title}</span>
                <span className={styles.numTracksWrapper}>
                    <span className={styles.numTracksLabel}>
                        Verses:
                    </span>
                    <span className={styles.numTracksValue}>
                        {numTracks}
                    </span>
                </span>
            </div>
        </div>
    );
}