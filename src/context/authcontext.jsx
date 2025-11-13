import React, { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [userRole, setUserRole] = useState(null);
  // NOVO: Estado de carregamento
  const [loadingAuth, setLoadingAuth] = useState(true);

  useEffect(() => {
    const role = localStorage.getItem("userRole");
    if (role) {
      setUserRole(role);
    }
    // AVISA QUE TERMINOU DE CHECAR o localStorage
    setLoadingAuth(false); 
  }, []);

  const login = (role) => {
    localStorage.setItem("userRole", role);
    setUserRole(role); 
  };

  const logout = () => {
    localStorage.removeItem("userRole");
    setUserRole(null);
  };

  // NÃO RENDERIZA O APP ENQUANTO ESTIVER CHECANDO A AUTH
  if (loadingAuth) {
    return (
      <div style={{
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh', 
        backgroundColor: '#151515', 
        color: 'white', 
        fontSize: '1.5rem'
      }}>
        Carregando...
      </div>
    );
  }

  return (
    <AuthContext.Provider value={{ userRole, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);