import { createContext } from "react"

export const AuthContext = createContext({
  userData: null,
  setUserData: () => {}
})