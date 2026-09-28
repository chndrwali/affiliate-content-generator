import type { Concept, Difficulty } from "./types";

/**
 * Parses ChatGPT's concepts response into structured Concept objects.
 * Expects the strict format mandated by buildConceptsPrompt:
 *
 *   === CONCEPT 1 ===
 *   TITLE: ...
 *   ...
 *   === END CONCEPT 1 ===
 *
 * The parser is intentionally lenient about whitespace, casing, and
 * minor label variations. Returns [] when nothing parseable is found —
 * the UI then falls back to showing the raw response.
 */

const BLOCK_RE =
  /===\s*CONCEPT\s+(\d+)\s*===\s*([\s\S]*?)\s*===\s*END\s+CONCEPT\s+\1\s*===/gi;

function field(block: string, label: string): string {
  // Matches e.g. "TITLE: some value" (case-insensitive, multiline).
  const re = new RegExp(`^\\s*${label}\\s*:\\s*(.+?)\\s*$`, "gim");
  const match = re.exec(block);
  return match?.[1]?.trim() ?? "";
}

function normalizeDifficulty(raw: string): Difficulty {
  const v = raw.toLowerCase();
  if (/(hard|sulit|berat)/.test(v)) return "Hard";
  if (/(medium|sedang|menengah)/.test(v)) return "Medium";
  if (/(easy|mudah|gampang)/.test(v)) return "Easy";
  // Default to the neutral middle when ChatGPT wrote something unexpected.
  return "Medium";
}

export function parseConceptsResponse(text: string): Concept[] {
  const concepts: Concept[] = [];
  BLOCK_RE.lastIndex = 0;

  let match: RegExpExecArray | null;
  while ((match = BLOCK_RE.exec(text)) !== null) {
    const index = Number(match[1]);
    const block = match[2] ?? "";
    const difficultyRaw = field(block, "DIFFICULTY");

    concepts.push({
      index,
      title: field(block, "TITLE"),
      contentStyle: field(block, "CONTENT STYLE"),
      hook: field(block, "HOOK"),
      strategicRationale: field(block, "STRATEGIC RATIONALE"),
      targetAudience: field(block, "TARGET AUDIENCE"),
      execution: field(block, "EXECUTION"),
      difficulty: normalizeDifficulty(difficultyRaw),
      difficultyRaw,
      setup: field(block, "SETUP"),
      estimatedScenes: field(block, "ESTIMATED SCENES"),
      raw: block.trim(),
    });
  }

  concepts.sort((a, b) => a.index - b.index);
  return concepts;
}
