# Chores App Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a mobile-first floor-plan chores app for 5 roommates — tap hotspots on the floor plan to flag/claim/clean chores, with localStorage state in Phase 1.

**Architecture:** Vite + React + TypeScript. A single `useChores` hook owns all state (localStorage now, Supabase later). `FloorPlan` renders the image + absolutely-positioned `Hotspot` components. Tapping a hotspot opens a `ChorePopup` bottom sheet. `UserPicker` handles identity on first open.

**Tech Stack:** Vite 5, React 18, TypeScript, Tailwind CSS v3, Vitest, @testing-library/react, vite-plugin-pwa

---

## File Map

| File | Responsibility |
|------|---------------|
| `src/data/chores.ts` | `ChoreDefinition[]` — hotspot positions + scene indices. `Chore` type. |
| `src/data/roommates.ts` | `string[]` — roommate names |
| `src/hooks/useChores.ts` | All chore state — reducer + localStorage persistence |
| `src/components/UserPicker.tsx` | Full-screen name selection |
| `src/components/StatusBar.tsx` | App title + current user chip |
| `src/components/Hotspot.tsx` | Single tappable dot, renders per ChoreState |
| `src/components/ChorePopup.tsx` | Bottom-sheet popup — mess thumbnail + action buttons |
| `src/components/FloorPlan.tsx` | Floor plan image + all hotspots + popup orchestration |
| `src/App.tsx` | UserPicker → FloorPlan flow, currentUser state |
| `src/index.css` | Google Fonts import, Tailwind directives, base styles |
| `vite.config.ts` | Vite config with react + PWA plugins |
| `tailwind.config.ts` | Custom design tokens (colors, fonts) |
| `public/icon-192.png` | PWA icon 192×192 |
| `public/icon-512.png` | PWA icon 512×512 |

---

## Task 1: Scaffold Vite project

**Files:**
- Create: `package.json`, `vite.config.ts`, `tsconfig.json`, `tsconfig.node.json`, `index.html`, `src/main.tsx`, `src/App.tsx`, `src/index.css`, `tailwind.config.ts`, `postcss.config.js`

- [ ] **Step 1: Scaffold in the existing directory**

```bash
cd /Users/harry/Projects/choresapp
npm create vite@latest . -- --template react-ts
```

When prompted "Current directory is not empty. Please choose how to proceed" → select **Ignore files and continue**.  
When prompted for framework → **React**.  
When prompted for variant → **TypeScript**.

- [ ] **Step 2: Install runtime dependencies**

```bash
npm install
npm install -D tailwindcss@3 autoprefixer postcss vite-plugin-pwa workbox-window
```

- [ ] **Step 3: Install test dependencies**

```bash
npm install -D vitest @vitest/coverage-v8 @testing-library/react @testing-library/user-event jsdom
```

- [ ] **Step 4: Configure Tailwind**

Replace `tailwind.config.ts` (create if absent):

```ts
import type { Config } from 'tailwindcss'

export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        cream:     '#FFF8F0',
        pink:      '#FF8FA3',
        mint:      '#7FD9C4',
        yellow:    '#FFD66B',
        plum:      '#6B5B95',
        'deep-plum': '#3A2E39',
      },
      fontFamily: {
        display: ['"Baloo 2"', 'sans-serif'],
        body:    ['Inter',     'sans-serif'],
        accent:  ['Caveat',    'cursive'],
      },
    },
  },
} satisfies Config
```

- [ ] **Step 5: Create PostCSS config**

```js
// postcss.config.js
export default {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
}
```

- [ ] **Step 6: Configure Vite + Vitest**

Replace `vite.config.ts`:

```ts
/// <reference types="vitest" />
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      manifest: {
        name: 'Apt 4B Chores',
        short_name: 'Chores',
        theme_color: '#6B5B95',
        background_color: '#FFF8F0',
        display: 'standalone',
        icons: [
          { src: 'icon-192.png', sizes: '192x192', type: 'image/png' },
          { src: 'icon-512.png', sizes: '512x512', type: 'image/png' },
        ],
      },
    }),
  ],
  test: {
    environment: 'jsdom',
    globals: true,
  },
})
```

- [ ] **Step 7: Add test scripts to package.json**

Add to `package.json` under `"scripts"`:
```json
"test": "vitest",
"test:run": "vitest run"
```

- [ ] **Step 8: Set up index.css**

Replace `src/index.css`:

```css
@import url('https://fonts.googleapis.com/css2?family=Baloo+2:wght@400;600;700&family=Inter:wght@400;500&family=Caveat:wght@400;600&display=swap');

@tailwind base;
@tailwind components;
@tailwind utilities;

body {
  @apply bg-cream font-body text-deep-plum;
  -webkit-tap-highlight-color: transparent;
}
```

- [ ] **Step 9: Verify dev server starts**

```bash
npm run dev
```

Expected: Vite dev server starts on `http://localhost:5173`, default React page loads.

- [ ] **Step 10: Commit**

```bash
git add -A
git commit -m "feat: scaffold Vite + React + TS project with Tailwind and PWA"
```

---

