import { createContext, useContext, useState } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [institucionId, setInstitucionId] = useState(null);
  const [institucionN, setInstitucionN] = useState(null);

  const contextValue = {
    institucionId,
    setInstitucionId,
    institucionN,
    setInstitucionN
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};
