import { useState } from 'react'
import { UserPicker } from './components/UserPicker'
import { StatusBar } from './components/StatusBar'
import { FloorPlan } from './components/FloorPlan'
import { useChores } from './hooks/useChores'

const USER_KEY = 'choresapp-user'

export function App() {
  const [currentUser, setCurrentUser] = useState<string | null>(
    () => localStorage.getItem(USER_KEY)
  )
  const [showPicker, setShowPicker] = useState(false)
  const { chores, flagDirty, claim, markClean } = useChores()

  function handleSelect(name: string) {
    localStorage.setItem(USER_KEY, name)
    setCurrentUser(name)
    setShowPicker(false)
  }

  if (!currentUser || showPicker) {
    return <UserPicker onSelect={handleSelect} />
  }

  return (
    <div className="min-h-screen bg-cream flex flex-col">
      <StatusBar currentUser={currentUser} onSwitchUser={() => setShowPicker(true)} />
      <FloorPlan
        currentUser={currentUser}
        chores={chores}
        flagDirty={flagDirty}
        claim={claim}
        markClean={markClean}
      />
    </div>
  )
}
