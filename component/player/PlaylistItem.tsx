import styles from './PlaylistItem.module.css';

interface Props {
    title: string
}

export default function PlaylistItem({ title }: Props) {
    return (
        <div className={styles.wrapper}>
            <span>{title}</span>
        </div>
    );
}