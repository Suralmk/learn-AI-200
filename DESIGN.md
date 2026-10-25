---
name: AI-200 Learn
description: Free, open study notes and practice exams for Microsoft AI-200, in a clean product register.
colors:
  primary: "#0177d1"
  primary-strong: "#0164b0"
  primary-soft: "#e8f2fc"
  coral: "#f0643a"
  coral-ink: "#b9431f"
  coral-soft: "#fff3ee"
  success: "#127a43"
  success-soft: "#edf8f1"
  danger: "#c81e4a"
  danger-soft: "#fdf0f3"
  warning: "#8a5a00"
  warning-soft: "#fff7e6"
  ink: "#0e1726"
  slate-muted: "#5b6b82"
  paper: "#ffffff"
  surface: "#f6f8fb"
  muted: "#eef2f7"
  border: "#e2e8f0"
  border-strong: "#cbd5e1"
  chart-1: "#0177d1"
  chart-2: "#f0643a"
  chart-3: "#5fa8e8"
  chart-4: "#0f3f6b"
  chart-5: "#94a3b8"
typography:
  display:
    fontFamily: "IBM Plex Sans, ui-sans-serif, system-ui, sans-serif"
    fontSize: "3.052rem"
    fontWeight: 600
    lineHeight: 1.05
    letterSpacing: "-0.025em"
  headline:
    fontFamily: "IBM Plex Sans, ui-sans-serif, system-ui, sans-serif"
    fontSize: "2.441rem"
    fontWeight: 600
    lineHeight: 1.12
    letterSpacing: "-0.025em"
  title:
    fontFamily: "IBM Plex Sans, ui-sans-serif, system-ui, sans-serif"
    fontSize: "1.5625rem"
    fontWeight: 600
    lineHeight: 1.3
  body:
    fontFamily: "IBM Plex Sans, ui-sans-serif, system-ui, sans-serif"
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: 1.7
    fontFeature: "\"ss02\", \"kern\""
  label:
    fontFamily: "IBM Plex Sans, ui-sans-serif, system-ui, sans-serif"
    fontSize: "0.875rem"
    fontWeight: 500
    lineHeight: 1.375
  mono:
    fontFamily: "IBM Plex Mono, ui-monospace, Cascadia Code, monospace"
    fontSize: "0.85em"
    fontWeight: 400
rounded:
  sm: "6px"
  md: "6px"
  lg: "10px"
  full: "9999px"
spacing:
  page-x: "16px"
  page-x-sm: "32px"
  section: "48px"
  block: "24px"
  row: "16px"
components:
  button-primary:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.paper}"
    rounded: "{rounded.md}"
    padding: "0 12px"
    height: "36px"
  button-primary-hover:
    backgroundColor: "{colors.primary-strong}"
  button-ghost-hover:
    backgroundColor: "{colors.muted}"
    textColor: "{colors.ink}"
  quiz-option:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.ink}"
    rounded: "{rounded.lg}"
    padding: "14px 16px"
  quiz-option-selected:
    backgroundColor: "{colors.primary-soft}"
  quiz-option-correct:
    backgroundColor: "{colors.success-soft}"
  quiz-option-incorrect:
    backgroundColor: "{colors.danger-soft}"
  callout-exam-trap:
    backgroundColor: "{colors.coral-soft}"
    textColor: "{colors.coral-ink}"
    rounded: "{rounded.lg}"
    padding: "14px 16px"
  objective-tag:
    backgroundColor: "{colors.primary-soft}"
    textColor: "{colors.primary-strong}"
    rounded: "{rounded.full}"
    padding: "4px 12px"
---

# Design System: AI-200 Learn

Source of truth: `app/globals.css`. Every value below is read from the shipped code. Dark mode values live in the `.dark` block of that file; the table in Colors lists both.

## Overview

**Creative North Star: "The Exam Blueprint"**

The direction is "Clean product": a calm, documentation-grade study tool in one blue and slate. The identity comes from the exam itself. The four AI-200 skill areas and their weights appear as horizontal "blueprint" bars in the logo, the home page, the Open Graph images and the score report. Everything else stays quiet so long-form notes and quiz questions can be read for an hour without fatigue.

