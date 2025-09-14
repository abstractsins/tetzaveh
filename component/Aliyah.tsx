import Link from 'next/link';
import styles from './Aliyah.module.css';

import { AliyahTrack } from "@/type/types";

interface Props {
    aliyah: AliyahTrack
}

export default function Aliyah({ aliyah }: Props) {

    return (
        <div className={styles.body}>
            <div className={styles.clipBody}>
                <div className={styles.header}>
                    <h2>{aliyah.label}</h2>
                    <Link href={aliyah.creditUrl}>
                        {aliyah.credit}
                    </Link>
                </div>
                <audio controls src={aliyah.src}></audio>
            </div>
        </div>
    );

}