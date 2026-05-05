export interface Tag {
  lbl: string;
  bg: string;
  color: string;
  border: string;
  desc?: string;
}

export interface SavedVerse {
  id: string;
  chapter: number;
  verse: number;
  text: string;
  timestamp: number;
}

export interface Book {
  id: string;
  num: string;
  name: string;
  sub?: string;
  tags: string[];
  isQ?: boolean;
  savedVerses?: SavedVerse[];
}

export const DEFAULT_WALLPAPERS = {
  genesis:
    "https://images.unsplash.com/photo-1470770841072-f978cf4d019e?q=80&w=800&auto=format&fit=crop",

  patriarchs:
    "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?q=80&w=800&auto=format&fit=crop",

  exodus:
    "https://images.unsplash.com/photo-1501785888041-af3ef285b470?q=80&w=800&auto=format&fit=crop",

  conquest_and_judges:
    "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?q=80&w=800&auto=format&fit=crop",

  kingdom:
    "https://images.unsplash.com/photo-1467269204594-9661b134dd2b?q=80&w=800&auto=format&fit=crop",

  exile:
    "https://images.unsplash.com/photo-1504198458649-3128b932f49b?q=80&w=800&auto=format&fit=crop",

  wisdom:
    "https://images.unsplash.com/photo-1519681393784-d120267933ba?q=80&w=800&auto=format&fit=crop",

  prophets:
    "https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?q=80&w=800&auto=format&fit=crop",

  minor_prophets:
    "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=800&auto=format&fit=crop",

  intertestamental:
    "https://images.unsplash.com/photo-1492724441997-5dc865305da7?q=80&w=800&auto=format&fit=crop",

  infancy:
    "https://images.unsplash.com/photo-1519682337058-a94d519337bc?q=80&w=800&auto=format&fit=crop",

  gospels:
    "https://images.unsplash.com/photo-1507699622108-4be3abd695ad?q=80&w=800&auto=format&fit=crop",

  passion:
    "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?q=80&w=800&auto=format&fit=crop",

  acts: "https://images.unsplash.com/photo-1500534623283-312aade485b7?q=80&w=800&auto=format&fit=crop",

  epistles:
    "https://images.unsplash.com/photo-1516979187457-637abb4f9353?q=80&w=800&auto=format&fit=crop",

  apocalypse:
    "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?q=80&w=800&auto=format&fit=crop",

  fathers:
    "https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?q=80&w=800&auto=format&fit=crop",

  gnosis:
    "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?q=80&w=800&auto=format&fit=crop",

  bridge:
    "https://images.unsplash.com/photo-1505761671935-60b3a7427bad?q=80&w=800&auto=format&fit=crop",

  islam:
    "https://images.unsplash.com/photo-1509099836639-18ba1795216d?q=80&w=800&auto=format&fit=crop",
} as const;

export type BibleTheme = keyof typeof DEFAULT_WALLPAPERS;

export interface Phase {
  id: string;
  num: string;
  title: string;
  theme: BibleTheme;
  div?: string;
  books: Book[];
}

export interface ApiBook {
  abbrev: string;
  author: string;
  chapters: number;
  group: string;
  name: string;
  testament: string;
}
