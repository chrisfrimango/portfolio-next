# Hero Descent Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** As the hero scrolls out, inline-SVG mountain silhouettes parallax-lift behind the headline, reading as a descent through the clouds to the peaks; and a hero-top scrim restores nav-link contrast over the bright footage.

**Architecture:** A new `HeroMountains` component renders three stacked SVG ridge bands plus a mist wisp inside the existing `HeroAmbient` backdrop. The bands mount only after `introDone` (LCP-safe) and are driven by a scrubbed GSAP timeline registered in `HeroHeader`'s existing `useGSAP` scope — no pin. A top `--brand-paper` scrim added to `HeroAmbient` backs the global nav over the hero only. `Nav.tsx`, `DayCycle`, `Meridian` and `About` are untouched.

**Tech Stack:** Next 15 / React 19, GSAP 3 + ScrollTrigger + `@gsap/react` `useGSAP`, Tailwind, Lenis (existing). Verification via Chrome (claude-in-chrome) + Lighthouse 12 (npx).

## Global Constraints

- No new credits; mountains are inline SVG only — no generated media, no network image bytes.
- `Nav.tsx`, `DayCycle.tsx`, `Meridian.tsx`, and About/Work/Say hi are **not modified**.
- All animation is transform/opacity only (GPU); no layout-affecting properties.
- Backdrop layers mount only after `introDone`; reduced motion renders the settled end-state, never the video, never a scrub.
- LCP regression vs committed state must stay < 200 ms; CLS unaffected.
- Nav links must clear WCAG AA (4.5:1) over the brightest hero frame, verified by live pixel sampling.
- Silhouettes use a fixed warm-dark tone (`#0e0b09`), not a day-cycle token.
- Feature must be removable in isolation (delete `HeroMountains` + its two call sites).

---

### Task 1: `HeroMountains` component — static settled layers

**Files:**
- Create: `src/components/hero/HeroMountains.tsx`
- Modify: `src/components/HeroHeader.tsx` (render `<HeroMountains />` inside `HeroAmbient`, above the video, below the bottom scrim)

**Interfaces:**
- Produces: `HeroMountains` (default export), a presentational component taking no props. Renders a `pointer-events-none absolute inset-0` layer containing four transform targets queried by later tasks: `[data-mtn="far"]`, `[data-mtn="mid"]`, `[data-mtn="near"]`, `[data-mist]`. Each is bottom-anchored.
- Consumes: nothing.

- [ ] **Step 1: Create the component with three ridge bands + mist**

```tsx
// src/components/hero/HeroMountains.tsx
"use client";

/**
 * Mountain silhouettes for the hero descent. Three bottom-anchored SVG ridge
 * bands (far/mid/near) plus a mist wisp. Fixed warm-dark fill so they read as
 * silhouettes against both the night sky and the dawn glow behind them; depth
 * comes from per-band opacity, not colour. Purely presentational — the parallax
 * transforms are applied by HeroHeader's scroll timeline via the data attrs.
 * Rendered only after the intro hands off, so it never affects LCP.
 */
const TONE = "#0e0b09";

// Low-detail ridgelines. viewBox 1440x300, filled down to the baseline.
const FAR =
  "M0,180 L120,160 L280,175 L440,150 L620,168 L800,140 L980,165 L1180,150 L1440,170 L1440,300 L0,300 Z";
const MID =
  "M0,220 L160,150 L300,190 L460,120 L640,175 L820,110 L1020,180 L1240,130 L1440,190 L1440,300 L0,300 Z";
const NEAR =
  "M0,260 L180,140 L360,240 L520,120 L700,220 L900,100 L1120,230 L1320,150 L1440,240 L1440,300 L0,300 Z";

function Band({
  d,
  role,
  opacity,
  heightVh,
}: {
  d: string;
  role: "far" | "mid" | "near";
  opacity: number;
  heightVh: number;
}) {
  return (
    <svg
      data-mtn={role}
      viewBox="0 0 1440 300"
      preserveAspectRatio="none"
      aria-hidden
      className="absolute bottom-0 left-0 w-full will-change-transform"
      style={{ height: `${heightVh}vh`, opacity }}
    >
      <path d={d} fill={TONE} />
    </svg>
  );
}

export default function HeroMountains() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
      <Band d={FAR} role="far" opacity={0.5} heightVh={30} />
      <Band d={MID} role="mid" opacity={0.72} heightVh={38} />
      <Band d={NEAR} role="near" opacity={0.92} heightVh={46} />
      {/* Mist wisp drifting along the ridge bases */}
      <div
        data-mist
        className="absolute bottom-0 left-0 w-full will-change-transform"
        style={{
          height: "40vh",
          background:
            "linear-gradient(to top, transparent 0%, rgba(246,243,237,0.10) 30%, rgba(246,243,237,0.16) 45%, transparent 70%)",
        }}
      />
    </div>
  );
}
```

