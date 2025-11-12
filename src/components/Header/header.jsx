import React, { useState } from "react";
// 1. IMPORTA O 'useLocation'
import { NavLink, Link, useNavigate, useLocation } from "react-router-dom"; 
import "bootstrap-icons/font/bootstrap-icons.css";
import "./header.css";

const Header = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  // OBTÉM A LOCALIZAÇÃO ATUAL
  const location = useLocation(); 

  // VERIFICA SE ESTAMOS EM UMA PÁGINA DE AUTENTICAÇÃO
  const isAuthPage = location.pathname === '/login' || location.pathname === '/cadastro';

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleSearchSubmit = (event) => {
    event.preventDefault();
    if (searchTerm.trim()) {
      const encodedSearchTerm = encodeURIComponent(searchTerm.trim());
      navigate(`/busca?query=${encodedSearchTerm}`);
      setSearchTerm("");
    }
  };

  return (
    <header className={`header ${isAuthPage ? 'auth-header' : ''}`}>
      <div className="logo">
        <Link to="/" className="logo-link">
          <span className="logo-let">Let</span>
          <span className="logo-movie">Movie</span>
        </Link>
      </div>

      { /* SÓ RENDERIZA O RESTO SE NÃO FOR PÁGINA DE AUTH */ }
      {!isAuthPage && (
        <>
          <nav className="nav-main">
            <ul className="nav-list">
              <li className="nav-item">
                <NavLink to="/" className={({ isActive }) => (isActive ? "active-link" : "")}>
                  Home
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink to="/filmes" className={({ isActive }) => (isActive ? "active-link" : "")}>
                  Filmes
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink to="/adicionarfilmes" className={({ isActive }) => (isActive ? "active-link" : "")}>
                  Adicionar Filme
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink to="/sobre" className={({ isActive }) => (isActive ? "active-link" : "")}>
                  Sobre
                </NavLink>
              </li>
            </ul>
          </nav>

          <div className="header-right-section">
            <form className="search-form" onSubmit={handleSearchSubmit}>
              <input
                type="text"
                placeholder="Buscar filmes..."
                value={searchTerm}
                onChange={handleSearchChange}
                className="search-input"
              />
              <button type="submit" className="search-button" aria-label="Buscar">
                <i className="bi bi-search"></i>
              </button>
            </form>

            <div className="section-icons">
              <button className="icon-button" aria-label="Favoritos">
                <i className="bi bi-heart"></i>
              </button>
              <button className="icon-button" aria-label="Notificações">
                <i className="bi bi-bell"></i>
              </button>
              <button className="icon-button" aria-label="Conta do Usuário">
                <i className="bi bi-person-circle"></i>
              </button>
            </div>
          </div>
        </>
      )}
    </header>
  );
};

export default Header;