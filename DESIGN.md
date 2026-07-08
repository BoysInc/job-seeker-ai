# JobSeeker AI — Design System

The foundation for all UI work in `job-seeker-ai`. Built inside shadcn's
architecture (this repo uses the **base-nova** style: Base UI primitives +
Tailwind v4 + CVA — not Radix). All tokens live in `app/globals.css`;
components live in `components/ui/` (generic primitives) and `components/`
(job-domain composites).

## Principles

1. **Trust before delight.** Job seekers hand us their career history. Quiet
   neutral surfaces, one brand accent, honest status colors, and clearly
   labeled AI output read as "professional tool", not "landing page".
2. **Built for scanning.** Users compare many listings quickly. Fixed card
   anatomy (title → company/location → salary → score), tabular numerals for
   scores, and one color meaning per hue keep cognitive load low.
3. **AI is always labeled and always explains itself.** Scores come with
   bands and reasons (`why_good_fit`, gaps). Never show a bare number the
   user can't interrogate.
4. **AA is a floor, not a goal.** Every foreground/background token pair in
   this file is ≥ 4.5:1 (checked programmatically). The old green text
   `#5f9d38` fails at 3.3:1 — never reintroduce it.

## Color

Brand greens are kept, but every token now has exactly one job:

| Token | Light | Role |
|---|---|---|
| `--primary` | `#9fdd70` | Brand green. **Fills only** (buttons, logo, active progress) with `--primary-foreground` text (12.4:1). Never as text on white. |
| `--accent` / `--accent-foreground` | `#eef7e4` / `#3f6b1f` | Soft brand tint + the *only* green for text/icons on light surfaces (6.3:1 AA). Replaces all hard-coded `#5f9d38`. |
| `--success` | `#436e22` | Positive status: strong match, passed check. Text at 6.0:1; soft usage as `bg-success/10 text-success`. |
| `--warning` | `#b45309` | Moderate match, gaps, "needs attention" (5.0:1). |
| `--destructive` | `#dc2626` | Errors, weak match, destructive actions (4.8:1). |
| `--background` / `--muted` | `#fafafa` / `#f4f4f5` | Neutral (was green-tinted). Green now reads as deliberate accent, not a wash. |
| `--border` / `--input` | `#e4e4e7` | Neutral; replaces `#dfeecf`. |
| `--ring` | `#9fdd70` | Focus rings — brand-colored, 3px at 50% opacity, on every interactive element. |

Dark mode inverts roles: brand green becomes the success/text accent
(`--success: #9fdd70` on `#0c0c0d` = 12.3:1); surfaces are layered zinc
(`#0c0c0d` page → `#161618` card → `#232326` muted).

**Rules**
- Use semantic tokens only. Hard-coded hexes and `text-zinc-*`/`bg-white` in
  feature code are defects (they also break dark mode).
- One meaning per hue: green = positive/brand, amber = caution, red =
  negative. Don't use green for anything that isn't good news.

## Typography

Geist Sans (kept — modern, excellent legibility at small sizes), Geist Mono
for file names/raw data if needed. Scale (Tailwind classes; no custom sizes):

| Use | Classes |
|---|---|
| Page title | `text-2xl sm:text-3xl font-semibold tracking-tight` |
| Section title | `text-lg font-semibold tracking-tight` |
| Card/job title | `text-base sm:text-lg font-semibold tracking-tight` |
| Body | `text-sm leading-6` (default), `text-base leading-7` for long-form |
| Meta/caption | `text-xs text-muted-foreground` |
| Scores/numbers | add `tabular-nums` |

Marketing hero may go up to `text-5xl`. Product screens stop at `text-3xl` —
the old `text-6xl/7xl` headings inside the app are what made it feel like a
landing page. Avoid `uppercase tracking-[0.2em]` eyebrow labels in product
UI; use plain `text-sm font-medium text-muted-foreground` or a Badge.

## Spacing, radius, elevation

- **Spacing:** 4px base grid. Cards pad `p-4` (mobile) / `p-5–p-6` (desktop);
  page sections `py-8 sm:py-10`; gaps in card lists `gap-3`. Page container:
  `mx-auto max-w-7xl px-4 sm:px-6 lg:px-8`.
- **Radius:** `--radius: 0.625rem` (10px). Cards/inputs `rounded-xl`/`rounded-lg`,
  chips `rounded-md`. The old 1rem base + `rounded-full` pills on every
  button was the single biggest "vibecoded" signal — buttons now use their
  built-in radius. Don't override radius per-instance.
- **Elevation:** neutral layered shadows (`--shadow-xs` → `--shadow-xl` in
  `@theme`). Resting cards: `shadow-xs`/`shadow-sm`. Hover on interactive
  cards: `shadow-md`. Modals: `shadow-lg`+. Never colored glow shadows
  (`shadow-[#cfe9b8]/40` is gone). Elevation implies interactivity — don't
  add shadows to static content.

## Component library

### shadcn/ui primitives (`components/ui/`)
Existing: `button`, `badge`, `card`, `input`, `label`, `alert`,
`alert-dialog`, `dialog`, `progress`, `skeleton`.
Added (shadcn conventions, `data-slot` + CVA): `spinner`, `empty`.
Worth adding from the registry as screens need them: `select`, `tabs`,
`tooltip`, `dropdown-menu`, `sonner` (toasts), `field`.