- [ ] **Step 2: Render it inside `HeroAmbient`, gated like the video**

In `src/components/HeroHeader.tsx`, import at top:

```tsx
import HeroMountains from "@/components/hero/HeroMountains";
```

Inside `HeroAmbient`'s returned `<div aria-hidden className="absolute inset-0 z-0 overflow-hidden">`, immediately AFTER the video/img conditional block and BEFORE the warm bottom scrim `<div>`, add:

```tsx
      {/* Mountain silhouettes — same mount gate as the footage */}
      {mounted && (reduced || introDone) ? <HeroMountains /> : null}
```

- [ ] **Step 3: Verify the bands render at the settled position (no motion yet)**

Build and serve, then confirm in the browser that three ridge bands are visible at the bottom of the hero on reload (intro skipped):

```bash
npm run build && (PORT=3120 npm run start > /tmp/next_t1.log 2>&1 &)
for i in $(seq 1 30); do curl -s -o /dev/null http://localhost:3120 && break; sleep 1; done
```

Navigate a Chrome tab to `http://localhost:3120`, reload once (so the intro is skipped and the hero shows at top), screenshot, and confirm the ridge silhouettes appear at the hero's lower edge with visible depth (far faint, near solid). Expected: peaks visible; headline still legible; no console errors.

- [ ] **Step 4: Commit**

```bash
git add src/components/hero/HeroMountains.tsx src/components/HeroHeader.tsx
git commit -m "Add static hero mountain silhouette layers"
```

---

### Task 2: Parallax scrub

