'use client';

import MediaPlayer from '@/component/player/MediaPlayer';
import styles from './page.module.css';
import TrackList from '@/component/player/TrackList';
import PlaylistSelect from '@/component/player/PlaylistSelect';
import MediaLibrary from '@/component/player/MediaLibrary';


export default function Home() {
    return (
        <div className={styles.body}>

            <MediaPlayer />
            <MediaLibrary />
            
        </div>
    );
}