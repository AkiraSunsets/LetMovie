import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

//componentes globais
import { AuthProvider } from "./context/authcontext";
import Header from "./components/Header/header";
import Footer from "./components/footer/footer";
import MainLayout from "./layouts/MainLayout/MainLayout"; 
import ProtectedRoute from "./layouts/ProtectedRoute/ProtectedRoute";

//páginas
import Home from "./pages/Home/home";
import Login from "./pages/login/login";
import Cadastro from "./pages/cadastro/cadastro";
import AdicionarFilmes from "./pages/adicionarfilmes/adicionarfilmes";
import Filmes from "./pages/Filmes/filmes";
import Sobre from "./pages/Sobre/sobre";
import Notificacoes from "./pages/notificacoes/notificacoes";
import EditarPerfil from './pages/editarperfil/editarperfil';
import Perfil from './pages/perfil/perfil';
import DetalheFilme from "./pages/detalhefilme/detalhefilme";
import EditarFilme from "./pages/editarfilmes/editarfilmes";
import PaginaBusca from "./pages/Busca/busca"; 

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <Header />
        <main>
          <Routes>
            {/* Rotas Públicas */}
            <Route path="/login" element={<Login />} />
            <Route path="/cadastro" element={<Cadastro />} />

            {/* Rotas Protegidas (precisa estar logado) */}
            <Route element={<ProtectedRoute />}>
              <Route path="/" element={<Home />} />
              <Route path="/filmes" element={<Filmes />} />
              <Route path="/sobre" element={<Sobre />} />
              <Route path="/editarperfil" element={<EditarPerfil />} />
              <Route path="/perfil" element={<Perfil />} />
              <Route path="/filme/:id" element={<DetalheFilme />} />
              <Route path="/busca" element={<PaginaBusca />} />
            </Route>

            {/* Rotas de Admin (precisa ser admin) */}
            <Route element={<ProtectedRoute adminOnly={true} />}>
              <Route path="/adicionarfilmes" element={<AdicionarFilmes />} />
              <Route path="/editarfilme/:id" element={<EditarFilme />} />
              <Route path="/notificacoes" element={<Notificacoes />} />
            </Route>

          </Routes>
        </main>
        <Footer />
      </Router>
    </AuthProvider>
  );
};

export default App;