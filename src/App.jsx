import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from "./components/Header/header";
import Home from "./pages/Home/home";
import Login from "./pages/login/login";
import AdicionarFilmes from "./pages/adicionarFilmes/addfilmes";
import Filmes from "./pages/Filmes/filmes";
import Sobre from "./pages/Sobre/sobre";
import Notificacoes from "./pages/notificacoes/notificacoes";


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
        </Routes>
      </main>
    </Router>
  );
};

export default App;