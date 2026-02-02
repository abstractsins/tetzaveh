import { useEffect, useRef } from "react";
import { Tetzaveh2Clips } from "@/data/playlist";
import { useMediaPlayer } from "@/context/PlayerContext";
import TrackItem from "./TrackItem";
import styles from "./TrackList.module.css";
import { Track } from "@/type/types";

export default function TrackList() {
  const {
    currentPlaylist,
    playTrackAt,
    setCurrentTrack,
    index: currentTrackIndex,
    isSelectingLoop,
    loopStartTrack,
    setIsSelectingLoop,
    setLoopPointsSet,
    setLoopStartTrack,
    loopEndTrack,
    setLoopEndTrack,
  } = useMediaPlayer();

  const tracks = currentPlaylist?.tracks;

  // create a ref array for all track items
  const itemRefs = useRef<(HTMLDivElement | null)[]>([]);

  const setItemRef = (el: HTMLDivElement | null, index: number) => {
    itemRefs.current[index] = el;
  };

  const configureLoopPoints = (track: Track, i: number) => {
    if (loopStartTrack && !loopEndTrack) {
      // if setting an end point before the start point, swap them
      if (i < tracks!.indexOf(loopStartTrack)) {
        setLoopEndTrack(loopStartTrack);
        setLoopStartTrack(track);
      } else {
        setLoopEndTrack(track);
      }
    }
    // exit loop selection mode after setting both points
    setIsSelectingLoop(false);
    setLoopPointsSet(true);
  };

  const handleClickTrack = (track: Track, i: number) => {
    if (isSelectingLoop) {
      if (!loopStartTrack) {
        setLoopStartTrack(track);
      } else {
        configureLoopPoints(track, i);
      }
    } else {
      setCurrentTrack(track);
      playTrackAt(i);
    }
  };

  // scroll current track into view when index changes
  useEffect(() => {
    const el = itemRefs.current[currentTrackIndex];
    if (el) {
      el.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }
  }, [currentTrackIndex]);

  return (
    <div className={styles.wrapper}>
      <div className={styles.body}>
        {tracks?.map((track, i) => (
          <div
            key={track.src || `${track.title}|${track.verse}`}
            ref={(el) => setItemRef(el, i)}
          >
            <TrackItem
              onClick={() => handleClickTrack(track, i)}
              key={`Tetzaveh-2-${i}`}
              title={track.title}
              src={track.src}
              verse={track.verse}
              wordCount={track.wordCount}
              className={`${i === currentTrackIndex ? "playing" : ""}`}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
