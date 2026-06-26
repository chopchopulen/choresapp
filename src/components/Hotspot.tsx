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
    <button
      aria-label={def.label}
      onClick={onClick}
      style={{ top: def.top, left: def.left, transform: 'translate(-50%, -50%)' }}
      className="absolute w-14 h-14 flex items-center justify-center active:scale-110 transition-transform"
    >
      {showMess ? (
        <span className={`text-2xl leading-none select-none drop-shadow-md ${isDirty ? 'animate-bounce' : 'opacity-60'}`}>
          {isDirty ? '❗' : '🔵'}
        </span>
      ) : (
        // Clean — small mint dot
        <span className="w-3.5 h-3.5 rounded-full bg-mint/90 border-2 border-white/70 shadow-md block" />
      )}
    </button>
  )
}
