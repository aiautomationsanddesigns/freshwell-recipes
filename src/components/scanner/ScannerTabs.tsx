"use client";

import { useState, useEffect } from "react";
import { Upload, Camera } from "lucide-react";
import { cn } from "@/lib/utils";
import { ImageUpload } from "@/components/ui/ImageUpload";
import { CameraCapture } from "./CameraCapture";

interface ScannerTabsProps {
  onImageSelect: (file: File) => void;
  preview: string | null;
  onClear: () => void;
}

type Tab = "upload" | "camera";

export function ScannerTabs({ onImageSelect, preview, onClear }: ScannerTabsProps) {
  const [activeTab, setActiveTab] = useState<Tab>("upload");
  const [hasCamera, setHasCamera] = useState(false);

  useEffect(() => {
    if (typeof navigator !== "undefined" && navigator.mediaDevices && typeof navigator.mediaDevices.getUserMedia === "function") {
      setHasCamera(true);
    }
  }, []);

  const tabs: { id: Tab; label: string; icon: React.ElementType }[] = [
    { id: "upload", label: "Upload Photo", icon: Upload },
    ...(hasCamera
      ? [{ id: "camera" as Tab, label: "Take Photo", icon: Camera }]
      : []),
  ];

  return (
    <div className="space-y-4">
      {/* Tab buttons */}
      <div className="flex gap-1 rounded-xl bg-gray-100 p-1">
        {tabs.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => setActiveTab(id)}
            className={cn(
              "flex-1 flex items-center justify-center gap-2 rounded-lg py-2.5 text-sm font-medium transition-all cursor-pointer",
              activeTab === id
                ? "bg-white text-gray-900 shadow-sm"
                : "text-gray-500 hover:text-gray-700"
            )}
          >
            <Icon className="h-4 w-4" />
            {label}
          </button>
        ))}
      </div>

      {/* Tab content */}
      {activeTab === "upload" && (
        <ImageUpload
          onImageSelect={onImageSelect}
          preview={preview}
          onClear={onClear}
        />
      )}
      {activeTab === "camera" && !preview && (
        <CameraCapture onCapture={onImageSelect} />
      )}
      {activeTab === "camera" && preview && (
        <ImageUpload
          onImageSelect={onImageSelect}
          preview={preview}
          onClear={onClear}
        />
      )}
    </div>
  );
}
