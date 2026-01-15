import { vi } from 'vitest'

const supabase = {
  auth: {
    signInWithPassword: vi.fn(),
    signOut: vi.fn(),
    signUp: vi.fn(),
    getUser: vi.fn(),
    onAuthStateChange: vi.fn(),
  },
}

export default supabase