import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from "./components/Header/header";
import Home from "./pages/Home/home";
import Login from "./pages/login/login";
import AdicionarFilmes from "./pages/adicionarfilmes/adicionarfilmes";
import Filmes from "./pages/Filmes/filmes";
import Sobre from "./pages/Sobre/sobre";
import Notificacoes from "./pages/notificacoes/notificacoes";
import EditarPerfil from './pages/editarperfil/editarperfil';
import Perfil from './pages/perfil/perfil';
import DetalheFilme from "./pages/DetalheFilme/detalhefilme"; // <- Crie esta página
import EditarFilme from "./pages/editarfilmes/editarfilmes"; // <- Mudei o nome para maiúscula (padrão)

const App = () => {
  return (
    <Router>
      <Header />
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/adicionarfilmes" element={<AdicionarFilmes />} />
          <Route path="/filmes" element={<Filmes />} />
          <Route path="/sobre" element={<Sobre />} /> 
          <Route path="/notificacoes" element={<Notificacoes />} /> 
          <Route path="/editarperfil" element={<EditarPerfil />} /> 

          {/* 👇 ROTA IMPORTANTE QUE FALTAVA 👇 */}
          {/* Esta rota captura /filme/1, /filme/2, etc. */}
          <Route path="/filme/:id" element={<DetalheFilme />} />

          {/* 👇 AJUSTE NECESSÁRIO NA ROTA DE EDIÇÃO 👇 */}
          {/* Você precisa saber QUAL filme editar */}
          <Route path="/editarfilme/:id" element={<EditarFilme />} />

        </Routes>
      </main>
    </Router>
  );
};

export default App;

