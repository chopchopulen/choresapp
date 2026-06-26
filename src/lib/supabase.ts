import { createClient } from '@supabase/supabase-js'

const url = import.meta.env.VITE_SUPABASE_URL as string
const key = import.meta.env.VITE_SUPABASE_ANON_KEY as string

console.log('[supabase] url:', url?.slice(0, 30))

export const supabase = createClient(url, key)
