# Hero descent — scroll-driven parallax to the mountains

**Date:** 2026-08-16
**Status:** Approved design, pending implementation plan
**Scope:** Additive enhancement to the homepage hero. No existing component is
restructured; DayCycle, Meridian, ProjectsMotion and About are untouched.

## Intent

The hero already shows an AI-generated sunrise over a misty sea, with faint
mountain tops on the horizon. As the visitor scrolls out of the hero, the page
should feel like a **descent through the clouds down toward those mountains** —
the distant peaks in the footage become the peaks you arrive at. The descent
completes exactly as the hero scrolls away and DayCycle's dawn breaks over
About, so the two motions meet.

Built with **zero new credits**: mountains are inline SVG/CSS silhouettes, not
generated footage. A generated descent clip (Seedance 2.5) is explicitly out of
scope for this version and may be revisited later.

## Layer structure

Extends the existing `HeroAmbient` background layer inside the hero container.
Back to front:

| z | Layer | Notes |
|---|-------|-------|
| z0 | Video (sky / sun / clouds) | Unchanged — the existing `hero_ambient` loop |
| z1 | Far mountain band | Lightest, most haze-veiled silhouette |
| z2 | Mid mountain band | |
| z3 | Near mountain band | Darkest silhouette |
| z4 | Mist wisp | A thin drifting band along the mountain bases |
| z5 | Warm scrim (bottom/left, text) | Unchanged — headline-contrast gradient |
| z5 | Warm scrim (top, nav) | **New** — see Nav contrast below |
| z10 | Headline | Unchanged DOM |

- Mountain bands are **inline SVG** paths (no network requests, no image
  bytes). Soft, low-detail ridge shapes — silhouettes, not an illustrated
  scene — to stay within the site's astronomical/minimal art direction.
- Silhouettes use a **fixed warm-dark tone** (a near-black with slight ember
  warmth), not a day-cycle token. They must read as silhouettes against both
  the night sky at the top of the hero and the dawn glow lower down. The colour
  story comes from the sky behind them (video + DayCycle palette), not the
  mountains themselves.
- Each band carries a subtle top-edge haze (soft gradient fade) so ridgelines
  dissolve into the mist rather than cutting hard.

## Motion

One `ScrollTrigger` **scrub, no pin**, tied to the hero's own scroll window
(`start: "top top"`, `end: "bottom top"` — the same window the existing hero
word-dissolve uses). As progress runs 0 → 1:

| Layer | translateY | scale | Rate |
|-------|-----------|-------|------|
| Far band | +20% → 0 | 1.02 → 1.00 | slow |
| Mid band | +45% → −5% | — | medium |
| Near band | +80% → −12% | 1.05 → 1.12 | fast (grows = approaching) |
| Mist wisp | 0 → −60% (opacity fades out) | — | — |

The differing rates read as sinking *toward* the peaks; the near band growing
and rising fastest sells the approach. All animation is transform/opacity only
(GPU), matching Meridian's and the hero's existing patterns. Percentages are a
starting point and will be tuned live in the browser during implementation.

## Nav contrast over the hero

The global nav (`Nav.tsx`) colours ride the day-cycle tokens — inactive links
`text-brand-gray`, active link and wordmark `text-brand-ink`. At the night hero
both are light (ink 246, gray 154), and over the brightest region of the video
(the sun / upper-right sky) they wash out. This is only a problem over the hero
video; over the flat paper of every other section the nav is fine.

Fix: a **top scrim inside `HeroAmbient`** — a `--brand-paper` gradient falling
from the top edge, mirroring the existing bottom/left scrim. Because it is
`--brand-paper`, it is dark behind the nav at the night hero (light nav text
pops) and self-corrects toward day as the palette tweens. It is scoped to the
hero, so the nav's appearance over other sections is untouched. `Nav.tsx`
itself is **not modified** — the fix is purely the hero backdrop.

The gradient must be strong enough to clear WCAG AA for the nav text (small
text → 4.5:1) against the brightest hero frame, verified by the same live
pixel-sampling method used for the headline. It covers roughly the top 12–18%
of the hero, feathered to transparent, so it reads as sky framing rather than a
bar.

## Coherence, performance, accessibility

- **DayCycle / Meridian:** The descent motion is fully contained in the hero's
  scroll window and completes as the hero exits. DayCycle's dawn (triggered by
  About entering) lights the sky behind the settled peaks at the same moment.
  No change to DayCycle, Meridian, or About — they compose by timing alone.
- **LCP:** The mountain layers mount only after `introDone` (same gate as the
  video), so they never become or delay the LCP element. Inline SVG means zero
  additional network bytes. Target: LCP delta stays within the same +4 ms
  envelope already measured for the video; re-measure before/after and hold the
  <200 ms gate.
- **Reduced motion:** Under `prefers-reduced-motion`, render the mountain bands
  in their settled end-state (progress = 1) with no scrub — consistent with how
  HeroAmbient already shows the poster still instead of the video.
- **Containment:** Everything lives inside the hero's `overflow-hidden` box and
  never bleeds into About.

## Component boundaries

- The mountain layers and their haze/mist are rendered by `HeroAmbient` (or a
  small dedicated child it composes), keeping all hero backdrop concerns in one
  place.
- The scrub timeline is registered in the hero's existing `useGSAP` scope in
  `HeroHeader`, alongside the current word-dissolve timeline — one place owns
  hero scroll motion.
- Silhouette geometry (SVG path data) is defined as plain constants so ridge
  shapes can be tuned without touching motion logic.

## Out of scope

- Generated descent video (Seedance 2.5) — deferred, needs credits.
- Any change to About, Work, Say hi, DayCycle, or Meridian.
- A page-spanning landscape below About.

## Success criteria

1. Scrolling out of the hero reads as descending toward mountains that emerge
   from the mist.
2. The arrival lands as dawn breaks into About, with no visible seam.
3. LCP regression < 200 ms vs the current committed state; CLS unaffected.
4. Reduced-motion shows a calm, settled peaks-in-mist still, no parallax.
5. Nav links clear AA contrast (4.5:1) over the brightest hero frame, verified
   by live measurement, with `Nav.tsx` unmodified.
6. No existing component restructured; feature is removable in isolation.
