import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import { AuthProvider } from "./context/authcontext";
// Header é global
import Header from "./components/Header/header";

// Importa suas páginas
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
                        <Route path="/login" element={<Login />} />
                        <Route path="/cadastro" element={<Cadastro />} />
                        <Route path="/" element={<Home />} />
                        <Route path="/filmes" element={<Filmes />} />
                        <Route path="/adicionarfilmes" element={<AdicionarFilmes />} />
                        <Route path="/sobre" element={<Sobre />} />
                        <Route path="/notificacoes" element={<Notificacoes />} />
                        <Route path="/editarperfil" element={<EditarPerfil />} />
                        <Route path="/perfil" element={<Perfil />} />
                        <Route path="/filme/:id" element={<DetalheFilme />} />
                        <Route path="/editarfilme/:id" element={<EditarFilme />} />
                        <Route path="/busca" element={<PaginaBusca />} /> 
                    </Routes>
                </main>
            </Router>
        </AuthProvider>
    );
};

export default App;