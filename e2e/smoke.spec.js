/**
 * A-QA-05
 * E2E smoke tests for critical paths that must work before every ship.
 */

import { test, expect } from "@playwright/test";

const STORAGE_KEY = "solo_leveling_state_v1";

async function openFreshApp(page) {
  await page.addInitScript((storageKey) => {
    localStorage.clear();
    localStorage.setItem("seen_onboarding", "1");
    localStorage.removeItem(storageKey);
  }, STORAGE_KEY);
  await page.goto("/");
  await expect(page.locator(".app")).toBeVisible();
  await expect(page.locator(".page")).toBeVisible();
}

async function readSavedState(page) {
  return page.evaluate((storageKey) => {
    const raw = localStorage.getItem(storageKey);
    return raw ? JSON.parse(raw) : null;
  }, STORAGE_KEY);
}

async function readHeaderXP(page) {
  const text = await page.locator(".stat-chip.xp").first().innerText();
  return Number(text.replace(/[^\d]/g, "")) || 0;
}

function bottomNavButton(page, name) {
  return page.locator(".bottom-nav").getByRole("button", { name, exact: true });
}

function sidebarButton(page, text) {
  return page.locator(".desktop-sidebar button").filter({ hasText: text }).first();
}

test.describe("App loads", () => {
  test("renders Daily page on first visit", async ({ page }) => {
    await openFreshApp(page);
    await expect(page.locator(".bottom-nav")).toBeVisible();
    await expect(bottomNavButton(page, "Daily")).toHaveAttribute("aria-current", "page");
  });

  test("shows no console errors on load", async ({ page }) => {
    const errors = [];
    page.on("console", (msg) => {
      if (msg.type() === "error") errors.push(msg.text());
    });

    await openFreshApp(page);
    await page.waitForTimeout(1500);

    expect(errors.filter((e) => !e.includes("ResizeObserver"))).toHaveLength(0);
  });
});

test.describe("Navigation", () => {
  test("navigates to Skill Trees", async ({ page }) => {
    await openFreshApp(page);
    await bottomNavButton(page, "Movement").click();
    await expect(page.locator(".tree-tabs")).toBeVisible();
  });

  test("navigates to Stats page", async ({ page }) => {
    await openFreshApp(page);
    await sidebarButton(page, /Ax/).click();
    await expect(page.locator(".page")).toBeVisible();
    await expect(page.getByText(/HYDRATION \(oz\)/i)).toBeVisible();
  });

  test("navigates to Settings and back", async ({ page }) => {
    await openFreshApp(page);
    await page.getByRole("button", { name: "Settings" }).click();
    await expect(page.locator(".page-title").filter({ hasText: /setting/i })).toBeVisible();
    await page.getByRole("button", { name: "Close settings" }).click();
    await expect(bottomNavButton(page, "Daily")).toHaveAttribute("aria-current", "page");
  });
});

test.describe("Core loop", () => {
  test("can complete a quest, gain XP, log reps, and persist both changes", async ({ page }) => {
    await openFreshApp(page);

    const initialXP = await readHeaderXP(page);
    await page.getByRole("button", { name: /^Complete / }).first().click();

    await expect.poll(() => readHeaderXP(page)).toBeGreaterThan(initialXP);
    const afterQuestState = await readSavedState(page);
    expect(afterQuestState.todayQuest.completed.length).toBeGreaterThan(0);
    expect(afterQuestState.player.totalXP).toBeGreaterThan(initialXP);

    await bottomNavButton(page, "Movement").click();
    await page.getByRole("button", { name: /Log 5 reps for/i }).first().click();

    await expect.poll(async () => {
      const state = await readSavedState(page);
      return Object.values(state.movementProgress || {}).reduce((sum, progress) => sum + (progress.reps || 0), 0);
    }).toBeGreaterThan(0);
  });

  test("daily workout subtasks persist and roll up to the parent quest", async ({ page }) => {
    await openFreshApp(page);

    await page.getByText("Foot Protocol").click();
    await page.getByTestId("quest-drill-q_foot-0").click();

    await expect.poll(async () => {
      const state = await readSavedState(page);
      return state.todayQuest.drills?.q_foot || [];
    }).toContain("0");

    await page.getByRole("button", { name: "Daily" }).first().click();
    await page.getByText("Foot Protocol").click();
    await expect(page.getByTestId("quest-drill-q_foot-0")).toHaveAccessibleName(/Undo Foot rolling/i);

    await page.getByTestId("quest-drill-q_foot-1").click();
    await page.getByTestId("quest-drill-q_foot-2").click();

    await expect.poll(async () => {
      const state = await readSavedState(page);
      return state.todayQuest.completed || [];
    }).toContain("q_foot");

    await page.getByRole("button", { name: "Daily" }).first().click();
    await expect(page.getByRole("button", { name: "Undo Foot Protocol" })).toBeVisible();
  });

  test("boss-style requirement checks persist when leaving and returning", async ({ page }) => {
    await openFreshApp(page);

    await bottomNavButton(page, "Roda").click();
    const firstRequirement = page.locator('[data-testid^="requirement-orisha:"]').first();
    await expect(firstRequirement).toBeVisible({ timeout: 5000 });
    const testId = await firstRequirement.getAttribute("data-testid");
    await firstRequirement.click();

    await expect.poll(async () => {
      const state = await readSavedState(page);
      return Object.values(state.requirementChecks || {}).some((items) => items.length > 0);
    }).toBe(true);

    await bottomNavButton(page, "Daily").click();
    await bottomNavButton(page, "Roda").click();
    await expect(page.getByTestId(testId)).toHaveAccessibleName(/Undo requirement/i);
  });
});

