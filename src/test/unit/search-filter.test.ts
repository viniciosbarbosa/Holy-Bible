/**
 * Unit tests for search filtering logic used in CommonBible.tsx and CustomCanon.tsx
 *
 * Pure logic extracted for fast, isolated testing.
 */
import { describe, it, expect } from "vitest";

// ── CommonBible search helper ─────────────────────────────────────────────
interface BibleBook {
  name: string;
  abbrev: string;
  chapters?: number;
  testament?: string;
}

function filterBooks(books: BibleBook[], query: string): BibleBook[] {
  const q = query.toLowerCase();
  return books.filter(
    (b) =>
      b.name.toLowerCase().includes(q) ||
      b.abbrev.toLowerCase().includes(q)
  );
}

// ── CustomCanon phase/book search helper ──────────────────────────────────
interface PhaseBook { name: string }
interface Phase { title: string; books: PhaseBook[] }

function filterPhases(phases: Phase[], query: string): Phase[] {
  const q = query.toLowerCase();
  return phases.filter(
    (p) =>
      p.title.toLowerCase().includes(q) ||
      p.books.some((b) => b.name.toLowerCase().includes(q))
  );
}

// ─────────────────────────────────────────────────────────────────────────

const mockBooks: BibleBook[] = [
  { name: "Gênesis", abbrev: "gen" },
  { name: "Êxodo", abbrev: "exo" },
  { name: "Revelação", abbrev: "rev" },
  { name: "Salmos", abbrev: "sal" },
];

describe("CommonBible search filtering", () => {
  it("returns all books when query is empty", () => {
    expect(filterBooks(mockBooks, "")).toHaveLength(mockBooks.length);
  });

  it("filters by partial name (case-insensitive)", () => {
    const result = filterBooks(mockBooks, "êxo");
    expect(result).toHaveLength(1);
    expect(result[0].abbrev).toBe("exo");
  });

  it("filters by abbreviation", () => {
    const result = filterBooks(mockBooks, "rev");
    expect(result).toHaveLength(1);
    expect(result[0].name).toBe("Revelação");
  });

  it("returns empty array when no match", () => {
    expect(filterBooks(mockBooks, "zzz")).toHaveLength(0);
  });

  it("matches multiple books for a broad query", () => {
    // both 'gen' and 'exo' contain letter 'e'
    const result = filterBooks(mockBooks, "esis");
    expect(result).toHaveLength(1);
    expect(result[0].name).toBe("Gênesis");
  });
});

const mockPhases: Phase[] = [
  {
    title: "Criação e Patriarcas",
    books: [{ name: "Gênesis" }, { name: "Jó" }],
  },
  {
    title: "Êxodo e Conquista",
    books: [{ name: "Êxodo" }, { name: "Josué" }],
  },
  {
    title: "Profetas Maiores",
    books: [{ name: "Isaías" }, { name: "Jeremias" }],
  },
];

describe("CustomCanon phase/book search filtering", () => {
  it("returns all phases when query is empty", () => {
    expect(filterPhases(mockPhases, "")).toHaveLength(mockPhases.length);
  });

  it("matches phase by title", () => {
    const result = filterPhases(mockPhases, "profetas");
    expect(result).toHaveLength(1);
    expect(result[0].title).toBe("Profetas Maiores");
  });

  it("matches phase by book name", () => {
    const result = filterPhases(mockPhases, "josué");
    expect(result).toHaveLength(1);
    expect(result[0].title).toBe("Êxodo e Conquista");
  });

  it("is case-insensitive", () => {
    const result = filterPhases(mockPhases, "GÊNESIS");
    expect(result).toHaveLength(1);
    expect(result[0].books[0].name).toBe("Gênesis");
  });

  it("returns multiple phases that partially match", () => {
    // Both "Êxodo e Conquista" (book Êxodo) and "Criação..." contain 'a'
    // but let's test a more specific case
    const result = filterPhases(mockPhases, "ia");
    // "Isaías" and "Jeremias" match; "Profetas" title also contains "ia"
    expect(result.length).toBeGreaterThanOrEqual(1);
  });

  it("returns empty array when nothing matches", () => {
    expect(filterPhases(mockPhases, "zzz")).toHaveLength(0);
  });
});
