import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import api from '../api/client';
import { clearToken, getToken, isTokenExpired, setToken } from '../lib/tokenStore';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const queryClient = useQueryClient();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(Boolean(getToken()));
  const [expired, setExpired] = useState(false);

  const endSession = useCallback(() => {
    clearToken();
    setUser(null);
    queryClient.clear();
  }, [queryClient]);

  // Restore the session from a stored token.
  useEffect(() => {
    const token = getToken();
    if (!token) return;
    if (isTokenExpired(token)) {
      endSession();
      setExpired(true);
      setLoading(false);
      return;
    }
    api
      .get('/auth/me')
      .then(({ data }) => setUser(data.user))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [endSession]);

  // The axios interceptor fires this when the API rejects the token mid-session.
  useEffect(() => {
    const onExpired = () => {
      endSession();
      setExpired(true);
    };
    window.addEventListener('auth:expired', onExpired);
    return () => window.removeEventListener('auth:expired', onExpired);
  }, [endSession]);

  const authenticate = useCallback(async (path, payload, remember = true) => {
    const { data } = await api.post(path, payload);
    setToken(data.token, remember);
    setExpired(false);
    setUser(data.user);
    return data.user;
  }, []);

  const value = useMemo(
    () => ({
      user,
      loading,
      expired,
      isAdmin: user?.role === 'admin',
      login: ({ remember, ...credentials }) => authenticate('/auth/login', credentials, remember),
      register: (payload) => authenticate('/auth/register', payload, true),
      logout: endSession,
      updateUser: setUser,
    }),
    [user, loading, expired, authenticate, endSession],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => useContext(AuthContext);
