import { create } from "zustand";
import { persist } from "zustand/middleware";
import { DEFAULT_WALLPAPERS } from "../@types/bible";

interface AppState {
  currentTheme: "dark" | "light" | "parchment";
  setTheme: (theme: "dark" | "light" | "parchment") => void;
  
  fontSize: number;
  setFontSize: (size: number) => void;
  
  currentBackground: string;
  setBackgroundFromTheme: (theme: string) => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      currentTheme: "dark",
      setTheme: (theme) => set({ currentTheme: theme }),
      
      fontSize: 18,
      setFontSize: (size) => set({ fontSize: Math.max(12, Math.min(size, 32)) }),
      
      currentBackground: DEFAULT_WALLPAPERS.genesis,
      setBackgroundFromTheme: (themeOrUrl) => {
        const url = DEFAULT_WALLPAPERS[themeOrUrl as keyof typeof DEFAULT_WALLPAPERS] || themeOrUrl;
        set({ currentBackground: url || DEFAULT_WALLPAPERS.genesis });
      },
    }),
    {
      name: "holy-bible-app-settings",
    }
  )
);