## Task 2: Copy assets + define data layer

**Files:**
- Create: `src/assets/floorplan1.png`, `src/assets/floorplanpopup1.png`
- Create: `src/data/chores.ts`, `src/data/roommates.ts`

- [ ] **Step 1: Copy images into src/assets/**

```bash
mkdir -p /Users/harry/Projects/choresapp/src/assets
cp /Users/harry/Downloads/floorplan1.png /Users/harry/Projects/choresapp/src/assets/
cp /Users/harry/Downloads/floorplanpopup1.png /Users/harry/Projects/choresapp/src/assets/
```

- [ ] **Step 2: Create src/data/roommates.ts**

```ts
export const ROOMMATES = ['Ariel', 'Aleena', 'Angela', 'Dylan', 'Harry'] as const
export type Roommate = typeof ROOMMATES[number]
```

- [ ] **Step 3: Create src/data/chores.ts**

```ts
export type ChoreState = 'clean' | 'dirty' | 'claimed'

export interface Chore {
  id: string
  state: ChoreState
  flaggedBy?: string
  claimedBy?: string
  flaggedAt?: string
}

export interface ChoreDefinition {
  id: string
  label: string
  room: string
  top: string   // percentage of floor plan image height
  left: string  // percentage of floor plan image width
  sceneIndex: number  // 0–8, position in 3×3 popup grid image
}

export const CHORE_DEFINITIONS: ChoreDefinition[] = [
  { id: 'kitchen-sink',  label: 'Kitchen Sink',     room: 'Kitchen',           top: '13%', left: '37%', sceneIndex: 0 },
  { id: 'trash',         label: 'Trash Area',        room: 'Kitchen / Hallway', top: '43%', left: '35%', sceneIndex: 1 },
  { id: 'lr-floor',      label: 'Living Room Floor', room: 'Living Room',       top: '65%', left: '15%', sceneIndex: 2 },
  { id: 'bath1-sink',    label: 'Bathroom Sink',     room: 'Bathroom 1',        top: '70%', left: '48%', sceneIndex: 3 },
  { id: 'bath1-toilet',  label: 'Toilet',            room: 'Bathroom 1',        top: '80%', left: '44%', sceneIndex: 4 },
  { id: 'tub',           label: 'Shower / Tub',      room: 'Shower/Tub Room',   top: '70%', left: '62%', sceneIndex: 5 },
  { id: 'lr-couch',      label: 'Couch',             room: 'Living Room',       top: '76%', left: '8%',  sceneIndex: 6 },
  { id: 'laundry',       label: 'W/D Laundry',       room: 'W/D Closet',        top: '40%', left: '6%',  sceneIndex: 7 },
  { id: 'plant',         label: 'Potted Plant',       room: 'Living Room',       top: '58%', left: '22%', sceneIndex: 8 },
]
```

- [ ] **Step 4: Commit**

```bash
git add src/assets/ src/data/
git commit -m "feat: add floor plan assets and chore/roommate data definitions"
```

---

## Task 3: useChores hook (TDD)

**Files:**
- Create: `src/hooks/useChores.ts`
- Create: `src/hooks/useChores.test.ts`

- [ ] **Step 1: Write failing tests**

Create `src/hooks/useChores.test.ts`:

```ts
import { describe, it, expect, beforeEach } from 'vitest'
import { choreReducer } from './useChores'
import type { Chore } from '../data/chores'

describe('choreReducer', () => {
  const empty: Record<string, Chore> = {}

  beforeEach(() => {
    // reset between tests
  })

  it('FLAG_DIRTY transitions a spot to dirty', () => {
    const next = choreReducer(empty, { type: 'FLAG_DIRTY', id: 'kitchen-sink', by: 'Harry' })
    expect(next['kitchen-sink'].state).toBe('dirty')
    expect(next['kitchen-sink'].flaggedBy).toBe('Harry')
    expect(next['kitchen-sink'].flaggedAt).toBeDefined()
  })

  it('CLAIM transitions a dirty spot to claimed', () => {
    const dirty = choreReducer(empty, { type: 'FLAG_DIRTY', id: 'trash', by: 'Ariel' })
    const claimed = choreReducer(dirty, { type: 'CLAIM', id: 'trash', by: 'Dylan' })
    expect(claimed['trash'].state).toBe('claimed')
    expect(claimed['trash'].claimedBy).toBe('Dylan')
    expect(claimed['trash'].flaggedBy).toBe('Ariel')
  })

  it('MARK_CLEAN resets a spot to clean', () => {
    const dirty = choreReducer(empty, { type: 'FLAG_DIRTY', id: 'plant', by: 'Aleena' })
    const clean = choreReducer(dirty, { type: 'MARK_CLEAN', id: 'plant' })
    expect(clean['plant'].state).toBe('clean')
    expect(clean['plant'].flaggedBy).toBeUndefined()
  })

  it('MARK_CLEAN works from claimed state', () => {
    const dirty = choreReducer(empty, { type: 'FLAG_DIRTY', id: 'tub', by: 'Angela' })
    const claimed = choreReducer(dirty, { type: 'CLAIM', id: 'tub', by: 'Harry' })
    const clean = choreReducer(claimed, { type: 'MARK_CLEAN', id: 'tub' })
    expect(clean['tub'].state).toBe('clean')
    expect(clean['tub'].claimedBy).toBeUndefined()
  })

  it('does not touch other spots when one changes', () => {
    const s1 = choreReducer(empty, { type: 'FLAG_DIRTY', id: 'trash', by: 'Harry' })
    const s2 = choreReducer(s1, { type: 'FLAG_DIRTY', id: 'plant', by: 'Ariel' })
    expect(s2['trash'].state).toBe('dirty')
    expect(s2['plant'].state).toBe('dirty')
  })
})
```

- [ ] **Step 2: Run tests to verify they fail**

```bash
npm run test:run -- src/hooks/useChores.test.ts
```

Expected: FAIL — `choreReducer` not found.

- [ ] **Step 3: Implement useChores.ts**

Create `src/hooks/useChores.ts`:

```ts
import { useReducer, useEffect } from 'react'
import type { Chore } from '../data/chores'

type Action =
  | { type: 'FLAG_DIRTY'; id: string; by: string }
  | { type: 'CLAIM';      id: string; by: string }
  | { type: 'MARK_CLEAN'; id: string }

export function choreReducer(
  state: Record<string, Chore>,
  action: Action,
): Record<string, Chore> {
  switch (action.type) {
    case 'FLAG_DIRTY':
      return {
        ...state,
        [action.id]: {
          id: action.id,
          state: 'dirty',
          flaggedBy: action.by,
          flaggedAt: new Date().toISOString(),
        },
      }
    case 'CLAIM':
      return {
        ...state,
        [action.id]: { ...state[action.id], state: 'claimed', claimedBy: action.by },
      }
    case 'MARK_CLEAN':
      return {
        ...state,
        [action.id]: { id: action.id, state: 'clean' },
      }
  }
}

const STORAGE_KEY = 'choresapp-chores'

function loadFromStorage(): Record<string, Chore> {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? (JSON.parse(raw) as Record<string, Chore>) : {}
  } catch {
    return {}
  }
}

export function useChores() {
  const [chores, dispatch] = useReducer(choreReducer, undefined, loadFromStorage)

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(chores))
  }, [chores])

  return {
    chores,
    flagDirty: (id: string, by: string) => dispatch({ type: 'FLAG_DIRTY', id, by }),
    claim:     (id: string, by: string) => dispatch({ type: 'CLAIM', id, by }),
    markClean: (id: string)             => dispatch({ type: 'MARK_CLEAN', id }),
  }
}
```

- [ ] **Step 4: Run tests to verify they pass**

```bash
npm run test:run -- src/hooks/useChores.test.ts
```

Expected: 5 tests PASS.

- [ ] **Step 5: Commit**

```bash
git add src/hooks/
git commit -m "feat: add useChores hook with reducer and localStorage persistence"
```

---

## Task 4: UserPicker component (TDD)

**Files:**
- Create: `src/components/UserPicker.tsx`
- Create: `src/components/UserPicker.test.tsx`

- [ ] **Step 1: Write failing tests**

Create `src/components/UserPicker.test.tsx`:

```tsx
import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { UserPicker } from './UserPicker'

describe('UserPicker', () => {
  it('renders all 5 roommate names', () => {
    render(<UserPicker onSelect={vi.fn()} />)
    expect(screen.getByText('Ariel')).toBeTruthy()
    expect(screen.getByText('Aleena')).toBeTruthy()
    expect(screen.getByText('Angela')).toBeTruthy()
    expect(screen.getByText('Dylan')).toBeTruthy()
    expect(screen.getByText('Harry')).toBeTruthy()
  })

  it('calls onSelect with the clicked name', async () => {
    const onSelect = vi.fn()
    render(<UserPicker onSelect={onSelect} />)
    await userEvent.click(screen.getByText('Dylan'))
    expect(onSelect).toHaveBeenCalledWith('Dylan')
  })
})
```

- [ ] **Step 2: Run tests to verify they fail**

```bash
npm run test:run -- src/components/UserPicker.test.tsx
```

Expected: FAIL — `UserPicker` not found.

- [ ] **Step 3: Implement UserPicker.tsx**

Create `src/components/UserPicker.tsx`:

```tsx
import { ROOMMATES } from '../data/roommates'

interface Props {
  onSelect: (name: string) => void
}

export function UserPicker({ onSelect }: Props) {
  return (
    <div className="fixed inset-0 bg-cream flex flex-col items-center justify-center gap-6 p-8">
      <h1 className="font-display text-3xl font-bold text-plum">Who are you?</h1>
      <p className="font-accent text-xl text-mint">Tap your name to get started</p>
      <div className="flex flex-col gap-3 w-full max-w-xs mt-4">
        {ROOMMATES.map((name) => (
          <button
            key={name}
            onClick={() => onSelect(name)}
            className="w-full py-4 rounded-2xl bg-plum text-cream font-display text-lg font-semibold
                       active:scale-95 transition-transform shadow-md"
          >
            {name}
          </button>
        ))}
      </div>
    </div>
  )
}
```

- [ ] **Step 4: Run tests to verify they pass**

```bash
npm run test:run -- src/components/UserPicker.test.tsx
```

Expected: 2 tests PASS.

- [ ] **Step 5: Commit**

```bash
git add src/components/UserPicker.tsx src/components/UserPicker.test.tsx
git commit -m "feat: add UserPicker component"
```

---

## Task 5: StatusBar component (TDD)

**Files:**
- Create: `src/components/StatusBar.tsx`
- Create: `src/components/StatusBar.test.tsx`

- [ ] **Step 1: Write failing tests**

Create `src/components/StatusBar.test.tsx`:

```tsx
import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { StatusBar } from './StatusBar'

describe('StatusBar', () => {
  it('renders the app title', () => {
    render(<StatusBar currentUser="Harry" onSwitchUser={vi.fn()} />)
    expect(screen.getByText('Apt 4B Chores')).toBeTruthy()
  })

  it('shows the current user name', () => {
    render(<StatusBar currentUser="Ariel" onSwitchUser={vi.fn()} />)
    expect(screen.getByText(/Ariel/)).toBeTruthy()
  })

  it('calls onSwitchUser when user chip is tapped', async () => {
    const onSwitch = vi.fn()
    render(<StatusBar currentUser="Angela" onSwitchUser={onSwitch} />)
    await userEvent.click(screen.getByRole('button'))
    expect(onSwitch).toHaveBeenCalledOnce()
  })
})
```

- [ ] **Step 2: Run tests to verify they fail**

```bash
npm run test:run -- src/components/StatusBar.test.tsx
```

Expected: FAIL — `StatusBar` not found.

- [ ] **Step 3: Implement StatusBar.tsx**

Create `src/components/StatusBar.tsx`:

```tsx
interface Props {
  currentUser: string
  onSwitchUser: () => void
}

export function StatusBar({ currentUser, onSwitchUser }: Props) {
  return (
    <div className="flex items-center justify-between px-4 py-2.5 bg-plum text-cream">
      <span className="font-display font-bold text-base">🏠 Apt 4B Chores</span>
      <button
        onClick={onSwitchUser}
        className="bg-yellow text-deep-plum rounded-full px-3 py-1 text-xs font-semibold
                   active:scale-95 transition-transform"
      >
        {currentUser} ▾
      </button>
    </div>
  )
}
```

- [ ] **Step 4: Run tests to verify they pass**

```bash
npm run test:run -- src/components/StatusBar.test.tsx
```

Expected: 3 tests PASS.

- [ ] **Step 5: Commit**

```bash
git add src/components/StatusBar.tsx src/components/StatusBar.test.tsx
git commit -m "feat: add StatusBar component"
```

---

## Task 6: Hotspot component (TDD)

**Files:**
- Create: `src/components/Hotspot.tsx`
- Create: `src/components/Hotspot.test.tsx`

- [ ] **Step 1: Write failing tests**

Create `src/components/Hotspot.test.tsx`:

```tsx
import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Hotspot } from './Hotspot'
import type { ChoreDefinition, Chore } from '../data/chores'

const def: ChoreDefinition = {
  id: 'kitchen-sink',
  label: 'Kitchen Sink',
  room: 'Kitchen',
  top: '10%',
  left: '30%',
  sceneIndex: 0,
}

const cleanChore: Chore = { id: 'kitchen-sink', state: 'clean' }
const dirtyChore: Chore = { id: 'kitchen-sink', state: 'dirty', flaggedBy: 'Harry', flaggedAt: new Date().toISOString() }
const claimedChore: Chore = { id: 'kitchen-sink', state: 'claimed', flaggedBy: 'Harry', claimedBy: 'Ariel', flaggedAt: new Date().toISOString() }

describe('Hotspot', () => {
  it('renders without crashing for each state', () => {
    const { rerender } = render(<Hotspot def={def} chore={cleanChore} onClick={vi.fn()} />)
    rerender(<Hotspot def={def} chore={dirtyChore} onClick={vi.fn()} />)
    rerender(<Hotspot def={def} chore={claimedChore} onClick={vi.fn()} />)
  })

  it('calls onClick when tapped', async () => {
    const onClick = vi.fn()
    render(<Hotspot def={def} chore={cleanChore} onClick={onClick} />)
    await userEvent.click(screen.getByRole('button'))
    expect(onClick).toHaveBeenCalledOnce()
  })

  it('positions itself at the definition coordinates', () => {
    render(<Hotspot def={def} chore={cleanChore} onClick={vi.fn()} />)
    const btn = screen.getByRole('button')
    expect(btn.style.top).toBe('10%')
    expect(btn.style.left).toBe('30%')
  })
})
```

- [ ] **Step 2: Run tests to verify they fail**

```bash
npm run test:run -- src/components/Hotspot.test.tsx
```

Expected: FAIL — `Hotspot` not found.

- [ ] **Step 3: Implement Hotspot.tsx**

Create `src/components/Hotspot.tsx`:

```tsx
import type { ChoreDefinition, Chore, ChoreState } from '../data/chores'

interface Props {
  def: ChoreDefinition
  chore: Chore
  onClick: () => void
}

const STATE_STYLES: Record<ChoreState, string> = {
  clean:   'w-3.5 h-3.5 bg-mint/90 border-white/70',
  dirty:   'w-5 h-5 bg-pink border-white/80 animate-pulse',
  claimed: 'w-4 h-4 bg-plum/90 border-white/70',
}

export function Hotspot({ def, chore, onClick }: Props) {
  return (
    <button
      aria-label={def.label}
      onClick={onClick}
      style={{ top: def.top, left: def.left, transform: 'translate(-50%, -50%)' }}
      className={`absolute rounded-full border-2 shadow-md active:scale-125 transition-transform
                  ${STATE_STYLES[chore.state]}`}
    />
  )
}
```

- [ ] **Step 4: Run tests to verify they pass**

```bash
npm run test:run -- src/components/Hotspot.test.tsx
```

Expected: 3 tests PASS.

- [ ] **Step 5: Commit**

```bash
git add src/components/Hotspot.tsx src/components/Hotspot.test.tsx
git commit -m "feat: add Hotspot component with state-based visual styles"
```

---

## Task 7: ChorePopup component (TDD)

**Files:**
- Create: `src/components/ChorePopup.tsx`
- Create: `src/components/ChorePopup.test.tsx`

- [ ] **Step 1: Write failing tests**

Create `src/components/ChorePopup.test.tsx`:

```tsx
import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { ChorePopup } from './ChorePopup'
import type { ChoreDefinition, Chore } from '../data/chores'

const def: ChoreDefinition = {
  id: 'trash',
  label: 'Trash Area',
  room: 'Kitchen / Hallway',
  top: '43%',
  left: '35%',
  sceneIndex: 1,
}

const cleanChore:   Chore = { id: 'trash', state: 'clean' }
const dirtyChore:   Chore = { id: 'trash', state: 'dirty',   flaggedBy: 'Ariel', flaggedAt: new Date().toISOString() }
const claimedChore: Chore = { id: 'trash', state: 'claimed', flaggedBy: 'Ariel', claimedBy: 'Dylan', flaggedAt: new Date().toISOString() }

const noop = vi.fn()
const actions = { onFlagDirty: noop, onClaim: noop, onMarkClean: noop, onClose: noop }

describe('ChorePopup', () => {
  it('shows the chore label and room', () => {
    render(<ChorePopup def={def} chore={cleanChore} currentUser="Harry" {...actions} />)
    expect(screen.getByText('Trash Area')).toBeTruthy()
    expect(screen.getByText('Kitchen / Hallway')).toBeTruthy()
  })

  it('shows Flag dirty button when clean', () => {
    render(<ChorePopup def={def} chore={cleanChore} currentUser="Harry" {...actions} />)
    expect(screen.getByText(/Flag dirty/i)).toBeTruthy()
  })

  it('shows Claim and Mark clean buttons when dirty', () => {
    render(<ChorePopup def={def} chore={dirtyChore} currentUser="Harry" {...actions} />)
    expect(screen.getByText(/Claim/i)).toBeTruthy()
    expect(screen.getByText(/Mark clean/i)).toBeTruthy()
  })

  it('shows Mark clean button when claimed', () => {
    render(<ChorePopup def={def} chore={claimedChore} currentUser="Harry" {...actions} />)
    expect(screen.getByText(/Mark clean/i)).toBeTruthy()
  })

  it('shows who flagged it when dirty', () => {
    render(<ChorePopup def={def} chore={dirtyChore} currentUser="Harry" {...actions} />)
    expect(screen.getByText(/Ariel/)).toBeTruthy()
  })

  it('calls onFlagDirty when Flag dirty is clicked', async () => {
    const onFlagDirty = vi.fn()
    render(<ChorePopup def={def} chore={cleanChore} currentUser="Harry" {...actions} onFlagDirty={onFlagDirty} />)
    await userEvent.click(screen.getByText(/Flag dirty/i))
    expect(onFlagDirty).toHaveBeenCalledOnce()
  })

  it('calls onClaim when Claim is clicked', async () => {
    const onClaim = vi.fn()
    render(<ChorePopup def={def} chore={dirtyChore} currentUser="Harry" {...actions} onClaim={onClaim} />)
    await userEvent.click(screen.getByText(/Claim/i))
    expect(onClaim).toHaveBeenCalledOnce()
  })

  it('calls onClose when Cancel is clicked', async () => {
    const onClose = vi.fn()
    render(<ChorePopup def={def} chore={cleanChore} currentUser="Harry" {...actions} onClose={onClose} />)
    await userEvent.click(screen.getByText(/Cancel/i))
    expect(onClose).toHaveBeenCalledOnce()
  })
})
```

- [ ] **Step 2: Run tests to verify they fail**

```bash
npm run test:run -- src/components/ChorePopup.test.tsx
```

Expected: FAIL — `ChorePopup` not found.

- [ ] **Step 3: Implement ChorePopup.tsx**

Create `src/components/ChorePopup.tsx`:

```tsx
import type { CSSProperties } from 'react'
import popupImg from '../assets/floorplanpopup1.png'
import type { ChoreDefinition, Chore } from '../data/chores'

interface Props {
  def: ChoreDefinition
  chore: Chore
  currentUser: string
  onFlagDirty: () => void
  onClaim: () => void
  onMarkClean: () => void
  onClose: () => void
}

function sceneStyle(sceneIndex: number): CSSProperties {
  const col = sceneIndex % 3
  const row = Math.floor(sceneIndex / 3)
  const x = col === 0 ? '0%' : col === 1 ? '50%' : '100%'
  const y = row === 0 ? '0%' : row === 1 ? '50%' : '100%'
  return {
    backgroundImage: `url(${popupImg})`,
    backgroundSize: '300% 300%',
    backgroundPosition: `${x} ${y}`,
    backgroundRepeat: 'no-repeat',
  }
}

function timeAgo(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 60) return `${mins}m ago`
  const hrs = Math.floor(mins / 60)
  if (hrs < 24) return `${hrs}h ago`
  return `${Math.floor(hrs / 24)}d ago`
}

export function ChorePopup({ def, chore, onFlagDirty, onClaim, onMarkClean, onClose }: Props) {
  return (
    <>
      {/* backdrop */}
      <div
        className="fixed inset-0 bg-deep-plum/40 z-10"
        onClick={onClose}
      />
      {/* sheet */}
      <div className="fixed bottom-0 left-0 right-0 z-20 bg-cream rounded-t-3xl border-t-4 border-yellow p-5 shadow-xl">
        <p className="font-accent text-mint text-sm font-semibold">{def.room}</p>
        <h2 className="font-display font-bold text-xl text-deep-plum mb-3">{def.label}</h2>

        {/* mess scene thumbnail */}
        <div
          className="w-full h-28 rounded-xl mb-3"
          style={sceneStyle(def.sceneIndex)}
        />

        {/* flagged/claimed info */}
        {chore.flaggedBy && (
          <p className="text-pink text-xs font-medium mb-3">
            ⚑ Flagged by {chore.flaggedBy}
            {chore.flaggedAt ? ` · ${timeAgo(chore.flaggedAt)}` : ''}
            {chore.claimedBy ? ` · Claimed by ${chore.claimedBy}` : ''}
          </p>
        )}

        {/* context-aware action buttons */}
        <div className="flex flex-col gap-2">
          {chore.state === 'clean' && (
            <button
              onClick={onFlagDirty}
              className="w-full py-3 rounded-xl bg-pink text-white font-display font-semibold text-sm active:scale-95 transition-transform"
            >
              ⚑ Flag dirty
            </button>
          )}
          {(chore.state === 'dirty') && (
            <button
              onClick={onClaim}
              className="w-full py-3 rounded-xl bg-mint text-deep-plum font-display font-semibold text-sm active:scale-95 transition-transform"
            >
              🧹 Claim — I'll handle it
            </button>
          )}
          {(chore.state === 'dirty' || chore.state === 'claimed') && (
            <button
              onClick={onMarkClean}
              className="w-full py-3 rounded-xl bg-yellow text-deep-plum font-display font-semibold text-sm active:scale-95 transition-transform"
            >
              ✓ Mark clean
            </button>
          )}
          <button
            onClick={onClose}
            className="w-full py-2.5 rounded-xl border border-plum/20 text-plum font-display text-sm active:scale-95 transition-transform"
          >
            Cancel
          </button>
        </div>
      </div>
    </>
  )
}
```

- [ ] **Step 4: Run tests to verify they pass**

```bash
npm run test:run -- src/components/ChorePopup.test.tsx
```

Expected: 8 tests PASS.

- [ ] **Step 5: Commit**

```bash
git add src/components/ChorePopup.tsx src/components/ChorePopup.test.tsx
git commit -m "feat: add ChorePopup component with mess thumbnail and context-aware actions"
```

---

## Task 8: FloorPlan component (TDD)

**Files:**
- Create: `src/components/FloorPlan.tsx`
- Create: `src/components/FloorPlan.test.tsx`

- [ ] **Step 1: Write failing tests**

Create `src/components/FloorPlan.test.tsx`:

```tsx
import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { FloorPlan } from './FloorPlan'

