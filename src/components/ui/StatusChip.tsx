"use client";

import { useEffect, useState } from "react";
import ServicesAnimation from "@/components/ui/ServicesAnimation";

function localTime(): string {
  return new Intl.DateTimeFormat("sv-SE", {
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "Europe/Stockholm", // Trollhättan shares Sweden's timezone
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
  // Narrative time from the homepage day cycle overrides the real clock
  const [narrativeTime, setNarrativeTime] = useState<string | null>(null);

  useEffect(() => {
    setTime(localTime());
    const interval = setInterval(() => setTime(localTime()), 30_000);

    const onCycleTime = (e: Event) => {
      const minutes = (e as CustomEvent<number>).detail;
      const hh = String(Math.floor(minutes / 60)).padStart(2, "0");
      const mm = String(minutes % 60).padStart(2, "0");
      setNarrativeTime(`${hh}:${mm}`);
    };
    const onCycleEnd = () => setNarrativeTime(null);

    window.addEventListener("daycycle:time", onCycleTime);
    window.addEventListener("daycycle:end", onCycleEnd);
    return () => {
      clearInterval(interval);
      window.removeEventListener("daycycle:time", onCycleTime);
      window.removeEventListener("daycycle:end", onCycleEnd);
    };
  }, []);

  const displayTime = narrativeTime ?? time;

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
        {displayTime && (
          <span className="text-brand-paper/60 normal-case tracking-normal tabular-nums">
            · Trollhättan {displayTime}
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
