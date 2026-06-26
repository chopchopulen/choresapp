import { useState, useEffect } from 'react'
import type { Chore } from '../data/chores'
import { supabase } from '../lib/supabase'

type Action =
  | { type: 'FLAG_DIRTY'; id: string; by: string }
  | { type: 'CLAIM';      id: string; by: string }
  | { type: 'MARK_CLEAN'; id: string }

export function choreReducer(
  state: Record<string, Chore>,
  action: Action,
): Record<string, Chore> {
  switch (action.type) {
    case 'FLAG_DIRTY':
      return { ...state, [action.id]: { id: action.id, state: 'dirty', flaggedBy: action.by, flaggedAt: new Date().toISOString() } }
    case 'CLAIM':
      return { ...state, [action.id]: { ...state[action.id], state: 'claimed', claimedBy: action.by } }
    case 'MARK_CLEAN':
      return { ...state, [action.id]: { id: action.id, state: 'clean' } }
    default:
      return state
  }
}

type DbRow = {
  id: string
  state: string
  flagged_by: string | null
  claimed_by: string | null
  flagged_at: string | null
}

function rowToChore(row: DbRow): Chore {
  return {
    id: row.id,
    state: row.state as Chore['state'],
    flaggedBy: row.flagged_by ?? undefined,
    claimedBy: row.claimed_by ?? undefined,
    flaggedAt: row.flagged_at ?? undefined,
  }
}

export function useChores() {
  const [chores, setChores] = useState<Record<string, Chore>>({})

  useEffect(() => {
    // initial fetch
    supabase.from('chores').select('*').then(({ data }) => {
      if (!data) return
      const map: Record<string, Chore> = {}
      data.forEach((row: DbRow) => { map[row.id] = rowToChore(row) })
      setChores(map)
    })

    // realtime subscription
    const channel = supabase
      .channel('chores-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'chores' }, (payload) => {
        const row = payload.new as DbRow
        setChores(prev => ({ ...prev, [row.id]: rowToChore(row) }))
      })
      .subscribe()

    return () => { supabase.removeChannel(channel) }
  }, [])

  const flagDirty = async (id: string, by: string) => {
    const chore: Chore = { id, state: 'dirty', flaggedBy: by, flaggedAt: new Date().toISOString() }
    setChores(prev => ({ ...prev, [id]: chore })) // optimistic
    await supabase.from('chores').update({
      state: 'dirty', flagged_by: by, flagged_at: chore.flaggedAt, claimed_by: null,
    }).eq('id', id)
  }

  const claim = async (id: string, by: string) => {
    setChores(prev => ({ ...prev, [id]: { ...prev[id], state: 'claimed', claimedBy: by } }))
    await supabase.from('chores').update({ state: 'claimed', claimed_by: by }).eq('id', id)
  }

  const markClean = async (id: string) => {
    setChores(prev => ({ ...prev, [id]: { id, state: 'clean' } }))
    await supabase.from('chores').update({
      state: 'clean', flagged_by: null, claimed_by: null, flagged_at: null,
    }).eq('id', id)
  }

  return { chores, flagDirty, claim, markClean }
}