// Vite asset imports return empty string in jsdom
vi.mock('../assets/floorplan1.png', () => ({ default: '' }))
vi.mock('../assets/floorplanpopup1.png', () => ({ default: '' }))

describe('FloorPlan', () => {
  it('renders the floor plan image', () => {
    render(<FloorPlan currentUser="Harry" chores={{}} flagDirty={vi.fn()} claim={vi.fn()} markClean={vi.fn()} />)
    expect(screen.getByAltText('Floor plan')).toBeTruthy()
  })

  it('renders 9 hotspot buttons', () => {
    render(<FloorPlan currentUser="Harry" chores={{}} flagDirty={vi.fn()} claim={vi.fn()} markClean={vi.fn()} />)
    expect(screen.getAllByRole('button').length).toBe(9)
  })

  it('opens popup when a hotspot is clicked', async () => {
    render(<FloorPlan currentUser="Harry" chores={{}} flagDirty={vi.fn()} claim={vi.fn()} markClean={vi.fn()} />)
    await userEvent.click(screen.getAllByRole('button')[0])
    expect(screen.getByText(/Cancel/i)).toBeTruthy()
  })

  it('closes popup when Cancel is clicked', async () => {
    render(<FloorPlan currentUser="Harry" chores={{}} flagDirty={vi.fn()} claim={vi.fn()} markClean={vi.fn()} />)
    await userEvent.click(screen.getAllByRole('button')[0])
    await userEvent.click(screen.getByText(/Cancel/i))
    expect(screen.queryByText(/Cancel/i)).toBeNull()
  })
})
```

- [ ] **Step 2: Run tests to verify they fail**

```bash
npm run test:run -- src/components/FloorPlan.test.tsx
```

Expected: FAIL — `FloorPlan` not found.

- [ ] **Step 3: Implement FloorPlan.tsx**

Create `src/components/FloorPlan.tsx`:

```tsx
import { useState } from 'react'
import floorplanImg from '../assets/floorplan1.png'
import { CHORE_DEFINITIONS } from '../data/chores'
import type { Chore } from '../data/chores'
import { Hotspot } from './Hotspot'
import { ChorePopup } from './ChorePopup'