Density is moderate. Lists are rows split by hairline dividers, not grids of cards. Depth comes from tonal surfaces and 1px borders, not shadows. Coral is a scarce signal for exam traps. The site is unofficial: no Microsoft logos, badges or brand marks, and nothing that implies affiliation.

**Key Characteristics:**
- One brand hue (blue) on slate neutrals; navy dark mode.
- Blueprint weight bars as the single recurring signature.
- Rows with hairline dividers; cards only where a block is a self-contained target (options, callouts, prev/next).
- Flat surfaces, 1px borders, 6px controls, 10px panels.
- IBM Plex Sans throughout, IBM Plex Mono for code.

## Colors

A single confident blue over cool slate, with a coral accent held back for traps and four status colors that always pair with an icon or text.

| Token | Light | Dark | Use |
|---|---|---|---|
| `--primary` | #0177d1 | #3b9cff | Links, primary buttons, active nav, focus ring (`--ring`), chart-1 |
| `--primary-strong` | #0164b0 | #6cb5ff | Primary hover; text on `primary-soft` |
| `--primary-soft` | #e8f2fc | #11294a | Selected option, tip/important callouts, objective tags, meter track |
| `--primary-foreground` | #ffffff | #0a1220 | Text on primary fills |
| `--coral` | #f0643a | #ff8a66 | Exam-trap borders and highlight icons only (non-text) |
| `--coral-ink` | #b9431f | #ff9d7f | Any coral text, e.g. the "Exam trap" label |
| `--coral-soft` | #fff3ee | #2a1914 | Exam-trap callout fill |
| `--success` / `-soft` | #127a43 / #edf8f1 | #4ade80 / #0f2a1c | Correct answers, passed status |
| `--danger` / `-soft` | #c81e4a / #fdf0f3 | #ff6b8b / #2c1420 | Incorrect answers, caution callout, destructive |
| `--warning` / `-soft` | #8a5a00 / #fff7e6 | #fbbf24 / #2a2110 | Warning status: below-pass score pill, countdown under 5 min |
| `--background` | #ffffff | #0a1220 | Page |
| `--surface` | #f6f8fb | #0f1a2b | Sidebar, code blocks, table heads, note callouts, active nav pill |
| `--card` | #ffffff | #111c2e | Option buttons, star prompt |
| `--foreground` | #0e1726 | #e6edf7 | Primary text (prose body at 85% opacity) |
| `--muted` | #eef2f7 | #17243a | Hover fills, bar tracks |
| `--muted-foreground` | #5b6b82 | #94a3b8 | Secondary text, metadata, captions |
| `--border` | #e2e8f0 | #22304a | Hairlines, dividers, panel borders |
| `--border-strong` | #cbd5e1 | #31415e | Inputs, option letter rings, list markers |
| `--chart-1..5` | #0177d1 #f0643a #5fa8e8 #0f3f6b #94a3b8 | #2f8ff0 #dc5f38 #9cc9f5 #1d5fa3 #64748b | Data marks, ordered for adjacent contrast |

Dark chart colors were checked with the dataviz palette validator against #0a1220. Syntax colors (`--code-*`) are tuned to reach 4.5:1 on `--surface` in both themes; do not reuse them outside code.

**The One Blue Rule.** Blue is the only brand hue. Interactive means blue; nothing decorative is blue.

**The Trap Rule.** Coral marks exam traps and small highlights (the star icon). It is never a button, link, or heading color. Coral text always uses `--coral-ink`; raw `--coral` fails AA as text on white.

**The Status Pair Rule.** Success, danger and warning never carry meaning by color alone: each pairs with an icon (Check, X, CircleAlert) or a text label.

## Typography

**Body and Display Font:** IBM Plex Sans (400/500/600/700, via `next/font`, fallback system-ui)
**Mono Font:** IBM Plex Mono (400/500), fallback ui-monospace, Cascadia Code

**Character:** One technical humanist family at every level; hierarchy comes from size and weight 600, not from a second face. Stylistic set `ss02` and kerning are on globally.

