import { useMediaPlayer } from '@/context/PlayerContext';
import styles from './PlaylistItem.module.css';

interface Props {
    title: string
    onClick: () => void;
}

export default function PlaylistItem({ title, onClick }: Props) {

    return (
        <div className={styles.wrapper} onClick={onClick}>
            <div className={styles.body}>
                <span>{title}</span>
            </div>
        </div>
    );
}