interface Props {
  currentUser: string
  chores: Record<string, Chore>
  flagDirty: (id: string, by: string) => void
  claim:     (id: string, by: string) => void
  markClean: (id: string) => void
}

const DEFAULT_CHORE = (id: string): Chore => ({ id, state: 'clean' })

export function FloorPlan({ currentUser, chores, flagDirty, claim, markClean }: Props) {
  const [activeId, setActiveId] = useState<string | null>(null)

  const activeDef = activeId ? CHORE_DEFINITIONS.find((d) => d.id === activeId) : null
  const activeChore = activeId ? (chores[activeId] ?? DEFAULT_CHORE(activeId)) : null

  return (
    <div className="relative w-full">
      {/* floor plan image */}
      <img src={floorplanImg} alt="Floor plan" className="w-full block" draggable={false} />

      {/* hotspot overlays */}
      {CHORE_DEFINITIONS.map((def) => (
        <Hotspot
          key={def.id}
          def={def}
          chore={chores[def.id] ?? DEFAULT_CHORE(def.id)}
          onClick={() => setActiveId(def.id)}
        />
      ))}

      {/* popup */}
      {activeDef && activeChore && (
        <ChorePopup
          def={activeDef}
          chore={activeChore}
          currentUser={currentUser}
          onFlagDirty={() => { flagDirty(activeDef.id, currentUser); setActiveId(null) }}
          onClaim={()     => { claim(activeDef.id, currentUser);     setActiveId(null) }}
          onMarkClean={() => { markClean(activeDef.id);              setActiveId(null) }}
          onClose={() => setActiveId(null)}
        />
      )}
    </div>
  )
}
```

- [ ] **Step 4: Run tests to verify they pass**

```bash
npm run test:run -- src/components/FloorPlan.test.tsx
```

Expected: 4 tests PASS.

- [ ] **Step 5: Commit**

```bash
git add src/components/FloorPlan.tsx src/components/FloorPlan.test.tsx
git commit -m "feat: add FloorPlan component — image, hotspots, popup orchestration"
```

---

## Task 9: Wire up App.tsx

**Files:**
- Modify: `src/App.tsx`
- Modify: `src/main.tsx`

- [ ] **Step 1: Replace src/App.tsx**

```tsx
import { useState, useEffect } from 'react'
import { UserPicker } from './components/UserPicker'
import { StatusBar } from './components/StatusBar'
import { FloorPlan } from './components/FloorPlan'
import { useChores } from './hooks/useChores'

