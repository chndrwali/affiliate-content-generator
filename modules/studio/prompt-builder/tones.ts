import { TONES, VOICE_FORMATS, labelFor } from "./options";

/** Substantive per-tone voice instructions. */
const TONE_INSTRUCTIONS: Record<string, string> = {
  natural: "Nada bicara natural seperti ngobrol biasa — tidak dibuat-buat, tidak lebay.",
  casual: "Nada santai dan gaul sewajarnya, boleh pakai bahasa sehari-hari.",
  friendly: "Nada hangat dan ramah, seperti merekomendasikan ke teman dekat.",
  funny: "Sisipkan humor natural (observasi lucu, self-deprecating ringan) — jangan memaksa lucu di setiap kalimat.",
  professional:
    "Nada rapi dan kredibel seperti reviewer profesional — tetap conversational, bukan kaku korporat.",
  persuasive:
    "Nada meyakinkan dengan argumen yang runtut — tekankan manfaat berbasis riset, bukan hype kosong.",
  storytelling:
    "Nada bercerita dengan dinamika: pelan di bagian setup, naik di bagian klimaks.",
};

const VOICE_FORMAT_INSTRUCTIONS: Record<string, string> = {
  "talking-head":
    "Format Talking Head: kreator berbicara langsung ke kamera di sebagian besar scene. Dialog ditulis sebagai ucapan langsung.",
  "voice-over":
    "Format Voice Over: visual produk/aksi yang dominan, suara kreator sebagai narasi di atasnya. Pisahkan jelas mana visual dan mana VO per scene.",
  mixed:
    "Format Mixed: kombinasikan talking head (untuk hook dan penutup) dengan voice over (untuk demo/proses). Tentukan per scene mana yang dipakai.",
};

/**
 * Duration-aware pacing: dialogue length and scene rhythm must genuinely
 * fit the target duration instead of being one-size-fits-all.
 */
export function buildDurationBlock(seconds: number): string {
  const words = Math.round(seconds * 2.5);
  return [
    "## DURASI & PACING",
    `Durasi target video: ${seconds} detik.`,
    `Panjang dialog/VO total: sekitar ${words} kata Bahasa Indonesia (pace bicara natural ~2,5 kata/detik).`,
    "Sesuaikan jumlah scene dan kepadatan informasi dengan durasi:",
    "- Video pendek (≤30 dtk): 1 pesan utama, hook kuat, langsung ke inti, CTA cepat.",
    "- Video sedang (31–60 dtk): boleh 2–3 poin pendukung + 1 demo singkat.",
    "- Video panjang (>60 dtk): struktur berlapis (hook → konteks → demo → bukti → CTA) tanpa bertele-tele.",
    "Jangan memaksakan konten 60 detik ke dalam 15 detik, dan jangan mengulur-ulur konten pendek.",
  ].join("\n");
}

export function buildToneBlock(toneValue: string): string {
  const label = labelFor(TONES, toneValue);
  const instructions =
    TONE_INSTRUCTIONS[toneValue] ?? "Gunakan nada yang konsisten dan natural.";
  return [`## TONE`, `Tone: ${label}`, `Instruksi tone: ${instructions}`].join(
    "\n",
  );
}

export function buildVoiceFormatBlock(voiceValue: string): string {
  const label = labelFor(VOICE_FORMATS, voiceValue);
  const instructions =
    VOICE_FORMAT_INSTRUCTIONS[voiceValue] ??
    "Tentukan format suara per scene secara konsisten.";
  return [
    "## FORMAT SUARA",
    `Format suara: ${label}`,
    `Instruksi: ${instructions}`,
  ].join("\n");
}
