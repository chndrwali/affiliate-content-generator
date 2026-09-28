/**
 * Shared types for the Affiliate Content Generator prompt builder.
 * The app never calls an AI API — these types only describe the
 * structured prompts the user copies into ChatGPT.
 */

export type Difficulty = "Easy" | "Medium" | "Hard";

/** All user inputs needed to assemble a prompt. */
export interface PromptInput {
  productName: string;
  productLink: string;
  /** Whether exactly one product photo was uploaded. */
  hasProductPhoto: boolean;
  targetAudience?: string;
  notes?: string;
  contentStyle: string;
  hookStrategy: string;
  tone: string;
  voiceFormat: string;
  /** Effective duration in seconds (custom value already resolved). */
  durationSeconds: number;
  conceptCount: number;
  cta: string;
}

/** A single content concept parsed from ChatGPT's response. */
export interface Concept {
  index: number;
  title: string;
  contentStyle: string;
  hook: string;
  strategicRationale: string;
  targetAudience: string;
  execution: string;
  difficulty: Difficulty;
  /** Raw difficulty text as written by ChatGPT (for transparency). */
  difficultyRaw: string;
  setup: string;
  estimatedScenes: string;
  /** Full raw text of this concept block. */
  raw: string;
}

export const DIFFICULTY_STARS: Record<Difficulty, string> = {
  Easy: "⭐ Easy",
  Medium: "⭐⭐ Medium",
  Hard: "⭐⭐⭐ Hard",
};
