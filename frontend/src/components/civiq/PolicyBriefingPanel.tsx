"use client";

import {
  FileText,
  Globe2,
  Lightbulb,
  ListChecks,
  Users,
} from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { MotionReveal, staggerContainer, staggerItem } from "./MotionReveal";
import type { PolicyResponse } from "@/lib/api";

type PolicyBriefingPanelProps = {
  loading: boolean;
  error: string | null;
  response: PolicyResponse | null;
  briefingQuery: string;
};

export function PolicyBriefingPanel({
  loading,
  error,
  response,
  briefingQuery,
}: PolicyBriefingPanelProps) {
  const skylineGifSrc = "/skyline.gif";
  const emptyStateRef = useRef<HTMLDivElement | null>(null);
  const [shouldLoadSkyline, setShouldLoadSkyline] = useState(false);
  const showBriefing = Boolean(response && !loading);
  const safe = {
    at_a_glance: response?.at_a_glance ?? [],
    key_takeaways: response?.key_takeaways ?? [],
    what_this_means: response?.what_this_means ?? [],
    relevant_actions: response?.relevant_actions ?? [],
    sources: response?.sources ?? [],
  };

  const structuredSections = [
    {
      key: "key_takeaways",
      title: "Key takeaways",
      items: safe.key_takeaways,
      Icon: Lightbulb,
    },
    {
      key: "what_this_means",
      title: "What this means for you",
      items: safe.what_this_means,
      Icon: Users,
    },
    {
      key: "relevant_actions",
      title: "Relevant actions",
      items: safe.relevant_actions,
      Icon: ListChecks,
    },
  ] as const;

  useEffect(() => {
    // #region agent log
    fetch("http://127.0.0.1:7325/ingest/a1f542d3-daba-482f-ae57-9ad654187441", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Debug-Session-Id": "438df4",
      },
      body: JSON.stringify({
        sessionId: "438df4",
        runId: "pre-fix",
        hypothesisId: "H2",
        location: "PolicyBriefingPanel.tsx:observerEffect",
        message: "Observer effect evaluated",
        data: { loading, showBriefing, shouldLoadSkyline, hasTarget: Boolean(emptyStateRef.current) },
        timestamp: Date.now(),
      }),
    }).catch(() => {});
    // #endregion

    if (loading || showBriefing || shouldLoadSkyline) return;
    const target = emptyStateRef.current;
    if (!target) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        // #region agent log
        fetch("http://127.0.0.1:7325/ingest/a1f542d3-daba-482f-ae57-9ad654187441", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "X-Debug-Session-Id": "438df4",
          },
          body: JSON.stringify({
            sessionId: "438df4",
            runId: "pre-fix",
            hypothesisId: "H3",
            location: "PolicyBriefingPanel.tsx:intersectionCallback",
            message: "Intersection observer callback",
            data: { isIntersecting: entry.isIntersecting, ratio: entry.intersectionRatio },
            timestamp: Date.now(),
          }),
        }).catch(() => {});
        // #endregion

        if (!entry.isIntersecting) return;
        setShouldLoadSkyline(true);
        observer.disconnect();
      },
      { threshold: 0.35 },
    );

    observer.observe(target);
    return () => observer.disconnect();
  }, [loading, showBriefing, shouldLoadSkyline]);

  return (
    <section className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
      {error ? (
        <div
          className="mb-6 rounded-2xl border border-red-200/80 bg-red-50/90 px-4 py-3 text-sm text-red-900 shadow-[0_4px_20px_-8px_rgba(180,40,40,0.12)] backdrop-blur-sm"
          role="alert"
        >
          <span className="font-semibold">Policy data unavailable. </span>
          <span className="font-normal">{error}</span>
          {process.env.NODE_ENV === "development" ? (
            <p className="mt-2 text-xs font-normal text-red-800/90">
              Tip: start FastAPI{" "}
              <code className="rounded bg-red-100 px-1">python -m uvicorn main:app --reload</code>{" "}
              in <code className="rounded bg-red-100 px-1">backend/</code> (port 8000). Set{" "}
              <code className="rounded bg-red-100 px-1">API_INTERNAL_BASE_URL</code> (or{" "}
              <code className="rounded bg-red-100 px-1">NEXT_PUBLIC_API_BASE_URL</code>) in{" "}
              <code className="rounded bg-red-100 px-1">frontend/.env.local</code> for the proxy.
            </p>
          ) : null}
        </div>
      ) : null}

      <MotionReveal>
        <h2 className="font-display text-2xl font-semibold tracking-[1.5px] text-[var(--foreground)] sm:text-3xl md:text-[2rem]">
          {showBriefing ? "Policy Briefing" : "Policy briefing"}
        </h2>
        {showBriefing ? (
          <p className="mt-3 max-w-2xl text-[var(--muted)]">
            Based on your question:{" "}
            <span className="font-medium text-[var(--foreground)]">
              {briefingQuery}
            </span>
          </p>
        ) : null}
      </MotionReveal>

      <MotionReveal className="mt-10">
        <div className="glass-card-strong lift-card rounded-3xl p-6 sm:p-10 md:rounded-[1.75rem]">
          <AnimatePresence mode="wait">
            {loading ? (
              <motion.div
                key="loading"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="flex min-h-[200px] flex-col items-center justify-center gap-3 py-12 text-center"
              >
                <p className="font-display text-lg font-semibold text-[var(--foreground)]">
                  Generating your policy briefing...
                </p>
                <p className="max-w-md text-[15px] text-black">
                  Gathering relevant policy context and local insights.
                </p>
              </motion.div>
            ) : showBriefing ? (
              <motion.div
                key="briefing"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.35 }}
              >
              <div className="flex flex-wrap items-center gap-3 border-b border-[var(--border)] pb-6">
                <span className="rounded-full bg-[linear-gradient(135deg,rgba(91,127,163,0.18)_0%,rgba(167,139,250,0.12)_100%)] px-3.5 py-1.5 text-xs font-semibold text-[var(--accent)] ring-1 ring-white/50">
                  Briefing ready
                </span>
              </div>

              <div className="mt-8 border-b border-[var(--border)] pb-10">
                <div className="flex items-center gap-3">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/70 text-[var(--accent)] shadow-[0_2px_12px_-4px_rgba(91,127,163,0.2)] ring-1 ring-white/80">
                    <FileText className="h-[1.125rem] w-[1.125rem]" strokeWidth={1.65} aria-hidden />
                  </span>
                  <h3 className="text-[15px] font-semibold tracking-[0.08em] text-black">
                    Policy overview
                  </h3>
                </div>
                <ul className="mt-4 space-y-2 pl-[3.25rem] text-[15px] leading-relaxed text-black">
                  {safe.at_a_glance.map((item, index) => (
                    <li key={`glance-${index}`} className="flex gap-2 leading-relaxed">
                      <span className="mt-1 text-[var(--accent)]">•</span>
                      <span className="text-[var(--color-black)]">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <motion.div
                className="mt-10 grid gap-10 sm:gap-12"
                initial="hidden"
                whileInView="show"
                viewport={{ once: true, margin: "-40px" }}
                variants={staggerContainer}
              >
                {structuredSections.map((s, i) => (
                    <motion.div key={s.title} variants={staggerItem}>
                      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:gap-4">
                        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/70 text-[var(--accent)] shadow-[0_2px_12px_-4px_rgba(91,127,163,0.2)] ring-1 ring-white/80">
                          <s.Icon
                            className="h-[1.125rem] w-[1.125rem]"
                            strokeWidth={1.65}
                            aria-hidden
                          />
                        </span>
                        <div className="min-w-0 flex-1">
                          <h3 className="text-[15px] font-semibold tracking-[0.08em] text-black">
                            {s.title}
                          </h3>
                          <ul className="mt-3 max-w-3xl space-y-2 text-[15px] leading-relaxed text-black">
                            {s.items.map((item, itemIndex) => (
                              <li key={`${s.key}-${itemIndex}`} className="flex gap-2">
                                <span className="text-[var(--accent)]">•</span>
                                <span>{item}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                      {i < structuredSections.length - 1 ? (
                        <div className="mt-10 h-px bg-gradient-to-r from-transparent via-[var(--border)] to-transparent" />
                      ) : null}
                    </motion.div>
                ))}
              </motion.div>

              {safe.sources.length > 0 ? (
                <div className="mt-10 border-t border-[var(--border)] pt-10">
                  <div className="flex items-center gap-3">
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/70 text-[var(--accent)] shadow-[0_2px_12px_-4px_rgba(91,127,163,0.2)] ring-1 ring-white/80">
                      <Globe2 className="h-[1.125rem] w-[1.125rem]" strokeWidth={1.65} aria-hidden />
                    </span>
                    <h3 className="text-[15px] font-semibold tracking-[0.08em] text-black">
                      Sources
                    </h3>
                  </div>
                  <ul className="mt-4 space-y-3 pl-[3.25rem] text-[15px] text-black">
                    {safe.sources.map((source, i) => (
                      <li
                        key={i}
                        className="border-l-2 border-[var(--accent)]/25 pl-3"
                      >
                        <p className="font-semibold text-black">{source.title}</p>
                        <p className="mt-1 text-[15px] leading-relaxed text-black">
                          {source.description}
                        </p>
                      </li>
                    ))}
                  </ul>
                </div>
              ) : null}
              </motion.div>
            ) : (
              <motion.div
                key="empty"
                ref={emptyStateRef}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.35 }}
                className="mx-auto flex h-full w-full max-w-[960px] items-center justify-center py-4 sm:py-6"
              >
                {shouldLoadSkyline ? (
                  <img
                    src={skylineGifSrc}
                    alt="Animated skyline"
                    className="h-full w-full rounded-2xl object-cover object-center"
                    style={{ width: "900px", height: "620px" }}
                    onLoad={() => {
                          // #region agent log
                          fetch("http://127.0.0.1:7325/ingest/a1f542d3-daba-482f-ae57-9ad654187441", {
                            method: "POST",
                            headers: {
                              "Content-Type": "application/json",
                              "X-Debug-Session-Id": "438df4",
                            },
                            body: JSON.stringify({
                              sessionId: "438df4",
                              runId: "pre-fix",
                              hypothesisId: "H4",
                              location: "PolicyBriefingPanel.tsx:imgOnLoad",
                              message: "Skyline image loaded",
                              data: { src: skylineGifSrc },
                              timestamp: Date.now(),
                            }),
                          }).catch(() => {});
                          // #endregion
                        }}
                    onError={() => {
                          // #region agent log
                          fetch("http://127.0.0.1:7325/ingest/a1f542d3-daba-482f-ae57-9ad654187441", {
                            method: "POST",
                            headers: {
                              "Content-Type": "application/json",
                              "X-Debug-Session-Id": "438df4",
                            },
                            body: JSON.stringify({
                              sessionId: "438df4",
                              runId: "pre-fix",
                              hypothesisId: "H1",
                              location: "PolicyBriefingPanel.tsx:imgOnError",
                              message: "Skyline image failed to load",
                              data: { src: skylineGifSrc },
                              timestamp: Date.now(),
                            }),
                          }).catch(() => {});
                          // #endregion
                    }}
                  />
                ) : (
                  <div className="p-6 text-center text-sm text-[var(--muted)]">
                    Scroll to start skyline preview
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </MotionReveal>
    </section>
  );
}
