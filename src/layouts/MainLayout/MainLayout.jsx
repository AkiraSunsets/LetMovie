import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from '../../components/Header/header'; 

//é usado para envolver paginas que precisam do header com rotas
const MainLayout = () => {
  return (
    <>
      <Header />
      <Outlet /> {/*renderiza o componente da rota atual */}
    </>
  );
};

export default MainLayout;