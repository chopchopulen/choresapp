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
}

export const CHORE_DEFINITIONS: ChoreDefinition[] = [
  { id: 'kitchen-sink',  label: 'Kitchen Sink',     room: 'Kitchen',           top: '15%', left: '33%', sceneIndex: 0, messEmoji: '🍽️' },
  { id: 'kitchen-floor', label: 'Kitchen Floor',     room: 'Kitchen',           top: '26%', left: '35%', sceneIndex: 2, messEmoji: '💧' },
  { id: 'kitchen-table', label: 'Kitchen Table',     room: 'Kitchen',           top: '38%', left: '35%', sceneIndex: 0, messEmoji: '🍽️' },
  { id: 'trash',         label: 'Trash Area',        room: 'Kitchen / Hallway', top: '43%', left: '27%', sceneIndex: 1, messEmoji: '🗑️' },
  { id: 'fridge',        label: 'Fridge',            room: 'Kitchen',           top: '39%', left: '46%', sceneIndex: 0, messEmoji: '🧊' },
  { id: 'lr-floor',      label: 'Living Room Floor', room: 'Living Room',       top: '67%', left: '23%', sceneIndex: 2, messEmoji: '💧' },
  { id: 'hallway',       label: 'Hallway Floor',     room: 'Hallway',           top: '53%', left: '61%', sceneIndex: 2, messEmoji: '💧' },
  { id: 'bath1-sink',    label: 'Bathroom 1',        room: 'Bathroom 1',        top: '70%', left: '50%', sceneIndex: 3, messEmoji: '🧴' },
  { id: 'bath2-sink',    label: 'Bathroom 2',        room: 'Bathroom 2',        top: '70%', left: '72%', sceneIndex: 3, messEmoji: '🧴' },
]
