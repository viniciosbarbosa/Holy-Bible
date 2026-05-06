/**
 * Unit tests for useModalStore
 *
 * TDD approach: we define behaviour expectations first, then confirm implementation matches.
 */
import { describe, it, expect, beforeEach } from "vitest";
import { act, renderHook } from "@testing-library/react";
import { useModalStore } from "../../store/use-modal-store";

/** Reset store between tests */
const resetStore = () =>
  useModalStore.setState({
    isEditBookOpen: false,
    isAddPhaseOpen: false,
    isAddBookOpen: false,
    activeBookId: null,
    activePhaseId: null,
  });

describe("useModalStore", () => {
  beforeEach(() => {
    resetStore();
  });

  it("initial state – all modals closed", () => {
    const { result } = renderHook(() => useModalStore());
    expect(result.current.isEditBookOpen).toBe(false);
    expect(result.current.isAddPhaseOpen).toBe(false);
    expect(result.current.isAddBookOpen).toBe(false);
    expect(result.current.activeBookId).toBeNull();
    expect(result.current.activePhaseId).toBeNull();
  });

  it("isAnyModalOpen() returns false when all modals are closed", () => {
    const { result } = renderHook(() => useModalStore());
    expect(result.current.isAnyModalOpen()).toBe(false);
  });

  it("openAddPhase() opens the add-phase modal", () => {
    const { result } = renderHook(() => useModalStore());
    act(() => result.current.openAddPhase());
    expect(result.current.isAddPhaseOpen).toBe(true);
    expect(result.current.isAnyModalOpen()).toBe(true);
  });

  it("openAddBook() sets the phaseId correctly", () => {
    const { result } = renderHook(() => useModalStore());
    act(() => result.current.openAddBook("phase-123"));
    expect(result.current.isAddBookOpen).toBe(true);
    expect(result.current.activePhaseId).toBe("phase-123");
  });

  it("openEditBook() sets bookId and phaseId correctly", () => {
    const { result } = renderHook(() => useModalStore());
    act(() => result.current.openEditBook("book-abc", "phase-xyz"));
    expect(result.current.isEditBookOpen).toBe(true);
    expect(result.current.activeBookId).toBe("book-abc");
    expect(result.current.activePhaseId).toBe("phase-xyz");
  });

  it("closeAllModals() closes every modal and clears ids", () => {
    const { result } = renderHook(() => useModalStore());
    act(() => result.current.openEditBook("book-abc", "phase-xyz"));
    act(() => result.current.closeAllModals());
    expect(result.current.isEditBookOpen).toBe(false);
    expect(result.current.isAddPhaseOpen).toBe(false);
    expect(result.current.isAddBookOpen).toBe(false);
    expect(result.current.activeBookId).toBeNull();
    expect(result.current.activePhaseId).toBeNull();
    expect(result.current.isAnyModalOpen()).toBe(false);
  });

  it("isAnyModalOpen() returns true when any modal is open", () => {
    const { result } = renderHook(() => useModalStore());
    act(() => result.current.openAddBook("p-1"));
    expect(result.current.isAnyModalOpen()).toBe(true);
  });
});
