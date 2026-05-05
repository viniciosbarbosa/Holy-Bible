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
    "https://santhatela.com.br/wp-content/uploads/2017/06/michelangelo-criacao-adao-d.jpg",
  patriarchs:
    "https://images.unsplash.com/photo-1473448912268-2022ce9509d8?w=1600&auto=format&fit=crop&q=80",
  exodus:
    "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=1600&auto=format&fit=crop&q=80",
  conquest_and_judges:
    "https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=1600&auto=format&fit=crop&q=80",
  kingdom:
    "https://images.unsplash.com/photo-1533154683836-84ea7a0bc310?w=1600&auto=format&fit=crop&q=80",
  exile:
    "https://images.unsplash.com/photo-1494200488721-f3e2d2356533?w=1600&auto=format&fit=crop&q=80",
  wisdom:
    "https://images.unsplash.com/photo-1519681393784-d120267933ba?w=1600&auto=format&fit=crop&q=80",
  prophets:
    "https://images.unsplash.com/photo-1466781923890-d36036a96739?w=1600&auto=format&fit=crop&q=80",
  minor_prophets:
    "https://images.unsplash.com/photo-1433086177607-6420be5803d0?w=1600&auto=format&fit=crop&q=80",
  intertestamental:
    "https://images.unsplash.com/photo-1550424564-9be8f941f173?w=1600&auto=format&fit=crop&q=80",
  infancy:
    "https://images.unsplash.com/photo-1512101176959-c557f3516787?w=1600&auto=format&fit=crop&q=80",
  gospels:
    "https://images.unsplash.com/photo-1490730141103-6cac27aaab94?w=1600&auto=format&fit=crop&q=80",
  passion:
    "https://images.unsplash.com/photo-1596704017354-935171e2e4f0?w=1600&auto=format&fit=crop&q=80",
  acts: "https://images.unsplash.com/photo-1532356884227-6ecdf7b3ee57?w=1600&auto=format&fit=crop&q=80",
  epistles:
    "https://images.unsplash.com/photo-1612860128461-5a30d5f2e83e?w=1600&auto=format&fit=crop&q=80",
  apocalypse:
    "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=1600&auto=format&fit=crop&q=80",
  fathers:
    "https://images.unsplash.com/photo-1507842217343-583bb7270b66?w=1600&auto=format&fit=crop&q=80",
  gnosis:
    "https://images.unsplash.com/photo-1601666874632-159620b75a1c?w=1600&auto=format&fit=crop&q=80",
  bridge:
    "https://images.unsplash.com/photo-1519794206461-ccfcaa8fa5b6?w=1600&auto=format&fit=crop&q=80",
  islam:
    "https://images.unsplash.com/photo-1519794206461-ccfcaa8fa5b6?w=1600&auto=format&fit=crop&q=80",
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

export type ProfileType = "personal" | "suggestion";

export interface ApiBook {
  abbrev: string;
  author: string;
  chapters: number;
  group: string;
  name: string;
  testament: string;
}
