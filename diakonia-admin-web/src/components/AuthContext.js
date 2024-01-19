import { createContext, useCallback, useContext, useMemo, useState } from 'react';
import PropTypes from 'prop-types';

const MY_AUTH_APP = 'MY_AUTH_APP';

export const AuthContext = createContext();

export default function AuthContextProvider({ children }) {
  const [user, setUser] = useState(() => JSON.parse(window.localStorage.getItem(MY_AUTH_APP)));
  const [isAuthenticated,SetisAuthenticated]= useState(Boolean(user));
  const [nombre, setNombre] = useState('');

  const login = useCallback(
    function (userData) {
      window.localStorage.setItem(MY_AUTH_APP, JSON.stringify(userData));
      setUser(userData);
      console.log(userData);
      SetisAuthenticated(Boolean(user))
    },
    []
  );

  const logout = useCallback(function () {
    window.localStorage.removeItem(MY_AUTH_APP);
    setUser(null);
    SetisAuthenticated(Boolean(user));
    setNombre('');
  }, []);

  const value = useMemo(
    () => ({
      login,
      logout,
      isAuthenticated: Boolean(user),
      user,
      nombre,
    }),
    [nombre,user, login, logout, isAuthenticated]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

AuthContextProvider.propTypes = {
  children: PropTypes.node,
};

export function useAuthContext() {
  return useContext(AuthContext);
}
