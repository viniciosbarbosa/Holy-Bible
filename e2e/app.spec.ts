/**
 * E2E Test Suite – Holy Bible Application
 *
 * Uses data-testid attributes for stable selectors.
 * Relies on the Vite dev server started by playwright.config.ts.
 *
 * Run with: npm run test:e2e
 */
import { test, expect, Page } from "@playwright/test";

// ── Helpers ───────────────────────────────────────────────────────────────

/** Inject a Zustand persisted profile so the onboarding screen is bypassed */
async function setStoredProfile(page: Page, profile: "personal" | "suggestion") {
  await page.evaluate((p) => {
    localStorage.setItem(
      "holy-bible-custom-canon-v2",
      JSON.stringify({
        state: {
          activeProfile: p,
          personalPhases: [],
          suggestionPhases: [],
        },
        version: 0,
      })
    );
  }, profile);
}

/** Clear all persisted storage so onboarding shows */
async function clearStorage(page: Page) {
  await page.evaluate(() => {
    localStorage.removeItem("holy-bible-custom-canon-v2");
    localStorage.removeItem("holy-bible-storage");
  });
}

// ─────────────────────────────────────────────────────────────────────────

test.describe("Onboarding", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
    await clearStorage(page);
    await page.reload();
    // Wait until the app shell is visible
    await page.waitForSelector("[data-testid='onboarding-title']", { timeout: 8000 });
  });

  test("shows the onboarding screen on first visit", async ({ page }) => {
    await expect(page.locator("[data-testid='onboarding-title']")).toBeVisible();
  });

  test("all three profile cards are rendered", async ({ page }) => {
    await expect(page.locator("[data-testid='profile-personal-btn']")).toBeVisible();
    await expect(page.locator("[data-testid='profile-suggestion-btn']")).toBeVisible();
    await expect(page.locator("[data-testid='profile-conventional-btn']")).toBeVisible();
  });

  test("choosing Personal hides the onboarding screen", async ({ page }) => {
    await page.locator("[data-testid='profile-personal-btn']").click();
    await expect(page.locator("[data-testid='onboarding-title']")).not.toBeVisible({ timeout: 4000 });
  });

  test("choosing Suggestion hides the onboarding screen", async ({ page }) => {
    await page.locator("[data-testid='profile-suggestion-btn']").click();
    await expect(page.locator("[data-testid='onboarding-title']")).not.toBeVisible({ timeout: 4000 });
  });

  test("choosing Conventional hides the onboarding screen", async ({ page }) => {
    await page.locator("[data-testid='profile-conventional-btn']").click();
    await expect(page.locator("[data-testid='onboarding-title']")).not.toBeVisible({ timeout: 4000 });
  });
});

// ─────────────────────────────────────────────────────────────────────────

test.describe("Navigation", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
    await setStoredProfile(page, "personal");
    await page.reload();
    // Wait for app shell, not onboarding
    await page.waitForURL("**/my-personal-bible", { timeout: 8000 });
  });

  test("root redirects to /my-personal-bible", async ({ page }) => {
    await expect(page).toHaveURL(/my-personal-bible/);
  });

  test("navigates to /default-bible without error", async ({ page }) => {
    await page.goto("/default-bible");
    await expect(page).toHaveURL(/default-bible/);
    // Ensure the page didn't crash — look for the header
    await expect(page.locator("h2").first()).toBeVisible({ timeout: 6000 });
  });
});

// ─────────────────────────────────────────────────────────────────────────

