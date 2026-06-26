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
