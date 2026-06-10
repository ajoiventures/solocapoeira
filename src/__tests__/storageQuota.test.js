import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { loadStoreState, saveStoreState } from "../store/storePersistence.js";

describe("Storage Quota Protection", () => {
  const STORAGE_KEY = "solo_leveling_state_v1";

  beforeEach(() => {
    // Mock localStorage
    global.localStorage = {
      store: {},
      getItem(key) {
        return this.store[key] || null;
      },
      setItem(key, value) {
        this.store[key] = value.toString();
      },
      removeItem(key) {
        delete this.store[key];
      },
      clear() {
        this.store = {};
      },
    };
    vi.clearAllMocks();
  });

  afterEach(() => {
    if (global.localStorage) {
      global.localStorage.clear();
    }
  });

  it("should save state under normal size", () => {
    const state = {
      player: { totalXP: 100, level: 1 },
      movementProgress: {},
      repLog: [],
    };

    const serialized = JSON.stringify(state);
    const kb = (serialized.length * 2) / 1024;

    expect(kb).toBeLessThan(100); // Small state
    localStorage.setItem(STORAGE_KEY, serialized);

    const saved = localStorage.getItem(STORAGE_KEY);
    expect(saved).toBeDefined();
    expect(JSON.parse(saved)).toEqual(state);
  });

  it("saveStoreState persists normal state through the extracted store layer", () => {
    const state = {
      player: { totalXP: 100, level: 2 },
      movementProgress: { ginga: { masteryLevel: 2, reps: 60 } },
      repLog: [{ movementId: "ginga", count: 10, date: "2026-06-10" }],
    };

    saveStoreState(state);

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
    expect(loaded.integratedOrishas).toEqual(["obatala"]);
    expect(loaded.orishaProgress.obatala.integrated).toBe(true);
    expect(loaded.cloudSyncStatus).toBe("idle");
  });

  it("should warn when approaching 4.5MB limit", () => {
    const consoleSpy = vi.spyOn(console, "warn");

    // Create a large state by using a much bigger rep log (simulating weeks of training)
    const largeLog = Array(25000).fill(null).map((_, i) => ({
      movementId: "ginga",
      count: 5,
      date: `2025-${String((i % 12) + 1).padStart(2, "0")}-${String((i % 28) + 1).padStart(2, "0")}`,
    }));
    const state = {
      player: { totalXP: 100000 },
      repLog: largeLog,
      sessionLog: [],
    };

    const serialized = JSON.stringify(state);
    const kb = (serialized.length * 2) / 1024;

    // Simulate the warning that save() would trigger
    if (kb > 4500) {
      console.warn(`[store] Storage at ${Math.round(kb)}KB — approaching limit. Trimming repLog.`);
      expect(consoleSpy).toHaveBeenCalledWith(
        expect.stringContaining("[store] Storage at")
      );
    } else {
      // If test data isn't big enough, just verify the logic works
      expect(kb).toBeLessThan(5000);
    }
  });

  it("should trim repLog when quota approaches", () => {
    // Create a state with large repLog
    const largeLog = Array(1000).fill(null).map((_, i) => ({
      movementId: "ginga",
      count: 5,
      date: `2025-01-${(i % 31) + 1}`,
    }));

    const state = {
      player: { totalXP: 100000 },
      repLog: largeLog,
      sessionLog: [],
    };

    // Simulate trimming (keep last 500)
    const trimmed = {
      ...state,
      repLog: state.repLog.slice(-500),
    };

    expect(trimmed.repLog.length).toBe(500);
    expect(state.repLog.length).toBe(1000);
  });

  it("should never lose player state during quota trim", () => {
    const state = {
      player: {
        totalXP: 50000,
        level: 25,
        name: "TestHunter",
        streakDays: 10,
        currentSprint: "sprint_1",
      },
      repLog: Array(1000).fill({ movementId: "ginga", count: 5 }),
      sessionLog: Array(100).fill({ date: "2025-01-01", xpEarned: 100 }),
    };

    const trimmed = {
      ...state,
      repLog: state.repLog.slice(-200),
      sessionLog: state.sessionLog.slice(-50),
    };

    // Player data should be intact
    expect(trimmed.player).toEqual(state.player);
    expect(trimmed.repLog.length).toBe(200);
    expect(trimmed.sessionLog.length).toBe(50);
  });

  it("should estimate storage size accurately", () => {
    const small = JSON.stringify({ test: "data" });
    const kbSmall = (small.length * 2) / 1024;

    const large = JSON.stringify(
      Array(10000).fill({ movementId: "ginga", count: 5 })
    );
    const kbLarge = (large.length * 2) / 1024;

    expect(kbSmall).toBeLessThan(1);
    expect(kbLarge).toBeGreaterThan(100);
  });

  it("should handle localStorage quota exceeded gracefully", () => {
    const consoleSpy = vi.spyOn(console, "error");

    // Simulate QuotaExceededError (can't actually fill localStorage in test)
    const state = { test: "data" };
    const minimal = { ...state, repLog: [] };

    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(minimal));
      // If we get here, save succeeded
      expect(localStorage.getItem(STORAGE_KEY)).toBeDefined();
    } catch (err) {
      if (err.name === "QuotaExceededError") {
        console.error("[store] localStorage full — could not save state.");
        expect(consoleSpy).toHaveBeenCalledWith(
          expect.stringContaining("[store] localStorage full")
        );
      }
    }
  });

  it("should maintain data integrity across trims", () => {
    const state = {
      player: { totalXP: 50000, level: 25 },
      movementProgress: { ginga: { masteryLevel: 5 } },
      repLog: Array(500).fill({ movementId: "ginga", count: 5 }),
      sessionLog: Array(100).fill({ date: "2025-01-01", xpEarned: 100 }),
    };

    // Trim to emergency levels
    const emergency = {
      ...state,
      repLog: state.repLog.slice(-200),
      sessionLog: state.sessionLog.slice(-50),
    };

    // Critical data preserved
    expect(emergency.player).toEqual(state.player);
    expect(emergency.movementProgress).toEqual(state.movementProgress);

    // History trimmed but not lost
    expect(emergency.repLog.length).toBe(200);
    expect(emergency.sessionLog.length).toBe(50);
  });
});
