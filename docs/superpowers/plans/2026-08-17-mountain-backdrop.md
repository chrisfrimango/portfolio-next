# Mountain Backdrop Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** A generated photographic mountain, fixed behind the page, is revealed as the hero scrolls off it, stands full-bleed behind About, and fades out before Projects.

**Architecture:** A `fixed inset-0 -z-10` `MountainBackdrop` renders the mountain image + a `--brand-paper` contrast scrim behind all content. The hero (cloud curtain) hides it until scrolled away; GSAP ScrollTriggers ramp its opacity/parallax on hero exit and fade it before Projects. The stylised `HeroMountains` SVG layer is removed. `page.tsx` gains one call site; About/Work/DayCycle/Meridian internals are untouched.

**Tech Stack:** Next 15 / React 19, GSAP 3 + ScrollTrigger + `@gsap/react`, Tailwind, Lenis. Higgsfield MCP image generation. Chrome (claude-in-chrome) + Lighthouse 12 for verification. ffmpeg/cwebp for image optimisation.

## Global Constraints

- Mountain is a single generated **photographic still**, not video/SVG.
- **Ask before spending any credits.** `get_cost` preflight → user approval → generate. Never more than three images in one batch without asking. Download to `/tmp`; place in `public/` only on the user's pick.
- Backdrop mounts only after `introDone` (except reduced motion); never becomes/delays LCP.
- All animation transform/opacity only; no layout shift.
- `Nav.tsx`, `DayCycle.tsx`, `Meridian.tsx`, About/Work/Say hi internals are **not** restructured.
- Reduced motion: static mountain at About-hold state, no parallax/scale, opacity fade before Projects only.
- About text ≥ 4.5:1 over the brightest mountain region (live-measured).
- LCP regression < 200 ms vs pre-backdrop committed state.
- Backdrop removable in isolation (delete `MountainBackdrop` + call site + image).

---

### Task 1: Generate and place the mountain image

**Files:**
- Create: `public/images/mountain_backdrop.webp` (final optimised asset)

**Interfaces:**
- Produces: the asset at `/images/mountain_backdrop.webp` consumed by `MountainBackdrop` in Task 3.

- [ ] **Step 1: Pick a photographic model and preflight cost**

Use `mcp__higgsfield__models_explore` (`action: "recommend"`, `type: "image"`, goal: photographic dawn mountain landscape, text-only) to choose a photorealistic model. Then call `mcp__higgsfield__generate_image` with `get_cost: true` for that model at a landscape aspect ratio, and note the per-image credit cost.

- [ ] **Step 2: Ask the user before spending**

Report the model, per-image cost, and proposed variant count (default 3 variants to choose from — images are cheap). Get explicit approval for the spend and count. Do not generate until approved.

- [ ] **Step 3: Generate the approved variants**

