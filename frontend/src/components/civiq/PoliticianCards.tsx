"use client";

import { MotionReveal, staggerContainer, staggerItem } from "./MotionReveal";
import { motion } from "framer-motion";
import { CheckCircle, AlertTriangle } from "lucide-react";

export function PoliticianCards({ userBorough }: { userBorough?: string }) {
  // Placeholder mock data that the backend will eventually overwrite 
  // It actively filters down if the user has a Borough in their profile!
  const politicians = [
    {
      name: "Julie Won",
      office: "City Council, District 26",
      borough: "Queens",
      alignment: 82,
      stances: ["Housing", "Transit", "Education"],
      recent: "Sponsored universal pre-k expansion bill",
      matchColor: "bg-green-100 text-green-700 border-green-200"
    },
    {
      name: "Carlina Rivera",
      office: "City Council, District 2",
      borough: "Manhattan",
      alignment: 45,
      stances: ["Healthcare", "Environment"],
      recent: "Voted against recent rezoning package",
      matchColor: "bg-yellow-100 text-yellow-700 border-yellow-200"
    },
    {
      name: "Justin Brannan",
      office: "City Council, District 43",
      borough: "Brooklyn",
      alignment: 88,
      stances: ["Policing", "Labor"],
      recent: "Authored prevailing wage legislation",
      matchColor: "bg-green-100 text-green-700 border-green-200"
    }
  ];

  // Filter based on profile mapping
  const displayed = userBorough 
    ? politicians.filter(p => p.borough === userBorough || p.alignment > 80)
    : politicians;

  return (
    <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
      <MotionReveal>
        <div className="flex items-center justify-between">
          <h2 className="font-display text-2xl font-semibold tracking-tight text-[var(--foreground)] sm:text-3xl md:text-[2rem]">
            Local Representatives
          </h2>
          {userBorough && (
            <span className="text-xs font-semibold px-3 py-1 bg-[var(--accent)] text-white rounded-full uppercase tracking-widest shadow-sm">
              Filtered for {userBorough}
            </span>
          )}
        </div>
        <p className="mt-3 text-[var(--muted)] text-[15px] max-w-2xl">
          See how local politicians stack up against your specific tracked issues. Our backend maps their recent voting history directly against your civic interests.
        </p>
      </MotionReveal>

      <MotionReveal className="mt-10">
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-40px" }}
          variants={staggerContainer}
        >
          {displayed.map((p) => (
            <motion.div key={p.name} variants={staggerItem} className="glass-card p-6 flex flex-col rounded-2xl border border-[var(--border)] relative overflow-hidden group hover:-translate-y-1 transition duration-300">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="font-sans font-bold text-xl text-[var(--foreground)] leading-tight">{p.name}</h3>
                  <p className="text-sm font-medium text-[var(--muted)]">{p.office}</p>
                </div>
                <div className={`flex flex-col items-center justify-center w-12 h-12 rounded-xl border ${p.matchColor}`}>
                  <span className="font-bold text-lg leading-none">{p.alignment}%</span>
                  <span className="text-[9px] font-bold uppercase tracking-widest leading-none mt-0.5">Match</span>
                </div>
              </div>

              <div className="flex-1 space-y-4">
                <div>
                  <p className="text-xs font-semibold text-[var(--muted)] uppercase tracking-wider mb-2">Key Policy Stances</p>
                  <div className="flex flex-wrap gap-1.5">
                    {p.stances.map(s => (
                       <span key={s} className="px-2 py-0.5 bg-white border border-[var(--border)] rounded text-[11px] font-medium text-[var(--foreground)] shadow-sm">
                         {s}
                       </span>
                    ))}
                  </div>
                </div>

                <div className="pt-4 border-t border-[var(--border)]">
                  <p className="text-xs font-semibold text-[var(--muted)] uppercase tracking-wider mb-1">Recent Activity</p>
                  <p className="text-[13px] leading-snug">{p.recent}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </MotionReveal>
    </section>
  )
}
