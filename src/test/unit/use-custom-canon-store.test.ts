/**
 * Unit tests for useCustomCanonStore
 *
 * Covers: profile management, phase CRUD, book CRUD, verse CRUD, getAllSavedVerses
 */
import { describe, it, expect, beforeEach } from "vitest";
import { act, renderHook } from "@testing-library/react";
import { useCustomCanonStore } from "../../store/use-custom-canon-store";

const resetStore = () =>
  useCustomCanonStore.setState({
    activeProfile: null,
    personalPhases: [],
    suggestionPhases: [],
  });

describe("useCustomCanonStore", () => {
  beforeEach(() => {
    resetStore();
  });

  // ── PROFILE ──────────────────────────────────────────────────────────────
  describe("profile management", () => {
    it("starts with no active profile", () => {
      const { result } = renderHook(() => useCustomCanonStore());
      expect(result.current.activeProfile).toBeNull();
    });

    it("setProfile('personal') switches to personal", () => {
      const { result } = renderHook(() => useCustomCanonStore());
      act(() => result.current.setProfile("personal"));
      expect(result.current.activeProfile).toBe("personal");
    });

    it("setProfile('suggestion') switches to suggestion", () => {
      const { result } = renderHook(() => useCustomCanonStore());
      act(() => result.current.setProfile("suggestion"));
      expect(result.current.activeProfile).toBe("suggestion");
    });

    it("resetProfile() sets activeProfile back to null", () => {
      const { result } = renderHook(() => useCustomCanonStore());
      act(() => result.current.setProfile("personal"));
      act(() => result.current.resetProfile());
      expect(result.current.activeProfile).toBeNull();
    });
  });

  // ── PHASE CRUD ───────────────────────────────────────────────────────────
  describe("phase operations (personal profile)", () => {
    beforeEach(() => {
      useCustomCanonStore.setState({ activeProfile: "personal" });
    });

    it("addPhase() appends a phase to personalPhases", () => {
      const { result } = renderHook(() => useCustomCanonStore());
      act(() => result.current.addPhase({ num: "1", title: "Gênesis", theme: "genesis" }));
      expect(result.current.personalPhases).toHaveLength(1);
      expect(result.current.personalPhases[0].title).toBe("Gênesis");
    });

    it("addPhase() auto-generates an id", () => {
      const { result } = renderHook(() => useCustomCanonStore());
      act(() => result.current.addPhase({ num: "1", title: "Test", theme: "genesis" }));
      expect(result.current.personalPhases[0].id).toBeTruthy();
    });

    it("addPhaseWithBooks() creates a phase with pre-attached books", () => {
      const { result } = renderHook(() => useCustomCanonStore());
      act(() =>
        result.current.addPhaseWithBooks(
          { num: "1", title: "AT", theme: "genesis" },
          [
            { num: "1", name: "Gênesis", sub: "", tags: [], savedVerses: [] },
            { num: "2", name: "Êxodo", sub: "", tags: [], savedVerses: [] },
          ]
        )
      );
      expect(result.current.personalPhases[0].books).toHaveLength(2);
    });

    it("updatePhase() modifies the matching phase", () => {
      const { result } = renderHook(() => useCustomCanonStore());
      act(() => result.current.addPhase({ num: "1", title: "Old Title", theme: "genesis" }));
      const id = result.current.personalPhases[0].id;
      act(() => result.current.updatePhase(id, { title: "New Title" }));
      expect(result.current.personalPhases[0].title).toBe("New Title");
    });

    it("deletePhase() removes the matching phase", () => {
      const { result } = renderHook(() => useCustomCanonStore());
      act(() => result.current.addPhase({ num: "1", title: "To Delete", theme: "genesis" }));
      const id = result.current.personalPhases[0].id;
      act(() => result.current.deletePhase(id));
      expect(result.current.personalPhases).toHaveLength(0);
    });

    it("deletePhase() does not delete other phases", () => {
      const { result } = renderHook(() => useCustomCanonStore());
      act(() => result.current.addPhase({ num: "1", title: "Keep", theme: "genesis" }));
      act(() => result.current.addPhase({ num: "2", title: "Delete", theme: "exodus" }));
      const idToDelete = result.current.personalPhases[1].id;
      act(() => result.current.deletePhase(idToDelete));
      expect(result.current.personalPhases).toHaveLength(1);
      expect(result.current.personalPhases[0].title).toBe("Keep");
    });

    it("reorderPhases() replaces phase array", () => {
      const { result } = renderHook(() => useCustomCanonStore());
      act(() => result.current.addPhase({ num: "1", title: "A", theme: "genesis" }));
      act(() => result.current.addPhase({ num: "2", title: "B", theme: "exodus" }));
      const reversed = [...result.current.personalPhases].reverse();
      act(() => result.current.reorderPhases(reversed));
      expect(result.current.personalPhases[0].title).toBe("B");
    });
  });

  // ── BOOK CRUD ────────────────────────────────────────────────────────────
  describe("book operations (personal profile)", () => {
    beforeEach(() => {
      useCustomCanonStore.setState({ activeProfile: "personal" });
    });

    const setupPhase = () => {
      const { result } = renderHook(() => useCustomCanonStore());
      act(() => result.current.addPhase({ num: "1", title: "AT", theme: "genesis" }));
      return result;
    };

    it("addBook() appends a book to the correct phase", () => {
      const result = setupPhase();
      const phaseId = result.current.personalPhases[0].id;
      act(() =>
        result.current.addBook(phaseId, { num: "1", name: "Gênesis", sub: "", tags: [], savedVerses: [] })
      );
      expect(result.current.personalPhases[0].books).toHaveLength(1);
    });

    it("updateBook() updates book fields", () => {
      const result = setupPhase();
      const phaseId = result.current.personalPhases[0].id;
      act(() =>
        result.current.addBook(phaseId, { num: "1", name: "Old", sub: "", tags: [], savedVerses: [] })
      );
      const bookId = result.current.personalPhases[0].books[0].id;
      act(() => result.current.updateBook(phaseId, bookId, { name: "New" }));
      expect(result.current.personalPhases[0].books[0].name).toBe("New");
    });

    it("deleteBook() removes only the target book", () => {
      const result = setupPhase();
      const phaseId = result.current.personalPhases[0].id;
      act(() =>
        result.current.addBook(phaseId, { num: "1", name: "A", sub: "", tags: [], savedVerses: [] })
      );
      act(() =>
        result.current.addBook(phaseId, { num: "2", name: "B", sub: "", tags: [], savedVerses: [] })
      );
      const bookId = result.current.personalPhases[0].books[0].id;
      act(() => result.current.deleteBook(phaseId, bookId));
      expect(result.current.personalPhases[0].books).toHaveLength(1);
      expect(result.current.personalPhases[0].books[0].name).toBe("B");
    });
  });

  // ── VERSE CRUD ───────────────────────────────────────────────────────────
  describe("verse operations (personal profile)", () => {
    let phaseId: string;
    let bookId: string;

    beforeEach(() => {
      resetStore();
      useCustomCanonStore.setState({ activeProfile: "personal" });
      const { result } = renderHook(() => useCustomCanonStore());
      act(() => result.current.addPhase({ num: "1", title: "AT", theme: "genesis" }));
      phaseId = result.current.personalPhases[0].id;
      act(() =>
        result.current.addBook(phaseId, { num: "1", name: "Gênesis", sub: "", tags: [], savedVerses: [] })
      );
      bookId = result.current.personalPhases[0].books[0].id;
    });

    it("addVerse() appends a verse with id and timestamp", () => {
      const { result } = renderHook(() => useCustomCanonStore());
      act(() =>
        result.current.addVerse(phaseId, bookId, { chapter: "1", verse: "1", text: "No princípio..." })
      );
      const verses = result.current.personalPhases[0].books[0].savedVerses ?? [];
      expect(verses).toHaveLength(1);
      expect(verses[0].id).toBeTruthy();
      expect(verses[0].timestamp).toBeGreaterThan(0);
    });

    it("deleteVerse() removes only the target verse", () => {
      const { result } = renderHook(() => useCustomCanonStore());
      act(() =>
        result.current.addVerse(phaseId, bookId, { chapter: "1", verse: "1", text: "V1" })
      );
      act(() =>
        result.current.addVerse(phaseId, bookId, { chapter: "1", verse: "2", text: "V2" })
      );
      const verseId = result.current.personalPhases[0].books[0].savedVerses![0].id;
      act(() => result.current.deleteVerse(phaseId, bookId, verseId));
      const verses = result.current.personalPhases[0].books[0].savedVerses ?? [];
      expect(verses).toHaveLength(1);
      expect(verses[0].text).toBe("V2");
    });

    it("getAllSavedVerses() returns all verses sorted by timestamp desc", () => {
      const { result } = renderHook(() => useCustomCanonStore());

      // Manually inject verses with distinct timestamps to guarantee ordering
      useCustomCanonStore.setState((s) => ({
        personalPhases: s.personalPhases.map((p) =>
          p.id !== phaseId
            ? p
            : {
                ...p,
                books: p.books.map((b) =>
                  b.id !== bookId
                    ? b
                    : {
                        ...b,
                        savedVerses: [
                          { id: "v1", chapter: "1", verse: "1", text: "First", timestamp: 1000 },
                          { id: "v2", chapter: "1", verse: "2", text: "Second", timestamp: 2000 },
                        ],
                      }
                ),
              }
        ),
      }));

      const all = result.current.getAllSavedVerses();
      expect(all).toHaveLength(2);
      // Most recent (timestamp 2000) should be first
      expect(all[0].text).toBe("Second");
    });
  });

  // ── SUGGESTION PROFILE ───────────────────────────────────────────────────
  describe("suggestion profile isolation", () => {
    it("phases added in 'personal' do not appear in 'suggestion'", () => {
      const { result } = renderHook(() => useCustomCanonStore());
      act(() => result.current.setProfile("personal"));
      act(() => result.current.addPhase({ num: "1", title: "Personal Phase", theme: "genesis" }));
      act(() => result.current.setProfile("suggestion"));
      expect(result.current.suggestionPhases.find((p) => p.title === "Personal Phase")).toBeUndefined();
    });
  });
});
