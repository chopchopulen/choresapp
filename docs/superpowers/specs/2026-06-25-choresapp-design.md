# Chores App — Design Spec

**Date:** 2026-06-25  
**Repo:** chopchopulen/choresapp  
**Stack:** Vite + React + TypeScript, Supabase (Phase 2), Vercel, PWA

---

## Overview

Mobile-first web app for 5 roommates to track apartment chores. The apartment floor plan is the primary UI — tappable hotspots on the floor plan illustration represent chore locations. Hotspots change visual state (clean / dirty / claimed) and a popup card provides actions.

**Roommates:** Ariel, Aleena, Angela, Dylan, Harry

---

## Phase Scope

**Phase 1 (this plan):** Core tap-to-flag mechanic with localStorage state. No backend.  
**Phase 2 (deferred):** Swap localStorage for Supabase Realtime. No component changes needed.  
**Deferred entirely:** Points/scoring system, push notifications, auth beyond name-picker.

---

## Architecture

```
src/
  assets/
    floorplan1.png          # floor plan illustration
    floorplanpopup1.png     # 3×3 grid of 9 mess-state scene illustrations
  components/
    FloorPlan.tsx           # floor plan image + all hotspot overlays
    Hotspot.tsx             # single tappable spot, renders per ChoreState
    ChorePopup.tsx          # bottom-sheet popup: actions + mess thumbnail
    UserPicker.tsx          # full-screen "tap your name" on first open
    StatusBar.tsx           # top bar: app title + current user chip + switch
  data/
    chores.ts               # 9 hotspot definitions (id, label, room, position %, scene crop)
    roommates.ts            # ['Ariel','Aleena','Angela','Dylan','Harry']
  hooks/
    useChores.ts            # all state logic — localStorage Phase 1, Supabase Phase 2
  App.tsx
  main.tsx
```

---

## Data Model

```ts
type ChoreState = 'clean' | 'dirty' | 'claimed'

interface Chore {
  id: string           // e.g. 'kitchen-sink'
  state: ChoreState
  flaggedBy?: string   // roommate name
  claimedBy?: string   // roommate name
  flaggedAt?: string   // ISO timestamp
}

interface ChoreDefinition {
  id: string
  label: string        // e.g. 'Kitchen Sink'
  room: string         // e.g. 'Kitchen'
  top: string          // percentage, e.g. '12%'
  left: string         // percentage
  sceneIndex: number   // 0–8, which cell in the 3×3 popup grid
}
```

---

## 9 Chore Hotspots

| # | ID | Label | Room | Scene (popup grid) |
|---|-----|-------|------|-------------------|
| 1 | kitchen-sink | Kitchen Sink | Kitchen | cell 0 (top-left) |
| 2 | trash | Trash Area | Kitchen/Hallway | cell 1 |
| 3 | lr-floor | Living Room Floor | Living Room | cell 2 |
| 4 | bath1-sink | Bathroom Sink | Bathroom 1 | cell 3 |
| 5 | bath1-toilet | Toilet | Bathroom 1 | cell 4 |
| 6 | tub | Shower/Tub | Shower/Tub Room | cell 5 |
| 7 | lr-couch | Couch | Living Room | cell 6 |
| 8 | laundry | W/D Laundry | W/D Closet | cell 7 |
| 9 | plant | Potted Plant | Living Room | cell 8 |

Hotspot pixel positions are set as percentages of floor plan image dimensions and tuned after the image renders at actual display size.

---

## State Machine

```
clean ──[Flag dirty]──▶ dirty ──[Claim]──▶ claimed
  ▲                       │                   │
  └──────[Mark clean]─────┘                   │
  ▲                                           │
  └──────────────[Mark clean]─────────────────┘
```

- Any roommate can flag any spot dirty (no restriction)
- Any roommate can claim any dirty spot
- Any roommate can mark any spot clean (no confirmation)
- State changes are instant — no confirmation step

---

## Hotspot Visual States

| State | Appearance |
|-------|-----------|
| clean | Small sage-green circle (#7FD9C4), semi-transparent |
| dirty | Larger pink circle (#FF8FA3), pulsing animation |
| claimed | Medium plum circle (#6B5B95), static |

Hotspots are absolutely positioned over the floor plan. Floor plan fills full viewport width on mobile.

---

## Popup Card

Triggered by tapping any hotspot. Shows:
1. Room label (Caveat font, mint color)
2. Chore name (Baloo 2, bold)
3. Mess scene thumbnail — cropped from `floorplanpopup1.png` using CSS `object-position` to isolate the correct cell
4. "Flagged by X · time ago" (if dirty/claimed)
5. Action buttons — context-aware:
   - If clean: **Flag dirty**
   - If dirty: **Claim**, **Mark clean**
   - If claimed: **Mark clean**, plus "Claimed by X"
6. Cancel button

---

## User Identity

On first open: full-screen UserPicker — 5 name buttons, tap to select.  
Selection stored in `localStorage` as `currentUser`.  
StatusBar shows current user with a chip; tapping chip re-opens UserPicker.  
No passwords, no sessions, no auth — 5 trusted roommates.

---

## Design Tokens

| Token | Value |
|-------|-------|
| Background | #FFF8F0 (warm cream) |
| Pink | #FF8FA3 (bubblegum) |
| Mint | #7FD9C4 |
| Yellow | #FFD66B (butter) |
| Plum | #6B5B95 (headers/text) |
| Body text | #3A2E39 (deep plum-black) |
| Display font | Baloo 2 (700 weight) |
| Body font | Inter |
| Accent font | Caveat (hand-lettered labels) |

---

## Tech Setup

- **Scaffold:** `npm create vite@latest choresapp -- --template react-ts`
- **Styling:** Tailwind CSS v3 with custom theme extending the above tokens
- **PWA:** `vite-plugin-pwa` — manifest, icons, "Add to Home Screen" on iOS/Android
- **State Phase 1:** React `useReducer` + `localStorage` persistence via `useChores` hook
- **State Phase 2:** Replace `useChores` internals with Supabase Realtime (no component changes)
- **Deploy:** Vercel — connected to GitHub repo, auto-deploy on push to main
- **Images:** `floorplan1.png` and `floorplanpopup1.png` copied into `src/assets/`

---

## GitHub Repo Setup

- Repo: `chopchopulen/choresapp` (public)
- Default branch: `main`
- `.gitignore`: standard Vite/Node template + `.superpowers/`
- Initial commit: scaffolded Vite project with assets copied in

---

## PWA Manifest

- `name`: "Apt 4B Chores"
- `short_name`: "Chores"
- `theme_color`: #6B5B95
- `background_color`: #FFF8F0
- `display`: standalone
- Icons: 192×192 and 512×512 (generated from a simple cottagecore house icon)
