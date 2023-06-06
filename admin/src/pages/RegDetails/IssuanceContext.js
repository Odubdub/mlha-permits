import { createContext } from 'react';

export const IssuanceContext = createContext({
  issue: false,
  message: 'Permit cannot be issued until all required actions are complete'
});
