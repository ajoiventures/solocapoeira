/**
 * dedup-movements.mjs
 * Removes duplicate movement objects from movements.js.
 * Keeps the FIRST occurrence of each id, removes subsequent duplicates.
 */
import { readFileSync, writeFileSync } from "fs";

const src = readFileSync("src/data/movements.js", "utf8");

// Split on movement object boundaries (  {\n    id: "...)
const parts = src.split(/(?=\n  \{[\s\n]*id:)/);
const seen = new Set();
const kept = [];

for (const part of parts) {
  const match = part.match(/id:\s*"([^"]+)"/);
  if (!match) { kept.push(part); continue; }
  const id = match[1];
  if (seen.has(id)) {
    console.log(`✂ removed duplicate: ${id}`);
    continue;
  }
  seen.add(id);
  kept.push(part);
}

writeFileSync("src/data/movements.js", kept.join(""), "utf8");
console.log(`\nDone. ${parts.length - kept.length} duplicate(s) removed.`);
