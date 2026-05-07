/**
 * Unit tests for useBibleStore
 *
 * Covers: toggleRead, setAcquisition, addFavoriteVerse, removeFavoriteVerse
 */
import { describe, it, expect, beforeEach } from "vitest";
import { act, renderHook } from "@testing-library/react";
import { useBibleStore } from "../../store/use-bible-store";

const resetStore = () =>
  useBibleStore.setState({
    readStatus: {},
    acquisitionStatus: {},
    favoriteVerses: [],
  });

describe("useBibleStore", () => {
  beforeEach(() => {
    resetStore();
  });

  // ── READ STATUS ──────────────────────────────────────────────────────────
  describe("toggleRead", () => {
    it("marks a book as read the first time", () => {
      const { result } = renderHook(() => useBibleStore());
      act(() => result.current.toggleRead("gen"));
      expect(result.current.readStatus["gen"]).toBe(true);
    });

    it("toggles back to unread on second call", () => {
      const { result } = renderHook(() => useBibleStore());
      act(() => result.current.toggleRead("gen"));
      act(() => result.current.toggleRead("gen"));
      expect(result.current.readStatus["gen"]).toBe(false);
    });

    it("does not affect other book statuses", () => {
      const { result } = renderHook(() => useBibleStore());
      act(() => result.current.toggleRead("gen"));
      expect(result.current.readStatus["exo"]).toBeUndefined();
    });
  });

  // ── ACQUISITION STATUS ───────────────────────────────────────────────────
  describe("setAcquisition", () => {
    it.each([
      ["missing"],
      ["acquired"],
      ["downloaded"],
      ["none"],
    ] as const)("sets status to '%s'", (status) => {
      const { result } = renderHook(() => useBibleStore());
      act(() => result.current.setAcquisition("rev", status));
      expect(result.current.acquisitionStatus["rev"]).toBe(status);
    });

    it("overwrites a previous status", () => {
      const { result } = renderHook(() => useBibleStore());
      act(() => result.current.setAcquisition("rev", "missing"));
      act(() => result.current.setAcquisition("rev", "acquired"));
      expect(result.current.acquisitionStatus["rev"]).toBe("acquired");
    });
  });

  // ── FAVORITE VERSES ──────────────────────────────────────────────────────
  const sampleVerse = {
    bookName: "Gênesis",
    bookAbbrev: "gen",
    chapter: "1",
    verse: "1",
    text: "No princípio Deus criou...",
  };

  describe("addFavoriteVerse", () => {
    it("adds a verse with an id and timestamp", () => {
      const { result } = renderHook(() => useBibleStore());
      act(() => result.current.addFavoriteVerse(sampleVerse));
      expect(result.current.favoriteVerses).toHaveLength(1);
      const added = result.current.favoriteVerses[0];
      expect(added.id).toBeDefined();
      expect(added.timestamp).toBeGreaterThan(0);
      expect(added.text).toBe(sampleVerse.text);
    });

    it("accumulates multiple verses", () => {
      const { result } = renderHook(() => useBibleStore());
      act(() => result.current.addFavoriteVerse(sampleVerse));
      act(() => result.current.addFavoriteVerse({ ...sampleVerse, verse: "2" }));
      expect(result.current.favoriteVerses).toHaveLength(2);
    });
  });

  describe("removeFavoriteVerse", () => {
    it("removes only the verse with the matching id", () => {
      const { result } = renderHook(() => useBibleStore());
      act(() => result.current.addFavoriteVerse(sampleVerse));
      const id = result.current.favoriteVerses[0].id;
      act(() => result.current.removeFavoriteVerse(id));
      expect(result.current.favoriteVerses).toHaveLength(0);
    });

    it("does not remove other verses", () => {
      const { result } = renderHook(() => useBibleStore());
      act(() => result.current.addFavoriteVerse(sampleVerse));
      act(() => result.current.addFavoriteVerse({ ...sampleVerse, verse: "2" }));
      const id = result.current.favoriteVerses[0].id;
      act(() => result.current.removeFavoriteVerse(id));
      expect(result.current.favoriteVerses).toHaveLength(1);
    });
  });
});