test.describe("Skill tree", () => {
  test("mastery filters render and are clickable", async ({ page }) => {
    await openFreshApp(page);
    await bottomNavButton(page, "Movement").click();

    const allFilter = page.getByRole("button", { name: "Filter movements by All" });
    await expect(allFilter).toBeVisible({ timeout: 5000 });
    await allFilter.click();
    await expect(page.locator(".tree-tabs")).toBeVisible();
  });

  test("search returns results", async ({ page }) => {
    await openFreshApp(page);
    await bottomNavButton(page, "Movement").click();

    const searchInput = page.locator("input[placeholder*='Search']");
    await expect(searchInput).toBeVisible({ timeout: 5000 });
    await searchInput.fill("ginga");

    await expect(page.getByText(/ginga/i).first()).toBeVisible({ timeout: 3000 });
  });

  test("concept tree strip shows one-shot tooltip before navigating", async ({ page }) => {
    await openFreshApp(page);
    await bottomNavButton(page, "Movement").click();

    await page.getByTestId("concept-tree-strip").click();
    const conceptTooltip = page.getByRole("tooltip").filter({ hasText: "Concept Trees" });
    await expect(conceptTooltip).toBeVisible({ timeout: 3000 });
    await conceptTooltip.getByRole("button", { name: "Got it" }).click();

    await expect.poll(async () => {
      const state = await readSavedState(page);
      return state.settings?.seenTooltips || [];
    }).toContain("concept-tree-strip");

    await page.getByTestId("concept-tree-strip").click();
    await expect(page.locator(".page-title").filter({ hasText: "Concept Trees" })).toBeVisible({ timeout: 5000 });
  });
});

test.describe("Settings", () => {
  test("export data button is present", async ({ page }) => {
    await openFreshApp(page);
    await page.getByRole("button", { name: "Settings" }).click();

    await expect(page.locator("button").filter({ hasText: /export|backup/i }).first()).toBeVisible({ timeout: 5000 });
  });

  test("Cloud Sync surface does not crash when env is absent or present", async ({ page }) => {
    await openFreshApp(page);
    await page.getByRole("button", { name: "Settings" }).click();

    await expect(page.locator(".page")).toBeVisible();
  });

  test("color blind mode changes the semantic palette and persists", async ({ page }) => {
    await page.goto("/");
    await page.evaluate((storageKey) => {
      localStorage.clear();
      localStorage.setItem("seen_onboarding", "1");
      localStorage.removeItem(storageKey);
    }, STORAGE_KEY);
    await page.reload();
    await expect(page.locator(".app")).toBeVisible();
    await expect(page.locator(".page")).toBeVisible();

    await page.getByRole("button", { name: "Settings" }).click();

    const toggle = page.getByTestId("color-blind-toggle");
    await expect(toggle).toHaveAttribute("aria-pressed", "false");

    await toggle.click();

    await expect(toggle).toHaveAttribute("aria-pressed", "true");
    await expect(page.locator("html")).toHaveAttribute("data-color-blind", "true");
    await expect.poll(() => page.evaluate(() => localStorage.getItem("sl_color_blind"))).toBe("true");
    await expect.poll(async () => {
      const state = await readSavedState(page);
      return state.settings?.colorBlindMode;
    }).toBe(true);
    await expect.poll(() => page.evaluate(() => (
      getComputedStyle(document.documentElement).getPropertyValue("--green").trim()
    ))).toBe("#1170AA");

    await page.reload();
    await expect(page.locator("html")).toHaveAttribute("data-color-blind", "true");
    await page.getByRole("button", { name: "Settings" }).click();
    await expect(page.getByTestId("color-blind-toggle")).toHaveAttribute("aria-pressed", "true");
  });
});

