"use client";

import { MapPinned } from "lucide-react";
import { MotionReveal } from "./MotionReveal";

export function MapPanel() {
  return (
    <section className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
      <MotionReveal>
        <h2 className="font-display text-2xl font-semibold tracking-tight text-[var(--foreground)] sm:text-3xl md:text-[2rem]">
          Policies near you
        </h2>
        <p className="mt-3 max-w-2xl text-[var(--muted)]">
          Map integration placeholder—drop in Mapbox, Leaflet, or NYC Planning Labs basemap.
        </p>
      </MotionReveal>
      <MotionReveal className="mt-10">
        <div className="glass-card lift-card relative flex min-h-[300px] items-center justify-center overflow-hidden rounded-2xl sm:min-h-[380px] md:rounded-3xl">
          <div
            className="absolute inset-0 opacity-[0.14]"
            style={{
              backgroundImage: `
                linear-gradient(90deg, var(--accent-soft) 1px, transparent 1px),
                linear-gradient(var(--accent-soft) 1px, transparent 1px)
              `,
              backgroundSize: "48px 48px",
            }}
            aria-hidden
          />
          <div className="relative z-[1] flex flex-col items-center rounded-2xl border border-dashed border-[var(--accent)]/40 bg-white/55 px-8 py-10 text-center shadow-[0_8px_32px_-12px_rgba(91,127,163,0.15)] backdrop-blur-md md:rounded-3xl md:px-12 md:py-12">
            <span className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-[linear-gradient(145deg,rgba(91,127,163,0.15)_0%,rgba(167,139,250,0.12)_100%)] text-[var(--accent)] ring-1 ring-white/70">
              <MapPinned className="h-6 w-6" strokeWidth={1.5} aria-hidden />
            </span>
            <p className="font-display text-lg font-semibold text-[var(--foreground)] sm:text-xl">
              Policies Near You
            </p>
            <p className="mt-2 max-w-sm text-sm leading-relaxed text-[var(--muted)]">
              Interactive map will render policy pins for the selected location.
            </p>
          </div>
        </div>
      </MotionReveal>
    </section>
  );
}
