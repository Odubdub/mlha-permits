const tokenKey = 'token';

export const updateToken = (token) => {
  window.localStorage.setItem(tokenKey, token);
};

export const getAuthParams = () => {
  return window.localStorage.getItem(tokenKey);
};

export const clearToken = () => {
  window.localStorage.removeItem(tokenKey);
};

//check if token is expired
export const isTokenExpired = () => {
  const authParams = getAuthParams();
  if (authParams == null) {
    return true;
  }
  const diff = new Date(authParams.expiration).getTime() - Date.now();
  const diffSeconds = Math.floor(diff / 1000);

  return diffSeconds < 0;
};
