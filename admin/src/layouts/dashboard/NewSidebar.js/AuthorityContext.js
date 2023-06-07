import { createContext } from "react"
export const Authorities = [

]

export const AuthorityContext = createContext({
    authority: Authorities[0],
    setAuthority: () => {}
})