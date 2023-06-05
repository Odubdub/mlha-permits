import { createContext } from "react"

export const DepartmentContext = createContext({
  departmentData: null,
  setDepartmentData: () => {},
  services: [],
  setServices: null
})