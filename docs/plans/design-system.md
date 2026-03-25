Design System: "Technical Blueprint"

Version: 2.0 (Readability-First Refresh)

Status: Active

Aesthetic Classification: Substack-grade readability meets digital industrial data presentation.

1. Core Philosophy

This system prioritizes reading comfort above all else. Long-form crypto research must be effortless to consume — clean backgrounds, generous line heights, high-contrast text, and focused reading columns.

The 3 Laws

The Metaphor: A research publication designed by a typographer, annotated by a quant.

The Rule of Readability: Text must be immediately comfortable to read at any screen size. 16px minimum for body, 1.8 line height, high-contrast ink.

The Rule of Focus: White canvas, minimal visual noise. Let the content breathe.

The Rule of Edge: Containers are sharp (0px radius); controls are organic (999px radius).

2. Color System & Harmony

2.1 Light Theme (Default)

The light theme uses a clean white canvas — no gray backgrounds. This is the Substack approach: pure white reading surface with high-contrast text.

2.1.1 Surface Tokens

Token | Hex | Role
surface-canvas | #FFFFFF | Global background (pure white)
surface-card | #FFFFFF | Card background (same as canvas for seamless reading)
surface-subtle | #F7F7F8 | Table headers, code blocks, subtle differentiation
surface-elevated | #FFFFFF | Modals, popovers

2.1.2 Ink Tokens

Token | Hex | Contrast on White | Role
ink-primary | #1A1A1A | 15.4:1 | Headlines, body text (near-black for max readability)
ink-secondary | #4A4A4A | 9.7:1 | Descriptions, secondary text (comfortably readable)
ink-tertiary | #8A8A8A | 3.9:1 | Labels, timestamps, metadata (passes AA for large text)
ink-on-accent | #FFFFFF | — | Text on accent backgrounds

2.1.3 Accent Tokens (Violet — Brand)

Token | Hex | Role
color-accent-main | #3A2E6F | Primary actions, links, badges
color-accent-hover | #4D4085 | Hover state
color-accent-subtle | #F3F1FA | Faint accent wash backgrounds
color-accent-muted | #E2DEF2 | Accent borders, selected states

2.1.4 Signal Tokens

Token | Hex | Subtle Bg | Role
signal-error | #B3261E | #FEF3F2 | Critical / bearish
signal-warning | #B8860B | #FFFBEB | Attention / neutral
signal-success | #006E50 | #F0FAF6 | Operational / bullish

2.1.5 Border Tokens

Token | Hex | Role
border-grid | #E5E5E5 | Structural dividers
border-element | #EBEBEB | Subtle borders (barely visible on white)
border-strong | #1A1A1A | Emphatic borders

2.2 Dark Theme

Token | Hex | Role
surface-canvas | #0C0D10 | Global background
surface-card | #16171C | Card background
surface-subtle | #1E1F26 | Internal segmentation
surface-elevated | #22232A | Popovers

ink-primary | #E8E9ED | Headlines, body text
ink-secondary | #9AA0A6 | Secondary text
ink-tertiary | #585C65 | Metadata, labels

color-accent-main | #7B6FBF | Primary actions (lighter violet for dark bg)
color-accent-hover | #9589D4 | Hover state
color-accent-subtle | #1E1A33 | Accent wash
color-accent-muted | #2E2850 | Accent borders

3. Typography (Readability-First)

The type system prioritizes comfortable long-form reading. Body text is 16px — the same as Substack, Medium, and every top-tier reading platform.

Primary Font: Geist Sans (clean, neutral, excellent x-height).
Data Font: Geist Mono (humanist monospace for tables/data).

3.1 Type Scale

Role | Weight | Size | Line Height | Tracking | Case
Display XL | Light (300) | 48px | 1.0 | -2.5% | Sentence
H1 Title | Bold (700) | 28–36px | 1.15 | -3% | Sentence
H2 Section | Bold (700) | 18px | 1.3 | -1% | Sentence
Body Reading | Regular (400) | 16px | 1.8 | 0% | Sentence
Body Secondary | Regular (400) | 15px | 1.7 | 0% | Sentence
Callout | Regular (400) | 15px | 1.7 | 0% | Sentence
Label/Micro | SemiBold (600) | 11px | 1.0 | 6–10% | UPPERCASE
Data Mono | Regular (400) | 14px | 1.4 | 0% | Tabular Nums

