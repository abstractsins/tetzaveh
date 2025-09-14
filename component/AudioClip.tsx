import styles from './AudioClips.module.css';


interface Props {
    title: string;
    src: string;
    verse: string;
}

export default function AudioClip({ title, src, verse }: Props) {

    return (
        <div className={styles.body}>

            <div className={styles.header} >
                <h2>{title}</h2>
                <span>{verse}</span>
            </div>
            <div className={styles.clipBody}>
                <audio controls src={`/audio/${src}`} />
            </div>
        </div>
    );
} 