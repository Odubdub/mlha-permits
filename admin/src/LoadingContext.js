import { createContext } from "react"

export const LoadingContext = createContext({
  load: false,
  setLoad: () => {}
})