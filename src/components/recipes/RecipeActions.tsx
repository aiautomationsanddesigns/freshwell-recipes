"use client";

import { useState } from "react";
import { Heart, Share2, Download, Printer, Copy, Link2, Mail, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/hooks/useAuth";
import { useSavedRecipes } from "@/hooks/useSavedRecipes";
import { generateRecipePDF, recipeToText } from "@/lib/pdf-generator";
import type { Recipe } from "@/types";

interface RecipeActionsProps {
  recipe: Recipe;
  onRemove?: () => void;
  showRemove?: boolean;
  className?: string;
}

export function RecipeActions({ recipe, onRemove, showRemove, className }: RecipeActionsProps) {
  const { user } = useAuth();
  const { saveRecipe, unsaveRecipe, isRecipeSaved } = useSavedRecipes();
  const [shareMenuOpen, setShareMenuOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [shareMessage, setShareMessage] = useState<string | null>(null);
  const saved = isRecipeSaved(recipe.id);

  const handleSave = async () => {
    if (!user) {
      window.location.href = "/auth/login";
      return;
    }
    setSaving(true);
    if (saved) {
      await unsaveRecipe(recipe.id);
    } else {
      await saveRecipe(recipe);
    }
    setSaving(false);
  };

  const handleCopyText = async () => {
    const text = recipeToText(recipe);
    await navigator.clipboard.writeText(text);
    setShareMessage("Copied to clipboard!");
    setTimeout(() => setShareMessage(null), 2000);
    setShareMenuOpen(false);
  };

  const handleCopyLink = async () => {
    try {
      const res = await fetch("/api/recipes/share", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ recipe }),
      });
      const data = await res.json();
      if (data.shareUrl) {
        await navigator.clipboard.writeText(data.shareUrl);
        setShareMessage("Share link copied!");
      } else {
        setShareMessage("Failed to create link");
      }
    } catch {
      setShareMessage("Failed to create link");
    }
    setTimeout(() => setShareMessage(null), 2000);
    setShareMenuOpen(false);
  };

  const handleEmail = async () => {
    const text = recipeToText(recipe);
    const subject = encodeURIComponent(`Freshwell Recipe: ${recipe.title}`);
    const body = encodeURIComponent(text);
    window.open(`mailto:?subject=${subject}&body=${body}`, "_blank");
    setShareMenuOpen(false);
  };

  const handlePDF = () => {
    generateRecipePDF(recipe);
    setShareMenuOpen(false);
  };

  const handlePrint = () => {
    // Set up a print-friendly version
    const text = recipeToText(recipe);
    const printWindow = window.open("", "_blank");
    if (printWindow) {
      printWindow.document.write(`<pre style="font-family: system-ui; max-width: 600px; margin: 40px auto; line-height: 1.6;">${text}</pre>`);
      printWindow.document.close();
      printWindow.print();
    }
    setShareMenuOpen(false);
  };

  return (
    <div className={cn("flex items-center gap-1 relative", className)}>
      {/* Save */}
      <button
        onClick={(e) => { e.stopPropagation(); handleSave(); }}
        disabled={saving}
        className={cn(
          "rounded-lg p-2 transition-colors cursor-pointer",
          saved ? "text-red-500 hover:bg-red-50" : "text-gray-400 hover:text-red-500 hover:bg-gray-100"
        )}
        title={saved ? "Unsave" : "Save recipe"}
      >
        <Heart className={cn("h-4 w-4", saved && "fill-current")} />
      </button>

      {/* Share */}
      <div className="relative">
        <button
          onClick={(e) => { e.stopPropagation(); setShareMenuOpen(!shareMenuOpen); }}
          className="rounded-lg p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors cursor-pointer"
          title="Share"
        >
          <Share2 className="h-4 w-4" />
        </button>

        {shareMenuOpen && (
          <div className="absolute bottom-full right-0 mb-1 w-48 rounded-xl border border-gray-200 bg-white shadow-lg py-1 z-50"
            onClick={(e) => e.stopPropagation()}
          >
            <button onClick={handleCopyLink} className="flex items-center gap-2 w-full px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 cursor-pointer">
              <Link2 className="h-3.5 w-3.5" /> Copy Link
            </button>
            <button onClick={handleCopyText} className="flex items-center gap-2 w-full px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 cursor-pointer">
              <Copy className="h-3.5 w-3.5" /> Copy as Text
            </button>
            <button onClick={handlePDF} className="flex items-center gap-2 w-full px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 cursor-pointer">
              <Download className="h-3.5 w-3.5" /> Download PDF
            </button>
            <button onClick={handleEmail} className="flex items-center gap-2 w-full px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 cursor-pointer">
              <Mail className="h-3.5 w-3.5" /> Email
            </button>
            <button onClick={handlePrint} className="flex items-center gap-2 w-full px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 cursor-pointer">
              <Printer className="h-3.5 w-3.5" /> Print
            </button>
          </div>
        )}
      </div>

      {/* Remove */}
      {showRemove && onRemove && (
        <button
          onClick={(e) => { e.stopPropagation(); onRemove(); }}
          className="rounded-lg p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors cursor-pointer"
          title="Remove"
        >
          <X className="h-4 w-4" />
        </button>
      )}

      {/* Toast */}
      {shareMessage && (
        <div className="absolute -top-10 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-lg bg-gray-900 px-3 py-1.5 text-xs text-white shadow-lg">
          {shareMessage}
        </div>
      )}
    </div>
  );
}
