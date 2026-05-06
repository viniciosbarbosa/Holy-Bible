/**
 * Integration tests for the Onboarding component
 *
 * Renders Onboarding and verifies both profile cards are present and
 * that clicking one calls setProfile with the correct argument.
 */
import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { Onboarding } from "../../features/onboarding/Onboarding";
import * as canonStore from "../../store/use-custom-canon-store";

// Mock i18next so it doesn't error in test env
vi.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key: string) => key,
    i18n: { language: "en" },
  }),
}));

// Mock framer-motion to avoid animation overhead in tests
vi.mock("framer-motion", () => ({
  motion: {
    h1: ({ children, ...p }: React.HTMLAttributes<HTMLHeadingElement>) => <h1 {...p}>{children}</h1>,
    p: ({ children, ...p }: React.HTMLAttributes<HTMLParagraphElement>) => <p {...p}>{children}</p>,
    div: ({ children, ...p }: React.HTMLAttributes<HTMLDivElement>) => <div {...p}>{children}</div>,
    button: ({ children, ...p }: React.ButtonHTMLAttributes<HTMLButtonElement>) => <button {...p}>{children}</button>,
  },
  AnimatePresence: ({ children }: { children: React.ReactNode }) => children,
}));

describe("Onboarding", () => {
  const mockSetProfile = vi.fn();

  beforeEach(() => {
    mockSetProfile.mockClear();
    vi.spyOn(canonStore, "useCustomCanonStore").mockImplementation(
      (selector?: (s: canonStore.CustomCanonStore) => unknown) => {
        const state = { setProfile: mockSetProfile } as unknown as canonStore.CustomCanonStore;
        return selector ? selector(state) : state;
      }
    );
  });

  it("renders the title translation key", () => {
    render(<Onboarding />);
    expect(screen.getByText("onboarding.title")).toBeInTheDocument();
  });

  it("renders both profile option buttons", () => {
    render(<Onboarding />);
    expect(screen.getByText("onboarding.personal_title")).toBeInTheDocument();
    expect(screen.getByText("onboarding.suggestion_title")).toBeInTheDocument();
  });

  it("calls setProfile('personal') when Personal card is clicked", () => {
    render(<Onboarding />);
    fireEvent.click(screen.getByText("onboarding.personal_title").closest("button")!);
    expect(mockSetProfile).toHaveBeenCalledWith("personal");
  });

  it("calls setProfile('suggestion') when Suggestion card is clicked", () => {
    render(<Onboarding />);
    fireEvent.click(screen.getByText("onboarding.suggestion_title").closest("button")!);
    expect(mockSetProfile).toHaveBeenCalledWith("suggestion");
  });
});