const USER_KEY = 'choresapp-user'

export function App() {
  const [currentUser, setCurrentUser] = useState<string | null>(
    () => localStorage.getItem(USER_KEY)
  )
  const [showPicker, setShowPicker] = useState(false)
  const { chores, flagDirty, claim, markClean } = useChores()

  function handleSelect(name: string) {
    localStorage.setItem(USER_KEY, name)
    setCurrentUser(name)
    setShowPicker(false)
  }

  if (!currentUser || showPicker) {
    return <UserPicker onSelect={handleSelect} />
  }

  return (
    <div className="min-h-screen bg-cream flex flex-col">
      <StatusBar currentUser={currentUser} onSwitchUser={() => setShowPicker(true)} />
      <FloorPlan
        currentUser={currentUser}
        chores={chores}
        flagDirty={flagDirty}
        claim={claim}
        markClean={markClean}
      />
    </div>
  )
}
```

- [ ] **Step 2: Replace src/main.tsx**

```tsx
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { App } from './App'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
```

- [ ] **Step 3: Run all tests to confirm nothing broken**

```bash
npm run test:run
```

Expected: all previous tests still PASS.

- [ ] **Step 4: Test in browser**

```bash
npm run dev
```

Open `http://localhost:5173`. Expected:
- UserPicker screen shows 5 names
- Clicking a name → floor plan view
- StatusBar shows chosen name
- Tapping a hotspot opens popup
- Popup actions (Flag dirty, Claim, Mark clean) change hotspot color
- Tapping StatusBar name chip → UserPicker again
- Refresh preserves state (localStorage)

