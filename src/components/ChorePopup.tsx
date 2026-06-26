import type { ChoreDefinition, Chore } from '../data/chores'
import { DIRTY_IMAGES } from '../assets/dirty-images'

interface Props {
  def: ChoreDefinition
  chore: Chore
  currentUser: string
  onFlagDirty: () => void
  onClaim: () => void
  onMarkClean: () => void
  onClose: () => void
}


function timeAgo(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 60) return `${mins}m ago`
  const hrs = Math.floor(mins / 60)
  if (hrs < 24) return `${hrs}h ago`
  return `${Math.floor(hrs / 24)}d ago`
}

export function ChorePopup({ def, chore, onFlagDirty, onClaim, onMarkClean, onClose }: Props) {
  return (
    <>
      {/* backdrop */}
      <div className="fixed inset-0 bg-deep-plum/50 z-10" onClick={onClose} />

      {/* centered square card */}
      <div className="fixed inset-0 z-20 flex items-center justify-center pointer-events-none">
        <div className="bg-cream rounded-3xl border-2 border-yellow shadow-2xl w-80 h-80 flex flex-col p-4 pointer-events-auto">

          {/* top row: thumbnail + info */}
          <div className="flex gap-3 mb-3">
            <img
              src={DIRTY_IMAGES[def.id]}
              alt={def.label}
              className="w-28 h-28 rounded-xl flex-shrink-0 object-cover"
            />
            <div className="flex-1 min-w-0">
              <p className="font-accent text-mint text-xs font-semibold leading-tight">{def.room}</p>
              <h2 className="font-display font-bold text-lg text-deep-plum leading-tight">{def.label}</h2>
              {chore.flaggedBy && (
                <p className="text-pink text-xs font-medium mt-1 leading-tight">
                  ⚑ {chore.flaggedBy}
                  {chore.flaggedAt ? ` · ${timeAgo(chore.flaggedAt)}` : ''}
                  {chore.claimedBy ? <><br />🧹 {chore.claimedBy}</> : null}
                </p>
              )}
            </div>
          </div>

          {/* buttons — flex-1 so they fill remaining space */}
          <div className="flex flex-col gap-1.5 flex-1 justify-end">
            {chore.state === 'clean' && (
              <button onClick={onFlagDirty} className="w-full py-2 rounded-xl bg-pink text-white font-display font-semibold text-sm active:scale-95 transition-transform">
                ⚑ Flag dirty
              </button>
            )}
            {chore.state === 'dirty' && (
              <button onClick={onClaim} className="w-full py-2 rounded-xl bg-mint text-deep-plum font-display font-semibold text-sm active:scale-95 transition-transform">
                🧹 Claim — I'll handle it
              </button>
            )}
            {(chore.state === 'dirty' || chore.state === 'claimed') && (
              <button onClick={onMarkClean} className="w-full py-2 rounded-xl bg-yellow text-deep-plum font-display font-semibold text-sm active:scale-95 transition-transform">
                ✓ Mark clean
              </button>
            )}
            <button onClick={onClose} className="w-full py-2 rounded-xl border border-plum/20 text-plum font-display text-sm active:scale-95 transition-transform">
              Cancel
            </button>
          </div>

        </div>
      </div>
    </>
  )
}