test.describe("Responsive layout", () => {
  test("phone landscape uses compact two-column shell", async ({ page }) => {
    await page.setViewportSize({ width: 667, height: 375 });
    await openFreshApp(page);

    await expect(page.locator(".app")).toBeVisible();
    await expect(page.locator(".bottom-nav")).toBeVisible();
    await expect(page.locator(".page")).toBeVisible();

    const layout = await page.evaluate(() => {
      const app = document.querySelector(".app");
      const nav = document.querySelector(".bottom-nav");
      const main = document.querySelector(".app-main");
      const label = document.querySelector(".bottom-nav .nav-label");
      const appStyle = getComputedStyle(app);
      const navStyle = getComputedStyle(nav);
      const mainBox = main.getBoundingClientRect();
      const navBox = nav.getBoundingClientRect();
      const pageBox = document.querySelector(".page").getBoundingClientRect();

      return {
        appDisplay: appStyle.display,
        gridAreas: appStyle.gridTemplateAreas,
        navDirection: navStyle.flexDirection,
        navWidth: Math.round(navBox.width),
        mainLeft: Math.round(mainBox.left),
        mainWidth: Math.round(mainBox.width),
        pageTop: Math.round(pageBox.top),
        pageHeight: Math.round(pageBox.height),
        labelDisplay: label ? getComputedStyle(label).display : null,
      };
    });

    expect(layout.appDisplay).toBe("grid");
    expect(layout.gridAreas).toContain("nav");
    expect(layout.gridAreas).toContain("main");
    expect(layout.navDirection).toBe("column");
    expect(layout.labelDisplay).toBe("none");
    expect(layout.navWidth).toBeGreaterThanOrEqual(60);
    expect(layout.mainLeft).toBeGreaterThanOrEqual(layout.navWidth);
    expect(layout.mainWidth).toBeGreaterThan(500);
    expect(layout.pageTop).toBeGreaterThanOrEqual(40);
    expect(layout.pageHeight).toBeGreaterThan(100);
  });
});

test.describe("Resilience", () => {
  test("app recovers when localStorage is cleared mid-session", async ({ page }) => {
    await openFreshApp(page);

    await page.evaluate(() => localStorage.clear());
    await page.reload();

    await expect(page.locator(".app")).toBeVisible({ timeout: 5000 });
    await expect(page.locator(".page")).toBeVisible();
  });
});

test.describe("Phase B/C pages", () => {
  test("Leaderboards page renders via drawer nav", async ({ page }) => {
    await openFreshApp(page);

    // Open the More drawer (mobile) or click sidebar item (desktop)
    const moreBtn = page.locator(".bottom-nav .nav-btn-more").first();
    if (await moreBtn.isVisible()) {
      await moreBtn.click();
      await page.getByRole("button", { name: "Leaderboards" }).click();
    } else {
      await sidebarButton(page, "Leaderboards").click();
    }

    await expect(page.getByText(/XP Ranking|Streak Ranking/i).first()).toBeVisible({ timeout: 5000 });
  });

  test("ComboBuilder page renders and search works", async ({ page }) => {
    await openFreshApp(page);

    const moreBtn = page.locator(".bottom-nav .nav-btn-more").first();
    if (await moreBtn.isVisible()) {
      await moreBtn.click();
      await page.getByRole("button", { name: "Combos" }).click();
    } else {
      await sidebarButton(page, "Combos").click();
    }

    // The page should render the combo list view
    await expect(page.locator(".page")).toBeVisible({ timeout: 5000 });
    await expect(page.getByText(/Build New Combo|No combos yet/i).first()).toBeVisible({ timeout: 5000 });
  });

  test("Profile page renders with Titles & Prestige section", async ({ page }) => {
    await openFreshApp(page);

    const moreBtn = page.locator(".bottom-nav .nav-btn-more").first();
    if (await moreBtn.isVisible()) {
      await moreBtn.click();
      await page.getByRole("button", { name: "Profile" }).click();
    } else {
      await sidebarButton(page, "Profile").click();
    }

    await expect(page.getByText(/Titles & Prestige/i)).toBeVisible({ timeout: 5000 });
  });

  test("ComboBuilder: combo practice logs reps to store", async ({ page }) => {
    // Seed a saved combo directly into localStorage before page load
    await page.addInitScript((storageKey) => {
      localStorage.clear();
      localStorage.setItem("seen_onboarding", "1");
      const state = {
        combos: [{
          id: "test-combo-1",
          name: "Test Combo",
          steps: ["ginga", "au"],
          tag: "flow",
          createdAt: new Date().toISOString(),
        }],
      };
      localStorage.setItem(storageKey, JSON.stringify(state));
    }, STORAGE_KEY);

    await page.goto("/");
    await expect(page.locator(".app")).toBeVisible();

    // Navigate to ComboBuilder
    const moreBtn = page.locator(".bottom-nav .nav-btn-more").first();
    if (await moreBtn.isVisible()) {
      await moreBtn.click();
      await page.getByRole("button", { name: "Combos" }).click();
    } else {
      await sidebarButton(page, "Combos").click();
    }

    // Start practice
    await page.getByRole("button", { name: /Practise|Practice/i }).first().click({ timeout: 5000 });

    // Step through all movements until done
    const nextBtn = page.getByRole("button", { name: /Next|Finish Combo/i });
    while (await nextBtn.isVisible({ timeout: 2000 }).catch(() => false)) {
      await nextBtn.click();
    }

    // Hit Done
    const doneBtn = page.getByRole("button", { name: "Done" });
    await expect(doneBtn).toBeVisible({ timeout: 3000 });
    await doneBtn.click();

    // Verify reps were logged in state
    const state = await page.evaluate((key) => {
      const raw = localStorage.getItem(key);
      return raw ? JSON.parse(raw) : null;
    }, STORAGE_KEY);

    const totalReps = Object.values(state?.movementProgress || {})
      .reduce((sum, p) => sum + (p?.reps || 0), 0);
    expect(totalReps).toBeGreaterThan(0);
  });
});