### Hierarchy
Scale is 1.25 from a 16px base (Tailwind keys overridden in `@theme`).

| Key | Size | Line height | Used for |
|---|---|---|---|
| `text-5xl` | 3.052rem | 1.05 | Home hero H1 at `sm+` only |
| `text-4xl` | 2.441rem | 1.12 | Page H1 (index pages; doc H1 at `sm+`) |
| `text-3xl` | 1.953rem | 1.2 | Doc H1 on mobile, home section H2 |
| `text-2xl` | 1.5625rem | 1.3 | Prose H2, stat values, area headings |
| `text-xl` | 1.25rem | 1.45 | Prose H3, module/area H2 in lists |
| `text-lg` | 1.125rem | 1.6 | Lead paragraph under H1 (muted) |
| `text-base` | 1rem | 1.7 | Body, prose, quiz options |
| `text-sm` | 0.875rem | 1.375rem | Nav, labels, metadata, buttons, tables |
| `text-xs` | 0.75rem | 1rem | Tags, code-block header, captions |

Headings are weight 600 with `tracking-tight` and `text-wrap: balance`. Prose paragraphs use `text-wrap: pretty`. Numbers in stats, meters and counters use the `.tabular` class.

**The 70ch Rule.** Reading measure is capped at 70ch (`.prose`, doc headers and footers); short intros use 62ch.

**The No Eyebrow Rule.** Headings stand alone. No small uppercase kicker or label above a heading.

## Layout

- Shell: sticky 64px top bar (`bg-background/75` with backdrop blur), content container `max-w-[90rem]`, horizontal padding 16px, 24-32px from `sm`.
- Study pages: left sidebar (paths with per-path Meter), article column, and a 14rem "On this page" TOC from `xl` (`grid-cols-[minmax(0,1fr)_14rem]`, gap 48px).
- Vertical rhythm: page padding 32px, 48px at `lg`; prose H2 top margin 48px; blocks (callouts, code) 24px; paragraphs 20px.
- Index pages (study, practice, exams, search, 404) are vertical lists: `divide-y divide-border`, often bracketed by `border-y`.
- `scroll-padding-top: 5rem` keeps anchored headings clear of the top bar.

## Elevation & Depth

Flat. Depth is tonal: `--background` for the page, `--surface` for recessed regions, `--card` for interactive blocks, each edged with a 1px `--border`. The only shadow is the search dialog overlay (`0 24px 60px -20px rgb(14 23 38 / 0.35)`), which floats above the page.

**The Border Not Shadow Rule.** Separate with a hairline or a surface step. Hover states change border color (`primary/50`) or fill, never lift.

## Shapes

- Controls (buttons, nav links, inputs, skip link): 6px (`--radius-md`).
- Panels and options (quiz options, callouts, code blocks, star prompt, prev/next, blockquotes, images): 10px (`--radius-lg`).
- Pills (`rounded-full`) only for tags and status: objective tags, the pass/below-pass score pill, single-select option letter, meter and bar tracks.
- Inline code: small 6px radius with a 1px border on `--surface`.
- Logo tile: rounded square with four white bars.

## Components

### Buttons (`components/ui/button.tsx`)
- 6px radius, `text-sm` weight 500, heights 24/32/36/40px (`xs`/`sm`/default/`lg`).
- **Default:** primary fill, `primary-foreground` text, hover `primary-strong`, 1px press nudge.
- **Outline / Secondary / Ghost:** border on background, secondary fill, or transparent; all hover to `--muted`.
- **Destructive:** tinted danger (10% fill, danger text), not solid.
- **Link:** primary text, underline on hover.
- Icons are lucide at 16px. A trailing arrow icon is allowed only on in-flow step controls (quiz Next); nav links and text links carry no arrow tail.

### Quiz option (`components/quiz/option-button.tsx`)
- Full-width 10px panel, 14px/16px padding, letter badge (circle for single, 6px square for multi).
- States: idle border with hover `primary/50` + surface; selected primary border + `primary-soft`; correct success border + soft fill + Check; incorrect danger + X; missed dashed success border. Each result state adds a text label.
- Semantics: `role="radio"` or `"checkbox"` with `aria-checked`; single-select groups use a roving tabindex with arrow keys (radio-group pattern in `question-card.tsx`).