- [ ] **Step 5: Fine-tune hotspot positions**

While the dev server is running, open browser DevTools. Inspect the floor plan image's rendered dimensions. Compare hotspot dots visually against the floor plan locations. If any dots are off, update the `top`/`left` values in `src/data/chores.ts` until each dot sits on its correct chore location. No tests needed for pixel positions — visual verification only.

- [ ] **Step 6: Commit**

```bash
git add src/App.tsx src/main.tsx src/data/chores.ts
git commit -m "feat: wire up App with UserPicker → FloorPlan flow and localStorage identity"
```

---

## Task 10: PWA icons + manifest

**Files:**
- Create: `public/icon-192.png`, `public/icon-512.png`

- [ ] **Step 1: Generate PWA icons**

Run this script to generate simple colored placeholder icons (plum background, white house emoji rendered via canvas — good enough for "Add to Home Screen"):

```bash
node -e "
const { createCanvas } = require('canvas')
const fs = require('fs')

function makeIcon(size) {
  const c = createCanvas(size, size)
  const ctx = c.getContext('2d')
  ctx.fillStyle = '#6B5B95'
  ctx.fillRect(0, 0, size, size)
  ctx.font = \`${Math.floor(size * 0.55)}px serif\`
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  ctx.fillText('🏠', size/2, size/2)
  return c.toBuffer('image/png')
}

fs.writeFileSync('public/icon-192.png', makeIcon(192))
fs.writeFileSync('public/icon-512.png', makeIcon(512))
console.log('Icons written.')
"
```

