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
        // Dirty/claimed — large pulsing dot with glow ring
        <span
          className={`rounded-full border-2 border-white shadow-lg block
                      ${isDirty
                        ? 'w-7 h-7 bg-pink animate-ping'
                        : 'w-6 h-6 bg-plum/80 border-white/60'}`}
          style={isDirty ? { boxShadow: '0 0 0 4px rgba(255,143,163,0.4), 0 2px 8px rgba(0,0,0,0.25)' } : undefined}
        />
      ) : (
        // Clean — small mint dot
        <span className="w-3.5 h-3.5 rounded-full bg-mint/90 border-2 border-white/70 shadow-md block" />
      )}
    </button>
  )
}
