"use client";

import { useRef, useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Sparkles,
  ClipboardPaste,
  RotateCcw,
  CheckCircle2,
  TriangleAlert,
  Video,
  Camera,
  ListChecks,
} from "lucide-react";

import {
  studioSchema,
  studioDefaultValues,
  type StudioFormValues,
} from "@/modules/studio/schema";
import {
  buildConceptsPrompt,
  buildFinalPrompt,
  parseConceptsResponse,
  SHOOTING_CONSTRAINTS,
  CONTENT_STYLES,
  HOOK_STRATEGIES,
  TONES,
  VOICE_FORMATS,
  DURATIONS,
  CONCEPT_COUNTS,
  DIFFICULTY_STARS,
  type Concept,
  type PromptInput,
} from "@/modules/studio/prompt-builder";
import { ProductPhotoUpload } from "@/modules/studio/ui/product-photo-upload";
import { PromptOutput } from "@/modules/studio/ui/prompt-output";
import { appToast } from "@/components/custom/app-toast";
import { cn } from "@/lib/utils";

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";

function toPromptInput(values: StudioFormValues): PromptInput {
  return {
    productName: values.productName.trim(),
    productLink: values.productLink.trim(),
    hasProductPhoto: values.productPhotoUrl.trim().length > 0,
    targetAudience: values.targetAudience?.trim() || undefined,
    notes: values.notes?.trim() || undefined,
    contentStyle: values.contentStyle,
    hookStrategy: values.hookStrategy,
    tone: values.tone,
    voiceFormat: values.voiceFormat,
    durationSeconds:
      values.duration === "custom"
        ? Number(values.customDurationSeconds)
        : Number(values.duration),
    conceptCount: Number(values.conceptCount),
    cta: values.cta.trim(),
  };
}

function SectionHeading({
  step,
  title,
  description,
}: {
  step: number;
  title: string;
  description?: string;
}) {
  return (
    <div className="flex items-start gap-3">
      <span
        aria-hidden
        className="flex size-8 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground"
      >
        {step}
      </span>
      <div>
        <h2 className="text-lg font-semibold tracking-tight">{title}</h2>
        {description ? (
          <p className="text-sm text-muted-foreground">{description}</p>
        ) : null}
      </div>
    </div>
  );
}

