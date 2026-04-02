"use client";

import { useEffect, useState } from "react";

export function ParallaxBackdrop() {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const onScroll = () => setScrollY(window.scrollY);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div
      className="pointer-events-none fixed inset-0 z-0 overflow-hidden"
      aria-hidden
    >
      {/* Slow layer: base wash + grid tint */}
      <div
        className="absolute inset-0 bg-[var(--background)]"
        style={{ transform: `translate3d(0, ${scrollY * 0.035}px, 0)` }}
      />
      <div
        className="absolute inset-0 opacity-90"
        style={{
          transform: `translate3d(0, ${scrollY * 0.045}px, 0)`,
          background: `
            radial-gradient(ellipse 100% 80% at 50% -20%, rgba(167, 139, 250, 0.14), transparent 55%),
            radial-gradient(ellipse 70% 50% at 100% 30%, rgba(91, 127, 163, 0.12), transparent 50%),
            radial-gradient(ellipse 55% 45% at 0% 85%, rgba(232, 121, 166, 0.1), transparent 50%)
          `,
        }}
      />

      {/* Mid layer: drifting orbs + extra parallax */}
      <div
        className="absolute inset-[-20%] h-[140%] w-[120%] left-[-10%]"
        style={{ transform: `translate3d(0, ${scrollY * 0.085}px, 0)` }}
      >
        <div className="blob blob-a absolute top-[6%] left-[5%] h-[min(420px,45vw)] w-[min(420px,45vw)] rounded-full bg-[radial-gradient(circle_at_30%_30%,rgba(147,197,253,0.45),rgba(91,127,163,0.15)_45%,transparent_70%)] blur-3xl" />
        <div className="blob blob-b absolute top-[38%] right-[2%] h-[min(380px,40vw)] w-[min(380px,40vw)] rounded-full bg-[radial-gradient(circle_at_70%_40%,rgba(196,181,253,0.38),rgba(167,139,250,0.12)_50%,transparent_72%)] blur-3xl" />
        <div className="blob blob-c absolute bottom-[5%] left-[28%] h-[min(480px,50vw)] w-[min(480px,50vw)] rounded-full bg-[radial-gradient(circle_at_50%_50%,rgba(251,182,206,0.32),rgba(232,121,166,0.08)_55%,transparent_75%)] blur-3xl" />
        <div className="blob blob-d absolute top-[52%] left-[-6%] h-[min(280px,30vw)] w-[min(280px,30vw)] rounded-full bg-[radial-gradient(circle_at_center,rgba(125,211,252,0.25),transparent_65%)] blur-3xl opacity-80" />
      </div>

      {/* Foreground noise veil — barely moves; keeps UI feeling grounded */}
      <div
        className="absolute inset-0 opacity-[0.45]"
        style={{
          transform: `translate3d(0, ${scrollY * 0.015}px, 0)`,
          backgroundImage: `radial-gradient(rgba(30,42,51,0.03) 1px, transparent 1px)`,
          backgroundSize: "24px 24px",
        }}
      />
    </div>
  );
}
