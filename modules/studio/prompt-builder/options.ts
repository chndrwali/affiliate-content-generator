/**
 * Fixed dropdown options for the studio workspace.
 * Values are stable keys; labels are shown in the UI.
 */

export const contentStyleValues = [
  "problem-solution",
  "review",
  "ugc",
  "demonstration",
  "storytelling",
  "tutorial",
  "comparison",
  "unboxing",
  "before-after",
  "listicle",
  "educational",
  "testimonial-style",
] as const;
export type ContentStyleValue = (typeof contentStyleValues)[number];

export const CONTENT_STYLES: { value: ContentStyleValue; label: string }[] = [
  { value: "problem-solution", label: "Problem → Solution" },
  { value: "review", label: "Review" },
  { value: "ugc", label: "UGC" },
  { value: "demonstration", label: "Demonstration" },
  { value: "storytelling", label: "Storytelling" },
  { value: "tutorial", label: "Tutorial" },
  { value: "comparison", label: "Comparison" },
  { value: "unboxing", label: "Unboxing" },
  { value: "before-after", label: "Before → After" },
  { value: "listicle", label: "Listicle" },
  { value: "educational", label: "Educational" },
  { value: "testimonial-style", label: "Testimonial-style" },
];

export const hookStrategyValues = [
  "curiosity",
  "problem",
  "question",
  "bold-claim",
  "relatable",
  "storytelling",
  "surprise",
  "demonstration",
  "before-after",
] as const;
export type HookStrategyValue = (typeof hookStrategyValues)[number];

export const HOOK_STRATEGIES: { value: HookStrategyValue; label: string }[] = [
  { value: "curiosity", label: "Curiosity" },
  { value: "problem", label: "Problem" },
  { value: "question", label: "Question" },
  { value: "bold-claim", label: "Bold Claim" },
  { value: "relatable", label: "Relatable" },
  { value: "storytelling", label: "Storytelling" },
  { value: "surprise", label: "Surprise" },
  { value: "demonstration", label: "Demonstration" },
  { value: "before-after", label: "Before → After" },
];

export const toneValues = [
  "natural",
  "casual",
  "friendly",
  "funny",
  "professional",
  "persuasive",
  "storytelling",
] as const;
export type ToneValue = (typeof toneValues)[number];

export const TONES: { value: ToneValue; label: string }[] = [
  { value: "natural", label: "Natural" },
  { value: "casual", label: "Casual" },
  { value: "friendly", label: "Friendly" },
  { value: "funny", label: "Funny" },
  { value: "professional", label: "Professional" },
  { value: "persuasive", label: "Persuasive" },
  { value: "storytelling", label: "Storytelling" },
];

export const voiceFormatValues = ["talking-head", "voice-over", "mixed"] as const;
export type VoiceFormatValue = (typeof voiceFormatValues)[number];

export const VOICE_FORMATS: { value: VoiceFormatValue; label: string }[] = [
  { value: "talking-head", label: "Talking Head" },
  { value: "voice-over", label: "Voice Over" },
  { value: "mixed", label: "Mixed" },
];

export const durationValues = ["15", "30", "45", "60", "90", "custom"] as const;
export type DurationValue = (typeof durationValues)[number];

export const DURATIONS: { value: DurationValue; label: string }[] = [
  { value: "15", label: "15 detik" },
  { value: "30", label: "30 detik" },
  { value: "45", label: "45 detik" },
  { value: "60", label: "60 detik" },
  { value: "90", label: "90 detik" },
  { value: "custom", label: "Custom" },
];

export const conceptCountValues = ["1", "3", "5", "10"] as const;
export type ConceptCountValue = (typeof conceptCountValues)[number];

export const CONCEPT_COUNTS: { value: ConceptCountValue; label: string }[] = [
  { value: "1", label: "1 konsep" },
  { value: "3", label: "3 konsep" },
  { value: "5", label: "5 konsep" },
  { value: "10", label: "10 konsep" },
];

/** Look up a label for a stored value; falls back to the raw value. */
export function labelFor(
  options: { value: string; label: string }[],
  value: string,
): string {
  return options.find((o) => o.value === value)?.label ?? value;
}
