export type TorahBook = 'Genesis' | 'Exodus' | 'Leviticus' | 'Numbers' | 'Deuteronomy';

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
}

export interface Playlist {
    title: string;
    tracks: Track[];
    notes?: string;
}
