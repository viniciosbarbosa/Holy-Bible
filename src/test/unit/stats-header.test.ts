/**
 * Unit tests for StatsHeader logic
 *
 * Tests the calculation of progress statistics (percentage, counts) used by StatsHeader.
 */
import { describe, it, expect } from "vitest";

// ── Pure helper (mirrors StatsHeader useMemo logic) ───────────────────────
interface Book { id: string }
interface Phase { books: Book[] }

function computeStats(phases: Phase[], readStatus: Record<string, boolean>) {
  const allBooks = phases.flatMap((p) => p.books);
  const total = allBooks.length;
  const bookIds = new Set(allBooks.map((b) => b.id));
  const readCount = Object.entries(readStatus).filter(
    ([id, isRead]) => isRead && bookIds.has(id)
  ).length;
  const percentage = total > 0 ? Math.round((readCount / total) * 100) : 0;
  return { total, readCount, percentage };
}

// ─────────────────────────────────────────────────────────────────────────

describe("StatsHeader – computeStats", () => {
  const phases: Phase[] = [
    { books: [{ id: "gen" }, { id: "exo" }, { id: "lev" }] },
    { books: [{ id: "num" }, { id: "deu" }] },
  ];

  it("returns 0% with empty readStatus", () => {
    const stats = computeStats(phases, {});
    expect(stats.percentage).toBe(0);
    expect(stats.readCount).toBe(0);
    expect(stats.total).toBe(5);
  });

  it("returns correct percentage when some books are read", () => {
    const stats = computeStats(phases, { gen: true, exo: true });
    expect(stats.readCount).toBe(2);
    expect(stats.percentage).toBe(40); // 2/5
  });

  it("returns 100% when all books are read", () => {
    const readStatus = { gen: true, exo: true, lev: true, num: true, deu: true };
    const stats = computeStats(phases, readStatus);
    expect(stats.percentage).toBe(100);
  });

  it("ignores readStatus entries not in current phases", () => {
    // "rev" is not part of phases — should not count
    const stats = computeStats(phases, { rev: true, gen: true });
    expect(stats.readCount).toBe(1);
  });

  it("handles empty phases gracefully (0/0)", () => {
    const stats = computeStats([], {});
    expect(stats.total).toBe(0);
    expect(stats.percentage).toBe(0);
  });

  it("rounds percentages", () => {
    // 1 out of 3 = 33.33% → 33
    const singlePhase: Phase[] = [{ books: [{ id: "a" }, { id: "b" }, { id: "c" }] }];
    const stats = computeStats(singlePhase, { a: true });
    expect(stats.percentage).toBe(33);
  });
});
