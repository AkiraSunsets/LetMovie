import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './editarperfil.css'; // Novo CSS
import 'bootstrap-icons/font/bootstrap-icons.css';

// Página Editar Perfil (baseada no mockup image_e8f36e.png)
// NOTA: O backend não tem uma API de usuário, então esta ação é simulada.
const EditarPerfil = () => {
    const navigate = useNavigate();
    
    // Dados simulados
    const [nome, setNome] = useState("Fulaninho");
    const [genero, setGenero] = useState("Não especificado");
    const [dataNasc, setDataNasc] = useState("01/01/2000");
    const [sobreMim, setSobreMim] = useState("Olá! Eu sou um fã de filmes.");

    const handleSubmit = (e) => {
        e.preventDefault();
        // Lógica de API (simulada)
        alert("Perfil salvo com sucesso! (Simulado)");
        navigate('/perfil'); // Volta para a página de perfil
    };

    return (
        <div className="edit-perfil-container">
            <div className="edit-perfil-card">
                <h1 className="edit-perfil-title">
                    <i className="bi bi-pencil-fill"></i>
                    Editar Perfil
                </h1>
                
                <form onSubmit={handleSubmit}>
                    <div className="edit-perfil-avatar-section">
                        <img src="https://placehold.co/120x120/c80710/white?text=User" alt="Avatar" />
                        <div className="edit-perfil-avatar-actions">
                            <button type="button" className="avatar-button change">Mudar Foto</button>
                            <button type="button" className="avatar-button remove">Remover Foto</button>
                        </div>
                    </div>

                    <div className="edit-perfil-field">
                        <label htmlFor="nome">Nome Completo:</label>
                        <input 
                            type="text" 
                            id="nome" 
                            value={nome} 
                            onChange={(e) => setNome(e.target.value)} 
                        />
                    </div>
                    
                    <div className="edit-perfil-field-row">
                        <div className="edit-perfil-field">
                            <label htmlFor="genero">Gênero:</label>
                            <input 
                                type="text" 
                                id="genero" 
                                value={genero} 
                                onChange={(e) => setGenero(e.target.value)} 
                            />
                        </div>
                        <div className="edit-perfil-field">
                            <label htmlFor="dataNasc">Data de Nascimento:</label>
                            <input 
                                type="text" 
                                id="dataNasc" 
                                value={dataNasc} 
                                onChange={(e) => setDataNasc(e.target.value)} 
                            />
                        </div>
                    </div>
                    
                    <div className="edit-perfil-field">
                        <label htmlFor="sobreMim">Sobre mim:</label>
                        <textarea 
                            id="sobreMim" 
                            value={sobreMim} 
                            onChange={(e) => setSobreMim(e.target.value)}
                        />
                    </div>

                    <div className="edit-perfil-actions">
                        <button type="button" className="edit-perfil-button cancel" onClick={() => navigate(-1)}>
                            Cancelar
                        </button>
                        <button type="submit" className="edit-perfil-button save">
                            Salvar
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EditarPerfil;