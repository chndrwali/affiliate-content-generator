/**
 * Research protocol: how ChatGPT must investigate the product before
 * writing anything, and how it must label what it claims.
 */

export function buildResearchBlock(): string {
  return [
    "## PROTOKOL RISET PRODUK (lakukan SEBELUM menulis konsep)",
    "Riset produk menggunakan link di atas plus sumber resmi brand/pabrikan, dokumentasi, situs terpercaya,",
    "review, artikel, dan sumber kredibel lainnya. Dari riset, identifikasi:",
    "1. Identitas produk",
    "2. Fungsi produk",
    "3. Fitur-fitur",
    "4. Spesifikasi yang terverifikasi",
    "5. Manfaat yang didukung bukti",
    "6. Masalah yang diselesaikan produk",
    "7. Target audiens",
    "8. Keberatan/keraguan calon pembeli",
    "9. Feedback pelanggan",
    "10. Diferensiasi dari kompetitor",
    "11. Keterbatasan produk",
    "12. Peluang angle konten",
    "",
    "## ATURAN KEBENARAN DATA",
    "- Jangan PERNAH mengarang spesifikasi, manfaat, harga, diskon, scarcity, atau testimoni.",
    "- Foto produk hanya referensi visual — jangan menyimpulkan ciri visual yang tidak terlihat jelas.",
    "- Bedakan setiap klaim dengan label berikut:",
    "  [FACT] = terverifikasi dari sumber resmi/dokumentasi",
    "  [OBSERVATION] = terlihat langsung dari foto/link produk",
    "  [REVIEW INSIGHT] = pola dari review pelanggan (bukan pengalaman pribadi kreator!)",
    "  [STRATEGIC INTERPRETATION] = kesimpulan strategismu — JANGAN disajikan sebagai fakta produk",
    "- Jika sumber saling bertentangan, akui secara eksplisit.",
    "- Jangan mengutip review seolah-olah itu pengalaman pribadi kreator.",
  ].join("\n");
}
