import { createContext } from 'react';
import { AuthorityPermits } from 'src/helper';

export const FiltersContext = createContext({
  filters: {},
  setFilters: () => {}
});

export const DefaultAuthorityFilters = {
  BOTC: {
    ftype: AuthorityPermits.BOTC[0].fName,
    type: AuthorityPermits.BOTC[0].type,
    status: 'all',
    fstatus: 'All Registrations'
  },
  MYSC: {
    ftype: AuthorityPermits.MYSC[0].fName,
    type: AuthorityPermits.MYSC[0].type,
    status: 'all',
    fstatus: 'All Registrations'
  },
  MOBE: {
    ftype: AuthorityPermits.MOBE[0].fName,
    type: AuthorityPermits.MOBE[0].type,
    status: 'all',
    fstatus: 'All Registrations'
  },
  MLGRD: {
    ftype: AuthorityPermits.MLGRD[0].fName,
    type: AuthorityPermits.MLGRD[0].type,
    status: 'all',
    fstatus: 'All Registrations'
  }
};
