import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { UserPicker } from './UserPicker'

describe('UserPicker', () => {
  it('renders all 5 roommate names', () => {
    render(<UserPicker onSelect={vi.fn()} />)
    expect(screen.getByText('Ariel')).toBeTruthy()
    expect(screen.getByText('Aleena')).toBeTruthy()
    expect(screen.getByText('Angela')).toBeTruthy()
    expect(screen.getByText('Dylan')).toBeTruthy()
    expect(screen.getByText('Harry')).toBeTruthy()
  })

  it('calls onSelect with the clicked name', async () => {
    const onSelect = vi.fn()
    render(<UserPicker onSelect={onSelect} />)
    await userEvent.click(screen.getByText('Dylan'))
    expect(onSelect).toHaveBeenCalledWith('Dylan')
  })
})
