import { defineConfig, devices } from "@playwright/test";

/**
 * Playwright configuration.
 *
 * Local runs:   Chromium only (fast feedback loop)
 * CI runs:      All three browsers via PLAYWRIGHT_CI=true env var
 */
const isCI = !!process.env.CI;

export default defineConfig({
  testDir: "./e2e",
  fullyParallel: !isCI,
  forbidOnly: isCI,
  retries: isCI ? 2 : 0,
  workers: isCI ? 2 : 4,
  timeout: 30_000,
  expect: { timeout: 8_000 },

  reporter: [
    ["list"],
    ["html", { outputFolder: "playwright-report", open: "never" }],
  ],

  use: {
    baseURL: "http://localhost:5173",
    trace: "on-first-retry",
    screenshot: "only-on-failure",
    video: "retain-on-failure",
    actionTimeout: 10_000,
    navigationTimeout: 15_000,
  },

  projects: [
    // Always run Chromium
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
    // Firefox and Mobile only in CI
    ...(isCI
      ? [
          {
            name: "firefox",
            use: { ...devices["Desktop Firefox"] },
          },
          {
            name: "mobile-safari",
            use: { ...devices["iPhone 13"] },
          },
        ]
      : []),
  ],

  // Automatically start/stop the Vite dev server
  webServer: {
    command: "npm run dev",
    url: "http://localhost:5173",
    reuseExistingServer: true,
    timeout: 60_000,
    stderr: "pipe",
  },
});
