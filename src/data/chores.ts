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
  { id: 'kitchen-sink',  label: 'Kitchen Sink',     room: 'Kitchen',           top: '13%', left: '37%', sceneIndex: 0, messEmoji: '🍽️' },
  { id: 'trash',         label: 'Trash Area',        room: 'Kitchen / Hallway', top: '43%', left: '35%', sceneIndex: 1, messEmoji: '🗑️' },
  { id: 'lr-floor',      label: 'Living Room Floor', room: 'Living Room',       top: '65%', left: '15%', sceneIndex: 2, messEmoji: '💧' },
  { id: 'bath1-sink',    label: 'Bathroom Sink',     room: 'Bathroom 1',        top: '70%', left: '48%', sceneIndex: 3, messEmoji: '🧴' },
  { id: 'bath1-toilet',  label: 'Toilet',            room: 'Bathroom 1',        top: '80%', left: '44%', sceneIndex: 4, messEmoji: '🚽' },
  { id: 'tub',           label: 'Shower / Tub',      room: 'Shower/Tub Room',   top: '70%', left: '62%', sceneIndex: 5, messEmoji: '🛁' },
  { id: 'lr-couch',      label: 'Couch',             room: 'Living Room',       top: '76%', left: '8%',  sceneIndex: 6, messEmoji: '🧦' },
  { id: 'laundry',       label: 'W/D Laundry',       room: 'W/D Closet',        top: '40%', left: '6%',  sceneIndex: 7, messEmoji: '👕' },
  { id: 'plant',         label: 'Potted Plant',       room: 'Living Room',       top: '58%', left: '22%', sceneIndex: 8, messEmoji: '🥀' },
]
