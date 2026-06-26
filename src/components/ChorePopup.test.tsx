import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { ChorePopup } from './ChorePopup'
import type { ChoreDefinition, Chore } from '../data/chores'

const def: ChoreDefinition = {
  id: 'trash',
  label: 'Trash Area',
  room: 'Kitchen / Hallway',
  top: '43%',
  left: '35%',
  sceneIndex: 1,
}

const cleanChore:   Chore = { id: 'trash', state: 'clean' }
const dirtyChore:   Chore = { id: 'trash', state: 'dirty',   flaggedBy: 'Ariel', flaggedAt: new Date().toISOString() }
const claimedChore: Chore = { id: 'trash', state: 'claimed', flaggedBy: 'Ariel', claimedBy: 'Dylan', flaggedAt: new Date().toISOString() }

const noop = vi.fn()
const actions = { onFlagDirty: noop, onClaim: noop, onMarkClean: noop, onClose: noop }

describe('ChorePopup', () => {
  it('shows the chore label and room', () => {
    render(<ChorePopup def={def} chore={cleanChore} currentUser="Harry" {...actions} />)
    expect(screen.getByText('Trash Area')).toBeTruthy()
    expect(screen.getByText('Kitchen / Hallway')).toBeTruthy()
  })

  it('shows Flag dirty button when clean', () => {
    render(<ChorePopup def={def} chore={cleanChore} currentUser="Harry" {...actions} />)
    expect(screen.getByText(/Flag dirty/i)).toBeTruthy()
  })

  it('shows Claim and Mark clean buttons when dirty', () => {
    render(<ChorePopup def={def} chore={dirtyChore} currentUser="Harry" {...actions} />)
    expect(screen.getByText(/Claim/i)).toBeTruthy()
    expect(screen.getByText(/Mark clean/i)).toBeTruthy()
  })

  it('shows Mark clean button when claimed', () => {
    render(<ChorePopup def={def} chore={claimedChore} currentUser="Harry" {...actions} />)
    expect(screen.getByText(/Mark clean/i)).toBeTruthy()
  })

  it('shows who flagged it when dirty', () => {
    render(<ChorePopup def={def} chore={dirtyChore} currentUser="Harry" {...actions} />)
    expect(screen.getByText(/Ariel/)).toBeTruthy()
  })

  it('calls onFlagDirty when Flag dirty is clicked', async () => {
    const onFlagDirty = vi.fn()
    render(<ChorePopup def={def} chore={cleanChore} currentUser="Harry" {...actions} onFlagDirty={onFlagDirty} />)
    await userEvent.click(screen.getByText(/Flag dirty/i))
    expect(onFlagDirty).toHaveBeenCalledOnce()
  })

  it('calls onClaim when Claim is clicked', async () => {
    const onClaim = vi.fn()
    render(<ChorePopup def={def} chore={dirtyChore} currentUser="Harry" {...actions} onClaim={onClaim} />)
    await userEvent.click(screen.getByText(/Claim/i))
    expect(onClaim).toHaveBeenCalledOnce()
  })

  it('calls onClose when Cancel is clicked', async () => {
    const onClose = vi.fn()
    render(<ChorePopup def={def} chore={cleanChore} currentUser="Harry" {...actions} onClose={onClose} />)
    await userEvent.click(screen.getByText(/Cancel/i))
    expect(onClose).toHaveBeenCalledOnce()
  })
})
