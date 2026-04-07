"use client";

import { useState, useRef, useCallback } from "react";
import { Upload, X, Image as ImageIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface ImageUploadProps {
  onImageSelect: (file: File) => void;
  preview?: string | null;
  onClear?: () => void;
  className?: string;
  accept?: string;
  maxSizeMB?: number;
}

export function ImageUpload({
  onImageSelect,
  preview,
  onClear,
  className,
  accept = "image/jpeg,image/png,image/webp",
  maxSizeMB = 10,
}: ImageUploadProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const validateAndSelect = useCallback(
    (file: File) => {
      setError(null);
      if (file.size > maxSizeMB * 1024 * 1024) {
        setError(`File too large. Max size is ${maxSizeMB}MB.`);
        return;
      }
      if (!file.type.startsWith("image/")) {
        setError("Please upload an image file.");
        return;
      }
      onImageSelect(file);
    },
    [onImageSelect, maxSizeMB]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      const file = e.dataTransfer.files[0];
      if (file) validateAndSelect(file);
    },
    [validateAndSelect]
  );

  if (preview) {
    return (
      <div className={cn("relative rounded-2xl overflow-hidden border border-gray-200", className)}>
        <img src={preview} alt="Preview" className="w-full h-64 object-cover" />
        {onClear && (
          <button
            onClick={onClear}
            className="absolute top-3 right-3 rounded-full bg-black/50 p-2 text-white hover:bg-black/70 transition-colors cursor-pointer"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>
    );
  }

  return (
    <div className={cn("space-y-2", className)}>
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={cn(
          "flex flex-col items-center justify-center gap-3 rounded-2xl border-2 border-dashed p-8 transition-all cursor-pointer",
          isDragging
            ? "border-emerald-500 bg-emerald-50"
            : "border-gray-300 bg-gray-50 hover:border-gray-400 hover:bg-gray-100"
        )}
      >
        <div className={cn(
          "rounded-full p-3",
          isDragging ? "bg-emerald-100" : "bg-gray-200"
        )}>
          {isDragging ? (
            <Upload className="h-6 w-6 text-emerald-600" />
          ) : (
            <ImageIcon className="h-6 w-6 text-gray-500" />
          )}
        </div>
        <div className="text-center">
          <p className="text-sm font-medium text-gray-700">
            {isDragging ? "Drop your image here" : "Drag & drop an image, or click to browse"}
          </p>
          <p className="mt-1 text-xs text-gray-500">JPG, PNG, WebP up to {maxSizeMB}MB</p>
        </div>
        <input
          ref={fileInputRef}
          type="file"
          accept={accept}
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) validateAndSelect(file);
          }}
          className="hidden"
        />
      </div>
      {error && <p className="text-sm text-red-600">{error}</p>}
    </div>
  );
}