3.2 Typographic Rules

- Body text uses --ink-primary (#1A1A1A in light), never --ink-secondary.
- Max reading width: 680px for prose, 820px for data.
- Paragraph spacing: 1.25em between paragraphs.
- Tabular Figures: All numbers in data tables use font-variant-numeric: tabular-nums.

4. Layout

4.1 Reading Column

The blog uses a focused single-column reading layout (max-width: 680px for prose) with an optional sticky sidebar for table of contents on desktop (width: 220px).

4.2 Homepage Feed

Stacked post feed with:
- Latest post gets accent left-border treatment
- Category pills with filter functionality
- Search bar at top
- Max content width: 1200px

4.3 Spacing

- Section gaps in blog: 12px margin-bottom on section headers
- Paragraph spacing: 1.25em
- Callout padding: 16px 20px
- Card padding: 14px 16px

5. Component Library

5.1 Containers

Shape: Rectangular, border-radius: 0px.
Background: --surface-card (white in light theme — seamless with canvas).
Border: 1px --border-element.

5.2 Callout Boxes

Left border: 3px colored by variant (error/success/warning/accent).
Background: variant-subtle color.
Text: --ink-primary (not secondary — callouts must be readable).
Font size: 15px, line-height: 1.7.

5.3 Buttons & Controls

Primary: Solid --color-accent-main background, white text.
Secondary: Transparent, 1px --color-accent-main border.
Shape: border-radius: 999px (pill).

5.4 Data Tables

Header: --surface-subtle background, 11px uppercase labels in --ink-secondary.
Cells: 14px monospace, --ink-primary text, 10-14px padding.
Borders: 1px --border-element between rows, 2px --border-strong under header.

5.5 Stat Grids

1px gap grid with --border-element separator.
Values: 18px bold monospace.
Labels: 10px uppercase --ink-tertiary.

6. Header

Sticky, 56px height.
Light theme: white background with blur (rgba(255,255,255,0.95)).
Dark theme: near-black with blur (rgba(12,13,16,0.92)).
Logo: theme-aware (dark wordmark on light, light wordmark on dark).

7. Developer Handoff (CSS Variables)

:root, [data-theme="light"] {
  --surface-canvas: #FFFFFF;
  --surface-card: #FFFFFF;
  --surface-subtle: #F7F7F8;
  --surface-elevated: #FFFFFF;

  --ink-primary: #1A1A1A;
  --ink-secondary: #4A4A4A;
  --ink-tertiary: #8A8A8A;
  --ink-on-accent: #FFFFFF;

  --color-accent-main: #3A2E6F;
  --color-accent-hover: #4D4085;
  --color-accent-subtle: #F3F1FA;
  --color-accent-muted: #E2DEF2;

  --signal-error: #B3261E;
  --signal-error-subtle: #FEF3F2;
  --signal-warning: #B8860B;
  --signal-warning-subtle: #FFFBEB;
  --signal-success: #006E50;
  --signal-success-subtle: #F0FAF6;

  --border-grid: #E5E5E5;
  --border-element: #EBEBEB;
  --border-strong: #1A1A1A;
}

[data-theme="dark"] {
  --surface-canvas: #0C0D10;
  --surface-card: #16171C;
  --surface-subtle: #1E1F26;
  --surface-elevated: #22232A;

  --ink-primary: #E8E9ED;
  --ink-secondary: #9AA0A6;
  --ink-tertiary: #585C65;
  --ink-on-accent: #FFFFFF;

  --color-accent-main: #7B6FBF;
  --color-accent-hover: #9589D4;
  --color-accent-subtle: #1E1A33;
  --color-accent-muted: #2E2850;

  --signal-error: #F2726A;
  --signal-error-subtle: #2A1615;
  --signal-warning: #F5CE5C;
  --signal-warning-subtle: #2A2410;
  --signal-success: #4FD1A5;
  --signal-success-subtle: #0F2A22;

  --border-grid: #2A2B33;
  --border-element: #22232A;
  --border-strong: #E8E9ED;
}
