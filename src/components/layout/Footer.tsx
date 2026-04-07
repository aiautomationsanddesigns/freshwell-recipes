import { Leaf } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-gray-100 bg-gray-50">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
        <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-between">
          <div className="flex items-center gap-2 text-gray-500">
            <Leaf className="h-4 w-4 text-emerald-600" />
            <span className="text-sm">
              Based on the <strong>Freshwell Low Carb</strong> principles
            </span>
          </div>
          <p className="text-xs text-gray-400">
            This app is for informational purposes only. Always consult your doctor before making dietary changes.
          </p>
        </div>
      </div>
    </footer>
  );
}
