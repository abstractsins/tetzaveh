'use client';

import MediaPlayer from '@/component/player/MediaPlayer';
import styles from './page.module.css';
import TrackList from '@/component/player/TrackList';
import PlaylistSelect from '@/component/player/PlaylistSelect';


export default function Home() {
    return (
        <div className={styles.body}>

            <MediaPlayer />
            <PlaylistSelect />
            <TrackList />

        </div>
    );
}