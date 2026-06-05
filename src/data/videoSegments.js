/**
 * Video Game Segment Library
 * Structure for breaking down Capoeira game videos into focused training segments
 */

export const VIDEO_GAMES = {
  "mestre_no_game_1": {
    id: "mestre_no_game_1",
    title: "Mestre Nô Game 1",
    opponent: "[To be filled]",
    totalDuration: 0, // in seconds
    videoSource: "https://www.reddit.com/r/capoeira/comments/1rxcvvd/capoeira_angola_palmares_featuring_mestre_nô/",
    segments: [], // Array of VideoSegment objects
    notes: "",
  },
};

/**
 * VideoSegment structure
 * {
 *   id: string (unique)
 *   videoId: string (parent game)
 *   title: string (e.g., "Opening Exchange")
 *   description: string (what happens in this segment)
 *   startTime: number (seconds from start)
 *   endTime: number (seconds from start)
 *   durationSeconds: number (calculated: endTime - startTime)
 *   techniques: string[] (techniques demonstrated)
 *   difficulty: number (1-5)
 *   focus: string (e.g., "defensive malícia", "ground work")
 *   keyMoments: string[] (notable events/timing points)
 *   notes: string (training notes)
 *   trained: boolean (have you practiced this segment?)
 *   repCount: number (how many times you've shadow-practiced it)
 *   lastTrained: string (ISO date)
 * }
 */

export function createBlankSegment(videoId, segmentNumber) {
  return {
    id: `${videoId}_seg_${segmentNumber}`,
    videoId,
    title: `Segment ${segmentNumber}`,
    description: "",
    startTime: 0,
    endTime: 0,
    durationSeconds: 0,
    techniques: [],
    difficulty: 1,
    focus: "",
    keyMoments: [],
    notes: "",
    trained: false,
    repCount: 0,
    lastTrained: null,
  };
}

export function addSegment(game, segment) {
  return {
    ...game,
    segments: [...(game.segments || []), segment],
  };
}

export function updateSegment(game, segmentId, updates) {
  return {
    ...game,
    segments: game.segments.map((seg) =>
      seg.id === segmentId ? { ...seg, ...updates } : seg
    ),
  };
}

export function getSegmentDuration(segment) {
  return segment.endTime - segment.startTime;
}

export function getVideoProgress(game) {
  if (!game.segments?.length) return 0;
  const trained = game.segments.filter((s) => s.trained).length;
  return Math.round((trained / game.segments.length) * 100);
}
