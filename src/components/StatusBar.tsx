interface Props {
  currentUser: string
  onSwitchUser: () => void
}

export function StatusBar({ currentUser, onSwitchUser }: Props) {
  return (
    <div className="flex items-center justify-between px-4 py-2.5 bg-plum text-cream">
      <span className="font-display font-bold text-base">
        <span aria-hidden="true">🏠 </span>
        Apt 4B Chores
      </span>
      <button
        onClick={onSwitchUser}
        className="bg-yellow text-deep-plum rounded-full px-3 py-1 text-xs font-semibold
                   active:scale-95 transition-transform"
      >
        {currentUser} ▾
      </button>
    </div>
  )
}