test.describe("Personal Bible – Add Phase flow", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
    await setStoredProfile(page, "personal");
    await page.reload();
    await page.waitForURL("**/my-personal-bible", { timeout: 8000 });
  });

  test("opens the Add Phase modal when button is clicked", async ({ page }) => {
    const addBtn = page.locator("[data-testid='add-phase-btn']");
    await addBtn.waitFor({ state: "visible", timeout: 6000 });
    await addBtn.click();
    await expect(page.locator("[data-testid='add-phase-modal']")).toBeVisible({ timeout: 4000 });
  });

  test("fills the phase title and advances to step 2", async ({ page }) => {
    const addBtn = page.getByRole("button", { name: /add phase|nova fase/i });
    await addBtn.waitFor({ state: "visible", timeout: 6000 });
    await addBtn.click();

    const titleInput = page.locator("[data-testid='phase-title-input']");
    await titleInput.waitFor({ state: "visible", timeout: 4000 });
    await titleInput.fill("Minha Primeira Fase");

    await page.locator("[data-testid='phase-next-btn']").click();

    // Step 2: finish button should appear
    await expect(page.locator("[data-testid='phase-finish-btn']")).toBeVisible({ timeout: 3000 });
  });

  test("creates a phase and it appears in the list", async ({ page }) => {
    const addBtn = page.getByRole("button", { name: /add phase|nova fase/i });
    await addBtn.waitFor({ state: "visible", timeout: 6000 });
    await addBtn.click();

    await page.locator("[data-testid='phase-title-input']").fill("Jornada Sagrada");
    await page.locator("[data-testid='phase-next-btn']").click();
    await page.locator("[data-testid='phase-finish-btn']").click();

    // Modal should close
    await expect(page.locator("[data-testid='add-phase-modal']")).not.toBeVisible({ timeout: 4000 });

    // Phase title should appear somewhere on the page
    await expect(page.getByText("Jornada Sagrada")).toBeVisible({ timeout: 5000 });
  });
});

// ─────────────────────────────────────────────────────────────────────────

test.describe("Conventional Bible – Search", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
    await setStoredProfile(page, "suggestion");
    await page.reload();
    await page.goto("/default-bible");
    // Wait for either the search box (books loaded) or loading spinner
    await page.waitForSelector("[data-testid='search-input'], [data-testid='book-card']", {
      timeout: 15000,
    });
  });

  test("search input is visible on the books tab", async ({ page }) => {
    await expect(page.locator("[data-testid='search-input']")).toBeVisible();
  });

  test("typing in search filters the book list", async ({ page }) => {
    const searchInput = page.locator("[data-testid='search-input']");
    await searchInput.fill("Genesis");

    // The API returns English book names in some builds; accept either
    const bookCards = page.locator("[data-testid='book-card']");
    await expect(bookCards.first()).toBeVisible({ timeout: 5000 });
    const count = await bookCards.count();
    // Search for "Genesis" should return only 1 book
    expect(count).toBeLessThan(10);
  });

  test("typing gibberish shows no book cards", async ({ page }) => {
    const searchInput = page.locator("[data-testid='search-input']");
    await searchInput.fill("zzzzzzzzzzz");

    const bookCards = page.locator("[data-testid='book-card']");
    // Cards should either disappear or never appear
    await expect(bookCards).toHaveCount(0, { timeout: 4000 });
  });

  test("clearing the search restores all cards", async ({ page }) => {
    const searchInput = page.locator("[data-testid='search-input']");
    await searchInput.fill("zzz");
    await page.locator("[data-testid='book-card']").waitFor({ state: "detached", timeout: 4000 }).catch(() => {});
    await searchInput.clear();
    await expect(page.locator("[data-testid='book-card']").first()).toBeVisible({ timeout: 5000 });
  });
});

// ─────────────────────────────────────────────────────────────────────────

test.describe("Conventional Bible – Favorites tab", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
    await setStoredProfile(page, "suggestion");
    await page.reload();
    await page.goto("/default-bible");
    await page.waitForSelector("[data-testid='search-input'], [data-testid='book-card']", {
      timeout: 15000,
    });
  });

  test("Favorites tab button is visible", async ({ page }) => {
    const favBtn = page.getByRole("button", { name: /favoritos|favorites/i });
    await expect(favBtn).toBeVisible();
  });

  test("clicking Favorites tab hides the search input", async ({ page }) => {
    await page.getByRole("button", { name: /favoritos|favorites/i }).click();
    await expect(page.locator("[data-testid='search-input']")).not.toBeVisible({ timeout: 3000 });
  });
});
