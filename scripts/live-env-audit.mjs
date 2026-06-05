import fs from "node:fs";

const siteUrl = process.argv[2] || "https://solocapoeira.netlify.app/";
const envPath = process.argv[3] || ".env.local";

function readEnv(path) {
  if (!fs.existsSync(path)) {
    throw new Error(`${path} not found`);
  }

  return Object.fromEntries(
    fs.readFileSync(path, "utf8")
      .split(/\r?\n/)
      .filter((line) => /^\s*[^#=]+=/.test(line))
      .map((line) => {
        const idx = line.indexOf("=");
        return [
          line.slice(0, idx).trim(),
          line.slice(idx + 1).trim().replace(/^['"]|['"]$/g, ""),
        ];
      })
  );
}

function containsValue(source, value, prefixLength = 12) {
  if (!value) return false;
  return source.includes(value) || source.includes(value.slice(0, prefixLength));
}

const env = readEnv(envPath);
const html = await fetch(siteUrl).then((res) => {
  if (!res.ok) throw new Error(`Failed to fetch ${siteUrl}: ${res.status}`);
  return res.text();
});

const jsPath = html.match(/src="(\/assets\/index-[^"]+\.js)"/)?.[1];
if (!jsPath) {
  throw new Error("Could not find Vite JS bundle in live HTML");
}

const jsUrl = new URL(jsPath, siteUrl).toString();
const js = await fetch(jsUrl).then((res) => {
  if (!res.ok) throw new Error(`Failed to fetch ${jsUrl}: ${res.status}`);
  return res.text();
});

const supabaseHost = env.VITE_SUPABASE_URL ? new URL(env.VITE_SUPABASE_URL).host : "";
const sentryHost = env.VITE_SENTRY_DSN ? new URL(env.VITE_SENTRY_DSN).host : "";

const checks = {
  siteUrl,
  liveBundle: jsPath,
  titleIsCapoeira: html.includes("Solo Leveling: Capoeira"),
  legacyStaticShellAbsent: !/contractor|vitality|portfolio/i.test(html),
  supabaseUrlPresent: Boolean(supabaseHost && js.includes(supabaseHost)),
  supabaseAnonPresent: containsValue(js, env.VITE_SUPABASE_ANON_KEY, 16),
  sentryDsnPresent: Boolean(sentryHost && js.includes(sentryHost)),
  posthogKeyPresent: containsValue(js, env.VITE_POSTHOG_KEY, 10),
  posthogHostPresent: containsValue(js, env.VITE_POSTHOG_HOST || "https://app.posthog.com", 20),
};

const missing = Object.entries(checks)
  .filter(([key, value]) => key.endsWith("Present") && !value)
  .map(([key]) => key);

console.log(JSON.stringify({ ...checks, missing }, null, 2));

if (missing.length > 0) {
  process.exitCode = 1;
}
