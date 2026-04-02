"use client";

import {
  Building2,
  CalendarClock,
  FileText,
  Users,
} from "lucide-react";
import { motion } from "framer-motion";
import { MotionReveal, staggerContainer, staggerItem } from "./MotionReveal";

const placeholderSections = [
  {
    title: "Policy Summary",
    body: "A proposed rezoning along the corridor would allow mid-rise housing where only light industrial uses exist today. The city is weighing affordable set-asides and infrastructure upgrades before a formal vote.",
    Icon: FileText,
  },
  {
    title: "Key Stakeholders",
    body: "Community Board 3, NYC Department of City Planning, local business improvement district, and tenant advocates have each submitted testimony. Council District 34’s office is hosting an additional listening session next month.",
    Icon: Users,
  },
  {
    title: "Potential Local Impacts",
    body: "Nearby blocks could see increased construction activity, updated streetscape treatments, and revised loading rules. School capacity and transit crowding are flagged for follow-up analysis in the environmental assessment.",
    Icon: Building2,
  },
  {
    title: "Timeline",
    body: "Scoping comments due · Public hearing (placeholder date) · Draft scope release · Expected land use vote window: late year (placeholder).",
    Icon: CalendarClock,
  },
] as const;

export function PolicyBriefingPanel() {
  return (
    <section className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
      <MotionReveal>
        <h2 className="font-display text-2xl font-semibold tracking-tight text-[var(--foreground)] sm:text-3xl md:text-[2rem]">
          Policy briefing panel
        </h2>
        <p className="mt-3 max-w-2xl text-[var(--muted)]">
          Main feature panel—replace with live RAG output per location.
        </p>
      </MotionReveal>

      <MotionReveal className="mt-10">
        <div className="glass-card-strong lift-card rounded-3xl p-6 sm:p-10 md:rounded-[1.75rem]">
          <div className="flex flex-wrap items-center gap-3 border-b border-[var(--border)] pb-6">
            <span className="rounded-full bg-[linear-gradient(135deg,rgba(91,127,163,0.18)_0%,rgba(167,139,250,0.12)_100%)] px-3.5 py-1.5 text-xs font-semibold text-[var(--accent)] ring-1 ring-white/50">
              Sample briefing
            </span>
            <span className="text-sm text-[var(--muted)]">
              Astoria · ZIP 11103 · 2026-04-01
            </span>
          </div>
          <motion.div
            className="mt-8 grid gap-10 sm:gap-12"
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-40px" }}
            variants={staggerContainer}
          >
            {placeholderSections.map((s, i) => (
              <motion.div key={s.title} variants={staggerItem}>
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:gap-4">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/70 text-[var(--accent)] shadow-[0_2px_12px_-4px_rgba(91,127,163,0.2)] ring-1 ring-white/80">
                    <s.Icon className="h-[1.125rem] w-[1.125rem]" strokeWidth={1.65} aria-hidden />
                  </span>
                  <div className="min-w-0 flex-1">
                    <h3 className="font-display text-lg font-semibold text-[var(--foreground)]">
                      {s.title}
                    </h3>
                    <p className="mt-3 max-w-3xl text-sm leading-relaxed text-[var(--muted)] sm:text-[15px]">
                      {s.body}
                    </p>
                  </div>
                </div>
                {i < placeholderSections.length - 1 && (
                  <div className="mt-10 h-px bg-gradient-to-r from-transparent via-[var(--border)] to-transparent" />
                )}
              </motion.div>
            ))}
          </motion.div>
        </div>
      </MotionReveal>
    </section>
  );
}
