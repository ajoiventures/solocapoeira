/**
 * add-video-links.mjs
 * Patches specific movements in movements.js with curated video URLs.
 * Run: node scripts/add-video-links.mjs
 */
import { readFileSync, writeFileSync } from "fs";

const VIDEO_LINKS = {
  cocorinha:             { tutorial: "https://www.youtube.com/watch?v=X7cVkJfN3Ks", video: "https://www.youtube.com/results?search_query=cocorinha+capoeira" },
  esquiva_baixa:         { tutorial: "https://www.youtube.com/watch?v=ZqkAFIJbSNY", video: "https://www.youtube.com/results?search_query=esquiva+baixa+capoeira" },
  negativa:              { tutorial: "https://www.youtube.com/watch?v=X8sj1iXxAFo", video: "https://www.youtube.com/results?search_query=negativa+capoeira+tutorial" },
  role:                  { tutorial: "https://www.youtube.com/watch?v=GpjyM2GVPBE", video: "https://www.youtube.com/results?search_query=rol%C3%AA+capoeira+tutorial" },
  esquiva_paralela:      { tutorial: "https://www.youtube.com/watch?v=oH6eqWqjS84", video: "https://www.youtube.com/results?search_query=esquiva+paralela+capoeira" },
  au_basico:             { tutorial: "https://www.youtube.com/watch?v=Kmt-t3a3bHg", video: "https://www.youtube.com/results?search_query=au+basico+capoeira+tutorial" },
  au_controlado:         { tutorial: "https://www.youtube.com/watch?v=bX3hFNiMiMc", video: "https://www.youtube.com/results?search_query=au+controlado+capoeira" },
  au_fechado:            { tutorial: "https://www.youtube.com/watch?v=8QkGrM2Dv3s", video: "https://www.youtube.com/results?search_query=au+fechado+capoeira" },
  queixada:              { tutorial: "https://www.youtube.com/watch?v=fVzHMtx1MJo", video: "https://www.youtube.com/results?search_query=queixada+capoeira+tutorial" },
  armada:                { tutorial: "https://www.youtube.com/watch?v=lCqYq5QGDFY", video: "https://www.youtube.com/results?search_query=armada+capoeira+tutorial" },
  bencao:                { tutorial: "https://www.youtube.com/watch?v=jh7qAVJqnHg", video: "https://www.youtube.com/results?search_query=bencao+capoeira+tutorial" },
  martelo:               { tutorial: "https://www.youtube.com/watch?v=VkniD2R8pnE", video: "https://www.youtube.com/results?search_query=martelo+capoeira+tutorial" },
  meia_lua_de_compasso:  { tutorial: "https://www.youtube.com/watch?v=3f3VLlQsxk8", video: "https://www.youtube.com/results?search_query=meia+lua+compasso+capoeira" },
  rasteira:              { tutorial: "https://www.youtube.com/watch?v=yxvjOjNQ_6o", video: "https://www.youtube.com/results?search_query=rasteira+capoeira+tutorial" },
  bananeira_wall:        { tutorial: "https://www.youtube.com/watch?v=kk2iGqHbhsI", video: "https://www.youtube.com/results?search_query=bananeira+handstand+capoeira" },
  macaco:                { tutorial: "https://www.youtube.com/watch?v=iLyPl5_BGOM", video: "https://www.youtube.com/results?search_query=macaco+capoeira+tutorial" },
  parafuso:              { tutorial: "https://www.youtube.com/watch?v=j7SIaK3oIPg", video: "https://www.youtube.com/results?search_query=parafuso+capoeira+tutorial" },
  ginga_baixo:           { tutorial: null, video: "https://www.youtube.com/results?search_query=ginga+baixa+angola+capoeira" },
  queda_de_rins:         { tutorial: "https://www.youtube.com/watch?v=sQQWdv_CGYE", video: "https://www.youtube.com/results?search_query=queda+de+rins+capoeira" },
};

const filePath = "src/data/movements.js";
let src = readFileSync(filePath, "utf8");
let patchCount = 0;

for (const [id, links] of Object.entries(VIDEO_LINKS)) {
  // Match the first occurrence of id: "X" followed by tutorialUrl: null / videoUrl: null
  const pattern = new RegExp(
    `(id:\\s*"${id}"[\\s\\S]*?tutorialUrl:\\s*)null([\\s\\S]*?videoUrl:\\s*)null`,
    "m"
  );
  const tutVal = links.tutorial ? `"${links.tutorial}"` : "null";
  const vidVal = links.video ? `"${links.video}"` : "null";
  const updated = src.replace(pattern, (match, pre1, pre2) => {
    return `${pre1}${tutVal}${pre2}${vidVal}`;
  });
  if (updated !== src) {
    src = updated;
    patchCount++;
    console.log(`✓ ${id}`);
  } else {
    console.warn(`⚠ no match: ${id}`);
  }
}

writeFileSync(filePath, src, "utf8");
console.log(`\nDone. ${patchCount}/${Object.keys(VIDEO_LINKS).length} movements patched.`);
