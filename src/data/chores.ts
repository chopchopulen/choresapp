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
  top: string        // percentage of floor plan image height
  left: string       // percentage of floor plan image width
  sceneIndex: number // 0–8, position in 3×3 popup grid image
  messEmoji: string  // placeholder mess visual shown on floor plan when dirty
  cropWidthPct: number // crop width as % of floor plan width (for proper scaling)
}

export const CHORE_DEFINITIONS: ChoreDefinition[] = [
  { id: 'kitchen-sink',  label: 'Kitchen Sink',     room: 'Kitchen',           top: '15.4%', left: '33%', sceneIndex: 0, messEmoji: '🍽️', cropWidthPct: 17.3 },
  { id: 'kitchen-floor', label: 'Kitchen Floor',     room: 'Kitchen',           top: '26.1%', left: '35%', sceneIndex: 2, messEmoji: '💧', cropWidthPct: 17.3 },
  { id: 'kitchen-table', label: 'Kitchen Table',     room: 'Kitchen',           top: '38%', left: '35%', sceneIndex: 0, messEmoji: '🍽️', cropWidthPct: 16.0 },
  { id: 'lr-floor',      label: 'Living Room Floor', room: 'Living Room',       top: '69%', left: '19%', sceneIndex: 2, messEmoji: '💧', cropWidthPct: 13.4 },
  { id: 'hallway',       label: 'Hallway Floor',     room: 'Hallway',           top: '50%', left: '61.9%', sceneIndex: 2, messEmoji: '💧', cropWidthPct: 28 },
  { id: 'bath1-sink',    label: 'Bathroom 1',        room: 'Bathroom 1',        top: '71.1%', left: '49.5%', sceneIndex: 3, messEmoji: '🧴', cropWidthPct: 10 },
  { id: 'bath2-sink',    label: 'Bathroom 2',        room: 'Bathroom 2',        top: '71.1%', left: '73.2%', sceneIndex: 3, messEmoji: '🧴', cropWidthPct: 15.4 },
]