function scrollTo(ref: React.RefObject<HTMLElement | null>) {
  window.setTimeout(() => {
    ref.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, 60);
}

export function StudioPage() {
  const form = useForm<StudioFormValues>({
    resolver: zodResolver(studioSchema),
    defaultValues: studioDefaultValues,
    mode: "onTouched",
  });

  const [conceptsPrompt, setConceptsPrompt] = useState<string | null>(null);
  const [chatGptResponse, setChatGptResponse] = useState("");
  const [concepts, setConcepts] = useState<Concept[]>([]);
  const [parseNotice, setParseNotice] = useState<string | null>(null);
  const [selectedConcept, setSelectedConcept] = useState<Concept | null>(null);
  const [finalPrompt, setFinalPrompt] = useState<string | null>(null);

  const conceptsPromptRef = useRef<HTMLDivElement>(null);
  const conceptsRef = useRef<HTMLDivElement>(null);
  const finalPromptRef = useRef<HTMLDivElement>(null);

  const duration = useWatch({ control: form.control, name: "duration" });

  const handleGenerateConcepts = (values: StudioFormValues) => {
    const prompt = buildConceptsPrompt(toPromptInput(values));
    setConceptsPrompt(prompt);
    // Reset everything downstream.
    setChatGptResponse("");
    setConcepts([]);
    setParseNotice(null);
    setSelectedConcept(null);
    setFinalPrompt(null);
    scrollTo(conceptsPromptRef);
  };

  const handleInvalid = () => {
    appToast.error(
      "Lengkapi dulu field yang wajib diisi / perbaiki yang bertanda merah.",
    );
  };

  // Called inside the submit event (not during render) so the
  // React Compiler ref rule stays happy with RHF's API.
  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    form.handleSubmit(handleGenerateConcepts, handleInvalid)(e);
  };

  const handleParseResponse = () => {
    if (!chatGptResponse.trim()) {
      appToast.error("Tempel dulu respons dari ChatGPT ke kolom di bawah sebelum di-parse.");
      return;
    }
    const parsed = parseConceptsResponse(chatGptResponse);
    setConcepts(parsed);
    setSelectedConcept(null);
    setFinalPrompt(null);
    if (parsed.length === 0) {
      setParseNotice(
        "Format respons tidak dikenali — menampilkan teks mentah di bawah. Pastikan ChatGPT mengikuti format === CONCEPT 1 === ... === END CONCEPT 1 === dari prompt.",
      );
    } else {
      setParseNotice(null);
      appToast.success(`${parsed.length} konsep berhasil di-parse. Pilih satu untuk lanjut.`);
    }
    scrollTo(conceptsRef);
  };

  const handleChooseConcept = (concept: Concept) => {
    const prompt = buildFinalPrompt(toPromptInput(form.getValues()), concept);
    setSelectedConcept(concept);
    setFinalPrompt(prompt);
    scrollTo(finalPromptRef);
  };

  const handleReset = () => {
    setConceptsPrompt(null);
    setChatGptResponse("");
    setConcepts([]);
    setParseNotice(null);
    setSelectedConcept(null);
    setFinalPrompt(null);
    appToast.info("Workspace di-reset. Mulai lagi dari data produk.");
  };

  return (
    <div className="mx-auto w-full max-w-4xl px-4 py-8 sm:px-6">
      {/* ── Header ── */}
      <header className="mb-8 space-y-3">
        <Badge variant="secondary" className="w-fit">
          <Sparkles className="size-3.5" aria-hidden />
          Prompt builder — tanpa AI API
        </Badge>
        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
          Affiliate Content Studio
        </h1>
        <p className="max-w-2xl text-sm text-muted-foreground sm:text-base">
          Isi data produk & pengaturan, generate prompt konsep, paste ke ChatGPT,
          pilih konsep favoritmu, lalu dapatkan prompt skrip final + shooting plan.
          Semua diproses lokal — aplikasi ini tidak memanggil AI apa pun.
        </p>
      </header>

      <Form {...form}>
        <form onSubmit={onSubmit} className="space-y-10">
          {/* ── 1. Produk ── */}
          <section aria-labelledby="section-produk" className="space-y-4">
            <SectionHeading
              step={1}
              title="Produk"
              description="Data produk yang akan diriset ChatGPT."
            />
            <Card>
              <CardContent className="space-y-5 pt-6">
                <FormField
                  control={form.control}
                  name="productName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Nama Produk <span className="text-destructive">*</span>
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="cth: Mini Blender Portable USB"
                          autoComplete="off"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="productLink"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Link Produk <span className="text-destructive">*</span>
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="https://..."
                          inputMode="url"
                          autoComplete="off"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        Link halaman produk untuk bahan riset ChatGPT.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="productPhotoUrl"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Foto Produk <span className="text-destructive">*</span>
                      </FormLabel>
                      <FormControl>
                        <ProductPhotoUpload
                          value={field.value}
                          onChange={field.onChange}
                          onRemove={() => field.onChange("")}
                        />
                      </FormControl>
                      <FormDescription>
                        Tepat 1 foto — hanya dipakai sebagai referensi visual.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="targetAudience"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Target Audiens (opsional)</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="cth: ibu rumah tangga 25–40 tahun yang suka masak"
                          autoComplete="off"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        Kosongkan jika ingin ChatGPT menyimpulkan dari riset.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="notes"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Catatan Tambahan (opsional)</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Batasan kreatif / hal penting yang harus diperhatikan, cth: jangan tampilkan wajah anak, tone jangan terlalu formal..."
                          rows={3}
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        Diperlakukan sebagai batasan kreatif yang penting.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>
          </section>

          {/* ── 2. Pengaturan Konten ── */}
          <section aria-labelledby="section-pengaturan" className="space-y-4">
            <SectionHeading
              step={2}
              title="Pengaturan Konten"
              description="Setiap pilihan mengubah isi instruksi prompt secara substantif."
            />
            <Card>
              <CardContent className="grid gap-5 pt-6 sm:grid-cols-2">
                <FormField
                  control={form.control}
                  name="contentStyle"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Gaya Konten</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Pilih gaya konten" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {CONTENT_STYLES.map((o) => (
                            <SelectItem key={o.value} value={o.value}>
                              {o.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="hookStrategy"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Strategi Hook</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Pilih strategi hook" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {HOOK_STRATEGIES.map((o) => (
                            <SelectItem key={o.value} value={o.value}>
                              {o.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="tone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tone</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Pilih tone" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {TONES.map((o) => (
                            <SelectItem key={o.value} value={o.value}>
                              {o.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="voiceFormat"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Format Suara</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Pilih format suara" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {VOICE_FORMATS.map((o) => (
                            <SelectItem key={o.value} value={o.value}>
                              {o.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="duration"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Durasi Video</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Pilih durasi" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {DURATIONS.map((o) => (
                            <SelectItem key={o.value} value={o.value}>
                              {o.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="conceptCount"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Jumlah Konsep</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Pilih jumlah konsep" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {CONCEPT_COUNTS.map((o) => (
                            <SelectItem key={o.value} value={o.value}>
                              {o.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {duration === "custom" && (
                  <FormField
                    control={form.control}
                    name="customDurationSeconds"
                    render={({ field }) => (
                      <FormItem className="sm:col-span-2">
                        <FormLabel>
                          Durasi Custom (detik){" "}
                          <span className="text-destructive">*</span>
                        </FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            min={5}
                            max={600}
                            step={1}
                            inputMode="numeric"
                            placeholder="cth: 25"
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>
                          Angka bulat antara 5–600 detik.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}

                <FormField
                  control={form.control}
                  name="cta"
                  render={({ field }) => (
                    <FormItem className="sm:col-span-2">
                      <FormLabel>Call-to-Action (CTA)</FormLabel>
                      <FormControl>
                        <Input autoComplete="off" {...field} />
                      </FormControl>
                      <FormDescription>
                        Teks CTA dipakai persis seperti tertulis di semua skrip.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>
          </section>

          {/* ── 3. Konteks Shooting ── */}
          <section aria-labelledby="section-shooting" className="space-y-4">
            <SectionHeading
              step={3}
              title="Konteks Shooting"
              description="Batasan tetap — otomatis masuk ke setiap prompt."
            />
            <Card>
              <CardContent className="pt-6">
                <ul className="space-y-2.5">
                  {SHOOTING_CONSTRAINTS.map((rule) => (
                    <li key={rule} className="flex items-start gap-2.5 text-sm">
                      <Camera
                        className="mt-0.5 size-4 shrink-0 text-primary"
                        aria-hidden
                      />
                      <span>{rule}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </section>

          {/* ── 4. Generate Concepts ── */}
          <section aria-labelledby="section-generate" className="space-y-4">
            <SectionHeading
              step={4}
              title="Generate Concepts"
              description="Rakit prompt riset + konsep untuk ChatGPT."
            />
            <div className="flex flex-col gap-2 sm:flex-row">
              <Button type="submit" size="lg" className="flex-1">
                <Sparkles className="size-4" aria-hidden />
                Generate Concepts Prompt
              </Button>
              {conceptsPrompt && (
                <Button
                  type="button"
                  variant="outline"
                  size="lg"
                  onClick={handleReset}
                >
                  <RotateCcw className="size-4" aria-hidden />
                  Mulai Ulang
                </Button>
              )}
            </div>

            {conceptsPrompt && (
              <div ref={conceptsPromptRef} className="scroll-mt-6 space-y-4">
                <PromptOutput
                  title="Prompt Konsep"
                  description="Salin prompt ini, buka ChatGPT, paste, lalu tekan Enter. ChatGPT akan meriset produk dan mengembalikan konsep dalam format terstruktur."
                  prompt={conceptsPrompt}
                />

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-base">
                      <ClipboardPaste className="size-4" aria-hidden />
                      Tempel Respons ChatGPT
                    </CardTitle>
                    <CardDescription>
                      Copy seluruh jawaban ChatGPT lalu paste di sini untuk
                      di-parse menjadi kartu konsep.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <Textarea
                      value={chatGptResponse}
                      onChange={(e) => setChatGptResponse(e.target.value)}
                      rows={8}
                      placeholder="Paste respons ChatGPT di sini..."
                      aria-label="Respons ChatGPT"
                      className="font-mono text-[13px]"
                    />
                    <Button
                      type="button"
                      variant="secondary"
                      onClick={handleParseResponse}
                    >
                      <ListChecks className="size-4" aria-hidden />
                      Parse Menjadi Kartu Konsep
                    </Button>
                  </CardContent>
                </Card>
              </div>
            )}
          </section>
        </form>
      </Form>

      {/* ── 5. Concept cards ── */}
      {(concepts.length > 0 || parseNotice) && (
        <section
          aria-labelledby="section-concepts"
          className="mt-10 space-y-4"
        >
          <div ref={conceptsRef} className="scroll-mt-6" />
          <SectionHeading
            step={5}
            title="Pilih Konsep"
            description="Klik satu konsep untuk generate prompt skrip final + shooting plan."
          />

          {parseNotice && (
            <Alert variant="destructive">
              <TriangleAlert className="size-4" aria-hidden />
              <AlertTitle>Format tidak dikenali</AlertTitle>
              <AlertDescription>{parseNotice}</AlertDescription>
            </Alert>
          )}

          {parseNotice ? (
            <Card>
              <CardContent className="pt-6">
                <div
                  role="region"
                  aria-label="Respons mentah ChatGPT"
                  className="max-h-[420px] overflow-y-auto rounded-md border bg-muted/30 p-4 font-mono text-[13px] leading-relaxed whitespace-pre-wrap break-words"
                >
                  {chatGptResponse}
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4 md:grid-cols-2">
              {concepts.map((concept) => {
                const isSelected = selectedConcept?.index === concept.index;
                return (
                  <Card
                    key={concept.index}
                    className={cn(
                      "flex flex-col transition-shadow",
                      isSelected && "ring-2 ring-primary shadow-lg",
                    )}
                  >
                    <CardHeader className="space-y-2">
                      <div className="flex items-center justify-between gap-2">
                        <Badge variant="secondary">
                          Konsep {concept.index}
                        </Badge>
                        <Badge
                          variant="outline"
                          aria-label={`Tingkat kesulitan: ${concept.difficulty}`}
                        >
                          {DIFFICULTY_STARS[concept.difficulty]}
                        </Badge>
                      </div>
                      <CardTitle className="text-base leading-snug">
                        {concept.title || `Konsep ${concept.index}`}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="flex flex-1 flex-col gap-3 text-sm">
                      {concept.hook && (
                        <blockquote className="border-l-2 border-primary pl-3 text-muted-foreground italic">
                          “{concept.hook}”
                        </blockquote>
                      )}
                      <dl className="space-y-2">
                        {concept.contentStyle && (
                          <div>
                            <dt className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">
                              Gaya Konten
                            </dt>
                            <dd>{concept.contentStyle}</dd>
                          </div>
                        )}
                        {concept.strategicRationale && (
                          <div>
                            <dt className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">
                              Rasional Strategi
                            </dt>
                            <dd className="text-muted-foreground">
                              {concept.strategicRationale}
                            </dd>
                          </div>
                        )}
                        {concept.targetAudience && (
                          <div>
                            <dt className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">
                              Target Audiens
                            </dt>
                            <dd className="text-muted-foreground">
                              {concept.targetAudience}
                            </dd>
                          </div>
                        )}
                        {concept.execution && (
                          <div>
                            <dt className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">
                              Eksekusi
                            </dt>
                            <dd className="text-muted-foreground whitespace-pre-line">
                              {concept.execution}
                            </dd>
                          </div>
                        )}
                        <div className="flex flex-wrap gap-x-6 gap-y-2">
                          {concept.setup && (
                            <div>
                              <dt className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">
                                Setup
                              </dt>
                              <dd className="text-muted-foreground">
                                {concept.setup}
                              </dd>
                            </div>
                          )}
                          {concept.estimatedScenes && (
                            <div>
                              <dt className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">
                                Estimasi Scene
                              </dt>
                              <dd className="text-muted-foreground">
                                {concept.estimatedScenes}
                              </dd>
                            </div>
                          )}
                        </div>
                      </dl>
                      <div className="mt-auto pt-2">
                        <Button
                          type="button"
                          className="w-full"
                          variant={isSelected ? "secondary" : "default"}
                          onClick={() => handleChooseConcept(concept)}
                        >
                          <CheckCircle2 className="size-4" aria-hidden />
                          {isSelected
                            ? "Konsep Terpilih"
                            : "Choose This Concept"}
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </section>
      )}

      {/* ── 6. Final prompt ── */}
      {finalPrompt && selectedConcept && (
        <section aria-labelledby="section-final" className="mt-10 space-y-4">
          <div ref={finalPromptRef} className="scroll-mt-6" />
          <SectionHeading
            step={6}
            title="Prompt Final"
            description={`Skrip + shooting plan untuk "${selectedConcept.title || `Konsep ${selectedConcept.index}`}".`}
          />
          <PromptOutput
            title="Prompt Skrip Final & Shooting Plan"
            description="Salin prompt ini, paste ke ChatGPT (di percakapan yang sama agar konteks riset terbawa), lalu tekan Enter."
            prompt={finalPrompt}
          />
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Video className="size-4" aria-hidden />
            <span>
              Output ChatGPT: A. Final Script (hook + dialog/VO + CTA) — B.
              Shooting Plan per scene — C. Caption.
            </span>
          </div>
        </section>
      )}

      <Separator className="my-10" />
      <footer className="pb-4 text-center text-xs text-muted-foreground">
        Affiliate Content Studio — merakit prompt terstruktur. Penalaran AI
        terjadi di ChatGPT setelah prompt di-paste.
      </footer>
    </div>
  );
}