### Callout (`components/doc/callout.tsx`)
- 10px panel, 1px tinted border, icon plus a bold `text-sm` label in the tone color.
- Note: surface. Tip / Important: primary-soft. **Warning renders as "Exam trap"** in coral-soft with coral-ink. Caution: danger-soft. Body uses `.callout-body` (tighter 8px rhythm).

### Data visuals (`components/viz.tsx`)
- **BlueprintBars** (signature): one row per skill area, label left, weight range right, 10px-tall bar on a 0-40% shared axis; solid `chart-1` for the minimum, `chart-1/35` for the range to the maximum.
- **Meter:** 6px (4px in sidebar) pill track in `primary-soft`, `chart-1` fill, `role="progressbar"`.
- **AccuracyBars:** per-area bars with a `foreground/60` pass reference line and legend; sr-only table equivalent.
- **StatTile:** muted `text-sm` label over a `text-2xl` tabular value, inside a `dl`.
- Rules: values are printed in text ink, never in series color; one hue per chart; every mark has a screen-reader equivalent.

### Navigation (`components/shell/*`)
- Top bar links: `text-sm` medium, muted, active = foreground on `--surface`. Mobile: disclosure menu below `lg`, active = primary text.
- Sidebar: collapsible path groups with chevrons and a Meter; topics in a left-ruled list, current topic `primary-soft` fill with `primary-strong` text.
- Prev/next: two bordered 10px link panels with chevrons, hover border `primary/50`.

### Prose (`.prose`, `.prose-compact`)
- `.prose` for study notes (70ch, see Typography); tables with surface header and hairline rows; blockquotes as surface panels.
- `.prose-compact` for Markdown inside UI (questions, options, explanations): 12px paragraph rhythm, inherits size.
- Anything self-styled (callouts, code blocks) sits inside `.not-prose`.

### Code block (`components/code-block.tsx`)
- 10px surface panel with a hairline header (language label `text-xs`, copy button). Syntax uses `--code-*` tokens only.

### Star prompt (`components/star-prompt.tsx`)
- 10px bordered card, `text-lg` title, GitHub star button (coral star icon). Card variant is dismissible and remembered; section variant is always shown.

### Logo and OG images
- `LogoIcon`: four white bars on a #0177d1 rounded square, widths follow the skill-area weights. Wordmark "AI-200 **Learn**" with "Learn" in primary.
- `lib/og.tsx` repeats the blueprint bars at 1200x630 with literal light-theme hex values; keep them in sync with the tokens.

## Accessibility

- All text pairs meet WCAG AA in both themes (checked when tokens were set).
- `:focus-visible` = 2px solid `--ring`, 2px offset, on every interactive element.
- Skip link to `#main` is the first focusable element.
- `prefers-reduced-motion` reduces all animation and transition to ~0.
- Color is never the only signal (icons and labels on all status states).

## Do's and Don'ts

### Do:
- **Do** take every color from a token; add a token to `globals.css` (both themes, AA-checked) before using a new color.
- **Do** list content as rows with hairline dividers (`divide-y divide-border`).
- **Do** use 6px for controls, 10px for panels, pills only for tags and status.
- **Do** use `--coral-ink` for coral text and keep coral to exam traps and small highlights.
- **Do** pair every success, danger and warning state with an icon or label.
- **Do** cap reading measure at 70ch and use `.tabular` for numbers.
- **Do** reuse BlueprintBars when showing the four skill areas.

### Don't:
- **Don't** add Microsoft logos, badges, or wording that implies affiliation.
- **Don't** build card grids for lists of paths, topics, or exams.
- **Don't** put eyebrow labels or uppercase kickers above headings.
- **Don't** add arrow tails ("Read more ->") to links.
- **Don't** use coral for buttons, links, or headings, or amber for anything other than warning status.
- **Don't** add shadows to cards or panels; the search dialog is the only floating layer.
- **Don't** introduce a second typeface or a display font.
- **Don't** color data values in series color, or use more than one hue for a single-measure chart.
