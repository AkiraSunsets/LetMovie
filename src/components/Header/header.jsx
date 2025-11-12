import React, { useEffect, useState } from "react";
import { NavLink, Link, useNavigate, useLocation } from "react-router-dom";
import "bootstrap-icons/font/bootstrap-icons.css";
import "./header.css";
import Dropdown from "../DropdownHeader/dropdownheader";
import { useAuth } from "../../context/authcontext";

const Header = () => {
    const [searchTerm, setSearchTerm] = useState("");
    const {userRole, logout } = useAuth();
    const location = useLocation();
    const navigate = useNavigate();

    const isAuthPage = location.pathname === '/login' || location.pathname === '/cadastro';

    const handleSearchSubmit = (event) => {
        event.preventDefault();
        if (searchTerm.trim()) {
            navigate(`/busca?query=${encodeURIComponent(searchTerm.trim())}`);
            setSearchTerm("");
        }
    };

    const handleLogout = () => {
        logout();
        navigate("/login")
    };

    // Componente Menu
    const ProfileMenu = () => (
        <>
            <div className="profile-menu-header">
                <i className="bi bi-person-circle profile-menu-avatar"></i>
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

                {userRole === "admin" && (
                    <>
                        <li>
                            <Link to="/adicionarfilmes" className="profile-menu-item">
                                <i className="bi bi-plus-circle-fill"></i>
                                <span>Adicionar Filme</span>
                            </Link>
                        </li>
                        <li>
                            <Link to="/notificacoes" className="profile-menu-item">
                                <i className="bi bi-bell-fill"></i>
                                <span>Notificações</span>
                            </Link>
                        </li>
                    </>
                )}

                <li className="profile-menu-item logout" onClick={handleLogout}>
                    <i className="bi bi-box-arrow-right"></i>
                    <span>Sair</span>
                </li>
            </ul>
        </>
    );

    const NotificationsMenu = () => (
        <>
            <div className="notificacoes-menu-header">Notificações</div>
            <ul className="notifications-list">
                <li className="notifications-item">
                    <span className="notifications-item-text">
                        <strong>"Filme Novo"</strong> foi enviado para aprovação.
                    </span>
                    <div className="notifications-item-actions">
                        <button className="notification-action-button approve" aria-label="Aprovar">
                            <i className="bi bi-check-circle-fill"></i>
                        </button>
                        <button className="notification-action-button reject" aria-label="Rejeitar">
                            <i className="bi bi-x-circle-fill"></i>
                        </button>
                    </div>
                </li>
            </ul>
        </>
    );



    return (
        <header className={`header ${isAuthPage ? 'auth-header' : ""}`}>
            <div className="logo">
                <Link to="/" className="logo-link">
                    <span className="logo-let">Let</span>
                    <span className="logo-movie">Movie</span>
                </Link>
            </div>


            {!isAuthPage && userRole && (
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
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="search-input"
                            />
                            <button type="submit" className="search-button" aria-label="Buscar">
                                <i className="bi bi-search"></i>
                            </button>
                        </form>

                        <div className="section-icons">
                            {userRole === 'admin' && (
                                <Dropdown trigger={
                                    <button className="icon-button" aria-label="Notificações">
                                        <i className="bi bi-bell"></i>
                                    </button>
                                }>
                                    <NotificationsMenu />
                                </Dropdown>
                            )}

                            <Dropdown
                                trigger={
                                    <button className="icon-button" aria-label="Conta de Usuário">
                                        <i className="bi bi-person-circle profile-menu-avatar"></i>
                                    </button>
                                }>
                                <ProfileMenu />
                            </Dropdown>
                        </div>
                    </div>
                </>
            )}
        </header>
    );
};

export default Header;