Prompt (locked to the spec's world — warm greyscale + ember, no foreign hues):

> "Photographic still, no text, no people, no buildings, no roads. A lone mountain ridge at dawn wrapped in soft mist at its base, warm low-sun light grazing the peak, deep warm-grey shadows lifting into a hazy warm sky; the peak sits in the upper third and the hazy base dissolves into cloud. Monochromatic warm greyscale with only a faint ember warmth from the low sun. Atmospheric, minimal, cinematic, fine grain, matte. Aspect ratio tall landscape for a full-screen background."

Submit via `mcp__higgsfield__generate_image` (or `generate_image_batch` for variants), poll to terminal, and present the results to the user. Let the user pick one.

- [ ] **Step 4: Download the pick to /tmp and optimise**

Download the chosen image URL to `/tmp/mountain_src.<ext>`. Downscale + encode to WebP sized for a full-viewport backdrop (max width ~1920, `object-cover` will crop), targeting < 300 KB:

```bash
# adjust input name/ext to the downloaded file
cwebp -quiet -q 80 -resize 1920 0 /tmp/mountain_src.png -o public/images/mountain_backdrop.webp
ls -la public/images/mountain_backdrop.webp   # confirm < 300 KB
```

If the source is a JPG/other, convert to PNG first with ffmpeg (`ffmpeg -i src.jpg /tmp/mountain_src.png`). If > 300 KB, drop `-q` to 72 and re-check.

- [ ] **Step 5: Commit**

```bash
git add public/images/mountain_backdrop.webp
git commit -m "Add generated dawn mountain backdrop image"
```

---

### Task 2: Remove the stylised SVG silhouettes

**Files:**
- Delete: `src/components/hero/HeroMountains.tsx`
- Modify: `src/components/HeroHeader.tsx` (remove the import, the render, the reduced-motion mountain `gsap.set`s, and the parallax `fromTo`s)

**Interfaces:**
- Consumes: nothing.
- Produces: hero returns to video-only backdrop; the top nav scrim (Task 3 of the prior feature) stays.

- [ ] **Step 1: Delete the component and unwire it**

```bash
git rm src/components/hero/HeroMountains.tsx
```

In `src/components/HeroHeader.tsx`, remove:
- the import line `import HeroMountains from "@/components/hero/HeroMountains";`
- the render line `{mounted && (reduced || introDone) ? <HeroMountains /> : null}` (and its comment)
- in the reduced-motion branch, the four mountain `gsap.set('[data-mtn=...]' ...)` / `gsap.set("[data-mist]" ...)` lines
- in the scrubbed timeline, the four `.fromTo('[data-mtn=...]' ...)` / `.fromTo("[data-mist]" ...)` blocks (leave the `words` and `.hero-meta` tweens intact — re-terminate the chain with a `;` after the `.hero-meta` `.to(...)`).

- [ ] **Step 2: Verify the hero is video-only and builds green**

```bash
npx next lint && npm run build
```

Expected: no eslint errors, build ok. Serve and confirm in Chrome that the hero shows the video + sun with no SVG ridges, and the nav top scrim is still present.

- [ ] **Step 3: Commit**

```bash
git add -A
git commit -m "Remove stylised hero mountain silhouettes (replaced by backdrop)"
```

---

### Task 3: `MountainBackdrop` component — static image + scrim behind About

**Files:**
- Create: `src/components/MountainBackdrop.tsx`
- Modify: `src/app/page.tsx` (mount `<MountainBackdrop />` inside `DayCycle`, before the content `<div>`)

**Interfaces:**
- Consumes: `/images/mountain_backdrop.webp` (Task 1); `useIntro().introDone`; `prefersReducedMotion`.
- Produces: `MountainBackdrop` default export. Renders a `fixed inset-0 -z-10` layer with transform target refs used by Task 4. Section ids it references: `#hero`, `#projects`.

- [ ] **Step 1: Create the component (static: full opacity, no motion yet)**

```tsx
// src/components/MountainBackdrop.tsx
"use client";

import { useEffect, useRef, useState } from "react";
import { useGSAP } from "@/lib/gsap";
import { prefersReducedMotion } from "@/lib/motion";
import { useIntro } from "@/components/intro/IntroContext";

/**
 * A photographic mountain fixed behind the page. The hero (cloud curtain) hides
 * it until scrolled away; it stands behind About and fades before Projects.
 * Mounted only after the intro hands off (LCP-safe). Motion is added in a later
 * step; this version renders it statically at full opacity.
 */
export default function MountainBackdrop() {
  const { introDone } = useIntro();
  const [mounted, setMounted] = useState(false);
  const [reduced, setReduced] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const imgRef = useRef<HTMLDivElement>(null);
  const scrimRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
    setReduced(prefersReducedMotion());
  }, []);

  // Motion added in Task 4. Placeholder scope keeps refs wired.
  useGSAP(() => {}, { dependencies: [mounted, reduced, introDone] });

  if (!mounted || (!reduced && !introDone)) return null;

  return (
    <div
      ref={rootRef}
      aria-hidden
      className="fixed inset-0 -z-10 pointer-events-none overflow-hidden"
    >
      <div ref={imgRef} className="absolute inset-0 will-change-transform">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/images/mountain_backdrop.webp"
          alt=""
          className="h-full w-full object-cover object-bottom"
        />
      </div>
      {/* Contrast scrim over About — --brand-paper so it tracks the day cycle.
          Starting values; tuned to >=4.5:1 in Task 5. */}
      <div
        ref={scrimRef}
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(to bottom, rgb(var(--brand-paper) / 0.5) 0%, rgb(var(--brand-paper) / 0.35) 50%, rgb(var(--brand-paper) / 0.55) 100%)",
        }}
      />
    </div>
  );
}
```

- [ ] **Step 2: Mount it in `page.tsx`**

In `src/app/page.tsx`, import and render `<MountainBackdrop />` as the first child inside `<DayCycle>`, before the content `<div className="w-full flex flex-col overflow-hidden">`:

```tsx
import MountainBackdrop from "@/components/MountainBackdrop";
```

```tsx
      <DayCycle>
        <MountainBackdrop />
        <div className="w-full flex flex-col overflow-hidden">
```

- [ ] **Step 3: Verify it sits behind About, hidden under the hero**

Build, serve, and in Chrome: at the top the hero should look unchanged (mountain hidden behind it). Scroll into About and confirm the mountain image is visible full-bleed behind the About heading/portrait/text, with the body paper no longer showing there. Confirm it is behind (not over) the content. Screenshot both.

- [ ] **Step 4: Commit**

```bash
git add src/components/MountainBackdrop.tsx src/app/page.tsx
git commit -m "Add static MountainBackdrop behind the page"
```

---

### Task 4: Scroll choreography (reveal / hold / fade) + reduced motion

**Files:**
- Modify: `src/components/MountainBackdrop.tsx` (fill in the `useGSAP` body)

**Interfaces:**
- Consumes: `rootRef`, `imgRef`, `scrimRef`, `mounted`, `reduced`, `introDone` from Task 3.

- [ ] **Step 1: Replace the placeholder `useGSAP` with the choreography**

```tsx
  useGSAP(
    () => {
      if (!mounted) return;
      const root = rootRef.current,
        img = imgRef.current,
        scrim = scrimRef.current;
      if (!root || !img || !scrim) return;

      if (reduced) {
        // Static at the About-hold state; only fade out before Projects.
        gsap.set(root, { opacity: 1 });
        gsap.set(img, { yPercent: 0, scale: 1 });
        ScrollTrigger.create({
          trigger: "#projects",
          start: "top 90%",
          end: "top 40%",
          scrub: true,
          onUpdate: (s) => gsap.set(root, { opacity: 1 - s.progress }),
        });
        return;
      }

      // Reveal as the hero scrolls off the fixed layer — descent parallax + fade-up.
      gsap.set(root, { opacity: 0 });
      gsap
        .timeline({
          scrollTrigger: {
            trigger: "#hero",
            start: "top top",
            end: "bottom top",
            scrub: true,
          },
        })
        .fromTo(root, { opacity: 0 }, { opacity: 1, ease: "none", duration: 0.4 }, 0)
        .fromTo(
          img,
          { yPercent: 8, scale: 1.06 },
          { yPercent: 0, scale: 1.0, ease: "none" },
          0
        );

      // Fade out before the first Projects stage.
      gsap.to(root, {
        opacity: 0,
        ease: "none",
        scrollTrigger: {
          trigger: "#projects",
          start: "top 90%",
          end: "top 40%",
          scrub: true,
        },
      });
    },
    { dependencies: [mounted, reduced, introDone] }
  );
```

Add the GSAP imports at the top of the file:

```tsx
import { gsap, ScrollTrigger, useGSAP } from "@/lib/gsap";
```

(replace the existing `import { useGSAP } from "@/lib/gsap";`).

- [ ] **Step 2: Verify reveal, hold, and fade across scroll**

Build, serve, and in Chrome drive scroll from top through About to the Projects boundary, screenshotting: (a) hero top — mountain hidden; (b) hero→About — mountain rising/fading in; (c) mid-About — full mountain behind content; (d) About→Projects — mountain faded to nothing before the first work stage. Confirm `#hero` opacity ramp and `#projects` fade both fire.

- [ ] **Step 3: Commit**

```bash
git add src/components/MountainBackdrop.tsx
git commit -m "Add reveal/hold/fade scroll choreography to mountain backdrop"
```

---

### Task 5: About contrast — measure and tune the scrim

**Files:**
- Modify: `src/components/MountainBackdrop.tsx` (scrim `background` values only)

- [ ] **Step 1: Measure worst-case About text contrast over the mountain**

Serve, scroll to mid-About in Chrome, and run this in the page context. It samples the rendered mountain image behind the About text band and composites the current scrim to find the worst contrast for the faint `--brand-gray` copy (day palette values, since About is the dawn/day range):

```js
const img=document.querySelector('.-z-10 img');
const about=document.querySelector('#about');
const r=about.getBoundingClientRect();
const vw=innerWidth,vh=innerHeight;
const c=document.createElement('canvas');c.width=vw;c.height=vh;const x=c.getContext('2d');
const sr=img.naturalWidth/img.naturalHeight,dr=vw/vh;let dw,dh,dx,dy;
if(sr>dr){dh=vh;dw=vh*sr;dx=(vw-dw)/2;dy=0;}else{dw=vw;dh=vw/sr;dx=0;dy=vh-dh;} // object-bottom
x.drawImage(img,dx,dy,dw,dh);
const paper=[246,243,237]; // brand-paper day
const L=(a,b,d)=>{const f=t=>{t/=255;return t<=.03928?t/12.92:((t+.055)/1.055)**2.4;};return .2126*f(a)+.7152*f(b)+.0722*f(d);};
const gray=L(111,111,111); // brand-gray day
// current scrim alpha model: top 0.5 -> mid 0.35 -> bottom 0.55 (vertical)
const alpha=(yy)=>{const p=yy/vh; if(p<0.5) return 0.5+(0.35-0.5)*(p/0.5); return 0.35+(0.55-0.35)*((p-0.5)/0.5);};
let worst=99;
const top=Math.max(0,r.top),bot=Math.min(vh,r.bottom);
for(let yy=top+10;yy<bot-10;yy+=14){const a=alpha(yy);
  for(let xx=40;xx<vw*0.7;xx+=24){const p=x.getImageData(Math.round(xx),Math.round(yy),1,1).data;
    const R=a*paper[0]+(1-a)*p[0],G=a*paper[1]+(1-a)*p[1],B=a*paper[2]+(1-a)*p[2];
    const bl=L(R,G,B),ratio=(Math.max(gray,bl)+.05)/(Math.min(gray,bl)+.05);if(ratio<worst)worst=ratio;}}
JSON.stringify({worstAboutContrast:+worst.toFixed(2)});
```

Note: `paper`/`gray` are the **day** token values because DayCycle is at day by About. If the mountain image is dark and the day text is dark, contrast may instead be limited where the mountain is *bright*; the sample scans the whole About band and reports the worst.

- [ ] **Step 2: Tune the scrim until ≥ 4.5:1**

If `worstAboutContrast` < 4.5, raise the scrim alphas (e.g. the mid stop 0.35 → 0.5, ends → 0.6) in the component's scrim `style.background` and re-measure. Prefer a gradient that is stronger where the About copy sits (upper-left/centre) so the mountain stays visible elsewhere. Record the final value and the final gradient.

- [ ] **Step 3: Commit**

```bash
git add src/components/MountainBackdrop.tsx
git commit -m "Tune mountain backdrop scrim to AA contrast behind About"
```

---

### Task 6: LCP + reduced-motion verification

**Files:** none (verification; fixes fold back into earlier tasks).

- [ ] **Step 1: Lighthouse before/after**

The pre-backdrop committed baseline measured median LCP ≈ 4886 ms. Rebuild the branch, serve, and run 3 mobile passes:

```bash
npm run build && (PORT=3130 npm run start > /tmp/next_mb.log 2>&1 &)
for i in $(seq 1 30); do curl -s -o /dev/null http://localhost:3130 && break; sleep 1; done
cd /tmp && for r in 1 2 3; do
  npx --yes lighthouse@12 http://localhost:3130 --only-categories=performance \
    --form-factor=mobile --screenEmulation.mobile --throttling-method=simulate \
    --quiet --chrome-flags="--headless=new --no-sandbox" \
    --output=json --output-path=/tmp/lh_mb_$r.json >/dev/null 2>&1
  node -e "const r=require('/tmp/lh_mb_$r.json');const it=r.audits['largest-contentful-paint-element'].details.items[0].items;console.log('LCP='+Math.round(r.audits['largest-contentful-paint'].numericValue)+'ms CLS='+(+r.audits['cumulative-layout-shift'].numericValue).toFixed(3)+' el='+it[0].node.snippet.slice(0,40));"
done
```

Expected: median LCP within 200 ms of ~4886 ms; LCP element still the headline span; CLS unaffected. If LCP regresses > 200 ms, STOP and report — likely mitigation: ensure the backdrop `<img>` has no eager priority and stays gated behind `introDone`.

- [ ] **Step 2: Reduced-motion check**

Headless screenshot with reduced motion forced, then confirm the mountain is static (full opacity behind About, no parallax) and still absent by Projects:

```bash
"/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" --headless=new \
  --force-prefers-reduced-motion --hide-scrollbars --virtual-time-budget=5000 \
  --window-size=1440,2600 --screenshot=/tmp/mb_rm.png http://localhost:3130
```

Read `/tmp/mb_rm.png` (a tall capture spanning hero→About→Projects) and confirm: mountain visible behind About, gone by Projects, no motion artefacts.

- [ ] **Step 3: Final visual pass + commit any tuning**

Screenshot hero→About→Projects at normal motion one last time; confirm the descent reads and About/nav/headline are legible. Commit any tuning:

```bash
git add -A
git commit -m "Verify mountain backdrop LCP and reduced motion"
```

---

## Self-Review

**Spec coverage:**
- Fixed mountain revealed by hero scroll-out → Task 3 (fixed -z-10) + Task 4 (reveal). ✓
- Photographic generated still, cheap, approved before spend → Task 1 (get_cost → ask → generate). ✓
- Full-bleed behind About + --brand-paper scrim ≥4.5:1 → Task 3 (scrim) + Task 5 (measure/tune). ✓
- Fade out before Projects → Task 4 (`#projects` fade). ✓
- Remove SVG silhouettes → Task 2. ✓
- DayCycle/Meridian/About/Work untouched → no task edits them; page.tsx only adds a sibling. ✓
- LCP < 200 ms, mount post-intro → Task 3 gate + Task 6. ✓
- Reduced motion static + opacity fade only → Task 4 reduced branch + Task 6 check. ✓
- Removable in isolation → delete component + call site + image; Global Constraints. ✓

**Placeholder scan:** No TBD/TODO. Task 1 steps are procedural (tool calls with real IDs unknowable ahead of time) but each is a concrete action with a gate. All component/measurement code is concrete.

**Type/attr consistency:** `rootRef`/`imgRef`/`scrimRef` defined in Task 3 are the exact refs animated in Task 4. The `.-z-10 img` selector in Task 5 matches the Task 3 markup (`fixed inset-0 -z-10` root containing the `<img>`). Section ids `#hero`, `#about`, `#projects` match `page.tsx`. ✓
