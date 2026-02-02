import { Parsha, AliyahTrack } from "@types";

// * INDIVIDUAL ALIYAH
export const Tetzaveh2: AliyahTrack = {
  label: "Tetzaveh, 2nd Aliyah",
  parsha: "Tetzaveh",
  order: 2,
  book: "Exodus",
  chapterStart: 28,
  verseStart: 13,
  chapterEnd: 28,
  verseEnd: 30,
  src: "/audio/Tetzaveh-2.wav",
  credit: "The Bayit, Hebrew Institute of Riverdale",
  creditUrl: "https://www.thebayit.org/tetzaveh#",
};

// * WHOLE PARSHA
const Tetzaveh: Parsha = {
  name: "Tetzaveh",
  book: "Exodus",
  chapterStart: 27,
  verseStart: 20,
  chapterEnd: 30,
  verseEnd: 10,
  aliyahs: [Tetzaveh2],
};
