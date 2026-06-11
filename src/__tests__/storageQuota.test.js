import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { loadStoreState, saveStoreState } from "../store/storePersistence.js";

// Provide a localStorage shim for the node test environment
function makeLocalStorageMock() {
  let store = {};
  return {
    getItem: (key) => store[key] ?? null,
    setItem: (key, value) => { store[key] = String(value); },
    removeItem: (key) => { delete store[key]; },
    clear: () => { store = {}; },
  };
}

describe("Storage Quota Protection", () => {
  const STORAGE_KEY = "solo_leveling_state_v1";

  beforeEach(() => {
    vi.stubGlobal("localStorage", makeLocalStorageMock());
    vi.restoreAllMocks();
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
  });

  it("saveStoreState persists normal state through the extracted store layer", () => {
    const state = {
      player: { totalXP: 100, level: 2 },
      movementProgress: { ginga: { masteryLevel: 2, reps: 60 } },
      repLog: [{ movementId: "ginga", count: 10, date: "2026-06-10" }],
    };

    const spy = vi.spyOn(localStorage, "setItem");
    saveStoreState(state);

    expect(spy).toHaveBeenCalledWith(STORAGE_KEY, expect.any(String));
    expect(JSON.parse(localStorage.getItem(STORAGE_KEY))).toEqual(state);
  });

  it("loadStoreState merges old saves with current defaults", () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({
      player: { totalXP: 300, level: 4 },
      orishasIntegrated: ["obatala"],
      movementProgress: {},
    }));

    const loaded = loadStoreState();

    expect(loaded.player.totalXP).toBe(300);
    expect(loaded.todayQuest.completed).toEqual([]);
    expect(loaded.todayQuest.drills).toEqual({});
    expect(loaded.requirementChecks).toEqual({});
    expect(loaded.settings.colorBlindMode).toBe(false);
    expect(loaded.settings.seenTooltips).toEqual([]);
    expect(loaded.integratedOrishas).toEqual(["obatala"]);
    expect(loaded.orishaProgress.obatala.integrated).toBe(true);
    expect(loaded.cloudSyncStatus).toBe("idle");
  });

  it("warns and trims repLog when approaching 4.5MB limit", () => {
    const warnSpy = vi.spyOn(console, "warn").mockImplementation(() => {});
    const setItemSpy = vi.spyOn(localStorage, "setItem");

    // Build a state large enough to exceed 4500KB (each entry ~72 bytes × 2 UTF16 ÷ 1024 ≈ 0.14KB; need >32000 entries)
    const largeLog = Array(45000).fill(null).map((_, i) => ({
      movementId: "ginga",
      count: 5,
      date: `2025-${String((i % 12) + 1).padStart(2, "0")}-${String((i % 28) + 1).padStart(2, "0")}`,
    }));
    const state = { player: { totalXP: 100000 }, repLog: largeLog, sessionLog: [], movementProgress: {} };

    saveStoreState(state);

    expect(warnSpy).toHaveBeenCalledWith(expect.stringContaining("[store] Storage at"));
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
    expect(saved.repLog.length).toBeLessThanOrEqual(500);
    expect(saved.player.totalXP).toBe(100000);
    expect(setItemSpy).toHaveBeenCalled();
  });

  it("writes minimal state after an initial QuotaExceededError", () => {
    const quota = new Error("QuotaExceededError");
    quota.name = "QuotaExceededError";
    const originalSetItem = localStorage.setItem.bind(localStorage);
    const setItemSpy = vi.spyOn(localStorage, "setItem")
      .mockImplementationOnce(() => { throw quota; })
      .mockImplementation(originalSetItem);

    const state = {
      player: { totalXP: 5000, level: 10 },
      repLog: Array(1000).fill({ movementId: "ginga", count: 5, date: "2026-01-01" }),
      sessionLog: Array(200).fill({ date: "2026-01-01", xpEarned: 100 }),
      movementProgress: { ginga: { masteryLevel: 4, reps: 250 } },
    };

    expect(() => saveStoreState(state)).not.toThrow();
    expect(setItemSpy).toHaveBeenCalledTimes(2);

    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
    expect(saved.player).toEqual(state.player);
    expect(saved.movementProgress).toEqual(state.movementProgress);
    expect(saved.repLog).toHaveLength(200);
    expect(saved.sessionLog).toHaveLength(50);
  });

  it("logs an error when the minimal quota retry also fails", () => {
    const errorSpy = vi.spyOn(console, "error").mockImplementation(() => {});
    const quota = new Error("QuotaExceededError");
    quota.name = "QuotaExceededError";
    vi.spyOn(localStorage, "setItem").mockImplementation(() => { throw quota; });

    const state = {
      player: { totalXP: 5000, level: 10 },
      repLog: Array(1000).fill({ movementId: "ginga", count: 5, date: "2026-01-01" }),
      sessionLog: Array(200).fill({ date: "2026-01-01", xpEarned: 100 }),
      movementProgress: {},
    };

    expect(() => saveStoreState(state)).not.toThrow();
    expect(errorSpy).toHaveBeenCalledWith(expect.stringContaining("[store] localStorage full"));
  });

  it("estimates storage size accurately", () => {
    const small = JSON.stringify({ test: "data" });
    const kbSmall = (small.length * 2) / 1024;

    const large = JSON.stringify(
      Array(10000).fill({ movementId: "ginga", count: 5 })
    );
    const kbLarge = (large.length * 2) / 1024;

    expect(kbSmall).toBeLessThan(1);
    expect(kbLarge).toBeGreaterThan(100);
  });
});