If `canvas` package is not available, install it first: `npm install -D canvas`

If canvas install fails (native build issues), use this fallback — download two simple PNGs manually:

```bash
# Alternative: use sharp if canvas fails
npm install -D sharp
node -e "
const sharp = require('sharp')
const svg = Buffer.from('<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 100 100\"><rect width=\"100\" height=\"100\" fill=\"#6B5B95\"/><text y=\".9em\" font-size=\"80\" x=\"50%\" text-anchor=\"middle\">🏠</text></svg>')
sharp(svg).resize(192).png().toFile('public/icon-192.png', () => {})
sharp(svg).resize(512).png().toFile('public/icon-512.png', () => {})
"
```

- [ ] **Step 2: Verify icons exist**

```bash
ls -lh public/icon-192.png public/icon-512.png
```

Expected: both files present, non-zero size.

- [ ] **Step 3: Build and check PWA manifest**

```bash
npm run build
```

Check `dist/manifest.webmanifest` exists and contains correct name, colors, icon refs.

- [ ] **Step 4: Commit**

```bash
git add public/icon-192.png public/icon-512.png
git commit -m "feat: add PWA icons and manifest for Add to Home Screen"
```

---

## Task 11: GitHub repo + push

- [ ] **Step 1: Create remote repo**

```bash
gh repo create chopchopulen/choresapp --public --description "Apartment chores tracker for 5 roommates"
```

