import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { StatusBar } from './StatusBar'

describe('StatusBar', () => {
  it('renders the app title', () => {
    render(<StatusBar currentUser="Harry" onSwitchUser={vi.fn()} />)
    expect(screen.getByText('Apt 4B Chores')).toBeTruthy()
  })

  it('shows the current user name', () => {
    render(<StatusBar currentUser="Ariel" onSwitchUser={vi.fn()} />)
    expect(screen.getByText(/Ariel/)).toBeTruthy()
  })

  it('calls onSwitchUser when user chip is tapped', async () => {
    const onSwitch = vi.fn()
    render(<StatusBar currentUser="Angela" onSwitchUser={onSwitch} />)
    await userEvent.click(screen.getByRole('button'))
    expect(onSwitch).toHaveBeenCalledOnce()
  })
})
