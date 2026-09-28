"use client";

import { useState } from "react";
import { Copy, ExternalLink, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { appToast } from "@/components/custom/app-toast";
import { cn } from "@/lib/utils";

const CHATGPT_URL = "https://chatgpt.com/";

/** Exact feedback message required by the spec. */
export const COPIED_FEEDBACK = "Prompt copied. Paste into ChatGPT and press Enter.";

async function copyTextToClipboard(text: string): Promise<boolean> {
  if (!text) return false;

  try {
    if (typeof navigator !== "undefined" && navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(text);
      return true;
    }
  } catch {
    // Fall through to the legacy fallback below.
  }

  try {
    const textarea = document.createElement("textarea");
    textarea.value = text;
    textarea.setAttribute("readonly", "");
    textarea.style.position = "fixed";
    textarea.style.opacity = "0";
    document.body.appendChild(textarea);
    textarea.select();
    const ok = document.execCommand("copy");
    document.body.removeChild(textarea);
    return ok;
  } catch {
    return false;
  }
}

interface PromptOutputProps {
  title: string;
  description?: string;
  prompt: string;
  className?: string;
}

/**
 * Reusable prompt display: readable scrollable text area plus
 * [Copy Prompt] and [Open ChatGPT] actions.
 */
export function PromptOutput({
  title,
  description,
  prompt,
  className,
}: PromptOutputProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async (): Promise<boolean> => {
    if (!prompt.trim()) {
      appToast.error("Prompt masih kosong — belum ada yang bisa disalin.");
      return false;
    }
    const ok = await copyTextToClipboard(prompt);
    if (ok) {
      setCopied(true);
      appToast.success(COPIED_FEEDBACK);
      window.setTimeout(() => setCopied(false), 2500);
    } else {
      appToast.error(
        "Gagal menyalin prompt. Coba blok teksnya manual lalu salin (Ctrl+C).",
      );
    }
    return ok;
  };

  const handleOpenChatGPT = async () => {
    const ok = await handleCopy();
    if (!ok) return;
    // Never rely on cross-origin auto-paste: the user pastes manually.
    const win = window.open(CHATGPT_URL, "_blank", "noopener,noreferrer");
    if (!win) {
      appToast.error(
        "Prompt sudah disalin, tapi popup diblokir browser. Buka chatgpt.com manual, lalu paste.",
      );
    }
  };

  return (
    <Card className={cn(className)}>
      <CardHeader>
        <CardTitle className="text-base">{title}</CardTitle>
        {description ? <CardDescription>{description}</CardDescription> : null}
      </CardHeader>
      <CardContent className="space-y-4">
        <div
          role="region"
          aria-label={title}
          className="max-h-[420px] overflow-y-auto rounded-md border bg-muted/30 p-4 font-mono text-[13px] leading-relaxed whitespace-pre-wrap break-words"
        >
          {prompt}
        </div>
        <div className="flex flex-col gap-2 sm:flex-row">
          <Button
            type="button"
            onClick={handleCopy}
            className="flex-1"
            aria-label="Salin prompt ke clipboard"
          >
            {copied ? (
              <Check className="size-4" aria-hidden />
            ) : (
              <Copy className="size-4" aria-hidden />
            )}
            {copied ? "Tersalin!" : "Copy Prompt"}
          </Button>
          <Button
            type="button"
            variant="secondary"
            onClick={handleOpenChatGPT}
            className="flex-1"
            aria-label="Salin prompt lalu buka ChatGPT di tab baru"
          >
            <ExternalLink className="size-4" aria-hidden />
            Open ChatGPT
          </Button>
        </div>
        <p className="text-xs text-muted-foreground">
          Prompt disalin dulu, lalu ChatGPT terbuka di tab baru — kamu paste
          manual di sana lalu tekan Enter.
        </p>
      </CardContent>
    </Card>
  );
}
