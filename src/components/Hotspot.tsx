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
        // CSS stain blob — organic smudge shape, blurred edges
        <div
          className={isDirty ? 'animate-pulse' : ''}
          style={{
            width: 40,
            height: 38,
            background: isDirty
              ? 'rgba(176, 72, 32, 0.58)'   // rust/terracotta for dirty
              : 'rgba(107, 91, 149, 0.48)',  // muted plum for claimed
            borderRadius: '62% 38% 54% 46% / 44% 58% 42% 56%',
            filter: 'blur(3px)',
            boxShadow: isDirty
              ? '0 0 8px 2px rgba(176, 72, 32, 0.35)'
              : '0 0 6px 1px rgba(107, 91, 149, 0.3)',
          }}
        />
      ) : (
        // Clean — small mint dot
        <span className="w-3.5 h-3.5 rounded-full bg-mint/90 border-2 border-white/70 shadow-md block" />
      )}
    </button>
  )
}
