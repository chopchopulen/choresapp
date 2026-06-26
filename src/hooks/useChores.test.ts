import { describe, it, expect, beforeEach, vi } from 'vitest'
vi.mock('../lib/supabase', () => import('../__mocks__/supabase'))
import { choreReducer } from './useChores'
import type { Chore } from '../data/chores'

describe('choreReducer', () => {
  const empty: Record<string, Chore> = {}

  beforeEach(() => {
    // reset between tests
  })

  it('FLAG_DIRTY transitions a spot to dirty', () => {
    const next = choreReducer(empty, { type: 'FLAG_DIRTY', id: 'kitchen-sink', by: 'Harry' })
    expect(next['kitchen-sink'].state).toBe('dirty')
    expect(next['kitchen-sink'].flaggedBy).toBe('Harry')
    expect(next['kitchen-sink'].flaggedAt).toBeDefined()
  })

  it('CLAIM transitions a dirty spot to claimed', () => {
    const dirty = choreReducer(empty, { type: 'FLAG_DIRTY', id: 'trash', by: 'Ariel' })
    const claimed = choreReducer(dirty, { type: 'CLAIM', id: 'trash', by: 'Dylan' })
    expect(claimed['trash'].state).toBe('claimed')
    expect(claimed['trash'].claimedBy).toBe('Dylan')
    expect(claimed['trash'].flaggedBy).toBe('Ariel')
  })

  it('MARK_CLEAN resets a spot to clean', () => {
    const dirty = choreReducer(empty, { type: 'FLAG_DIRTY', id: 'plant', by: 'Aleena' })
    const clean = choreReducer(dirty, { type: 'MARK_CLEAN', id: 'plant' })
    expect(clean['plant'].state).toBe('clean')
    expect(clean['plant'].flaggedBy).toBeUndefined()
  })

  it('MARK_CLEAN works from claimed state', () => {
    const dirty = choreReducer(empty, { type: 'FLAG_DIRTY', id: 'tub', by: 'Angela' })
    const claimed = choreReducer(dirty, { type: 'CLAIM', id: 'tub', by: 'Harry' })
    const clean = choreReducer(claimed, { type: 'MARK_CLEAN', id: 'tub' })
    expect(clean['tub'].state).toBe('clean')
    expect(clean['tub'].claimedBy).toBeUndefined()
  })

  it('does not touch other spots when one changes', () => {
    const s1 = choreReducer(empty, { type: 'FLAG_DIRTY', id: 'trash', by: 'Harry' })
    const s2 = choreReducer(s1, { type: 'FLAG_DIRTY', id: 'plant', by: 'Ariel' })
    expect(s2['trash'].state).toBe('dirty')
    expect(s2['plant'].state).toBe('dirty')
  })
})
