"use client";

import { useEffect, useState } from "react";
import ServicesAnimation from "@/components/ui/ServicesAnimation";

function stockholmTime(): string {
  return new Intl.DateTimeFormat("sv-SE", {
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "Europe/Stockholm",
  }).format(new Date());
}

/**
 * Availability status: fixed bottom-right chip with a live pulse dot and
 * local time. Click opens the services panel.
 */
export default function StatusChip() {
  const [showServices, setShowServices] = useState(false);
  // Rendered empty on the server to avoid hydration mismatch
  const [time, setTime] = useState("");

  useEffect(() => {
    setTime(stockholmTime());
    const interval = setInterval(() => setTime(stockholmTime()), 30_000);
    return () => clearInterval(interval);
  }, []);

  return (
    <>
      <button
        onClick={() => setShowServices(!showServices)}
        aria-expanded={showServices}
        className="fixed bottom-4 right-4 z-[80] flex items-center gap-2 rounded-full bg-brand-ink text-brand-paper pl-3 pr-4 py-2 text-[11px] uppercase tracking-[0.15em] shadow-lg hover:bg-black transition-colors"
      >
        <span className="relative flex w-2 h-2">
          <span className="motion-safe:animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-accent opacity-75" />
          <span className="relative inline-flex rounded-full w-2 h-2 bg-brand-accent" />
        </span>
        Open to work
        {time && (
          <span className="text-brand-paper/60 normal-case tracking-normal tabular-nums">
            · STHLM {time}
          </span>
        )}
      </button>
      <ServicesAnimation
        isVisible={showServices}
        onClose={() => setShowServices(false)}
      />
    </>
  );
}
