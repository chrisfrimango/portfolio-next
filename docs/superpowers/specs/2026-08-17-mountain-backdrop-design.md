# Mountain backdrop — descend under the clouds to a real mountain

**Date:** 2026-08-17
**Status:** Approved design, pending implementation plan
**Supersedes:** `2026-08-16-hero-descent-design.md` (the stylised SVG silhouettes are replaced by a photographic mountain backdrop).

## Intent

Scrolling down from the hero should feel like descending **below the cloud
deck** to find a real mountain standing behind the page. The hero (a sea of
mist + sun) is the cloud curtain; as it scrolls away it uncovers a photographic
mountain fixed behind the page. The mountain stands **through About**, lit by
DayCycle's dawn, then **fades out before Projects** so the cinematic black work
stages stay clean.

The mountain is a **generated photographic still** (Higgsfield image model),
not video and not SVG — a fraction of a credit. Generation is gated on explicit
user approval after a `get_cost` preflight.

## Core architecture

The key idea: **the hero is the cloud curtain.** A `fixed` mountain layer
behind the page is revealed for free as the hero scrolls up and off it — no
crossfade trick. It then underlies About and fades before Projects.

- New component `MountainBackdrop` — `fixed inset-0`, `z-0` (behind all content,
  above the body background). Renders the mountain image (bottom-anchored) plus
  a scrim.
- The **hero** is unchanged in spirit (video mist + sun + the faint peaks
  already in the footage that hint "a mountain is under here"). It is opaque
  enough across the viewport that the fixed mountain behind is hidden until the
  hero scrolls away.
- The stylised **SVG silhouettes** from the superseded spec are **removed**
  (`HeroMountains` deleted and unmounted). The photographic mountain replaces
  them.

## Layer / z-order

| Layer | Positioning | Notes |
|-------|-------------|-------|
| Body background (`--brand-paper`) | — | Day-cycle tweened; shows for Projects onward |
| `MountainBackdrop` (image + scrim) | `fixed inset-0 z-0` | Revealed as hero scrolls off; fades before Projects |
| Page content (`DayCycle` children) | normal flow, above z-0 | Hero, About, Work, Say hi — unchanged structure |
| Hero video/scrims | inside hero container | The cloud curtain that uncovers the mountain |

About content sits above the backdrop by normal stacking; the backdrop's scrim
provides its text contrast. Sections other than the hero/About range show the
body paper because the mountain has faded to `opacity: 0` there.

## Scroll choreography

One or two `ScrollTrigger`s drive the fixed backdrop; no pinning.

1. **Reveal (hero → About):** The mountain is uncovered simply by the hero
   scrolling up and off the fixed layer. Add a subtle parallax so it reads as a
   descent, not a flat reveal: the mountain translates up slightly and scales
   from ~1.06 → 1.0 across the hero's scroll-out (`trigger: #hero, start: top
   top, end: bottom top, scrub`). Opacity ramps 0 → 1 over the first ~40% of
   that range so it emerges from beneath the mist rather than being abruptly
   present.
2. **Hold (through About):** Full opacity, near-static (a very slow continued
   parallax drift is acceptable but optional).
3. **Fade-out (About → Projects):** Opacity 1 → 0 driven by
   `trigger: #projects, start: top 90%, end: top 40%, scrub`, so the mountain
   is gone before the first work stage arrives.

All animation is transform/opacity only (GPU).

## About contrast

With the mountain full-bleed behind About, a warm `--brand-paper` scrim (part of
`MountainBackdrop`, sitting above the image) keeps About legible: the section
heading (`01 / About`), `AboutPortrait`, and body copy. Because the scrim is
`--brand-paper` it tracks the day cycle (About is the dawn range). Tuned to a
measured worst-case contrast ≥ 4.5:1 for the smallest About text over the
brightest region of the mountain image, verified by live pixel sampling. The
scrim strength ramps with the same reveal progress so it is only present while
the mountain is.

## Mountain image spec (generation brief)

- Single tall, portrait-ish photographic still; **no text, no people, no
  buildings**.
- A lone mountain / ridge at dawn, wrapped in soft mist at its base, warm
  low-sun light — same warm greyscale + ember world as the hero footage; no
  foreign hues.
- Composition: peak in the upper third, body filling the frame, hazy base so it
  dissolves into mist (meets the hero cloud line without a hard seam).
- Delivered as a web-optimised asset in `public/` (AVIF/WebP, sized for a
  full-viewport backdrop; poster-grade compression, target < 300 KB).
- Generated via Higgsfield image model; **cost previewed with `get_cost` and
  approved by the user before submitting.** Downloaded to `/tmp` first; committed
  to `public/` only on approval.

## Performance / accessibility

- **LCP:** The backdrop image lazy-loads and mounts only after `introDone`
  (same gate as the hero video), so it never becomes or delays the LCP element.
  Measure Lighthouse before/after; hold the < 200 ms regression gate.
- **CLS:** Fixed, transform/opacity only — no layout shift.
- **Reduced motion:** The mountain renders statically at its About-hold state
  (full opacity, no parallax, no scale) and still fades out before Projects via
  opacity only. No reveal parallax, no scale tween.
- **Weight:** One image under ~300 KB; no video added.

## Out of scope

- Seedance 2.5 video mountain (deferred; needs credit top-up).
- Any restructuring of About, Work, Say hi, DayCycle, or Meridian internals.
- A mountain behind Projects / Say hi.

## Success criteria

1. Scrolling out of the hero reveals a photographic mountain that reads as
   descending below the clouds.
2. The mountain stands full-bleed behind About, dawn-lit, with all About text
   ≥ 4.5:1 contrast (verified by live measurement).
3. The mountain has fully faded before the first Projects work stage.
4. LCP regression < 200 ms vs the pre-backdrop committed state; CLS unaffected.
5. Reduced motion shows a calm static mountain, no parallax.
6. The superseded `HeroMountains` SVG layer is removed; no other component is
   restructured; the backdrop is removable in isolation (delete `MountainBackdrop`
   + its one call site + the image).
