"use client";

import { useState, useCallback } from "react";
import Image from "next/image";
import { X, ImagePlus, Loader2 } from "lucide-react";
import { useDropzone } from "@uploadthing/react";
import { useUploadThing } from "@/components/uploadthing";
import { cn } from "@/lib/utils";
import { appToast } from "@/components/custom/app-toast";

interface ProductPhotoUploadProps {
  value?: string;
  onChange: (url: string) => void;
  onRemove: () => void;
  disabled?: boolean;
  className?: string;
}

/**
 * Single product-photo upload for the studio workspace.
 * Uses the public `publicImage` endpoint (no login required).
 * Removing only clears local state — there is no delete API in this app.
 */
export function ProductPhotoUpload({
  value,
  onChange,
  onRemove,
  disabled,
  className,
}: ProductPhotoUploadProps) {
  const [isUploading, setIsUploading] = useState(false);

  const { startUpload } = useUploadThing("publicImage", {
    onClientUploadComplete: (res) => {
      if (res?.[0]) {
        onChange(res[0].ufsUrl);
        appToast.success("Foto produk berhasil diupload.");
      }
      setIsUploading(false);
    },
    onUploadError: (error: Error) => {
      appToast.error(`Gagal mengupload foto: ${error.message}`);
      setIsUploading(false);
    },
    onUploadBegin: () => {
      setIsUploading(true);
    },
  });

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      if (acceptedFiles.length > 0) {
        startUpload(acceptedFiles);
      }
    },
    [startUpload],
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "image/*": [".png", ".jpg", ".jpeg", ".webp"] },
    maxFiles: 1,
    disabled: disabled || isUploading,
  });

  const handleRemove = () => {
    onRemove();
    appToast.info("Foto produk dihapus. Upload ulang 1 foto untuk lanjut.");
  };

  if (value) {
    return (
      <div
        className={cn(
          "relative group rounded-xl overflow-hidden border border-border bg-muted/30",
          "w-full aspect-video",
          className,
        )}
      >
        <Image
          src={value}
          alt="Foto produk"
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all duration-300" />
        <button
          type="button"
          onClick={handleRemove}
          disabled={disabled}
          aria-label="Hapus foto produk"
          className={cn(
            "absolute top-2 right-2 z-10",
            "flex items-center justify-center",
            "size-8 rounded-full",
            "bg-destructive/90 text-destructive-foreground",
            "opacity-0 group-hover:opacity-100 focus-visible:opacity-100",
            "hover:bg-destructive hover:scale-110",
            "transition-all duration-200",
            "shadow-lg backdrop-blur-sm",
            "disabled:opacity-50 disabled:cursor-not-allowed",
          )}
        >
          <X className="size-4" />
        </button>
      </div>
    );
  }

  return (
    <div
      {...getRootProps()}
      className={cn(
        "relative cursor-pointer rounded-xl border-2 border-dashed",
        "w-full aspect-video",
        "flex flex-col items-center justify-center gap-3",
        "transition-all duration-300 ease-out",
        isDragActive
          ? "border-primary bg-primary/5 scale-[1.02] shadow-lg shadow-primary/10"
          : "border-muted-foreground/25 bg-muted/20 hover:border-primary/50 hover:bg-muted/40",
        (disabled || isUploading) && "opacity-50 cursor-not-allowed",
        className,
      )}
    >
      <input {...getInputProps()} aria-label="Upload foto produk" />
      {isUploading ? (
        <>
          <div className="relative">
            <div className="absolute inset-0 rounded-full bg-primary/20 animate-ping" />
            <Loader2 className="size-10 text-primary animate-spin" />
          </div>
          <p className="text-sm text-muted-foreground font-medium">
            Mengupload foto...
          </p>
        </>
      ) : (
        <>
          <div
            className={cn(
              "rounded-full p-3 transition-colors duration-300",
              isDragActive
                ? "bg-primary/10 text-primary"
                : "bg-muted text-muted-foreground",
            )}
          >
            <ImagePlus className="size-8" />
          </div>
          <div className="text-center space-y-1 px-4">
            <p className="text-sm font-medium text-foreground">
              {isDragActive ? "Jatuhkan foto di sini" : "Drag & drop foto produk"}
            </p>
            <p className="text-xs text-muted-foreground">
              atau{" "}
              <span className="text-primary font-medium underline underline-offset-2">
                klik untuk pilih file
              </span>
            </p>
            <p className="text-xs text-muted-foreground/60">
              Tepat 1 foto • PNG, JPG, WEBP • Maks 4MB
            </p>
          </div>
        </>
      )}
    </div>
  );
}
