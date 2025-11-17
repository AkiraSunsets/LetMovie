import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/authcontext';
import './perfil.css'; // Novo CSS
import 'bootstrap-icons/font/bootstrap-icons.css';

// Página de Perfil (baseada no mockup image_e8f0a2.png)
// NOTA: O backend não tem uma API de usuário, então estes dados são simulados.
const Perfil = () => {
    const { userRole } = useAuth();
    
    // Dados simulados
    const userData = {
        nome: userRole === 'admin' ? 'Administrador' : 'Usuário Comum',
        email: userRole === 'admin' ? 'admin@letmovie.com' : 'user@letmovie.com',
        genero: 'Não especificado',
        dataNascimento: '01/01/2000',
        sobreMim: 'Olá! Eu sou um fã de filmes.'
    };

    return (
        <div className="perfil-container">
            <div className="perfil-card">
                <h1 className="perfil-title">
                    <i className="bi bi-person-circle"></i>
                    Profile
                </h1>
                
                <div className="perfil-content">
                    <div className="perfil-avatar">
                        {/* Imagem de placeholder */}
                        <img src="https://placehold.co/150x150/c80710/white?text=User" alt="Avatar" />
                    </div>
                    
                    <div className="perfil-info">
                        <div className="perfil-field">
                            <label>Nome Completo:</label>
                            <span>{userData.nome}</span>
                        </div>
                        <div className="perfil-field">
                            <label>Email:</label>
                            <span>{userData.email}</span>
                        </div>
                        <div className="perfil-field-row">
                            <div className="perfil-field">
                                <label>Gênero:</label>
                                <span>{userData.genero}</span>
                            </div>
                            <div className="perfil-field">
                                <label>Data de Nascimento:</label>
                                <span>{userData.dataNascimento}</span>
                            </div>
                        </div>
                         <div className="perfil-field">
                            <label>Sobre mim:</label>
                            <p>{userData.sobreMim}</p>
                        </div>

                        <div className="perfil-actions">
                            <Link to="/editarperfil" className="perfil-button-edit">
                                Editar
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Perfil;