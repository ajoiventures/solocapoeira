import { chromium } from "@playwright/test";

const STORAGE_KEY = "solo_leveling_state_v1";
const DEFAULT_URL = "https://solocapoeira.netlify.app/";
const url = process.env.PWA_AUDIT_URL || DEFAULT_URL;

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

async function readSavedState(page) {
  return page.evaluate((key) => {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : null;
  }, STORAGE_KEY);
}

function getLatestHydrationOz(state) {
  const entries = Object.values(state.apf?.recoveryLog || {});
  const latest = entries[entries.length - 1] || {};
  return Math.round((latest.hydrationMl || 0) / 29.5735);
}

async function waitForHydrationOz(page, minOz) {
  await page.waitForFunction(
    ([key, min]) => {
      const raw = localStorage.getItem(key);
      if (!raw) return false;
      const state = JSON.parse(raw);
      const entries = Object.values(state.apf?.recoveryLog || {});
      const latest = entries[entries.length - 1] || {};
      return Math.round((latest.hydrationMl || 0) / 29.5735) >= min;
    },
    [STORAGE_KEY, minOz],
    { timeout: 10000 }
  );
}

async function getPwaStatus(page) {
  return page.evaluate(async () => {
    const manifestEl = document.querySelector('link[rel="manifest"]');
    const manifestHref = manifestEl?.getAttribute("href") || null;
    const manifestUrl = manifestHref ? new URL(manifestHref, location.href).href : null;
    const manifest = manifestUrl ? await fetch(manifestUrl).then((res) => res.json()) : null;
    const registration = "serviceWorker" in navigator
      ? await navigator.serviceWorker.getRegistration()
      : null;
    if (registration) await navigator.serviceWorker.ready;
    return {
      manifestUrl,
      manifestName: manifest?.name || null,
      display: manifest?.display || null,
      startUrl: manifest?.start_url || null,
      iconCount: manifest?.icons?.length || 0,
      serviceWorkerScope: registration?.scope || null,
      serviceWorkerActive: registration?.active?.state || null,
      controlled: !!navigator.serviceWorker?.controller,
      cacheNames: "caches" in window ? await caches.keys() : [],
    };
  });
}

const browser = await chromium.launch();
const context = await browser.newContext({
  serviceWorkers: "allow",
  viewport: { width: 390, height: 844 },
});

try {
  const page = await context.newPage();
  await page.goto(url, { waitUntil: "networkidle", timeout: 30000 });
  await page.evaluate((key) => {
    localStorage.clear();
    localStorage.setItem("seen_onboarding", "1");
    localStorage.removeItem(key);
  }, STORAGE_KEY);
  await page.reload({ waitUntil: "networkidle", timeout: 30000 });
  await page.waitForSelector(".app", { timeout: 10000 });

  let pwaStatus = await getPwaStatus(page);
  assert(pwaStatus.manifestUrl, "PWA manifest link is missing");
  assert(pwaStatus.display === "standalone", `Expected standalone display, got ${pwaStatus.display}`);
  assert(pwaStatus.iconCount >= 2, `Expected at least 2 manifest icons, got ${pwaStatus.iconCount}`);
  assert(pwaStatus.serviceWorkerScope, "Service worker registration is missing");

  if (!pwaStatus.controlled) {
    await page.reload({ waitUntil: "networkidle", timeout: 30000 });
    await page.waitForSelector(".app", { timeout: 10000 });
    pwaStatus = await getPwaStatus(page);
  }

  assert(pwaStatus.serviceWorkerActive === "activated", `Service worker is ${pwaStatus.serviceWorkerActive || "not active"}`);
  assert(pwaStatus.controlled, "Page is not controlled by the service worker after reload");
  assert(pwaStatus.cacheNames.length > 0, "No service worker caches were created");

  await page.getByRole("button", { name: "+8" }).click();
  await waitForHydrationOz(page, 8);
  const onlineState = await readSavedState(page);
  const onlineHydrationOz = getLatestHydrationOz(onlineState);

  await context.setOffline(true);
  await page.reload({ waitUntil: "domcontentloaded", timeout: 30000 });
  await page.waitForSelector(".app", { timeout: 10000 });
  await page.waitForSelector(".page", { timeout: 10000 });
  const offlineReloadState = await readSavedState(page);
  assert(
    getLatestHydrationOz(offlineReloadState) >= onlineHydrationOz,
    "Online daily hydration state did not survive offline reload"
  );

  await page.getByRole("button", { name: "+8" }).click();
  await waitForHydrationOz(page, onlineHydrationOz + 8);

  const offlineState = await readSavedState(page);
  const offlineHydrationOz = getLatestHydrationOz(offlineState);
  assert(offlineHydrationOz >= onlineHydrationOz + 8, "Offline daily hydration log did not persist");

  await page.reload({ waitUntil: "domcontentloaded", timeout: 30000 });
  await page.waitForSelector(".app", { timeout: 10000 });
  const secondOfflineState = await readSavedState(page);
  assert(
    getLatestHydrationOz(secondOfflineState) >= offlineHydrationOz,
    "Offline progress did not survive second offline reload"
  );

  await context.setOffline(false);
  await page.reload({ waitUntil: "networkidle", timeout: 30000 });
  await page.waitForSelector(".app", { timeout: 10000 });
  const backOnlineState = await readSavedState(page);
  assert(
    getLatestHydrationOz(backOnlineState) >= offlineHydrationOz,
    "Offline progress did not survive returning online"
  );

  console.log(JSON.stringify({
    url,
    manifest: {
      name: pwaStatus.manifestName,
      display: pwaStatus.display,
      startUrl: pwaStatus.startUrl,
      icons: pwaStatus.iconCount,
    },
    serviceWorker: {
      scope: pwaStatus.serviceWorkerScope,
      active: pwaStatus.serviceWorkerActive,
      controlled: pwaStatus.controlled,
      caches: pwaStatus.cacheNames,
    },
    state: {
      hydrationOzOnline: onlineHydrationOz,
      hydrationOzOffline: offlineHydrationOz,
      hydrationOzAfterOnlineReturn: getLatestHydrationOz(backOnlineState),
    },
    result: "pass",
  }, null, 2));
} finally {
  await context.setOffline(false).catch(() => {});
  await browser.close();
}
