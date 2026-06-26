import type { ChoreDefinition, Chore, ChoreState } from '../data/chores'

interface Props {
  def: ChoreDefinition
  chore: Chore
  onClick: () => void
}

const STATE_STYLES: Record<ChoreState, string> = {
  clean:   'w-3.5 h-3.5 bg-mint/90 border-white/70',
  dirty:   'w-5 h-5 bg-pink border-white/80 animate-pulse',
  claimed: 'w-4 h-4 bg-plum/90 border-white/70',
}

export function Hotspot({ def, chore, onClick }: Props) {
  return (
    <button
      aria-label={def.label}
      onClick={onClick}
      style={{ top: def.top, left: def.left, transform: 'translate(-50%, -50%)' }}
      className={`absolute rounded-full border-2 shadow-md active:scale-125 transition-transform
                  ${STATE_STYLES[chore.state]}`}
    />
  )
}
