import type { Concept, PromptInput } from "./types";
import { CONTENT_STYLES, labelFor } from "./options";
import {
  buildRoleBlock,
  buildProductContextBlock,
  buildGlobalRulesBlock,
} from "./base";
import { buildShootingRulesBlock, buildAuthenticityBlock } from "./rules";
import { buildStyleBlock } from "./styles";
import { buildHookBlock } from "./hooks";
import {
  buildToneBlock,
  buildVoiceFormatBlock,
  buildDurationBlock,
} from "./tones";

/**
 * Assembles the FINAL-SCRIPT prompt for the concept the user chose.
 * It instructs ChatGPT to reuse the FULL product research from earlier
 * in the conversation — not just the selected concept summary.
 */
export function buildFinalPrompt(input: PromptInput, concept: Concept): string {
  const conceptBlock = [
    "## KONSEP TERPILIH",
    `Judul: ${concept.title}`,
    `Content style: ${concept.contentStyle || labelFor(CONTENT_STYLES, input.contentStyle)}`,
    `Hook: ${concept.hook}`,
    `Strategic rationale: ${concept.strategicRationale}`,
    `Target audience: ${concept.targetAudience}`,
    `Eksekusi: ${concept.execution}`,
    `Setup: ${concept.setup}`,
  ].join("\n");

  const outputBlock = [
    "## OUTPUT YANG DIHARAPKAN",
    "Tulis SELURUH output dalam Bahasa Indonesia yang natural dan conversational.",
    "Label struktur tetap Bahasa Inggris seperti di bawah.",
    "",
    "### A. FINAL SCRIPT",
    "- Hook: tulis ulang hook terpilih menjadi kalimat pembuka final yang siap diucapkan.",
    "- Dialog/VO lengkap dari awal sampai akhir, dengan penanda siapa bicara / bagian VO.",
    `- Akhiri dengan CTA persis: "${input.cta}"`,
    `- Panjang dialog harus pas untuk ${input.durationSeconds} detik (lihat aturan pacing di atas).`,
    "- Dialog harus terdengar natural seperti ngobrol, bukan seperti membaca iklan.",
    "",
    "### B. SHOOTING PLAN (per scene)",
    "Susun scene demi scene. Jumlah scene DITURUNKAN dari durasi, gaya konten, konsep, dan kebutuhan demonstrasi —",
    "bukan angka tetap. Untuk SETIAP scene tulis:",
    "- Nomor & durasi scene (dalam detik)",
    "- Angle kamera (medium / wide / close-up / side / top-down / over-the-shoulder)",
    "- Posisi tripod (spesifik — jika pindah dari scene sebelumnya, jelaskan persis ke mana)",
    "- Aksi yang dilakukan kreator",
    "- Format suara scene ini (talking head / voice over)",
    "- Dialog/VO untuk scene ini",
    "- Overlay text (singkat, mudah dibaca, MENGUATKAN dialog bukan mengulanginya — jangan terlalu sering)",
    "- Transisi / aksi berikutnya",
    "",
    "### C. CAPTION",
    "Satu caption pendek berbahasa Indonesia yang natural dan relevan dengan video.",
    "Tanpa emoji berlebihan, tanpa klaim karangan, tanpa harga, tanpa nama marketplace.",
  ].join("\n");

  return [
    buildRoleBlock(),
    "",
    "## KONTEKS PERCAKAPAN",
    "Gunakan SELURUH hasil riset produk dari pesan-pesan sebelumnya di percakapan ini sebagai konteks penuh.",
    "Jangan hanya mengandalkan ringkasan konsep di bawah — seluruh detail riset (fitur terverifikasi,",
    "manfaat, keberatan pembeli, feedback, keterbatasan) harus tercermin dalam skrip dan shooting plan.",
    "",
    buildProductContextBlock(input),
    "",
    conceptBlock,
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
    outputBlock,
  ].join("\n");
}
