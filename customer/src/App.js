import ThemeConfig from './theme';
import GlobalStyles from './theme/globalStyles';
import { useEffect, useState } from 'react';
import { DataContext } from './DataContext';
import { AuthContext } from './AuthContext';
import { RequestContext } from './RequestContext';
import { getAuthParams } from './Auth/AuthService';
import jwtDecode from 'jwt-decode';
import { Welcome } from './Auth/Welcome';
import Router from './router';
import { useNavigate } from 'react-router-dom';
import { NotificationContext } from './NotificationContext';

export default function App() {
  const [userData, setUserData] = useState(null);
  const userValues = { userData, setUserData };
  const [currentRequest, setCurrentRequest] = useState(null);
  const [readOnlyForm, setReadOnlyForm] = useState(false);
  const [didCheck, setDidCheck] = useState(false);
  const [viewAll, setViewAll] = useState(false);
  const [refreshRegistrations, setRefreshRegistrations] = useState(0);

  const [notification, setNotification] = useState(null);

  const notificationValues = { notification, setNotification };
  const navigate = useNavigate();

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
      navigate('/dashboard');
    }
    setDidCheck(true);
  }, []);

  useEffect(() => {
    const element = document.getElementById('tsparticles');

    if (userData) {
      if (element) {
        element.style.display = 'none';
      }
    } else {
      if (element) {
        element.style.display = 'block';
      }
    }
  }, [userData]);

  return (
    <ThemeConfig>
      <GlobalStyles />
      <AuthContext.Provider value={userValues}>
        {
          <RequestContext.Provider value={currentRequestValues}>
            <DataContext.Provider value={currentRequest}>
              {didCheck && (
                <>
                  {userData == null ? (
                    <Welcome />
                  ) : (
                    <NotificationContext.Provider value={notificationValues}>
                      <Router />
                    </NotificationContext.Provider>
                  )}
                </>
              )}
            </DataContext.Provider>
          </RequestContext.Provider>
        }
      </AuthContext.Provider>
    </ThemeConfig>
  );
}
