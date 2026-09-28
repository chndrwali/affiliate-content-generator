import { CONTENT_STYLES, labelFor } from "./options";

/**
 * Substantive per-style instructions. Each entry changes HOW ChatGPT must
 * think and write — not just a label inserted into the prompt.
 */
const STYLE_INSTRUCTIONS: Record<string, string> = {
  "problem-solution": [
    "Buka dengan masalah nyata yang dialami audiens (bukan masalah karangan — harus didukung riset),",
    "tunjukkan produk sebagai solusi yang logis, dan tutup dengan hasil/transformasi yang masuk akal.",
    "Struktur: problem → agitasi ringan → solusi (produk) → bukti/fitur pendukung → CTA.",
  ].join(" "),
  review: [
    "Susun seperti review jujur berbasis riset: apa produk ini, siapa yang cocok / tidak cocok,",
    "kelebihan dan KEKURANGAN yang ditemukan dari riset (review tanpa kekurangan tidak kredibel).",
    "Jangan mengarang pengalaman pemakaian pribadi — framing sebagai analisis berbasis riset.",
  ].join(" "),
  ugc: [
    "Tulis seolah konten buatan pengguna biasa: bahasa super natural, sedikit imperfect,",
    "seperti lagi cerita ke teman. Hindari struktur iklan dan klaim bombastis.",
    "Fokus pada 1-2 hal yang paling relatable dari produk.",
  ].join(" "),
  demonstration: [
    "Fokus pada DEMO VISUAL produk: tunjukkan cara kerja, fitur utama, dan hasil yang terlihat kamera.",
    "Setiap klaim harus bisa DIBUKTIKAN secara visual dalam scene. Prioritaskan close-up dan top-down shot",
    "untuk memperlihatkan detail produk saat didemonstrasikan.",
  ].join(" "),
  storytelling: [
    "Bangun narasi mini dengan karakter/situasi yang relatable bagi audiens,",
    "produk muncul sebagai bagian alami dari cerita (bukan interupsi iklan).",
    "Ada arc sederhana: situasi awal → konflik kecil → resolusi dengan produk.",
  ].join(" "),
  tutorial: [
    "Susun sebagai panduan langkah-demi-langkah memakai produk dengan benar.",
    "Tiap langkah harus konkret dan bisa diikuti penonton. Sertakan tips yang didapat dari riset",
    "(mis. kesalahan umum pemakaian menurut review).",
  ].join(" "),
  comparison: [
    "Bandingkan produk dengan alternatif yang relevan (kompetitor / cara lama / produk sejenis).",
    "Bandingkan secara fair berdasarkan data riset — sebutkan juga di mana produk ini KALAH.",
    "Akhiri dengan untuk siapa produk ini pilihan yang tepat.",
  ].join(" "),
  unboxing: [
    "Susun alur unboxing: kesan pertama kemasan, isi paket, build quality yang terlihat,",
    "lalu impresi awal fitur utama. Bangun antisipasi natural tanpa overacting.",
    "Jangan mengarang isi paket — hanya yang terverifikasi dari riset/link produk.",
  ].join(" "),
  "before-after": [
    "Tunjukkan kontras SEBELUM vs SESUDAH yang realistis dan bisa divisualkan.",
    "Sisi 'before' harus relatable, sisi 'after' harus masuk akal (jangan klaim ajaib).",
    "Gunakan transisi visual sederhana yang bisa dilakukan 1 orang (mis. snap, wipe tangan, cut).",
  ].join(" "),
  listicle: [
    "Susun sebagai daftar bernomor (mis. '5 alasan...', '3 hal yang...') dengan tiap poin yang padat.",
    "Urutkan dari yang paling menarik. Tiap poin harus didukung riset, bukan karangan.",
    "Beri variasi visual tiap poin agar tidak monoton.",
  ].join(" "),
  educational: [
    "Fokus mengedukasi: jelaskan konsep/masalah di balik kategori produk,",
    "lalu posisikan produk sebagai contoh penerapan yang tepat.",
    "Rasio edukasi vs promosi minimal 70:30 — penonton harus dapat ilmu walau tidak beli.",
  ].join(" "),
  "testimonial-style": [
    "Susun seperti cerita pengalaman pengguna — TAPI karena kreator belum tentu pernah memakai produk,",
    "framing-nya sebagai merangkum pola dari review pelanggan [REVIEW INSIGHT], BUKAN pengalaman pribadi kreator.",
    "Jangan mengarang nama/testimoni spesifik.",
  ].join(" "),
};

export function buildStyleBlock(styleValue: string): string {
  const label = labelFor(CONTENT_STYLES, styleValue);
  const instructions =
    STYLE_INSTRUCTIONS[styleValue] ?? "Ikuti gaya konten tersebut secara konsisten.";
  return [
    "## GAYA KONTEN",
    `Gaya konten: ${label}`,
    `Instruksi gaya: ${instructions}`,
  ].join("\n");
}
