import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './editarperfil.css'; 
import 'bootstrap-icons/font/bootstrap-icons.css';

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
        // Seção principal da página
        <section className="edit-perfil-container">
            <div className="edit-perfil-card">
                
                {/* Título da página */}
                <h1 className="edit-perfil-title">
                    <i className="bi bi-pencil-fill"></i>
                    Editar Perfil
                </h1>
                
                {/* Formulário de edição */}
                <form onSubmit={handleSubmit}>

                    {/* Área do avatar */}
                    <div className="edit-perfil-avatar-section">
                        <img 
                            src="https://i.pinimg.com/1200x/62/45/44/624544c54200da39b9fd507498509092.jpg" 
                            alt="Avatar" 
                        />
                        
                        {/* Botões para mudar/remover a foto */}
                        <div className="edit-perfil-avatar-actions">
                            <button type="button" className="avatar-button change">
                                Mudar Foto
                            </button>
                            <button type="button" className="avatar-button remove">
                                Remover Foto
                            </button>
                        </div>
                    </div>

                    {/* Campo: Nome */}
                    <div className="edit-perfil-field">
                        <label htmlFor="nome">Nome Completo:</label>
                        <input 
                            type="text" 
                            id="nome" 
                            value={nome} 
                            onChange={(e) => setNome(e.target.value)} 
                        />
                    </div>
                    
                    {/* Linha com Gênero e Data de Nascimento */}
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
                    
                    {/* Campo: Sobre mim */}
                    <div className="edit-perfil-field">
                        <label htmlFor="sobreMim">Sobre mim:</label>
                        <textarea 
                            id="sobreMim" 
                            value={sobreMim} 
                            onChange={(e) => setSobreMim(e.target.value)}
                        />
                    </div>

                    {/* Botões de ação */}
                    <div className="edit-perfil-actions">
                        <button 
                            type="button" 
                            className="edit-perfil-button cancel" 
                            onClick={() => navigate(-1)}
                        >
                            Cancelar
                        </button>

                        <button type="submit" className="edit-perfil-button save">
                            Salvar
                        </button>
                    </div>
                </form>
            </div>
        </section>
    );
};

export default EditarPerfil;