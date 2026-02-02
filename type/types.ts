import type WaveSurfer from "wavesurfer.js";

export type TorahBook =
  | "Genesis"
  | "Exodus"
  | "Leviticus"
  | "Numbers"
  | "Deuteronomy";

export interface Parsha {
  name: string;
  book: TorahBook;
  chapterStart: number;
  verseStart: number;
  chapterEnd: number;
  verseEnd: number;
  aliyahs: Aliyah[];
}

export interface Aliyah {
  label: string;
  parsha: string;
  order: number;
  book: TorahBook;
  chapterStart: number;
  verseStart: number;
  chapterEnd: number;
  verseEnd: number;
}

export interface AliyahTrack extends Aliyah {
  src: string;
  credit: string;
  creditUrl: string;
}

export interface Track {
  title: string;
  src: string;
  verse: string;
  wordCount: number;
}

export interface TrackFullMeta extends Track {
  credit?: string;
  creditUrl?: string;
}

export interface Playlist {
  id: string;
  title: string;
  tracks: TrackFullMeta[];
  notes?: string;
}

export interface MediaPlayerContextValue {
  currentTrack: TrackFullMeta | null;
  setCurrentTrack: (t: Track | null) => void;

  currentPlaylist: Playlist | undefined;
  setCurrentPlaylist: (p: Playlist | undefined) => void;

  nextTrackInfo: Track | null;

  isPlaying: boolean;
  setPlaying: (b: boolean) => void;

  isPaused: boolean;
  setPaused: (b: boolean) => void;

  isTrackLooping: boolean;
  setTrackLooping: (b: boolean) => void;

  isAutoPlay: boolean;
  setAutoPlay: (b: boolean) => void;

  wavesurfer: WaveSurfer | null;
  registerWave: (ws: WaveSurfer | null) => void;

  registerPlaylist: (pl: Playlist | null) => void;
  playTrackAt: (index: number) => void;

  // TRANSPORT
  play: () => void;
  pause: () => void;
  stop: () => void;
  restartTrack: () => void;

  // VOLUME
  setVolume: (v: number) => void; // 0..1
  getVolume: () => number; // 0..1
  currentVolume: number;

  seekToZero: () => void;
  prevTrack: () => void;
  nextTrack: () => void;

  handleFinish: () => void;

  consumeAutoplay: () => void;

  // current track index
  index: number;
  setIndex: (i: number) => void;

  playbackRate: number;
  setPlaybackRate: (x: number) => void;

  // TIME
  currentTrackDuration: number | null;
  currentTrackPosition: number | null;
  setCurrentTrackPosition: (pos: number) => void;
  handlePositionUpdate: (pos: number) => void;
  setCurrentTrackDuration: (n: number) => void;
}
