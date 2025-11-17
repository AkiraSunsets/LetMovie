import React, { useEffect, useState } from "react";
import { NavLink, Link, useNavigate, useLocation } from "react-router-dom";
import "bootstrap-icons/font/bootstrap-icons.css";
import "./header.css";
import DropdownHeader from "../DropdownHeader/dropdownheader"; // Seu Dropdown
import { useAuth } from "../../context/authcontext"; // Seu Auth

const Header = () => {
    const [searchTerm, setSearchTerm] = useState("");
    const { userRole, logout } = useAuth();
    const location = useLocation();
    const navigate = useNavigate();

    // Estado para notificações
    const [notificacoes, setNotificacoes] = useState([]);

    const isAuthPage = location.pathname === '/login' || location.pathname === '/cadastro';

    // Busca notificações se for admin
    useEffect(() => {
        // Só busca se for admin E não estiver na pág de login
        if (userRole === 'admin') {
            const fetchNotificacoes = async () => {
                try {
                    // Busca na nova API
                    const response = await fetch("http://localhost:8000/api/filmes/pendentes");
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
            
            // Opcional: Adicionar um 'interval' para checar a cada 30s
            // const intervalId = setInterval(fetchNotificacoes, 30000);
            // return () => clearInterval(intervalId);

        } else {
            setNotificacoes([]); // Limpa se não for admin
        }
    }, [userRole, location]); // Recarrega se a role ou a rota mudar

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
        <>
            <div className="profile-menu-header">
                <i className="bi bi-person-circle header-avatar-icon"></i>

                <span className="profile-menu-user">
                    {userRole === "admin" ? "Administrador" : "Usuário Comum"}
                </span>
            </div>
            <ul className="profile-menu-list">
                <li><Link to="/perfil" className="profile-menu-item"><i className="bi bi-person-fill"></i><span>Meu Perfil</span></Link></li>
                <li><Link to="/editarperfil" className="profile-menu-item"><i className="bi bi-gear-fill"></i><span>Editar Perfil</span></Link></li>
                {userRole === "admin" && (
                    <>
                        <li><Link to="/notificacoes" className="profile-menu-item"><i className="bi bi-bell-fill"></i><span>Ver Notificações</span></Link></li>
                    </>
                )}
                <li style={{cursor: 'pointer'}} className="profile-menu-item logout" onClick={handleLogout}><i className="bi bi-box-arrow-right"></i><span>Sair</span></li>
            </ul>
        </>
    );

    // Componente Menu Notificações (Agora dinâmico)
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
                        <span className="notifications-item-text">Nenhuma notificação pendente.</span>
                    </li>
                )}
            </ul>
            <Link to="/notificacoes" className="notification-view-link">
                Ver todas
            </Link>
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

            {/* Mostra o menu SÓ SE não for pág de auth E estiver logado */}
            {!isAuthPage && userRole && (
                <>
                    <nav className="nav-main">
                        <ul className="nav-list">
                            <li className="nav-item"><NavLink to="/" className={({ isActive }) => (isActive ? "active-link" : "")}>Home</NavLink></li>
                            <li className="nav-item"><NavLink to="/filmes" className={({ isActive }) => (isActive ? "active-link" : "")}>Filmes</NavLink></li>
                            
                            {/* --- CORREÇÃO AQUI --- */}
                            {/* O link agora aparece para TODOS os usuários logados */}
                            <li className="nav-item"><NavLink to="/adicionarfilmes" className={({ isActive }) => (isActive ? "active-link" : "")}>Adicionar Filme</NavLink></li>
                            
                            <li className="nav-item"><NavLink to="/sobre" className={({ isActive }) => (isActive ? "active-link" : "")}>Sobre</NavLink></li>
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
                                <DropdownHeader trigger={ // Seu componente Dropdown
                                    <button className="icon-button" aria-label="Notificações">
                                        <i className="bi bi-bell"></i>
                                        {/* Badge de Notificação (NOVO) */}
                                        {notificacoes.length > 0 && (
                                            <span className="notification-badge">{notificacoes.length}</span>
                                        )}
                                    </button>
                                }>
                                    <NotificationsMenu />
                                </DropdownHeader>
                            )}

                            <DropdownHeader // Seu componente Dropdown
                                trigger={
                                    <button className="icon-button" aria-label="Conta de Usuário">
                                        <i className="bi bi-person-circle header-avatar-icon"></i>
                                    </button>
                                }>
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