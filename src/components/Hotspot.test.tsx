import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Hotspot } from './Hotspot'
import type { ChoreDefinition, Chore } from '../data/chores'

const def: ChoreDefinition = {
  id: 'kitchen-sink',
  label: 'Kitchen Sink',
  room: 'Kitchen',
  top: '10%',
  left: '30%',
  sceneIndex: 0,
  messEmoji: '🍽️',
}

const cleanChore: Chore = { id: 'kitchen-sink', state: 'clean' }
const dirtyChore: Chore = { id: 'kitchen-sink', state: 'dirty', flaggedBy: 'Harry', flaggedAt: new Date().toISOString() }
const claimedChore: Chore = { id: 'kitchen-sink', state: 'claimed', flaggedBy: 'Harry', claimedBy: 'Ariel', flaggedAt: new Date().toISOString() }

describe('Hotspot', () => {
  it('renders without crashing for each state', () => {
    const { rerender } = render(<Hotspot def={def} chore={cleanChore} onClick={vi.fn()} />)
    rerender(<Hotspot def={def} chore={dirtyChore} onClick={vi.fn()} />)
    rerender(<Hotspot def={def} chore={claimedChore} onClick={vi.fn()} />)
  })

  it('calls onClick when tapped', async () => {
    const onClick = vi.fn()
    render(<Hotspot def={def} chore={cleanChore} onClick={onClick} />)
    await userEvent.click(screen.getByRole('button'))
    expect(onClick).toHaveBeenCalledOnce()
  })

  it('positions itself at the definition coordinates', () => {
    render(<Hotspot def={def} chore={cleanChore} onClick={vi.fn()} />)
    const btn = screen.getByRole('button')
    expect(btn.style.top).toBe('10%')
    expect(btn.style.left).toBe('30%')
  })

  it('shows stain blob when dirty', () => {
    const { container } = render(<Hotspot def={def} chore={dirtyChore} onClick={vi.fn()} />)
    const blob = container.querySelector('[style*="border-radius"]')
    expect(blob).toBeTruthy()
  })

  it('shows stain blob when claimed', () => {
    const { container } = render(<Hotspot def={def} chore={claimedChore} onClick={vi.fn()} />)
    const blob = container.querySelector('[style*="border-radius"]')
    expect(blob).toBeTruthy()
  })
})
