# Design Brief — LectureAI

## Tone & Purpose
Refined minimalism meets warm intelligence. A calm, focused learning companion that helps students capture, organize, and deeply understand lecture content without cognitive overload.

## Color Palette

| Token | Light (L C H) | Dark (L C H) | Usage |
|-------|---|---|---|
| Primary | `0.45 0.18 268` | `0.68 0.2 268` | Deep indigo for primary actions, highlights, interactive elements |
| Accent | `0.65 0.19 45` | `0.72 0.22 45` | Warm amber for CTAs, timestamps, AI responses |
| Secondary | `0.88 0.08 240` | `0.32 0.06 240` | Light violet for supporting UI, backgrounds |
| Muted | `0.92 0.01 0` | `0.24 0.02 270` | Neutral greys for borders, dividers, secondary text |
| Destructive | `0.55 0.22 25` | `0.65 0.19 22` | Red for errors and deletion states |

## Typography

| Role | Font | Size | Weight | Usage |
|------|------|------|--------|-------|
| Display | General Sans | 24–32px | 600–700 | Page titles, lecture summaries |
| Body | Figtree | 14–16px | 400–500 | Transcript, main content, descriptions |
| Mono | Geist Mono | 12–14px | 400 | Timestamps, code blocks, metadata |

## Elevation & Depth

| Component | Shadow | Background | Border |
|-----------|--------|------------|--------|
| Card | `shadow-card` | `bg-card` | `border border-border` |
| Elevated (Modal, Popover) | `shadow-elevated` | `bg-popover` | `border border-border` |
| Input | `shadow-xs` | `bg-input` | `border border-border` |
| Navigation | None | `bg-sidebar` | `border-b border-sidebar-border` |

## Structural Zones

| Zone | Background | Purpose |
|------|------------|---------|
| Header | `bg-sidebar` with `border-b` | Navigation, logo, user menu |
| Main Content | `bg-background` | Lecture transcript, AI summary, notes |
| Sidebar | `bg-sidebar` | Lecture history, navigation menu |
| Cards | `bg-card` with `shadow-card` | Summary panels, Q&A items, metadata |
| Footer | `bg-muted/20` with `border-t` | Help links, support, download options |

## Spacing & Rhythm
- **Base unit**: 4px (sm: 2, md: 4, lg: 8, xl: 16, 2xl: 32)
- **Card padding**: 16–24px
- **Section gap**: 24–32px
- **Text leading**: 1.5–1.6 (generous for readability)

## Component Patterns
- **Buttons**: Primary (indigo bg, white text), Secondary (violet bg, indigo text), Accent (amber bg, dark text)
- **Input fields**: `bg-input` with `border-border`, focus ring in `ring-primary`
- **Transcript line**: Timestamp (mono, warm accent), text (body, left-aligned)
- **Card interaction**: Hover lift with `shadow-elevated`, smooth transition
- **Badge**: Muted background, semantic color for status (success, warning, destructive)

## Motion & Interaction
- **Transitions**: `transition-smooth` (all 0.3s cubic-bezier)
- **Entrance**: `animate-fade-in` for modals, `animate-slide-up` for cards
- **Hover**: Shadow lift, opacity increase on interactive elements
- **Active state**: Deeper color, no motion (instant feedback)

## Signature Detail
Interactive transcript with color-coded timestamps. Timestamps in warm amber create visual anchors and guide students through the lecture. AI responses highlighted with subtle indigo accent bar on left. Download options presented as warm amber buttons to emphasize student agency.

## Differentiation
Clean, focused interface prioritizes lecture content over decoration. Generous whitespace and soft corners create approachability. Warm amber accents inject personality while remaining professional. Dark mode optimized for extended study sessions.

## Constraints & Guardrails
- No full-page gradients or busy patterns
- Avoid color mixing across palettes (indigo + amber only, no secondary colors in buttons)
- All shadows use opacity, not blurs > 12px
- Text contrast maintained at AA+ in both modes
- Mobile-first responsive design with sm/md/lg breakpoints
