import type { CSSProperties } from 'react'
import popupImg from '../assets/floorplanpopup1.png'
import type { ChoreDefinition, Chore } from '../data/chores'

interface Props {
  def: ChoreDefinition
  chore: Chore
  onClick: () => void
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

export function Hotspot({ def, chore, onClick }: Props) {
  const isDirty = chore.state === 'dirty'
  const isClaimed = chore.state === 'claimed'
  const showMess = isDirty || isClaimed

  return (
    // Large invisible tap zone — 44px minimum for mobile touch targets
    <button
      aria-label={def.label}
      onClick={onClick}
      style={{ top: def.top, left: def.left, transform: 'translate(-50%, -50%)' }}
      className="absolute w-16 h-16 flex items-center justify-center active:scale-110 transition-transform"
    >
      {showMess ? (
        // Dirty scene crop from popup grid — overlaid on floor plan
        <div
          className={`w-14 h-14 rounded-lg shadow-lg border-2 border-white/80
                      ${isDirty ? 'animate-pulse' : 'opacity-75'}`}
          style={sceneStyle(def.sceneIndex)}
        />
      ) : (
        // Clean state — small colored dot
        <span className="w-3.5 h-3.5 rounded-full bg-mint/90 border-2 border-white/70 shadow-md block" />
      )}
    </button>
  )
}
