import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { FloorPlan } from './FloorPlan'
import { CHORE_DEFINITIONS } from '../data/chores'

// Vite asset imports return empty string in jsdom
vi.mock('../assets/floorplan1.png', () => ({ default: '' }))
vi.mock('../assets/floorplanpopup1.png', () => ({ default: '' }))

describe('FloorPlan', () => {
  it('renders the floor plan image', () => {
    render(<FloorPlan currentUser="Harry" chores={{}} flagDirty={vi.fn()} claim={vi.fn()} markClean={vi.fn()} />)
    expect(screen.getByAltText('Floor plan')).toBeTruthy()
  })

  it('renders a hotspot button per chore definition', () => {
    render(<FloorPlan currentUser="Harry" chores={{}} flagDirty={vi.fn()} claim={vi.fn()} markClean={vi.fn()} />)
    expect(screen.getAllByRole('button').length).toBe(CHORE_DEFINITIONS.length)
  })

  it('opens popup when a hotspot is clicked', async () => {
    render(<FloorPlan currentUser="Harry" chores={{}} flagDirty={vi.fn()} claim={vi.fn()} markClean={vi.fn()} />)
    await userEvent.click(screen.getAllByRole('button')[0])
    expect(screen.getByText(/Cancel/i)).toBeTruthy()
  })

  it('closes popup when Cancel is clicked', async () => {
    render(<FloorPlan currentUser="Harry" chores={{}} flagDirty={vi.fn()} claim={vi.fn()} markClean={vi.fn()} />)
    await userEvent.click(screen.getAllByRole('button')[0])
    await userEvent.click(screen.getByText(/Cancel/i))
    expect(screen.queryByText(/Cancel/i)).toBeNull()
  })
})
