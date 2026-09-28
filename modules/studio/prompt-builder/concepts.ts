import type { PromptInput } from "./types";
import { CONTENT_STYLES, labelFor } from "./options";
import {
  buildRoleBlock,
  buildProductContextBlock,
  buildGlobalRulesBlock,
} from "./base";
import { buildResearchBlock } from "./research";
import { buildShootingRulesBlock, buildAuthenticityBlock } from "./rules";
import { buildStyleBlock } from "./styles";
import { buildHookBlock } from "./hooks";
import {
  buildToneBlock,
  buildVoiceFormatBlock,
  buildDurationBlock,
} from "./tones";

/**
 * Assembles the CONCEPT-GENERATION prompt.
 * The user copies this into ChatGPT, which does the research and
 * returns concepts in a strict parseable format.
 */
export function buildConceptsPrompt(input: PromptInput): string {
  const styleLabel = labelFor(CONTENT_STYLES, input.contentStyle);

  const formatBlock = [
    "## FORMAT OUTPUT — WAJIB DIIKUTI PERSIS",
    "Tulis SELURUH output dalam Bahasa Indonesia yang natural (label struktur tetap Bahasa Inggris seperti di bawah).",
    `Hasilkan TEPAT ${input.conceptCount} konsep — tidak kurang, tidak lebih.`,
    "Setiap konsep harus BENAR-BENAR BERBEDA satu sama lain: beda angle, beda hook, beda struktur.",
    "Jangan mengulang konsep yang sama dengan kata-kata berbeda.",
    "",
    "Untuk SETIAP konsep, gunakan format persis seperti ini (termasuk garis pembatasnya):",
    "",
    "=== CONCEPT 1 ===",
    "TITLE: [judul singkat & catchy, maksimal 8 kata]",
    `CONTENT STYLE: [${styleLabel}]`,
    "HOOK: [satu kalimat hook pembuka yang siap diucapkan, maksimal 15 kata]",
    "STRATEGIC RATIONALE: [2-3 kalimat: kenapa konsep ini efektif untuk produk & audiens ini, berdasarkan hasil riset]",
    "TARGET AUDIENCE: [siapa yang disasar konsep ini dan kenapa mereka cocok]",
    "EXECUTION: [3-6 langkah eksekusi konkret yang bisa dilakukan 1 orang sendirian]",
    "DIFFICULTY: [tulis SALAH SATU saja: Easy / Medium / Hard — nilai berdasarkan kompleksitas shooting untuk 1 orang sendirian]",
    "SETUP: [peralatan dan setting lokasi yang dibutuhkan]",
    "ESTIMATED SCENES: [angka saja, estimasi jumlah scene untuk durasi yang diminta]",
    "=== END CONCEPT 1 ===",
    "",
    "Ulangi pola yang sama untuk CONCEPT 2, CONCEPT 3, dst. dengan nomor yang berurutan.",
    "Jangan menambah atau mengurangi field. Jangan menulis teks di luar blok konsep kecuali ringkasan riset singkat di awal.",
    "Awali respons dengan ringkasan riset singkat (maksimal 8 baris) memakai label [FACT] / [OBSERVATION] /",
    "[REVIEW INSIGHT] / [STRATEGIC INTERPRETATION], lalu langsung ke blok-blok konsep.",
  ].join("\n");

  return [
    buildRoleBlock(),
    "",
    buildProductContextBlock(input),
    "",
    buildResearchBlock(),
    "",
    buildStyleBlock(input.contentStyle),
    "",
    buildHookBlock(input.hookStrategy),
    "",
    buildToneBlock(input.tone),
    "",
    buildVoiceFormatBlock(input.voiceFormat),
    "",
    buildDurationBlock(input.durationSeconds),
    "",
    buildShootingRulesBlock(),
    "",
    buildAuthenticityBlock(),
    "",
    buildGlobalRulesBlock(input),
    "",
    formatBlock,
  ].join("\n");
}
