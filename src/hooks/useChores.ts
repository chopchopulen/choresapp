import { useReducer, useEffect } from 'react'
import type { Chore } from '../data/chores'

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
      return {
        ...state,
        [action.id]: {
          id: action.id,
          state: 'dirty',
          flaggedBy: action.by,
          flaggedAt: new Date().toISOString(),
        },
      }
    case 'CLAIM':
      return {
        ...state,
        [action.id]: { ...state[action.id], state: 'claimed', claimedBy: action.by },
      }
    case 'MARK_CLEAN':
      return {
        ...state,
        [action.id]: { id: action.id, state: 'clean' },
      }
    default:
      return state
  }
}

const STORAGE_KEY = 'choresapp-chores'

function loadFromStorage(): Record<string, Chore> {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? (JSON.parse(raw) as Record<string, Chore>) : {}
  } catch {
    return {}
  }
}

export function useChores() {
  const [chores, dispatch] = useReducer(choreReducer, undefined, loadFromStorage)

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(chores))
  }, [chores])

  return {
    chores,
    flagDirty: (id: string, by: string) => dispatch({ type: 'FLAG_DIRTY', id, by }),
    claim:     (id: string, by: string) => dispatch({ type: 'CLAIM', id, by }),
    markClean: (id: string)             => dispatch({ type: 'MARK_CLEAN', id }),
  }
}
