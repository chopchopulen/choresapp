// Room regions as percentage of floor plan image dimensions.
// Adjust top/left/width/height to match the actual floor plan layout.
export interface RoomRegion {
  id: string
  label: string
  top: string
  left: string
  width: string
  height: string
  // which chore IDs belong to this room (used to detect dirty state)
  choreIds: string[]
}

export const ROOM_REGIONS: RoomRegion[] = [
  {
    id: 'kitchen',
    label: 'Kitchen',
    top: '8%', left: '28%', width: '24%', height: '40%',
    choreIds: ['kitchen-sink', 'kitchen-floor', 'kitchen-table', 'trash', 'fridge'],
  },
  {
    id: 'living-room',
    label: 'Living Room',
    top: '50%', left: '0%', width: '30%', height: '46%',
    choreIds: ['lr-floor'],
  },
  {
    id: 'hallway',
    label: 'Hallway',
    top: '45%', left: '28%', width: '52%', height: '16%',
    choreIds: ['hallway'],
  },
  {
    id: 'bathroom-1',
    label: 'Bathroom 1',
    top: '62%', left: '40%', width: '16%', height: '34%',
    choreIds: ['bath1-sink'],
  },
  {
    id: 'bathroom-2',
    label: 'Bathroom 2',
    top: '62%', left: '62%', width: '14%', height: '34%',
    choreIds: ['bath2-sink'],
  },
]
