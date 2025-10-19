'use client';

import MediaPlayer from '@/component/player/MediaPlayer';
import styles from './page.module.css';
import TrackList from '@/component/player/TrackList';


export default function Home() {
    return (
        <div className={styles.body}>

            <MediaPlayer />
            <TrackList />

        </div>
    );
}