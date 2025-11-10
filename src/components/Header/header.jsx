import React, { useState } from "react";
import { NavLink, Link, useNavigate } from "react-router-dom";
import "bootstrap-icons/font/bootstrap-icons.css";
import "./header.css";

const Header = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

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
    <header className="header">
      {/* ... Logo ... */}
      <div className="logo">
        <Link to="/" className="logo-link">
          <span className="logo-let">Let</span>
          <span className="logo-movie">Movie</span>
        </Link>
      </div>

      <nav className="nav-main">
        <ul className="nav-list">
          <li className="nav-item">
            {/* CORREÇÃO: Adicionado espaço antes de className */}
            <NavLink
              to="/"
              className={({ isActive }) => (isActive ? "active-link" : "")}
            >
              Home
            </NavLink>
          </li>

          <li className="nav-item">
            {/* CORREÇÃO: Adicionado espaço antes de className */}
            <NavLink
              to="/filmes"
              className={({ isActive }) => (isActive ? "active-link" : "")}
            >
              Filmes
            </NavLink>
          </li>

          <li className="nav-item">
            {/* CORREÇÃO: Adicionado espaço antes de className */}
            <NavLink
              to="/adicionarfilmes"
              className={({ isActive }) => (isActive ? "active-link" : "")}
            >
              Adicionar Filme
            </NavLink>
          </li>

          <li className="nav-item">
            {/* CORREÇÃO: Adicionado espaço antes de className */}
            <NavLink
              to="/sobre"
              className={({ isActive }) => (isActive ? "active-link" : "")}
            >
              Sobre
            </NavLink>
          </li>
        </ul>
      </nav>

      {/* Seção de Busca e Ícones */}
      <div className="header-right-section">
        {/* O onSubmit e onChange estão corretos no seu JSX */}
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

        {/* Container dos Ícones*/}
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
    </header>
  );
};

export default Header;
