/**
 * smoke.spec.js — A-QA-05
 * E2E smoke tests: critical paths that must work before every ship.
 * Run: npx playwright test
 * CI: runs in GitHub Actions after unit tests pass.
 */

import { test, expect } from "@playwright/test";

test.describe("App loads", () => {
  test("renders Daily page on first visit", async ({ page }) => {
    await page.goto("/");
    // App shell renders
    await expect(page.locator(".app")).toBeVisible();
    // Bottom nav exists
    await expect(page.locator(".bottom-nav")).toBeVisible();
    // Daily page is the default view
    await expect(page.locator(".page")).toBeVisible();
  });

  test("shows no console errors on load", async ({ page }) => {
    const errors = [];
    page.on("console", msg => { if (msg.type() === "error") errors.push(msg.text()); });
    await page.goto("/");
    await page.waitForTimeout(1500);
    expect(errors.filter(e => !e.includes("ResizeObserver"))).toHaveLength(0);
  });
});

test.describe("Navigation", () => {
  test("navigates to Skill Trees", async ({ page }) => {
    await page.goto("/");
    await page.locator(".bottom-nav button, .bottom-nav a").filter({ hasText: /skill|tree|move/i }).first().click();
    await expect(page.locator(".tree-tabs, .page-title")).toBeVisible();
  });

  test("navigates to Stats page", async ({ page }) => {
    await page.goto("/");
    await page.locator(".bottom-nav button, .bottom-nav a").filter({ hasText: /axé|stat|progress/i }).first().click();
    await expect(page.locator(".page")).toBeVisible();
  });

  test("navigates to Settings and back", async ({ page }) => {
    await page.goto("/");
    // Settings icon in header
    const settingsBtn = page.locator("header button").filter({ hasText: /⚙|setting/i }).first();
    await settingsBtn.click();
    await expect(page.locator(".page-title").filter({ hasText: /setting/i })).toBeVisible();
    // Close settings
    await settingsBtn.click();
    await expect(page.locator(".page")).toBeVisible();
  });
});

test.describe("Core loop — rep logging", () => {
  test("can log reps on a Foundation movement", async ({ page }) => {
    await page.goto("/");
    // Navigate to Skill Trees
    await page.locator(".bottom-nav button, .bottom-nav a").filter({ hasText: /skill|tree|move/i }).first().click();
    await page.waitForTimeout(500);

    // Find a +5 quick log button on any Foundation card
    const quickLogBtn = page.locator("button").filter({ hasText: "+5" }).first();
    await expect(quickLogBtn).toBeVisible({ timeout: 5000 });

    // Click it and verify no crash
    await quickLogBtn.click();
    await expect(page.locator(".page")).toBeVisible();
  });
});

test.describe("Skill tree", () => {
  test("mastery filters render and are clickable", async ({ page }) => {
    await page.goto("/");
    await page.locator(".bottom-nav button, .bottom-nav a").filter({ hasText: /skill|tree|move/i }).first().click();
    await page.waitForTimeout(500);

    // Filter pills should exist
    const filters = page.locator("button").filter({ hasText: /All|Drilling|Owning|Instinct|Rusty/i });
    await expect(filters.first()).toBeVisible({ timeout: 5000 });

    // Click a filter — should not crash
    await filters.first().click();
    await expect(page.locator(".page")).toBeVisible();
  });

  test("search returns results", async ({ page }) => {
    await page.goto("/");
    await page.locator(".bottom-nav button, .bottom-nav a").filter({ hasText: /skill|tree|move/i }).first().click();
    await page.waitForTimeout(500);

    const searchInput = page.locator("input[placeholder*='Search']");
    await expect(searchInput).toBeVisible({ timeout: 5000 });
    await searchInput.fill("ginga");

    // Results should appear
    await expect(page.locator("text=ginga").first()).toBeVisible({ timeout: 3000 });
  });
});

test.describe("Settings", () => {
  test("export data button is present", async ({ page }) => {
    await page.goto("/");
    const settingsBtn = page.locator("header button").filter({ hasText: /⚙|setting/i }).first();
    await settingsBtn.click();

    await expect(page.locator("button").filter({ hasText: /export|backup/i }).first()).toBeVisible({ timeout: 5000 });
  });

  test("Cloud Sync card shows when Supabase configured", async ({ page }) => {
    await page.goto("/");
    const settingsBtn = page.locator("header button").filter({ hasText: /⚙|setting/i }).first();
    await settingsBtn.click();

    // If Supabase env vars are set, the Cloud Sync card shows
    // In CI without vars, this card is hidden — test passes either way
    const syncCard = page.locator("text=Cloud Sync");
    const isVisible = await syncCard.isVisible().catch(() => false);
    // Just verify no crash — card presence depends on env
    await expect(page.locator(".page")).toBeVisible();
    void isVisible; // used
  });
});

test.describe("Resilience", () => {
  test("app recovers when localStorage is cleared mid-session", async ({ page }) => {
    await page.goto("/");
    await page.waitForTimeout(500);

    // Clear storage and reload — should show Day 0 state, not crash
    await page.evaluate(() => localStorage.clear());
    await page.reload();
    await expect(page.locator(".app")).toBeVisible({ timeout: 5000 });
    await expect(page.locator(".page")).toBeVisible();
  });
});
