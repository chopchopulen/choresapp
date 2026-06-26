import type { ChoreDefinition, Chore } from '../data/chores'

interface Props {
  def: ChoreDefinition
  chore: Chore
  onClick: () => void
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
      className="absolute w-11 h-11 flex items-center justify-center active:scale-110 transition-transform"
    >
      {showMess ? (
        // Mess emoji — visible on floor plan when dirty/claimed
        <span
          className={`text-xl leading-none drop-shadow-md select-none ${isDirty ? 'animate-pulse' : 'opacity-70'}`}
        >
          {def.messEmoji}
        </span>
      ) : (
        // Clean state — small colored dot
        <span className="w-3.5 h-3.5 rounded-full bg-mint/90 border-2 border-white/70 shadow-md block" />
      )}
    </button>
  )
}
