import { createContext } from 'react';

export const CorrectionsContext = createContext({
  onToggleCorrectionMode: () => {},
  corrections: [],
  toggleCorrectionField: () => {},
  correctionMode: false
});
