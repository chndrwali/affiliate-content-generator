/**
 * Fixed shooting constraints (solo creator) and authenticity rules.
 * These are NOT user-configurable — they apply to every prompt.
 */

/** Human-readable list of the fixed constraints, also shown in the UI. */
export const SHOOTING_CONSTRAINTS: string[] = [
  "Kreator shooting sendirian dengan 1 smartphone/kamera dan 1 tripod",
  "Produk fisik di tangan, lokasi utama hanya 1 tempat",
  "Setiap scene harus bisa dieksekusi 1 orang: pasang tripod → rekam → perform → stop",
  "DILARANG: kameramen, operator, drone, operator gimbal, multi-kamera, tracking camera, rig kompleks, alat studio, gerakan mustahil",
  "Utamakan: tripod statis, shot medium/wide/close-up/side/top-down/over-the-shoulder, dan reposisi sederhana",
  "Jika tripod dipindah, jelaskan PERSIS ke mana tripod dipindahkan",
];

export function buildShootingRulesBlock(): string {
  return [
    "## ATURAN SHOOTING (WAJIB — kreator sendirian)",
    "Kreator shooting SENDIRIAN dengan SATU smartphone/kamera, SATU tripod, produk fisik,",
    "dan terutama SATU lokasi.",
    "SETIAP scene harus bisa dieksekusi oleh satu orang dengan alur:",
    "pasang tripod → mulai rekam → perform → stop rekam.",
    "JANGAN PERNAH mensyaratkan: kameramen, operator, drone, operator gimbal,",
    "multiple cameras, tracking camera, rig kompleks, peralatan studio, atau gerakan kamera yang mustahil.",
    "Utamakan: tripod statis, shot medium / wide / close-up / side / top-down / over-the-shoulder,",
    "dan reposisi tripod yang sederhana.",
    "Jika tripod dipindah antar scene, jelaskan PERSIS ke mana tripod dipindahkan.",
  ].join("\n");
}

export function buildAuthenticityBlock(): string {
  return [
    "## ATURAN AUTENTISITAS (WAJIB)",
    "Jangan PERNAH mengarang pengalaman pribadi memakai produk.",
    "Kecuali saya menyatakan sudah pernah memakai produknya, HINDARI kalimat seperti:",
    '"Saya sudah pakai ini seminggu", "Saya pakai ini setiap hari", "Setelah saya coba...", "Ini mengubah hidup saya".',
    "Sebagai gantinya gunakan framing yang jujur, misalnya:",
    '"Yang menarik dari produk ini...", "Kalau dilihat dari fiturnya...",',
    '"Produk ini dirancang untuk...", "Yang paling menarik menurut gue dari fitur ini...".',
  ].join("\n");
}