**Files:**
- Modify: `src/components/HeroHeader.tsx` (extend the existing hero scroll timeline in `HeroHeader`'s `useGSAP`)

**Interfaces:**
- Consumes: `[data-mtn="far"|"mid"|"near"]` and `[data-mist]` from Task 1; `containerRef`, `introDone`, and the existing `gsap.timeline({ scrollTrigger: { trigger: containerRef.current, start: "top top", end: "bottom top", scrub: true } })` in `HeroHeader`.
- Produces: nothing consumed downstream.

- [ ] **Step 1: Add settled-state + scrub to the hero timeline**

In `HeroHeader`'s `useGSAP` callback: under the reduced-motion early branch (where `.hero-meta` is set visible), add the settled end-state so reduced-motion users get the landed peaks:

```tsx
      if (prefersReducedMotion()) {
        gsap.set(".hero-meta", { opacity: 1, y: 0 });
        gsap.set('[data-mtn="far"]', { yPercent: 0, scale: 1.0 });
        gsap.set('[data-mtn="mid"]', { yPercent: -5 });
        gsap.set('[data-mtn="near"]', { yPercent: -12, scale: 1.12 });
        gsap.set("[data-mist]", { yPercent: -60, opacity: 0 });
        return;
      }
```

Then, in the scrubbed timeline (the existing `gsap.timeline({ scrollTrigger: {...scrub:true} })` that already animates `words` and `.hero-meta`), append parallax tweens at position `0` so they share the scrub:

```tsx
        .fromTo(
          '[data-mtn="far"]',
          { yPercent: 20, scale: 1.02 },
          { yPercent: 0, scale: 1.0, ease: "none" },
          0
        )
        .fromTo(
          '[data-mtn="mid"]',
          { yPercent: 45 },
          { yPercent: -5, ease: "none" },
          0
        )
        .fromTo(
          '[data-mtn="near"]',
          { yPercent: 80, scale: 1.05 },
          { yPercent: -12, scale: 1.12, ease: "none" },
          0
        )
        .fromTo(
          "[data-mist]",
          { yPercent: 0, opacity: 0.6 },
          { yPercent: -60, opacity: 0, ease: "none" },
          0
        );
```

- [ ] **Step 2: Verify the descent reads across scroll**

Rebuild, serve on a fresh port, and in Chrome drive three scroll positions of the hero window (`scrollY` 0, ~40% and ~90% of viewport height) via the page's Lenis-safe scroll (or `ScrollTrigger`), screenshotting each. Expected: at top the peaks sit low/partly below; mid-scroll they rise with the near band growing fastest; near hero exit they have lifted and the mist has faded — reading as a descent. Confirm `[data-mtn="near"]` transform advances between snapshots.

- [ ] **Step 3: Commit**

```bash
git add src/components/HeroHeader.tsx
git commit -m "Add scrubbed parallax lift to hero mountains"
```

---

### Task 3: Hero-top nav scrim + contrast verification

**Files:**
- Modify: `src/components/HeroHeader.tsx` (add a top scrim div inside `HeroAmbient`)

**Interfaces:**
- Consumes: the existing `HeroAmbient` scrim block.
- Produces: nothing.

- [ ] **Step 1: Add the top scrim**

In `HeroAmbient`, immediately after the existing bottom/left warm scrim `<div>`, add:

```tsx
      {/* Top scrim — backs the global nav over the bright footage. --brand-paper
          so it darkens at the night hero (light nav text) and self-corrects
          toward day. Hero-scoped; Nav.tsx is untouched. */}
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-[18vh]"
        style={{
          background:
            "linear-gradient(to bottom, rgb(var(--brand-paper) / 0.85) 0%, rgb(var(--brand-paper) / 0.5) 45%, transparent 100%)",
        }}
      />
```

- [ ] **Step 2: Measure nav-link contrast over the brightest hero frame**

Rebuild, serve, load the hero at top in Chrome, and run this in the page context. It composites the video frame under the top scrim at the nav-link band and returns worst-case contrast for the faint (`--brand-gray`) link colour:

```js
const v=document.querySelector('#hero video');
const vw=innerWidth,vh=innerHeight;
const c=document.createElement('canvas');c.width=vw;c.height=vh;const x=c.getContext('2d');
const sr=v.videoWidth/v.videoHeight,dr=vw/vh;let dw,dh,dx,dy;
if(sr>dr){dh=vh;dw=vh*sr;dx=(vw-dw)*0.8;dy=0;}else{dw=vw;dh=vw/sr;dx=0;dy=(vh-dh)*0.45;}
x.drawImage(v,dx,dy,dw,dh);
const paper=[19,19,19]; // brand-paper at night
const L=(r,g,b)=>{const f=t=>{t/=255;return t<=.03928?t/12.92:((t+.055)/1.055)**2.4;};return .2126*f(r)+.7152*f(g)+.0722*f(b);};
const gray=L(154,150,142); // brand-gray night
// nav band: top ~28-56px, right half where links sit
let worst=99;
for(let yy=24;yy<64;yy+=6){
  const aT=0.85+(0.5-0.85)*(yy/vh/0.18); const a=Math.max(0,Math.min(0.85,aT));
  for(let xx=vw*0.6;xx<vw-40;xx+=14){
    const p=x.getImageData(xx,yy,1,1).data;
    const R=a*paper[0]+(1-a)*p[0],G=a*paper[1]+(1-a)*p[1],B=a*paper[2]+(1-a)*p[2];
    const bl=L(R,G,B),ratio=(Math.max(gray,bl)+.05)/(Math.min(gray,bl)+.05);
    if(ratio<worst)worst=ratio;
  }
}
JSON.stringify({worstNavContrast:+worst.toFixed(2)});
```

Expected: `worstNavContrast` ≥ 4.5. If below, increase the top scrim's first stop opacity (e.g. 0.85 → 0.92) and/or its height (18vh → 22vh) and re-measure until ≥ 4.5. Record the final value.

- [ ] **Step 3: Commit**

```bash
git add src/components/HeroHeader.tsx
git commit -m "Add hero-top scrim to restore nav contrast over footage"
```

---

### Task 4: LCP + reduced-motion verification

**Files:**
- None modified (verification + any tuning fixes fold back into Task 1–3 files if a regression is found).

- [ ] **Step 1: Lighthouse before/after LCP**

The committed baseline (video only) measured median LCP ≈ 4890 ms. Rebuild the current branch, serve, and run 3 mobile Lighthouse passes:

```bash
npm run build && (PORT=3121 npm run start > /tmp/next_t4.log 2>&1 &)
for i in $(seq 1 30); do curl -s -o /dev/null http://localhost:3121 && break; sleep 1; done
cd /tmp && for r in 1 2 3; do
  npx --yes lighthouse@12 http://localhost:3121 --only-categories=performance \
    --form-factor=mobile --screenEmulation.mobile --throttling-method=simulate \
    --quiet --chrome-flags="--headless=new --no-sandbox" \
    --output=json --output-path=/tmp/lh_desc_$r.json >/dev/null 2>&1
  node -e "const r=require('/tmp/lh_desc_$r.json');const it=r.audits['largest-contentful-paint-element'].details.items[0].items;console.log('LCP='+Math.round(r.audits['largest-contentful-paint'].numericValue)+'ms CLS='+(+r.audits['cumulative-layout-shift'].numericValue).toFixed(3)+' el='+it[0].node.snippet.slice(0,40));"
done
```

Expected: median LCP within 200 ms of ~4890 ms; LCP element still the headline span; CLS ≈ unchanged. If LCP regresses > 200 ms, STOP and report — do not proceed. (The mountains mount post-`introDone`, so a regression would indicate the SVG paint is being counted; mitigation would be to defer the mountain mount one frame after the headline paints.)

- [ ] **Step 2: Reduced-motion check**

In Chrome, emulate `prefers-reduced-motion: reduce` (CDP `Emulation.setEmulatedMedia` or a `--force-prefers-reduced-motion` Chrome flag), load the hero, and confirm: no `<video>` element in `#hero`, a poster `<img>` present, the mountain bands rendered in their settled end-state, and no scrub on scroll. Screenshot for the record.

- [ ] **Step 3: Final visual pass + commit any tuning**

Screenshot the hero at top and mid-scroll one last time; confirm the descent reads and nav + headline are legible. If band opacities/heights or parallax percentages were tuned during verification, commit them:

```bash
git add -A
git commit -m "Tune hero descent parallax and verify LCP/contrast"
```

---

## Self-Review

**Spec coverage:**
- Layer structure (video / far / mid / near / mist / scrims / headline) → Task 1 + Task 3 (top scrim). ✓
- Fixed warm-dark silhouette tone → Task 1 (`TONE = #0e0b09`). ✓
- Parallax rates (far/mid/near/mist translate + scale) → Task 2, values copied from spec. ✓
- No pin; shares hero scroll window → Task 2 (appended to existing `top top → bottom top` scrub). ✓
- DayCycle/Meridian/About untouched → no task modifies them; Global Constraints. ✓
- LCP < 200 ms, mount after introDone → Task 1 gate + Task 4 measurement. ✓
- Reduced motion settled state → Task 1 gate (`reduced || introDone`) + Task 2 settled sets + Task 4 check. ✓
- Nav contrast AA over hero, Nav.tsx unmodified → Task 3. ✓
- Containment in hero overflow-hidden → Task 1 renders inside `HeroAmbient`. ✓
- Removable in isolation → delete `HeroMountains` + two call sites; noted in Global Constraints. ✓

**Placeholder scan:** No TBD/TODO; all code and measurement JS is concrete. ✓

**Type/attr consistency:** `data-mtn="far|mid|near"` and `data-mist` are defined in Task 1 and referenced verbatim in Task 2's tweens and settled sets. Mount gate `mounted && (reduced || introDone)` matches the reduced/introDone variables already present in `HeroAmbient`. ✓
