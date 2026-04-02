"use client";

import { Rss } from "lucide-react";
import { motion } from "framer-motion";
import { MotionReveal, staggerContainer, staggerItem } from "./MotionReveal";

const updates = [
  {
    title: "Commercial waste zone pilot extension",
    neighborhood: "Brooklyn CB6",
    summary:
      "City sanitation is extending-comment deadlines on commercial carting routes affecting Atlantic Ave corridors.",
  },
  {
    title: "School seat planning hearing",
    neighborhood: "Queens District 26",
    summary:
      "DOE capacity study cites enrollment growth; a hearing schedule placeholder is posted for spring.",
  },
  {
    title: "Parks capital project scoping",
    neighborhood: "Bronx CB4",
    summary:
      "A playground renovation and greenway link are in early design; trees and ADA paths flagged in draft scope.",
  },
] as const;

export function RecentUpdates() {
  return (
    <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
      <MotionReveal>
        <div className="flex items-center gap-2">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/60 text-[var(--accent)] shadow-[0_4px_14px_-6px_rgba(91,127,163,0.25)] ring-1 ring-white/70">
            <Rss className="h-4 w-4" strokeWidth={1.65} aria-hidden />
          </span>
          <h2 className="font-display text-2xl font-semibold tracking-tight text-[var(--foreground)] sm:text-3xl md:text-[2rem]">
            Recent policy updates
          </h2>
        </div>
        <p className="mt-3 max-w-2xl text-[var(--muted)]">
          Placeholder feed—wire to your retrieval layer or RSS-style ingest.
        </p>
      </MotionReveal>
      <MotionReveal className="mt-10">
        <motion.ul
          className="glass-card divide-y divide-[var(--border)] overflow-hidden rounded-2xl md:rounded-3xl"
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-40px" }}
          variants={staggerContainer}
        >
          {updates.map((u) => (
            <motion.li
              key={u.title}
              variants={staggerItem}
              className="lift-row flex flex-col gap-2 px-6 py-6 transition-colors hover:bg-white/45 sm:flex-row sm:items-start sm:gap-8 md:px-8"
            >
              <div className="min-w-0 flex-1">
                <p className="font-display font-semibold text-[var(--foreground)]">{u.title}</p>
                <p className="mt-1 text-sm font-medium text-[var(--accent)]">{u.neighborhood}</p>
              </div>
              <p className="max-w-xl text-sm leading-relaxed text-[var(--muted)] sm:text-right">
                {u.summary}
              </p>
            </motion.li>
          ))}
        </motion.ul>
      </MotionReveal>
    </section>
  );
}
