import { HOOK_STRATEGIES, labelFor } from "./options";

/**
 * Substantive per-hook-strategy instructions — how the opening
 * 2–3 seconds must be constructed.
 */
const HOOK_INSTRUCTIONS: Record<string, string> = {
  curiosity: [
    "Buka dengan celah informasi: buat penonton penasaran dan HARUS menonton sampai habis",
    "untuk dapat jawabannya. Jangan jawab rasa penasarannya di 3 detik pertama.",
  ].join(" "),
  problem: [
    "Buka dengan menyebut masalah spesifik audiens seolah kamu memahami penderitaannya.",
    "Masalahnya harus didukung riset (masalah nyata yang diselesaikan produk), bukan karangan.",
  ].join(" "),
  question: [
    "Buka dengan pertanyaan langsung yang jawabannya 'iya' bagi target audiens,",
    "sehingga mereka merasa video ini memang untuk mereka.",
  ].join(" "),
  "bold-claim": [
    "Buka dengan klaim berani yang didukung riset — cukup kuat untuk menghentikan scroll,",
    "tapi tetap jujur dan bisa dipertanggungjawabkan. Jangan clickbait kosong.",
  ].join(" "),
  relatable: [
    "Buka dengan situasi sehari-hari yang sangat relatable bagi audiens,",
    "seolah kamu mengalami hal yang sama dengan mereka.",
  ].join(" "),
  storytelling: [
    "Buka di tengah cerita (in medias res) — satu kalimat yang langsung menempatkan penonton",
    "dalam sebuah momen, membuat mereka bertanya 'terus gimana?'.",
  ].join(" "),
  surprise: [
    "Buka dengan sesuatu yang tak terduga: fakta mengejutkan dari riset, visual yang unik,",
    "atau pernyataan yang mematahkan ekspektasi — lalu sambungkan ke produk.",
  ].join(" "),
  demonstration: [
    "Buka LANGSUNG dengan aksi visual produk (bukan omongan) — tunjukkan hal paling menarik",
    "dalam 2 detik pertama sambil suara menjelaskan.",
  ].join(" "),
  "before-after": [
    "Buka dengan menampilkan hasil 'after' dulu (atau kontras before/after sekilas),",
    "lalu janjikan akan menunjukkan caranya — penonton bertahan untuk melihat prosesnya.",
  ].join(" "),
};

export function buildHookBlock(hookValue: string): string {
  const label = labelFor(HOOK_STRATEGIES, hookValue);
  const instructions =
    HOOK_INSTRUCTIONS[hookValue] ?? "Bangun hook pembuka yang kuat dan relevan.";
  return [
    "## STRATEGI HOOK",
    `Strategi hook: ${label}`,
    `Hook menempati 2–3 detik pertama video. Instruksi: ${instructions}`,
    "Tulis hook sebagai SATU kalimat pembuka yang siap diucapkan (maksimal 15 kata).",
  ].join("\n");
}
