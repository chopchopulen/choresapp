import { vi } from 'vitest'

export const supabase = {
  from: vi.fn().mockReturnValue({
    select: vi.fn().mockResolvedValue({ data: [] }),
    update: vi.fn().mockReturnValue({ eq: vi.fn().mockResolvedValue({}) }),
  }),
  channel: vi.fn().mockReturnValue({
    on: vi.fn().mockReturnThis(),
    subscribe: vi.fn().mockReturnThis(),
  }),
  removeChannel: vi.fn(),
}
