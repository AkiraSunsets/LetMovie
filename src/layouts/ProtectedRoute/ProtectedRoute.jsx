import React from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../../context/authcontext";

const ProtectedRoute = ({ adminOnly = false }) => {
  const { userRole, loadingAuth } = useAuth();
  const location = useLocation();

  if (loadingAuth) {
    // Aguarda a autenticação carregar
    return <div>Carregando...</div>; 
  }

  // Se não estiver logado, manda para /login
  if (!userRole) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Se a rota é só para admin, mas o user não é admin
  if (adminOnly && userRole !== "admin") {
    // Manda para a Home (ou uma página "Não Autorizado")
    return <Navigate to="/" replace />; 
  }

  // Se passou em tudo, mostra a página
  return <Outlet />;
};

export default ProtectedRoute;