"use client";
import Link from "next/link";
import { useState } from "react";
import { SettingsModal } from "./SettingsModal";
import { useProfile } from "@/lib/useProfile";

export function Header() {
  const [showSettings, setShowSettings] = useState(false);
  const { profile } = useProfile();

  return (
    <>
      <header className="sticky top-0 z-50 border-b border-white/45 bg-[linear-gradient(180deg,rgba(255,255,255,0.76)_0%,rgba(255,255,255,0.52)_100%)] shadow-[0_4px_24px_-12px_rgba(30,42,51,0.08)] backdrop-blur-2xl backdrop-saturate-150">
        <div className="mx-auto flex h-[3.35rem] max-w-6xl items-center justify-between px-4 sm:h-14 sm:px-6 lg:px-8">
          <Link
            href="/"
            className="flex items-center gap-2 transition hover:opacity-85"
          >
            <span className="logo-clip flex-shrink-0"></span>
            <span className="font-display text-2xl tracking-widest text-[var(--foreground)] uppercase mt-1">
              Civic <span className="text-[var(--accent)]">Spiegel</span>
            </span>
          </Link>
          <div className="flex items-center gap-4">
            <p className="hidden font-condensed text-sm font-semibold tracking-wide uppercase text-[var(--muted)] sm:block">
              NY Policy Assistant
            </p>
            <button
              onClick={() => setShowSettings(true)}
              className="text-xs font-semibold text-[var(--accent)] border border-[var(--accent)]/30 rounded-full px-4 py-1.5 hover:bg-[var(--accent)] hover:text-white transition tracking-wide uppercase"
            >
              Settings
            </button>
          </div>
        </div>
      </header>
      {showSettings && (
        <SettingsModal
          isOpen={showSettings}
          onClose={() => setShowSettings(false)}
        />
      )}
    </>
  );
}
