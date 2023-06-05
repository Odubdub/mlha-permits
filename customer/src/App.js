import ThemeConfig from './theme';
import GlobalStyles from './theme/globalStyles';
import MainPage from './Main';
import { useEffect, useState } from 'react';
import { DataContext } from './DataContext';
import { AuthContext } from './AuthContext';
import { RequestContext } from './RequestContext';
import Login from './Auth/Login';
import { getAuthParams } from './Auth/AuthService';
import jwtDecode from 'jwt-decode';
import { Welcome } from './Auth/Welcome'

export default function App() {
  const [userData, setUserData] = useState(null);
  const userValues = { userData, setUserData };
  const [currentRequest, setCurrentRequest] = useState(null);
  const [readOnlyForm, setReadOnlyForm] = useState(false);
  const [didCheck, setDidCheck] = useState(false);
  const [viewAll, setViewAll] = useState(false);
  const [refreshRegistrations, setRefreshRegistrations] = useState(0);

  const currentRequestValues = {
    currentRequest,
    setCurrentRequest,
    viewAll,
    setViewAll,
    readOnlyForm,
    setReadOnlyForm,
    refreshRegistrations,
    setRefreshRegistrations
  };

  useEffect(() => {
    const params = getAuthParams();
    if (params) {
      const decoded = jwtDecode(params);
      setUserData(decoded);
    }
    setDidCheck(true);
  }, []);

  useEffect(() => {
    if (userData) {
      document.getElementById('tsparticles').style.display = 'none';
    } else {
      document.getElementById('tsparticles').style.display = 'block';
    }
  }, [userData]);

  return (
    <ThemeConfig>
      <GlobalStyles />
      <AuthContext.Provider value={userValues}>
        {
          <RequestContext.Provider value={currentRequestValues}>
            <DataContext.Provider value={currentRequest}>
              {didCheck && <>{userData == null ? <Welcome/> : <MainPage />}</>}
            </DataContext.Provider>
          </RequestContext.Provider>
        }
      </AuthContext.Provider>
    </ThemeConfig>
  );
}
