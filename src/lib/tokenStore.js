const KEY = 'yusafir_token';

// "Remember me" keeps the token across browser restarts; otherwise it lives for the tab only.
export const getToken = () => localStorage.getItem(KEY) ?? sessionStorage.getItem(KEY);

export const clearToken = () => {
  localStorage.removeItem(KEY);
  sessionStorage.removeItem(KEY);
};

export const setToken = (token, remember) => {
  clearToken();
  (remember ? localStorage : sessionStorage).setItem(KEY, token);
};

export const isTokenExpired = (token) => {
  try {
    const { exp } = JSON.parse(atob(token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/')));
    return !exp || exp * 1000 <= Date.now();
  } catch {
    return true;
  }
};
