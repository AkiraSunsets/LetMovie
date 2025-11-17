import React, { useEffect, useState } from "react";
import { NavLink, Link, useNavigate, useLocation } from "react-router-dom";
import "bootstrap-icons/font/bootstrap-icons.css";
import "./header.css";
import DropdownHeader from "../DropdownHeader/dropdownheader";
import { useAuth } from "../../context/authcontext"; //utilizado para mostrar headers diferentes para usuários/admins/sem logar

const Header = () => {
  const [searchTerm, setSearchTerm] = useState(""); //armazena o texto digitado na barra de pesquisa
  const { userRole, logout } = useAuth(); // recebe o usuário e função de logout
  const location = useLocation(); //detecta rota atual
  const navigate = useNavigate(); //hook de navegação

  // Estado para notificações (somente admins)
  const [notificacoes, setNotificacoes] = useState([]);

  //detecta se a pagina atual é login ou cadastro
  const isAuthPage =
    location.pathname === "/login" || location.pathname === "/cadastro";

  // Busca notificações se for admin
  useEffect(() => {
    if (userRole === "admin") {
      const fetchNotificacoes = async () => {
        try {
          // Busca API de filmes pendentes
          const response = await fetch(
            "http://localhost:8000/api/filmes/pendentes"
          );
          const data = await response.json();
          if (response.ok) {
            //se estiver ok, exibe filmes pendentes
            setNotificacoes(data);
          } else {
            console.error("Erro ao buscar notificações:", data.message); // se não, exibe mensagem de erro
          }
        } catch (err) {
          console.error("Erro de rede ao buscar notificações:", err);
        }
      };
      fetchNotificacoes();
    } else {
      setNotificacoes([]); // Limpa se não for admin
    }
  }, [userRole, location]); // Recarrega se a role ou a rota mudar

  //quando o usuário envia o search
  const handleSearchSubmit = (event) => {
    event.preventDefault();

    //redireciona para a página de busca com o resultado da pesquisa
    if (searchTerm.trim()) {
      navigate(`/busca?query=${encodeURIComponent(searchTerm.trim())}`);
      setSearchTerm("");
    }
  };

  //logout e redirecionamento para a pagina login
  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  //menu de usuário
  const ProfileMenu = () => (
    <>
      <div className="profile-menu-header">
        <i className="bi bi-person-circle header-avatar-icon"></i>
        
        {/* mostra se o usuário é admin ou user */}
        <span className="profile-menu-user">
          {userRole === "admin" ? "Administrador" : "Usuário Comum"}
        </span>
      </div>
      <ul className="profile-menu-list">
        <li>
          <Link to="/perfil" className="profile-menu-item">
            <i className="bi bi-person-fill"></i>
            <span>Meu Perfil</span>
          </Link>
        </li>

        <li>
          <Link to="/editarperfil" className="profile-menu-item">
            <i className="bi bi-gear-fill"></i>
            <span>Editar Perfil</span>
          </Link>
        </li>


        {/*apenas admins conseguem ver as notificações */}
        {userRole === "admin" && (
          <>
            <li>
              <Link to="/notificacoes" className="profile-menu-item">
                <i className="bi bi-bell-fill"></i>
                <span>Ver Notificações</span>
              </Link>
            </li>
          </>
        )}

        {/* botão de logout */}
        <li
          style={{ cursor: "pointer" }}
          className="profile-menu-item logout"
          onClick={handleLogout}
        >
          <i className="bi bi-box-arrow-right"></i>
          <span>Sair</span>
        </li>
      </ul>
    </>
  );

  // Menu de notificações
  const NotificationsMenu = () => (
    <>
      <div className="notificacoes-menu-header">Notificações</div>
      <ul className="notifications-list">
        {notificacoes.length > 0 ? (
          // Mostra só as 3 mais recentes no dropdown
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
      <Link to="/notificacoes" className="notification-view-link"> {/* botão para ir para a página completa */}
        Ver todas
      </Link>
    </>
  );

  return (
    <header className={`header ${isAuthPage ? "auth-header" : ""}`}>
      <div className="logo">
        <Link to="/" className="logo-link">
          <span className="logo-let">Let</span>
          <span className="logo-movie">Movie</span>
        </Link>
      </div>

      {/* Só mostra o menu se o usuário estiver logado */}
      {!isAuthPage && userRole && (
        <>
          <nav className="nav-main">
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

            {/* link de adicionar filmes (todos os usuários possuem acesso) */}
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

        {/* area direita do header */}
          <div className="header-right-section">

            {/* barra de busca */}
            <form className="search-form" onSubmit={handleSearchSubmit}>
              <input
                type="text"
                placeholder="Buscar filmes..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="search-input"
              />
              <button
                type="submit"
                className="search-button"
                aria-label="Buscar"
              >
                <i className="bi bi-search"></i>
              </button>
            </form>

            {/* icones da direita com popup */}
            <div className="section-icons">
              {userRole === "admin" && (
                <DropdownHeader
                  trigger={

                    <button className="icon-button" aria-label="Notificações">
                      <i className="bi bi-bell"></i>

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

            {/* menu de usuário */}
              <DropdownHeader 
                trigger={
                  <button className="icon-button" aria-label="Conta de Usuário">
                    <i className="bi bi-person-circle header-avatar-icon"></i>
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
