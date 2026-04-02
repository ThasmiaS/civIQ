"use client";

import { BookOpen, MapPin, Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import { MotionReveal, staggerContainer, staggerItem } from "./MotionReveal";

const steps = [
  {
    title: "Find Your Location",
    body: "Enter a neighborhood or ZIP. We anchor briefings to your block group context.",
    Icon: MapPin,
  },
  {
    title: "Retrieve Local Policies",
    body: "Relevant resolutions, hearings, and agency notices are gathered from open civic data.",
    Icon: BookOpen,
  },
  {
    title: "AI-Generated Briefing",
    body: "Plain-language summaries highlight what changed, who it involves, and what it could mean locally.",
    Icon: Sparkles,
  },
] as const;

export function HowItWorks() {
  return (
    <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
      <MotionReveal>
        <h2 className="font-display text-2xl font-semibold tracking-tight text-[var(--foreground)] sm:text-3xl md:text-[2rem]">
          How it works
        </h2>
        <p className="mt-3 max-w-2xl text-[var(--muted)]">
          Three steps from your address to a readable briefing—no accounts required.
        </p>
      </MotionReveal>
      <motion.div
        className="mt-12 grid gap-6 md:grid-cols-3"
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "-60px", amount: 0.12 }}
        variants={staggerContainer}
      >
        {steps.map((step) => (
          <motion.article
            key={step.title}
            variants={staggerItem}
            className="glass-card lift-card flex h-full flex-col rounded-2xl p-7 md:rounded-3xl"
          >
            <span className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-[linear-gradient(145deg,rgba(91,127,163,0.14)_0%,rgba(167,139,250,0.1)_100%)] text-[var(--accent)] ring-1 ring-white/60 shadow-[0_4px_16px_-6px_rgba(91,127,163,0.25)]">
              <step.Icon className="h-5 w-5 opacity-90" strokeWidth={1.65} aria-hidden />
            </span>
            <h3 className="font-display mt-5 text-lg font-semibold text-[var(--foreground)]">
              {step.title}
            </h3>
            <p className="mt-3 text-sm leading-relaxed text-[var(--muted)]">{step.body}</p>
          </motion.article>
        ))}
      </motion.div>
    </section>
  );
}
