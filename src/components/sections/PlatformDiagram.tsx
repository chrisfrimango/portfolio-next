"use client";

import { useEffect, useRef } from "react";
import { prefersReducedMotion } from "@/lib/motion";

/**
 * Kraftverket — an abstract portrait of the platform: one glowing core (shared
 * infrastructure) with ~18 service nodes wired to it, ember pulses running the
 * connections like data through a power plant. Warm greyscale on the cinematic
 * ink frame. Canvas for the many moving pulses; static under reduced motion and
 * paused when off-screen.
 */
const ACCENT = "#ff3b00";
const NODE = "rgba(246,243,237,0.82)";
const LINE = "rgba(246,243,237,0.12)";
const CROSS = "rgba(246,243,237,0.05)";
const N = 18;
const GOLDEN = Math.PI * (3 - Math.sqrt(5));

type Node = { bx: number; by: number; r: number; phase: number; amp: number };

export default function PlatformDiagram() {
  const wrapRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const wrap = wrapRef.current;
    if (!canvas || !wrap) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reduced = prefersReducedMotion();
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    let W = 0;
    let H = 0;
    const core = { x: 0, y: 0 };
    let nodes: Node[] = [];
    const cross: [number, number][] = [];
    let pulses: { i: number; t: number; speed: number }[] = [];

    const layout = () => {
      const rect = wrap.getBoundingClientRect();
      W = rect.width;
      H = rect.height;
      canvas.width = Math.round(W * dpr);
      canvas.height = Math.round(H * dpr);
      canvas.style.width = `${W}px`;
      canvas.style.height = `${H}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      core.x = W * 0.5;
      core.y = H * 0.52;
      const rx = W * 0.44;
      const ry = H * 0.4;
      nodes = [];
      for (let i = 0; i < N; i++) {
        const a = i * GOLDEN;
        const s = Math.sqrt((i + 0.7) / N);
        nodes.push({
          bx: core.x + Math.cos(a) * rx * s,
          by: core.y + Math.sin(a) * ry * s,
          r: 1.8 + (i % 4 === 0 ? 1.8 : 0.7),
          phase: (i * 1.7) % (Math.PI * 2),
          amp: 2 + (i % 5),
        });
      }
      cross.length = 0;
      for (let i = 0; i < N; i++) {
        const j = (i + 1 + (i % 3)) % N;
        if (i < j) cross.push([i, j]);
      }
      pulses = nodes.map((_, i) => ({
        i,
        t: i / N,
        speed: 0.12 + ((i * 37) % 13) / 100,
      }));
    };

    const pos = (i: number, time: number) => {
      const n = nodes[i];
      const o = reduced ? 0 : Math.sin(time * 0.0009 + n.phase) * n.amp;
      return { x: n.bx + o, y: n.by + o * 0.55 };
    };

    const draw = (time: number) => {
      ctx.clearRect(0, 0, W, H);

      ctx.lineWidth = 1;
      ctx.strokeStyle = LINE;
      for (let i = 0; i < N; i++) {
        const p = pos(i, time);
        ctx.beginPath();
        ctx.moveTo(core.x, core.y);
        ctx.lineTo(p.x, p.y);
        ctx.stroke();
      }

      ctx.strokeStyle = CROSS;
      for (const [a, b] of cross) {
        const pa = pos(a, time);
        const pb = pos(b, time);
        ctx.beginPath();
        ctx.moveTo(pa.x, pa.y);
        ctx.lineTo(pb.x, pb.y);
        ctx.stroke();
      }

      for (const pl of pulses) {
        const p = pos(pl.i, time);
        const x = core.x + (p.x - core.x) * pl.t;
        const y = core.y + (p.y - core.y) * pl.t;
        ctx.globalAlpha = 0.85 * (1 - Math.abs(pl.t - 0.5) * 0.5);
        ctx.fillStyle = ACCENT;
        ctx.beginPath();
        ctx.arc(x, y, 1.6, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalAlpha = 1;

      ctx.fillStyle = NODE;
      for (let i = 0; i < N; i++) {
        const p = pos(i, time);
        ctx.beginPath();
        ctx.arc(p.x, p.y, nodes[i].r, 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.save();
      ctx.shadowColor = ACCENT;
      ctx.shadowBlur = 22;
      ctx.fillStyle = ACCENT;
      ctx.beginPath();
      ctx.arc(core.x, core.y, 5, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    };

    let raf = 0;
    let last = performance.now();
    let running = false;

    const tick = (now: number) => {
      const dt = now - last;
      last = now;
      for (const pl of pulses) {
        pl.t += pl.speed * (dt / 1000);
        if (pl.t > 1) pl.t -= 1;
      }
      draw(now);
      if (running) raf = requestAnimationFrame(tick);
    };

    const start = () => {
      if (running || reduced) return;
      running = true;
      last = performance.now();
      raf = requestAnimationFrame(tick);
    };
    const stop = () => {
      running = false;
      cancelAnimationFrame(raf);
    };

    layout();
    draw(0);

    const io = new IntersectionObserver(
      ([e]) => (e.isIntersecting ? start() : stop()),
      { threshold: 0 }
    );
    io.observe(wrap);

    const ro = new ResizeObserver(() => {
      layout();
      draw(performance.now());
    });
    ro.observe(wrap);

    return () => {
      stop();
      io.disconnect();
      ro.disconnect();
    };
  }, []);

  return (
    <div
      ref={wrapRef}
      aria-hidden
      className="absolute inset-0"
      style={{
        // Fixed dark stage independent of the day-cycle so the warm-grey
        // diagram and ember pulses always read.
        background:
          "radial-gradient(120% 120% at 50% 45%, #18130d 0%, #0b0a08 72%)",
      }}
    >
      <canvas ref={canvasRef} className="h-full w-full" />
    </div>
  );
}
