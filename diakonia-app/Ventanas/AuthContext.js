import React, { createContext, useContext, useState } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [institucionId, setInstitucionId] = useState(null);
  const [institucionN, setInstitucionN] = useState(null);
  const [convenioN, setConvenioN] = useState(null);
  const [convenioId, setConvenioId] = useState(null);

  const [scannedData, setScannedData] = useState({
    nombre: '',
    institucion: '',
    iDinstitucion: '',
    idBeneficiario: '',
    convenio:''
  });

  const updateScannedData = (newData) => {
    setScannedData(newData);
  };

  const contextValue = {
    institucionId,
    setInstitucionId,
    institucionN,
    setInstitucionN,
    convenioN,
    setConvenioN,
    convenioId,
    setConvenioId,
    scannedData,
    updateScannedData,
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
