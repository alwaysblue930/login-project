import { create } from 'zustand'
import { TUserJwt } from '../types/types'
import { parseAndDecode } from '../utils/parseJwt'
import axios from 'axios'

type TAuthState = {
  isLoggedIn: boolean
  user: TUserJwt | null
}

type TAuthActions = {
  login: (user: TUserJwt | null) => void
  logoutAsync: () => Promise<void>
  refresh: () => void
}

type TAuthStore = TAuthState & TAuthActions

const useAuthStore = create<TAuthStore>((set) => {
  const initialUser = parseAndDecode()
  return {
    isLoggedIn: initialUser ? true : false,
    user: initialUser,
    login: (user) => {
      set({ isLoggedIn: true, user })
    },
    logoutAsync: async () => {
      axios
        .get('http://localhost:4000/auth/logout', {
          withCredentials: true,
        })
        .then(() => set({ isLoggedIn: false, user: null }))
        .catch((e) => console.log(e))
    },
    refresh: () => {
      const user = parseAndDecode()
      set({ isLoggedIn: user ? true : false, user: user })
    },
  }
})
export default useAuthStore
