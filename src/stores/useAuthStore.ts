import { create } from 'zustand'
import { User } from '@/types'

interface AuthState {
  user: User | null
  isAuthenticated: boolean
  login: (email: string, role?: User['role']) => void
  logout: () => void
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  login: (email, role = 'manager') => {
    set({
      isAuthenticated: true,
      user: {
        id: '1',
        name: 'Carlos Silva',
        email,
        role,
        company: 'Vectra Cargo',
        avatarUrl:
          'https://img.usecurling.com/ppl/thumbnail?gender=male&seed=1',
      },
    })
  },
  logout: () => set({ user: null, isAuthenticated: false }),
}))
