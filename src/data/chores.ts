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
  { id: 'kitchen-sink',  label: 'Kitchen Sink',     room: 'Kitchen',           top: '15.2%', left: '33%', sceneIndex: 0, messEmoji: '🍽️', cropWidthPct: 17.3 },
  { id: 'kitchen-floor', label: 'Kitchen Floor',     room: 'Kitchen',           top: '26.1%', left: '35%', sceneIndex: 2, messEmoji: '💧', cropWidthPct: 17.3 },
  { id: 'kitchen-table', label: 'Kitchen Table',     room: 'Kitchen',           top: '38%', left: '35%', sceneIndex: 0, messEmoji: '🍽️', cropWidthPct: 17.3 },
  { id: 'trash',         label: 'Trash Area',        room: 'Kitchen / Hallway', top: '41%', left: '27%', sceneIndex: 1, messEmoji: '🗑️', cropWidthPct: 15.8 },
  { id: 'fridge',        label: 'Fridge',            room: 'Kitchen',           top: '37.1%', left: '45.9%', sceneIndex: 0, messEmoji: '🧊', cropWidthPct: 15.8 },
  { id: 'lr-floor',      label: 'Living Room Floor', room: 'Living Room',       top: '66.2%', left: '23%', sceneIndex: 2, messEmoji: '💧', cropWidthPct: 18.9 },
  { id: 'hallway',       label: 'Hallway Floor',     room: 'Hallway',           top: '50.5%', left: '48%', sceneIndex: 2, messEmoji: '💧', cropWidthPct: 28 },
  { id: 'bath1-sink',    label: 'Bathroom 1',        room: 'Bathroom 1',        top: '69%', left: '50%', sceneIndex: 3, messEmoji: '🧴', cropWidthPct: 15.8 },
  { id: 'bath2-sink',    label: 'Bathroom 2',        room: 'Bathroom 2',        top: '69%', left: '72%', sceneIndex: 3, messEmoji: '🧴', cropWidthPct: 15.8 },
]
