import React, { createContext, useContext, useState, useEffect } from "react";

//cria o contexto de autenticação
const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [userRole, setUserRole] = useState(null); //estado para guardar a role do usuario
  const [loadingAuth, setLoadingAuth] = useState(true); //estado de carregamento enquanto checa as informações

  //roda apenas uma vez ao montar o componente
  useEffect(() => {
    const role = localStorage.getItem("userRole"); //checa se há role salva no localStorage
    if (role) {
      setUserRole(role); // atualiza o estado
    }
    setLoadingAuth(false); // termina o carregamento
  }, []);

  //função para fazer login
  const login = (role) => {
    localStorage.setItem("userRole", role); //salva a role no localStorage
    setUserRole(role); // atualiza o estado
  };

  //função para fazer logout
  const logout = () => {
    localStorage.removeItem("userRole"); //remove do localstorage
    setUserRole(null); //reseta o estado
  };

  // enquanto esitver carregando auth, exibe um loader centralizado
  if (loadingAuth) {
    return (
      <div style={{
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh', 
        backgroundColor: '#ffffff', 
        color: 'white', 
        fontSize: '24px'
      }}>
        Carregando...
      </div>
    );
  }

  //provedor do contexto para passar userRole e funções login/logout
  return (
    <AuthContext.Provider value={{ userRole, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);