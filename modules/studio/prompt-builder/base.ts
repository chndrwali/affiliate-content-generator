import type { PromptInput } from "./types";

/**
 * Base framing: role, language, product context, CTA, and global rules.
 * Everything is addressed to ChatGPT — this app only assembles the prompt.
 */

export function buildRoleBlock(): string {
  return [
    "## PERAN & TUJUAN",
    "Kamu adalah ahli strategi konten afiliasi dan scriptwriter Indonesia yang berpengalaman membuat video pendek",
    "(TikTok, Reels, Shorts) yang terasa autentik dan menjual tanpa terlihat seperti iklan.",
    "Tugasmu: meneliti produk di bawah ini, lalu merancang KONSEP konten video yang bisa dieksekusi",
    "oleh SATU orang kreator dengan SATU smartphone/kamera dan SATU tripod.",
    "",
    "## BAHASA",
    "Seluruh output WAJIB dalam Bahasa Indonesia yang natural dan conversational — seperti ngobrol dengan teman,",
    "bukan bahasa iklan yang kaku. Label struktur tetap dalam Bahasa Inggris sesuai format yang diminta.",
    "Hindari pengulangan spesifikasi yang tidak perlu dan kalimat yang terdengar seperti robot.",
  ].join("\n");
}

export function buildProductContextBlock(input: PromptInput): string {
  const lines = [
    "## KONTEKS PRODUK",
    `Nama produk: ${input.productName}`,
    `Link produk: ${input.productLink}`,
  ];

  if (input.hasProductPhoto) {
    lines.push(
      "Foto produk: tersedia sebagai REFERENSI VISUAL saja (akan saya lampirkan di chat ini).",
      "Jangan menyimpulkan ciri visual apa pun yang tidak terlihat jelas dari foto, dan jangan",
      "mengarang spesifikasi berdasarkan foto.",
    );
  }

  if (input.targetAudience?.trim()) {
    lines.push(
      `Target audiens (dari saya): ${input.targetAudience.trim()}`,
      "Jadikan ini sebagai audiens UTAMA. Kamu boleh mempertajamnya, tapi JANGAN menggantinya",
      "dengan audiens yang tidak berhubungan.",
    );
  } else {
    lines.push(
      "Target audiens: tidak saya tentukan — simpulkan secara wajar dari hasil riset,",
      "dan bedakan dengan jelas mana yang didukung bukti dan mana yang asumsi.",
    );
  }

  if (input.notes?.trim()) {
    lines.push(
      "Catatan tambahan dari saya (perlakukan sebagai BATASAN KREATIF yang penting):",
      input.notes.trim(),
    );
  }

  return lines.join("\n");
}

export function buildGlobalRulesBlock(input: PromptInput): string {
  return [
    "## ATURAN GLOBAL",
    `- Call-to-action (CTA) yang dipakai di semua skrip, persis seperti ini: "${input.cta}"`,
    "  Jangan mengubah kata-katanya kecuali saya memintanya secara eksplisit.",
    "Jangan pernah menyebut nama marketplace atau harga, kecuali saya memintanya secara eksplisit.",
    "Jangan mengarang: testimoni, harga, diskon, urgensi/scarcity, atau klaim manfaat yang tidak terverifikasi.",
  ].join("\n");
}
