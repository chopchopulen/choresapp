import { ROOMMATES } from '../data/roommates'

interface Props {
  onSelect: (name: string) => void
}

export function UserPicker({ onSelect }: Props) {
  return (
    <div className="fixed inset-0 bg-cream flex flex-col items-center justify-center gap-6 p-8">
      <h1 className="font-display text-3xl font-bold text-plum">Who are you?</h1>
      <p className="font-accent text-xl text-mint">Tap your name to get started</p>
      <div className="flex flex-col gap-3 w-full max-w-xs mt-4">
        {ROOMMATES.map((name) => (
          <button
            key={name}
            onClick={() => onSelect(name)}
            className="w-full py-4 rounded-2xl bg-plum text-cream font-display text-lg font-semibold
                       active:scale-95 transition-transform shadow-md"
          >
            {name}
          </button>
        ))}
      </div>
    </div>
  )
}
