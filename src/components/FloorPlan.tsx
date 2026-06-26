import { useState } from 'react'
import floorplanImg from '../assets/floorplan1.png'
import { CHORE_DEFINITIONS } from '../data/chores'
import type { Chore } from '../data/chores'
import { ROOM_REGIONS } from '../data/rooms'
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

  // derive worst state per room for tint color
  function roomState(choreIds: string[]): 'dirty' | 'claimed' | 'clean' {
    const states = choreIds.map((id) => chores[id]?.state ?? 'clean')
    if (states.includes('dirty')) return 'dirty'
    if (states.includes('claimed')) return 'claimed'
    return 'clean'
  }

  return (
    <div className="relative w-full">
      {/* floor plan image */}
      <img src={floorplanImg} alt="Floor plan" className="w-full block" draggable={false} />

      {/* room tint overlays — rendered below hotspots */}
      {ROOM_REGIONS.map((room) => {
        const state = roomState(room.choreIds)
        if (state === 'clean') return null
        return (
          <div
            key={room.id}
            className="absolute pointer-events-none rounded-lg"
            style={{
              top: room.top,
              left: room.left,
              width: room.width,
              height: room.height,
              background: state === 'dirty'
                ? 'rgba(220, 80, 40, 0.22)'
                : 'rgba(107, 91, 149, 0.18)',
              boxShadow: state === 'dirty'
                ? 'inset 0 0 12px 4px rgba(220, 80, 40, 0.18)'
                : 'inset 0 0 10px 3px rgba(107, 91, 149, 0.15)',
            }}
          />
        )
      })}

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
