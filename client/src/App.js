// routes
import Router from './routes';

// theme
import ThemeConfig from './theme';
import GlobalStyles from './theme/globalStyles';

// components
import ScrollToTop from './components/ScrollToTop';
import { BaseOptionChartStyle } from './components/charts/BaseOptionChart';
import { useEffect, useRef, useState } from 'react';
import { AuthContext } from './AuthContext';
import { LoadingContext } from './LoadingContext';
import AuthRouter from './auth-routes';
import { DepartmentContext } from './DepartmentContext';
import { FiltersContext } from './pages/Registrations/FiltersContext';
import { ValidateModal } from './validate';
import { desc } from './pages/Registrations/Registrations';

export default function App() {
  //Function that adds 2 numbers
  const [userData, setUserData] = useState(null);
  const userValue = { userData, setUserData };

  const [department, setDepartment] = useState(null);
  const [services, setServices] = useState([]);
  const departmentValue = { department, setDepartment, setServices, services };

  const [filters, setFilters] = useState({
    status: 'all',
    type: 'all',
    limitPerPage: 17,
    search: '',
    page: 1,
    sort: 'updatedAt',
    order: desc,
    type: 'all',
    status: 'all'
  });

  const filtersValue = { filters, setFilters };
  const startLoad = useRef(null);
  const stopLoad = useRef(null);
  const stopLoadWithCheck = useRef(null);
  const stopLoadWithError = useRef(null);

  const loadValue = { startLoad, stopLoad, stopLoadWithError, stopLoadWithCheck };

  useEffect(() => {
    //get href from url
    const href = window.location.href;
    if (href.includes('/auth/set-password')) {
      if (userData != null) {
        setUserData(null);
      }
    }
  }, []);

  return (
    <ThemeConfig>
      <ScrollToTop />
      <GlobalStyles />
      <BaseOptionChartStyle />
      <LoadingContext.Provider value={loadValue}>
        <DepartmentContext.Provider value={departmentValue}>
          <FiltersContext.Provider value={filtersValue}>
            <AuthContext.Provider value={userValue}>
              {userData == null ? <AuthRouter /> : <Router />}
              <ValidateModal />
            </AuthContext.Provider>
          </FiltersContext.Provider>
        </DepartmentContext.Provider>
      </LoadingContext.Provider>
    </ThemeConfig>
  );
}
