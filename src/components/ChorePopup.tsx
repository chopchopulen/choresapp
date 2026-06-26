import type { CSSProperties } from 'react'
import popupImg from '../assets/floorplanpopup1.png'
import type { ChoreDefinition, Chore } from '../data/chores'

interface Props {
  def: ChoreDefinition
  chore: Chore
  currentUser: string
  onFlagDirty: () => void
  onClaim: () => void
  onMarkClean: () => void
  onClose: () => void
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
      <div
        className="fixed inset-0 bg-deep-plum/40 z-10"
        onClick={onClose}
      />
      {/* sheet */}
      <div className="fixed bottom-0 left-0 right-0 z-20 bg-cream rounded-t-3xl border-t-4 border-yellow p-5 shadow-xl">
        <p className="font-accent text-mint text-sm font-semibold">{def.room}</p>
        <h2 className="font-display font-bold text-xl text-deep-plum mb-3">{def.label}</h2>

        {/* mess scene thumbnail */}
        <div
          className="w-full h-28 rounded-xl mb-3"
          style={sceneStyle(def.sceneIndex)}
        />

        {/* flagged/claimed info */}
        {chore.flaggedBy && (
          <p className="text-pink text-xs font-medium mb-3">
            ⚑ Flagged by {chore.flaggedBy}
            {chore.flaggedAt ? ` · ${timeAgo(chore.flaggedAt)}` : ''}
            {chore.claimedBy ? ` · Claimed by ${chore.claimedBy}` : ''}
          </p>
        )}

        {/* context-aware action buttons */}
        <div className="flex flex-col gap-2">
          {chore.state === 'clean' && (
            <button
              onClick={onFlagDirty}
              className="w-full py-3 rounded-xl bg-pink text-white font-display font-semibold text-sm active:scale-95 transition-transform"
            >
              ⚑ Flag dirty
            </button>
          )}
          {chore.state === 'dirty' && (
            <button
              onClick={onClaim}
              className="w-full py-3 rounded-xl bg-mint text-deep-plum font-display font-semibold text-sm active:scale-95 transition-transform"
            >
              🧹 Claim — I'll handle it
            </button>
          )}
          {(chore.state === 'dirty' || chore.state === 'claimed') && (
            <button
              onClick={onMarkClean}
              className="w-full py-3 rounded-xl bg-yellow text-deep-plum font-display font-semibold text-sm active:scale-95 transition-transform"
            >
              ✓ Mark clean
            </button>
          )}
          <button
            onClick={onClose}
            className="w-full py-2.5 rounded-xl border border-plum/20 text-plum font-display text-sm active:scale-95 transition-transform"
          >
            Cancel
          </button>
        </div>
      </div>
    </>
  )
}
