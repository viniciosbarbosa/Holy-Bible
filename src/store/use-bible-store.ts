import { create } from "zustand";
import { persist } from "zustand/middleware";

// 1. Garanta que a interface está 100% alinhada com o que você usa no Modal
export interface FavoriteVerse {
  id: string;
  bookName: string;
  bookAbbrev: string;
  chapter: string;
  verse: string;
  text: string | any[];
  timestamp: number;
}

interface BibleState {
  readStatus: Record<string, boolean>;
  acquisitionStatus: Record<
    string,
    "missing" | "acquired" | "downloaded" | "none"
  >;
  favoriteVerses: FavoriteVerse[];
  
  toggleRead: (bookId: string) => void;
  setAcquisition: (
    bookId: string,
    status: "missing" | "acquired" | "downloaded" | "none",
  ) => void;
  
  addFavoriteVerse: (verse: Omit<FavoriteVerse, "id" | "timestamp">) => void;
  removeFavoriteVerse: (id: string) => void;
}

export const useBibleStore = create<BibleState>()(
  persist(
    (set) => ({
      readStatus: {},
      acquisitionStatus: {},
      favoriteVerses: [],

      toggleRead: (bookId) =>
        set((state) => ({
          readStatus: {
            ...state.readStatus,
            [bookId]: !state.readStatus[bookId],
          },
        })),

      setAcquisition: (bookId, status) =>
        set((state) => ({
          acquisitionStatus: {
            ...state.acquisitionStatus,
            [bookId]: status,
          },
        })),
        
      addFavoriteVerse: (verse) =>
        set((state) => ({
          favoriteVerses: [
            ...state.favoriteVerses,
            {
              ...verse,
              id: crypto.randomUUID(),
              timestamp: Date.now(),
            },
          ],
        })),
        
      removeFavoriteVerse: (id) =>
        set((state) => ({
          favoriteVerses: state.favoriteVerses.filter((v) => v.id !== id),
        })),
    }),
    {
      name: "holy-bible-storage",
    },
  ),
);
