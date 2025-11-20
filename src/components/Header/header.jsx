import React, { useEffect, useState } from "react";
import { NavLink, Link, useNavigate, useLocation } from "react-router-dom";
import "bootstrap-icons/font/bootstrap-icons.css";
import "./header.css";
import DropdownHeader from "../DropdownHeader/dropdownheader";
import { useAuth } from "../../context/authcontext"; 

const Header = () => {
  const [searchTerm, setSearchTerm] = useState(""); 
  const { userRole, logout } = useAuth(); 
  const location = useLocation(); 
  const navigate = useNavigate(); 

  const [notificacoes, setNotificacoes] = useState([]);

  const isAuthPage =
    location.pathname === "/login" || location.pathname === "/cadastro";

  useEffect(() => {
    if (userRole === "admin") {
      const fetchNotificacoes = async () => {
        try {
          const response = await fetch(
            "http://localhost:8000/api/filmes/pendentes"
          );
          const data = await response.json();
          if (response.ok) {
            setNotificacoes(data);
          } else {
            console.error("Erro ao buscar notificações:", data.message); 
          }
        } catch (err) {
          console.error("Erro de rede ao buscar notificações:", err);
        }
      };
      fetchNotificacoes();
    } else {
      setNotificacoes([]); 
    }
  }, [userRole, location]); 

  const handleSearchSubmit = (event) => {
    event.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/busca?query=${encodeURIComponent(searchTerm.trim())}`);
      setSearchTerm("");
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const ProfileMenu = () => (
    <nav className="profile-menu-nav" aria-label="Menu de usuário">
      <div className="profile-menu-header">
        <i className="bi bi-person-circle header-avatar-icon" aria-hidden="true"></i>
        <span className="profile-menu-user">
          {userRole === "admin" ? "Administrador" : "Usuário Comum"}
        </span>
      </div>
      <ul className="profile-menu-list">
        <li>
          <Link to="/perfil" className="profile-menu-item">
            <i className="bi bi-person-fill" aria-hidden="true"></i>
            <span>Meu Perfil</span>
          </Link>
        </li>
        <li>
          <Link to="/editarperfil" className="profile-menu-item">
            <i className="bi bi-gear-fill" aria-hidden="true"></i>
            <span>Editar Perfil</span>
          </Link>
        </li>
        {userRole === "admin" && (
          <li>
            <Link to="/notificacoes" className="profile-menu-item">
              <i className="bi bi-bell-fill" aria-hidden="true"></i>
              <span>Ver Notificações</span>
            </Link>
          </li>
        )}
        <li
          style={{ cursor: "pointer" }}
          className="profile-menu-item logout"
          onClick={handleLogout}
          role="button" // Importante para acessibilidade em li clicável
        >
          <i className="bi bi-box-arrow-right" aria-hidden="true"></i>
          <span>Sair</span>
        </li>
      </ul>
    </nav>
  );

  const NotificationsMenu = () => (
    <div className="notification-container"> {/* Mantém div ou section pequena */}
      <div className="notificacoes-menu-header">Notificações</div>
      <ul className="notifications-list">
        {notificacoes.length > 0 ? (
          notificacoes.slice(0, 3).map((filme) => (
            <li className="notifications-item" key={filme.id_filme}>
              <span className="notifications-item-text">
                <strong>"{filme.nomeFilme}"</strong> foi enviado para aprovação.
              </span>
            </li>
          ))
        ) : (
          <li className="notifications-item">
            <span className="notifications-item-text">
              Nenhuma notificação pendente.
            </span>
          </li>
        )}
      </ul>
      <Link to="/notificacoes" className="notification-view-link"> 
        Ver todas
      </Link>
    </div>
  );

  return (
    <header className={`header ${isAuthPage ? "auth-header" : ""}`}>
      <div className="logo">
        <Link to="/" className="logo-link">
          <span className="logo-let">Let</span>
          <span className="logo-movie">Movie</span>
        </Link>
      </div>

      {!isAuthPage && userRole && (
        <>
          <nav className="nav-main" aria-label="Navegação principal">
            <ul className="nav-list">
              <li className="nav-item">
                <NavLink
                  to="/"
                  className={({ isActive }) => (isActive ? "active-link" : "")}
                >
                  Home
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink
                  to="/filmes"
                  className={({ isActive }) => (isActive ? "active-link" : "")}
                >
                  Filmes
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink
                  to="/adicionarfilmes"
                  className={({ isActive }) => (isActive ? "active-link" : "")}
                >
                  Adicionar Filme
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink
                  to="/sobre"
                  className={({ isActive }) => (isActive ? "active-link" : "")}
                >
                  Sobre
                </NavLink>
              </li>
            </ul>
          </nav>

          <div className="header-right-section">
            <form className="search-form" onSubmit={handleSearchSubmit} role="search">
              <input
                type="text"
                placeholder="Buscar filmes..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="search-input"
                aria-label="Buscar filmes"
              />
              <button
                type="submit"
                className="search-button"
                aria-label="Buscar"
              >
                <i className="bi bi-search" aria-hidden="true"></i>
              </button>
            </form>

            <div className="section-icons">
              {userRole === "admin" && (
                <DropdownHeader
                  trigger={
                    <button className="icon-button" aria-label="Notificações">
                      <i className="bi bi-bell" aria-hidden="true"></i>
                      {notificacoes.length > 0 && (
                        <span className="notification-badge">
                          {notificacoes.length}
                        </span>
                      )}
                    </button>
                  }
                >
                  <NotificationsMenu />
                </DropdownHeader>
              )}

              <DropdownHeader 
                trigger={
                  <button className="icon-button" aria-label="Conta de Usuário">
                    <i className="bi bi-person-circle header-avatar-icon" aria-hidden="true"></i>
                  </button>
                }
              >
                <ProfileMenu />
              </DropdownHeader>
            </div>
          </div>
        </>
      )}
    </header>
  );
};

export default Header;