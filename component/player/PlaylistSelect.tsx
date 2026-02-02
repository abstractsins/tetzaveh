import { useMediaPlayer } from "@/context/PlayerContext";
import PlaylistItem from "./PlaylistItem";
import styles from "./LibraryControls.module.css";

import { playlists } from "@/data/playlist";
import { Playlist } from "@/type/types";

export default function PlaylistSelect() {
  const { registerPlaylist, currentPlaylist } = useMediaPlayer();

  const handlePlaylistSelect = (playlist: Playlist) => {
    registerPlaylist(playlist);
  };

  return (
    <div className={styles.wrapper}>
      <div className={styles.header}>
        <span>playlists</span>
      </div>

      <div className={styles.body}>
        {playlists.map((playlist, i) => (
          <PlaylistItem
            key={i}
            title={playlist.title}
            numTracks={playlist.tracks.length}
            className={`${currentPlaylist?.id === playlist.id ? "playing" : ""}`}
            onClick={() => handlePlaylistSelect(playlist)}
          />
        ))}
      </div>
    </div>
  );
}
