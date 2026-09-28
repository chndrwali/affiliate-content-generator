import { z } from "zod";
import {
  conceptCountValues,
  contentStyleValues,
  durationValues,
  hookStrategyValues,
  toneValues,
  voiceFormatValues,
} from "./prompt-builder/options";

export const DEFAULT_CTA = "Cek produknya di bawah.";

function isHttpUrl(value: string): boolean {
  try {
    const url = new URL(value.trim());
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}

export const studioSchema = z
  .object({
    // ── Product ──
    productName: z
      .string()
      .min(1, "Nama produk wajib diisi.")
      .max(200, "Nama produk maksimal 200 karakter."),
    productLink: z
      .string()
      .min(1, "Link produk wajib diisi.")
      .refine(isHttpUrl, {
        message: "Link produk harus URL yang valid (diawali http:// atau https://).",
      }),
    productPhotoUrl: z
      .string()
      .min(1, "Foto produk wajib diupload (tepat 1 foto)."),
    targetAudience: z
      .string()
      .max(300, "Target audiens maksimal 300 karakter.")
      .optional(),
    notes: z
      .string()
      .max(2000, "Catatan maksimal 2000 karakter.")
      .optional(),

    // ── Content settings ──
    contentStyle: z.enum(contentStyleValues),
    hookStrategy: z.enum(hookStrategyValues),
    tone: z.enum(toneValues),
    voiceFormat: z.enum(voiceFormatValues),
    duration: z.enum(durationValues),
    customDurationSeconds: z.string().optional(),
    conceptCount: z.enum(conceptCountValues),
    cta: z
      .string()
      .min(1, "Teks CTA wajib diisi.")
      .max(200, "Teks CTA maksimal 200 karakter."),
  })
  .superRefine((data, ctx) => {
    if (data.duration === "custom") {
      const raw = data.customDurationSeconds?.trim() ?? "";
      const n = Number(raw);
      if (!raw || !Number.isInteger(n) || n < 5 || n > 600) {
        ctx.addIssue({
          code: "custom",
          path: ["customDurationSeconds"],
          message: "Durasi custom wajib diisi: angka bulat 5–600 detik.",
        });
      }
    }
  });

export type StudioFormValues = z.infer<typeof studioSchema>;

export const studioDefaultValues: StudioFormValues = {
  productName: "",
  productLink: "",
  productPhotoUrl: "",
  targetAudience: "",
  notes: "",
  contentStyle: "problem-solution",
  hookStrategy: "curiosity",
  tone: "natural",
  voiceFormat: "talking-head",
  duration: "30",
  customDurationSeconds: "",
  conceptCount: "3",
  cta: DEFAULT_CTA,
};