Expected: repo created at `https://github.com/chopchopulen/choresapp`

- [ ] **Step 2: Add remote and push**

```bash
git remote add origin https://github.com/chopchopulen/choresapp.git
git push -u origin main
```

Expected: all commits pushed, branch `main` tracks `origin/main`.

- [ ] **Step 3: Verify on GitHub**

Open `https://github.com/chopchopulen/choresapp` — confirm all files present.

---

## Task 12: Deploy to Vercel

- [ ] **Step 1: Connect repo to Vercel**

Go to `https://vercel.com/new` → Import Git Repository → select `chopchopulen/choresapp`.

Framework preset: **Vite** (auto-detected).  
Build command: `npm run build` (default).  
Output directory: `dist` (default).  

Click **Deploy**.

- [ ] **Step 2: Wait for deployment and verify**

Wait ~60 seconds. Vercel gives you a URL like `choresapp-xyz.vercel.app`.  
Open that URL on your phone. Verify:
- Floor plan loads
- Hotspots tap correctly
- UserPicker works
- State persists between page reloads

- [ ] **Step 3: Add to Home Screen test**

On iPhone: Safari → Share → Add to Home Screen → "Chores".  
Tap the home screen icon. Verify it opens in standalone mode (no browser chrome) with the plum theme color.

- [ ] **Step 4: Share URL with roommates**

Send the Vercel URL (or set up a custom domain later) to Ariel, Aleena, Angela, Dylan.

---

## Done

At this point Phase 1 is complete:
- Floor plan tap-to-flag mechanic works
- State persists per device via localStorage
- All 5 roommates can use the app from their phones via the Vercel URL
- PWA installable via "Add to Home Screen"

**Phase 2 (next plan):** Replace `useChores` localStorage internals with Supabase Realtime so state syncs across all 5 devices in real time.