**Usage rules**
- Buttons: use variants/sizes as-is (`default` = brand fill for the one
  primary action per view; `secondary` = dark; `outline`/`ghost` for the
  rest). No height/radius overrides. Loading state = `<Spinner /> + label`,
  keep the button disabled.
- Empty/error/loading states: use `Empty` for empty & recoverable error
  states (icon + title + description + action), `Skeleton` for loading
  layout, `Alert variant="destructive"` for inline operation errors. Every
  error state must include a retry or way forward.

### Domain components (`components/`)

| Component | File | Base | Notes |
|---|---|---|---|
| `MatchScoreBadge` / `MatchScoreRing` / `ScoreBar` | `match-score.tsx` | CVA + `role="meter"` | One thresholds table (≥75 strong / ≥50 moderate / <50 weak) drives color everywhere a score appears. |
| `JobCard` | `job-card.tsx` | Card anatomy + `MatchScoreBadge` | Stretched-link pattern: title is the accessible link, whole card clickable. |
| `ProcessingSteps` | `processing-steps.tsx` | `Spinner` + list | AI pipeline progress (upload → extract → search → score); `aria-current="step"` + polite live region. |
| `FileDropzone` | `file-dropzone.tsx` | native button + hidden input | Click/drag/keyboard; validation stays in the controller. |
| `AiBadge` | `ai-badge.tsx` | span | Labels AI-generated content. Use on every AI summary/suggestion/score block. |
| `AppNavbar` | `app-navbar.tsx` | — | Sticky full-width header, active-link states, mobile menu, theme toggle. Place directly under `<main>`, outside max-width containers. |
| `ThemeToggle` | `theme-toggle.tsx` | Button | Zero-dependency; pairs with the pre-paint script in `app/layout.tsx`. |

## Migration audit

Already on shadcn correctly: view scaffolding (`Card`, `Button`, `Alert`,
`AlertDialog`, `Badge`, `Progress`, `Skeleton`, `Input`, `Label`).

Migrated in this pass:
- Tokens/dark mode/shadows/radius (`globals.css`), theme toggle + no-flash
  script (`layout.tsx`), navbar (all views), job results + processing
  screens (proof of concept), `nav-auth-actions` override cleanup.

Still to migrate (pattern established, mechanical work):
- `resume-upload.view.tsx` — hero + upload card: hard-coded hexes,
  `text-zinc-*`, inline SVGs → `FileDropzone`, lucide icons, tokens.
- `resume-analysis-section.tsx` — local `scoreColor`/`scoreBarColor` and
  severity/priority maps → `ScoreBar`, `MatchScoreRing`,
  success/warning/destructive tokens; add `AiBadge` to tailored summary.
- `job-detail.view.tsx` body — `#5f9d38` eyebrows, `text-zinc-700` lists →
  tokens; fit/salary badges → `MatchScoreBadge` + outline `Badge`.
- `auth-form.view.tsx` — input/strength-meter hex overrides → default
  `Input` + tokens.
- `resume-list.view.tsx` rows — action overflow on mobile (see UX flags).

## Living preview

`/design-preview` renders the job results screen with mock data covering all
three score bands — use it to eyeball changes to tokens or job components in
light/dark and mobile/desktop without logging in. Dev-only; delete or gate
it before production.

## UX flags (beyond visuals)

1. **Dev jargon in user copy** — "These jobs came directly from the resume
   analysis endpoint", "Ranked by your backend". Rewritten in the new job
   results view; sweep remaining copy.
2. **Fake numbers undermine trust** — "92% average ATS lift", "12k+ resumes
   analyzed", and the hard-coded 86 score demo on the landing page. Remove
   or replace with real product claims; a job platform can't afford
   invented stats.
3. **Upload flow navigates before the work starts** — `handleUpload` pushes
   to `/processing` without awaiting anything; refresh on that page strands
   the user. Consider driving upload+matching from one place and making
   `/processing` resumable (it can re-poll `getJobRecommendations`).
4. **Auth redirects lose context** — failing auth mid-action pushes to
   `/login` with no return path. Add a `?next=` param and redirect back
   after login.
5. **Resume list actions overflow on mobile** — three buttons + badge in a
   row; move secondary actions into a dropdown menu (add shadcn
   `dropdown-menu`).
6. **Delete has confirmation but no undo/feedback** — good `AlertDialog`;
   pair the result with a toast (`sonner`) for success/failure instead of
   silent list refresh.
7. **Landing hash-links (`#review`) render as nav** — they look like app
   routes but only scroll; fine for marketing page, but they appear on the
   logged-in home too. Split marketing header from app navbar when the
   dashboard emerges.
8. **`overflow-x-hidden` on `body` and `main`** — masks layout bugs and
   breaks `position: sticky` in some browsers; remove once the offending
   overflow source is found.
9. **Everything is behind login** — `useAuth` redirects every path except
   `/login`, `/signup` (and now `/design-preview`) to login, so logged-out
   visitors never see the landing page or its value proposition. Make `/`
   public and gate only the actions (upload, matching).
10. **Base UI `render={<Link/>}` buttons claimed native-button semantics** —
   console errors on every page, wrong ARIA for links styled as buttons.
   Fixed at the system level in `components/ui/button.tsx` (`nativeButton`
   now defaults to false when `render` is set).
