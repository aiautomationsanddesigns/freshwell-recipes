"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { User, LogOut, Heart, ChevronDown } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

export function UserMenu() {
  const { user, loading, signOut } = useAuth();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  if (loading) {
    return <div className="h-9 w-20 rounded-lg bg-gray-100 animate-pulse" />;
  }

  if (!user) {
    return (
      <Link
        href="/auth/login"
        className="rounded-lg px-4 py-2 text-sm font-medium text-emerald-600 border border-emerald-200 hover:bg-emerald-50 transition-colors"
      >
        Sign In
      </Link>
    );
  }

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 transition-colors cursor-pointer"
      >
        <div className="flex h-7 w-7 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
          <User className="h-3.5 w-3.5" />
        </div>
        <ChevronDown className="h-3.5 w-3.5" />
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-1 w-56 rounded-xl border border-gray-200 bg-white shadow-lg py-1 z-50">
          <div className="px-4 py-2 border-b border-gray-100">
            <p className="text-xs text-gray-500 truncate">{user.email}</p>
          </div>
          <Link
            href="/saved"
            onClick={() => setOpen(false)}
            className="flex items-center gap-2 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
          >
            <Heart className="h-4 w-4" />
            Saved Recipes
          </Link>
          <button
            onClick={() => {
              signOut();
              setOpen(false);
            }}
            className="flex items-center gap-2 w-full px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors cursor-pointer"
          >
            <LogOut className="h-4 w-4" />
            Sign Out
          </button>
        </div>
      )}
    </div>
  );
}
