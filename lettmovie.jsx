(((((((((((((((((((((( modal ))))))))))))))))))))))))))))))))))))))))))))))))

import React from 'react';
import './Modal.css';
import 'bootstrap-icons/font/bootstrap-icons.css';

// Componente genérico de Modal
const Modal = ({ isOpen, onClose, children }) => {
  if (!isOpen) {
    return null;
  }

  return (
    // O fundo escuro (overlay)
    <div className="modal-overlay" onClick={onClose}>
      {/* O conteúdo do modal (impede o fecho ao clicar dentro) */}
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close-button" onClick={onClose}>
          <i className="bi bi-x-lg"></i>
        </button>
        {children}
      </div>
    </div>
  );
};

export default Modal;

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.7);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  font-family: 'Inter', sans-serif;
}

.modal-content {
  position: relative;
  background-color: #1c1c1c;
  border-radius: 12px;
  padding: 2.5rem;
  width: 90%;
  max-width: 450px;
  box-shadow: 0 10px 30px rgba(0,0,0,0.5);
  border: 1px solid #333;
  color: #ffffff;
}

.modal-close-button {
  position: absolute;
  top: 1rem;
  right: 1rem;
  background: none;
  border: none;
  color: #888;
  font-size: 1.2rem;
  cursor: pointer;
  transition: all 0.2s ease;
}
.modal-close-button:hover {
  color: #fff;
  transform: scale(1.1);
}

/* Estilos específicos para o Modal de Logout (baseado no seu design) */
.logout-modal-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1.5rem;
}

.logout-modal-content h2 {
  font-size: 1.8rem;
  font-weight: 600;
  margin: 0;
  font-family: "Montserrat", sans-serif;
}

.logout-modal-content p {
  font-size: 1rem;
  color: #aaa;
  margin: 0;
}

.logout-modal-actions {
  display: flex;
  width: 100%;
  gap: 1rem;
}

.logout-modal-button {
  flex: 1; /* Faz os botões ocuparem o espaço igualmente */
  padding: 0.8rem 1rem;
  font-size: 1rem;
  font-weight: 600;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
  font-family: "Montserrat", sans-serif;
}

.logout-modal-button.cancel {
  background-color: #444;
  color: #fff;
}
.logout-modal-button.cancel:hover {
  background-color: #555;
}

.logout-modal-button.confirm {
  background-color: #c80710;
  color: #fff;
}
.logout-modal-button.confirm:hover {
  background-color: #e50914;
}


((((((((((((((((((((((((((((((((((((((( notificação ))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))

import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/authcontext';
import './notificacoes.css'; // CSS Novo
import 'bootstrap-icons/font/bootstrap-icons.css';

const Notificacoes = () => {
    const { userRole } = useAuth();
    const [pendentes, setPendentes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Função para buscar os filmes pendentes
    const fetchPendentes = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await fetch('http://localhost:8000/api/filmes/pendentes');
            const data = await response.json();
            if (response.ok) {
                setPendentes(data);
            } else {
                throw new Error(data.message || 'Erro ao buscar pendências');
            }
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    // Busca os filmes ao carregar a página
    useEffect(() => {
        if (userRole === 'admin') {
            fetchPendentes();
        }
    }, [userRole]);

    // Função para aprovar ou rejeitar
    const handleAction = async (id, action) => {
        const route = action === 'approve' ? 'aprovar' : 'rejeitar';
        try {
            const body = new URLSearchParams();
            body.append('id_filme', id);

            const response = await fetch(`http://localhost:8000/api/filme/${route}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                body: body.toString()
            });

            const data = await response.json();
            if (response.ok) {
                // Remove o filme da lista local
                setPendentes(prev => prev.filter(filme => filme.ID !== id));
            } else {
                throw new Error(data.message || `Erro ao ${action} filme`);
            }
        } catch (err) {
            setError(err.message);
        }
    };

    if (userRole !== 'admin') {
        return (
            <div className="notifications-container">
                <h1 className="notifications-title">Acesso Negado</h1>
                <p className="page-status">Você não tem permissão para ver esta página.</p>
            </div>
        );
    }
    
    if (loading) return <div className="page-status">Carregando pendências...</div>;
    if (error) return <div className="page-status error">Erro: {error}</div>;

    return (
        <div className="notifications-container">
            <h1 className="notifications-title">
                <i className="bi bi-bell-fill"></i>
                Filmes Pendentes de Aprovação
            </h1>

            {pendentes.length === 0 ? (
                <p className="page-status">Nenhum filme pendente no momento.</p>
            ) : (
                <ul className="notifications-list-page">
                    {pendentes.map(filme => (
                        <li key={filme.ID} className="notification-item-page">
                            <span className="notification-item-text">
                                <strong>{filme.Titulo}</strong> (ID: {filme.ID})
                            </span>
                            <div className="notification-item-actions">
                                <button 
                                    className="notification-action-button approve"
                                    onClick={() => handleAction(filme.ID, 'approve')}
                                    title="Aprovar"
                                >
                                    <i className="bi bi-check-circle-fill"></i> Aprovar
                                </button>
                                <button 
                                    className="notification-action-button reject"
                                    onClick={() => handleAction(filme.ID, 'reject')}
                                    title="Rejeitar"
                                >
                                    <i className="bi bi-x-circle-fill"></i> Rejeitar
                                </button>
                            </div>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default Notificacoes;

(((((((((((((((((((((((((((((((((((((((((((((((((((((( home )))))))))))))))))))))))))))))))))))))))))))))))))
     import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import MovieCard from '../../components/MovieCard/MovieCard';
import './home.css'; 

// Simulação dos seus componentes que já existem
const SessaoAbertura = () => (
  <div className="home-section-abertura">
    <h1>Bem-vindo ao LetMovie</h1>
    <p>O seu catálogo de filmes, agora colaborativo.</p>
    <Link to="/filmes" className="home-button-cta">Ver Todos os Filmes</Link>
  </div>
);

// O NOVO COMPONENTE DE FILMES DA API
const FilmesDaAPI = () => {
  const [filmes, setFilmes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFilmes = async () => {
      try {
        const response = await fetch('http://localhost:8000/api/filmes');
        const data = await response.json();
        if (response.ok) {
          setFilmes(data.slice(0, 8)); // Pega apenas os 8 primeiros
        }
      } catch (err) {
        console.error("Erro ao buscar filmes para a Home:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchFilmes();
  }, []);

  return (
    <div className="home-section">
      <h2>Filmes Adicionados pela Comunidade</h2>
      {loading ? (
        <p>Carregando filmes...</p>
      ) : (
        <div className="home-filmes-grid">
          {filmes.map(filme => (
            <MovieCard key={filme.id_filme} filme={filme} />
          ))}
        </div>
      )}
    </div>
  );
};

// A PÁGINA HOME COMPLETA
const Home = () => {
  return (
    <div className="home-container">
      <SessaoAbertura />
      {/* <CarrosselFixo />  // Você pode adicionar os seus componentes estáticos aqui */}
      <FilmesDaAPI />
    </div>
  );
};

export default Home;

((((((((((((((((((((((((((((((((((((((((((((((((((((((((detalhes)))))))))))))))))))))))))))))))))))))))))))))))))))))))
 import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import "./detalhefilme.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import { useAuth } from "../../context/authcontext"; 

const DetalheFilme = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [filme, setFilme] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { userRole } = useAuth(); // Usa o Contexto

  useEffect(() => {
    const fetchFilme = async () => {
      setLoading(true);
      setError(null);
      try {
        // CORRIGIDO: http (sem s) e /api/filme/ (singular)
        const response = await fetch(`http://localhost:8000/api/filme/${id}`);
        if (!response.ok) {
          throw new Error("Filme não encontrado");
        }
        const data = await response.json();
        setFilme(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchFilme();
  }, [id]);

  const handleDelete = async () => {
    // TODO: Substituir por um Modal
    if (!window.confirm("Tem certeza que deseja deletar este filme?")) {
      return;
    }

    try {
      const body = new URLSearchParams();
      body.append("id", id);
      const response = await fetch("http://localhost:8000/delete", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: body.toString(),
      });

      const data = await response.json();
      if (response.ok) {
        alert("Filme deletado com sucesso!");
        navigate("/filmes");
      } else {
        throw new Error(data.message || "Erro ao deletar o filme");
      }
    } catch (err) {
      console.error(err);
      alert(`Erro: ${err.message}`);
    }
  };

  if (loading) return <div className="detalhe-loading">Carregando...</div>;
  if (error) return <div className="detalhe-error">Erro: {error}</div>;
  if (!filme) return null;

  const rating = (filme.id_filme % 20 / 10 + 3.0).toFixed(1);

  return (
    <div className="detalhe-container">
      <div
        className="detalhe-backdrop"
        style={{ backgroundImage: `url(${filme.poster})` }}
      ></div>

      <div className="detalhe-content">
        <div className="detalhe-poster">
          <img
            src={filme.poster}
            alt={`Pôster de ${filme.nomeFilme}`}
            onError={(e) => {
              e.target.onerror = null;
              e.target.src =
                "https://placehold.co/300x450/151515/E50914?text=Imagem+Indisponivel";
            }}
          />
        </div>

        <div className="detalhe-info">
          <h1 className="detalhe-title">
            {filme.nomeFilme}
            <span className="detalhe-year">({filme.ano})</span>
          </h1>
          <div className="detalhe-meta">
            <span>{filme.tempo_duracao} min</span>
            <span className="detalhe-rating">
              <i className="bi bi-star-fill"></i>
              {rating}
            </span>
          </div>
          <div className="detalhes-generos">
            {filme.generos?.split(",").map((g) => (
              <span key={g.trim()} className="detalhe-genero-tag">
                {g.trim()}
              </span>
            ))}
          </div>
          <h3 className="detalhe-subtitle">Sinopse:</h3>
          <p className="detalhe-sinopse">
            {filme.sinopse || "Nenhuma sinopse disponível."}
          </p>
          <div className="detalhe-crew">
            <div className="crew-item">
              <strong>Diretor(es):</strong>
              <span>{filme.diretores || "Não informado"}</span>
            </div>
            <div className="crew-item">
              <strong>Produtora(s):</strong>
              <span>{filme.produtoras || "Não informado"}</span>
            </div>
            <div className="crew-item full">
              <strong>Elenco:</strong>
              <span>{filme.atores || "Não informado"}</span>
            </div>
          </div>

          {/* Lógica dos Botões ATUALIZADA */}
          <div className="detalhe-actions">
            <button
              onClick={() => navigate(-1)} // -1 navega para a página anterior
              className="detalhe-button back"
            >
              <i className="bi bi-arrow-left-circle"></i> Voltar
            </button>
            
            {userRole === "admin" && (
              <>
                <Link
                  to={`/editarfilme/${filme.id_filme}`}
                  className="detalhe-button edit"
                >
                  <i className="bi bi-pencil-fill"></i> Editar
                </Link>
                <button
                  onClick={handleDelete}
                  className="detalhe-button delete"
                >
                  <i className="bi bi-trash-fill"></i> Excluir
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DetalheFilme;

.detalhe-container {
  position: relative;
  min-height: 90vh;
  color: #ffffff;
  display: flex;
  align-items: center;
  padding: 64px 0;
  width: 100%; 
  box-sizing: border-box;
  overflow: hidden; 
  font-family: "Montserrat", sans-serif;
}

.detalhe-backdrop {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-size: cover; /* <-- CORRIGIDO */
  background-position: center;
  filter: blur(15px) brightness(0.3);
  z-index: 1;
  transform: scale(1.2); 
}

.detalhe-content {
  position: relative;
  z-index: 2;
  display: flex;
  gap: 48px;
  max-width: 1100px;
  margin: 0 auto;
  padding: 40px;
  background-color: rgba(21, 21, 21, 0.6);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 16px;
}

.detalhe-poster {
  flex: 0 0 300px;
  width: 300px;
}
.detalhe-poster img {
  width: 100%;
  height: auto;
  border-radius: 12px;
  border: 2px solid rgba(255, 255, 255, 0.2);
}
.detalhe-info {
  flex: 1;
  display: flex; 
  flex-direction: column; 
}
.detalhe-title {
  font-size: 40px;
  text-align: left;
  font-weight: 700;
  margin: 0;
}
.detalhe-year {
  font-size: 24px;
  font-weight: 300;
  color: #cccccc;
  margin-left: 16px;
}
.detalhe-meta {
  display: flex;
  gap: 24px;
  font-size: 16px;
  color: red;
  margin-top: 16px;
  align-items: center;
}
.detalhe-rating {
  display: flex;
  align-items: center;
  gap: 8px;
  color: #f5c518;
  font-weight: bold;
}
.detalhes-generos {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 16px;
}
.detalhe-genero-tag {
  background-color: rgba(255, 255, 255, 0.20);
  padding: 0.3rem 0.7rem;
  border-radius: 20px;
  font-size: 16px;
}
.detalhe-subtitle {
  font-size: 22px;
  font-weight: 600;
  margin-top: 42px;
  margin-bottom: 8px;
  border-bottom: 2px solid var(--primary-color, #c80710);
  padding-bottom: 6px;
  display: inline-block;
}
.detalhe-sinopse {
  text-align: left;
  font-size: 16px;
  line-height: 1.6;
  color: #ffffff;
  width: 100%;
  white-space: pre-wrap;
  overflow-wrap: break-word;
}
.detalhe-crew {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
  margin-top: 32px;
}
.crew-item {
  flex: 1;
  min-width: 200px;
}
.crew-item.full {
  flex-basis: 100%;
}
.crew-item strong {
  display: block;
  font-size: 16px;
  font-weight: 600;
  color: #aaaaaa;
  margin-bottom: 5px;
}
.crew-item span {
  font-size: 16px;
  color: #ffffff;
}

/* Container para TODOS os botões */
.detalhe-actions {
  display: flex;
  gap: 16px;
  margin-top: auto; /* EMPURRA PARA O FUNDO */
  padding-top: 24px;
  border-top: 1px solid #333;
  align-items: center;
}

/* Botão de Voltar */
.detalhe-button.back {
  background-color: #444;
  color: #fff;
  margin-right: auto; /* Joga os botões de admin para a direita */
}
.detalhe-button.back:hover {
  background-color: #555;
}

/* Botões de Admin */
.detalhe-button,
.detalhe-button.edit,
.detalhe-button.delete {
  border: none;
  border-radius: 8px;
  padding: 12px 18px;
  font-size: 16px;
  font-weight: 600;
  font-family: "Montserrat", sans-serif;
  cursor: pointer;
  display: inline-flex;
  gap: 8px;
  text-decoration: none;
  transition: all 0.2s ease;
}

.detalhe-button.edit {
  background-color: #007bff;
  color: white;
}
.detalhe-button.edit:hover {
  background-color: #0056b3;
}

.detalhe-button.delete {
  background-color: var(--primary-color, #c80710);
  color: white;
}
.detalhe-button.delete:hover {
  background-color: #a0050c;
}

.detalhe-loading,
.detalhe-error {
  min-height: 80vh;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 24px;
  color: white;
  font-family: "Montserrat", sans-serif;
}



((((((((((((((((((((((((((((((((((((((((((((((((((((((((forms adicionar/editar))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))

/* --- Página de Formulário (Adicionar/Editar) --- */
.form-page-container {
    max-width: 900px;
    margin: 3rem auto;
    padding: 2rem;
}

.form-filme-container {
    background-color: #1c1c1c;
    border: 1px solid #333;
    border-radius: 12px;
    padding: 2.5rem 3rem;
    color: white;
    font-family: 'Inter', sans-serif;
}

.form-filme-container h1 {
    display: flex;
    align-items: center;
    gap: 1rem;
    font-size: 2rem;
    font-weight: 600;
    color: #c80710;
    margin: 0 0 2rem 0;
    padding-bottom: 1.5rem;
    border-bottom: 1px solid #333;
    font-family: "Montserrat", sans-serif;
}

.form-filme-container h1 .title-addmovie {
    color: white;
}

.form-filme {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
}

.form-group {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
}

.form-group label {
    font-size: 0.9rem;
    font-weight: 500;
    color: #aaa;
}

.form-group input,
.form-group textarea,
.form-group select {
    background-color: #333;
    border: 1px solid #555;
    border-radius: 8px;
    padding: 0.9rem 1rem;
    color: #fff;
    font-size: 1rem;
    font-family: 'Inter', sans-serif;
}

.form-group input::placeholder,
.form-group textarea::placeholder {
    color: #888;
}

.form-group input:focus,
.form-group textarea:focus,
.form-group select:focus {
    outline: none;
    border-color: #c80710;
    box-shadow: 0 0 5px rgba(200, 7, 16, 0.5);
}

.form-group textarea {
    min-height: 120px;
    resize: vertical;
}

.form-row {
    display: flex;
    gap: 1.5rem;
}

.form-row .form-group {
    flex: 1;
}

/* --- Botões de Ação --- */
.form-actions {
    display: flex;
    justify-content: flex-end;
    gap: 1rem;
    margin-top: 2rem;
    padding-top: 1.5rem;
    border-top: 1px solid #333;
}

.form-button {
    padding: 0.8rem 1.5rem;
    font-size: 1rem;
    font-weight: 600;
    border: none;
    border-radius: 8px;
    cursor: pointer;
    transition: all 0.2s ease;
    font-family: "Montserrat", sans-serif;
}

.form-button.cancel {
    background-color: #444;
    color: #fff;
}
.form-button.cancel:hover {
    background-color: #555;
}

.form-button.submit {
    background-color: #c80710;
    color: #fff;
}
.form-button.submit:hover {
    background-color: #e50914;
}
.form-button:disabled {
    background-color: #555;
    cursor: not-allowed;
}

/* --- Mensagens de Status --- */
.form-message {
    margin-top: 1.5rem;
    padding: 1rem;
    border-radius: 8px;
    text-align: center;
    font-weight: 500;
}
.form-message.success {
    background-color: rgba(40, 167, 69, 0.2);
    color: #28a745;
    border: 1px solid #28a745;
}
.form-message.error {
    background-color: rgba(220, 53, 69, 0.2);
    color: #dc3545;
    border: 1px solid #dc3545;
}

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./FormFilme.css"; // CSS novo/corrigido
import "bootstrap-icons/font/bootstrap-icons.css";
import { useAuth } from "../../context/authcontext"; // 1. Importar o useAuth

const AdicionarFilmes = () => {
  const navigate = useNavigate();
  const { userRole } = useAuth(); // 2. Obter o userRole
  const [formData, setFormData] = useState({
    nome: "",
    atores: "",
    diretor: "",
    ano: "",
    duracao: "",
    id_genero: "1", // Valor padrão
    produtora: "",
    id_linguagem: "2", // Valor padrão
    urlposter: "",
    sinopse: "",
  });
  const [status, setStatus] = useState({
    loading: false,
    error: null,
    success: null,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus({ loading: true, error: null, success: null });

    try {
      const body = new URLSearchParams();
      for (const key in formData) {
        body.append(key, formData[key]);
      }
      body.append("userRole", userRole); // 3. Enviar o userRole para o backend

      const response = await fetch("http://localhost:8000/cadastro", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: body.toString(),
      });

      const data = await response.json();

      if (response.ok) {
        // 4. Mensagem de sucesso diferente para admin
        const successMsg =
          userRole === "admin"
            ? "Filme APROVADO e adicionado com sucesso!"
            : "Filme enviado para aprovação!";

        setStatus({ loading: false, error: null, success: successMsg });

        setFormData({
          nome: "",
          atores: "",
          diretor: "",
          ano: "",
          duracao: "",
          id_genero: "1",
          produtora: "",
          id_linguagem: "2",
          urlposter: "",
          sinopse: "",
        });
        // Redireciona para locais diferentes
        setTimeout(() => navigate(userRole === 'admin' ? '/filmes' : '/notificacoes'), 2000); 
      } else {
        throw new Error(data.message || "Erro ao adicionar filme");
      }
    } catch (err) {
      setStatus({ loading: false, error: err.message, success: null });
    }
  };

  return (
    <div className="form-page-container">
      <div className="form-filme-container">
        <h1>
          <i className="bi bi-plus-circle-fill"></i>
          <span className="title-addmovie">Adicionar Filme</span>
        </h1>
        <form onSubmit={handleSubmit} className="form-filme">
          {/* Título */}
          <div className="form-group">
            <label htmlFor="nome">Título do Filme:</label>
            <input
              type="text"
              id="nome"
              name="nome"
              value={formData.nome}
              onChange={handleChange}
              placeholder="Ex: A volta dos que não foram"
              required
            />
          </div>

          {/* Poster */}
          <div className="form-group">
            <label htmlFor="urlposter">URL do Pôster:</label>
            <input
              type="url"
              id="urlposter"
              name="urlposter"
              value={formData.urlposter}
              onChange={handleChange}
              placeholder="Ex: https://image.tmdb.org/..."
              required
            />
          </div>

          {/* Ano e Duração */}
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="ano">Ano de Lançamento:</label>
              <input
                type="number"
                id="ano"
                name="ano"
                value={formData.ano}
                onChange={handleChange}
                placeholder="Ex: 2024"
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="duracao">Duração (em minutos):</label>
              <input
                type="number"
                id="duracao"
                name="duracao"
                value={formData.duracao}
                onChange={handleChange}
                placeholder="Ex: 120"
                required
              />
            </div>
          </div>

          {/* Sinopse */}
          <div className="form-group">
            <label htmlFor="sinopse">Sinopse:</label>
            <textarea
              id="sinopse"
              name="sinopse"
              value={formData.sinopse}
              onChange={handleChange}
              placeholder="Digite a descrição do filme"
            />
          </div>

          {/* Diretor e Produtora */}
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="diretor">Diretor:</label>
              <input
                type="text"
                id="diretor"
                name="diretor"
                value={formData.diretor}
                onChange={handleChange}
                placeholder="Ex: Christopher Nolan"
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="produtora">Produtora:</label>
              <input
                type="text"
                id="produtora"
                name="produtora"
                value={formData.produtora}
                onChange={handleChange}
                placeholder="Ex: Warner Bros."
                required
              />
            </div>
          </div>

          {/* Atores */}
          <div className="form-group">
            <label htmlFor="atores">Atores (separados por vírgula):</label>
            <input
              type="text"
              id="atores"
              name="atores"
              value={formData.atores}
              onChange={handleChange}
              placeholder="Ex: Ator Um, Atriz Dois"
              required
            />
          </div>

          {/* Gênero e Linguagem */}
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="id_genero">Gênero:</label>
              <select
                id="id_genero"
                name="id_genero"
                value={formData.id_genero}
                onChange={handleChange}
              >
                <option value="1">Romance</option>
                <option value="2">Drama</option>
                <option value="3">Ação</option>
                <option value="4">Ficção Científica</option>
                <option value="5">Aventura</option>
                <option value="6">Terror</option>
                <option value="9">Biografia</option>
                <option value="10">Comédia</option>
                <option value="12">Animação</option>
              </select>
            </div>
            <div className="form-group">
              <label htmlFor="id_linguagem">Linguagem Original:</label>
              <select
                id="id_linguagem"
                name="id_linguagem"
                value={formData.id_linguagem}
                onChange={handleChange}
              >
                <option value="2">Inglês</option>
                <option value="1">Português</option>
                <option value="9">Coreano</option>
                <option value="7">Japonês</option>
                <option value="4">Francês</option>
                <option value="3">Espanhol</option>
              </select>
            </div>
          </div>

          {/* Botões */}
          <div className="form-actions">
            <button
              type="button"
              className="form-button cancel"
              onClick={() => navigate(-1)}
            >
              Cancelar
            </button>
            <button type="submit" className="form-button submit" disabled={status.loading}>
              {status.loading ? "Enviando..." : (userRole === 'admin' ? "Adicionar Filme" : "Enviar para Aprovação")}
            </button>
          </div>
        </form>

        {/* Mensagens de Status */}
        {status.error && (
          <div className="form-message error">{status.error}</div>
        )}
        {status.success && (
          <div className="form-message success">{status.success}</div>
        )}
      </div>
    </div>
  );
};

export default AdicionarFilmes;

import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "./FormFilme.css"; // CSS Corrigido
import "bootstrap-icons/font/bootstrap-icons.css";
import { useAuth } from "../../context/authcontext"; // 1. Importar o useAuth

const EditarFilme = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { userRole } = useAuth(); // 2. Obter o userRole
  const [formData, setFormData] = useState(null); // Inicia como null
  const [status, setStatus] = useState({
    loading: true,
    error: null,
    success: null,
  });

  // 1. Busca os dados atuais do filme
  useEffect(() => {
    const fetchFilme = async () => {
      setStatus({ loading: true, error: null, success: null });
      try {
        const response = await fetch(`http://localhost:8000/api/filme/${id}`);
        const data = await response.json();

        if (response.ok) {
          setFormData({
            id_filme: data.id_filme,
            nome: data.nomeFilme || "",
            atores: data.atores || "",
            diretor: data.diretores || "",
            ano: data.ano || "",
            duracao: data.tempo_duracao || "",
            // NOTA: O backend ainda não retorna os IDs de genero/linguagem
            // Vamos usar placeholders, mas o ideal era o backend retornar
            id_genero: "1", // Você precisa buscar isso do 'data.generos'
            produtora: data.produtoras || "",
            id_linguagem: "2", // Você precisa buscar isso do 'data.linguagens'
            urlposter: data.poster || "",
            sinopse: data.sinopse || "",
          });
        } else {
          throw new Error(data.message || "Filme não encontrado");
        }
      } catch (err) {
        setStatus({ loading: false, error: err.message, success: null });
      } finally {
        // Apenas para de carregar. Não mexe no 'error' que já foi setado.
        setStatus((prev) => ({ ...prev, loading: false }));
      }
    };
    fetchFilme();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // 2. Envia os dados editados
  const handleSubmit = async (e) => {
    e.preventDefault();
    // Inicia o loading, mas mantém o erro anterior (caso exista)
    setStatus((prev) => ({ ...prev, loading: true, error: null, success: null }));

    try {
      const body = new URLSearchParams();
      for (const key in formData) {
        body.append(key, formData[key]);
      }
      body.append("userRole", userRole); // 3. Enviar o userRole

      const response = await fetch("http://localhost:8000/api/filme/editar", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: body.toString(),
      });

      const data = await response.json();

      if (response.ok) {
        const successMsg =
          userRole === "admin"
            ? "Filme atualizado e aprovado com sucesso!"
            : "Alterações enviadas para aprovação!";
        
        setStatus({ loading: false, error: null, success: successMsg });
        setTimeout(() => {
          navigate(`/filme/${id}`); // Volta para a página do filme
        }, 2000);
      } else {
        throw new Error(data.message || "Erro ao editar filme.");
      }
    } catch (err) {
      setStatus({ loading: false, error: err.message, success: null });
    }
  };

  // 3. Lógica de Renderização
  
  // Estado de Carregamento Inicial
  if (status.loading && !formData) {
    return (
      <div
        style={{
          color: "white",
          textAlign: "center",
          marginTop: "5rem",
          fontSize: "2rem",
        }}
      >
        Carregando...
      </div>
    );
  }

  // Estado de Erro no Fetch Inicial
  if (status.error && !formData) {
     return (
      <div
        style={{
          color: "red",
          textAlign: "center",
          marginTop: "5rem",
          fontSize: "2rem",
        }}
      >
        Erro: {status.error}
      </div>
    );
  }
  
  // Se o formData ainda é null (improvável, mas seguro)
  if (!formData) return null;


  // Estado Normal (Formulário)
  return (
    <div className="form-page-container">
      <div className="form-filme-container">
        <h1>
          <i className="bi bi-pencil-fill"></i>
          <span className="title-addmovie">Editar Filme</span>
        </h1>
        <form onSubmit={handleSubmit} className="form-filme">
          {/* Título */}
          <div className="form-group">
            <label htmlFor="nome">Título do Filme:</label>
            <input
              type="text"
              id="nome"
              name="nome"
              value={formData.nome}
              onChange={handleChange}
              required
            />
          </div>

          {/* Poster */}
          <div className="form-group">
            <label htmlFor="urlposter">URL do Pôster:</label>
            <input
              type="url"
              id="urlposter"
              name="urlposter"
              value={formData.urlposter}
              onChange={handleChange}
              required
            />
          </div>

          {/* Ano e Duração */}
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="ano">Ano de Lançamento:</label>
              <input
                type="number"
                id="ano"
                name="ano"
                value={formData.ano}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="duracao">Duração (em minutos):</label>
              <input
                type="number"
                id="duracao"
                name="duracao"
                value={formData.duracao}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          {/* Sinopse */}
          <div className="form-group">
            <label htmlFor="sinopse">Sinopse:</label>
            <textarea
              id="sinopse"
              name="sinopse"
              value={formData.sinopse}
              onChange={handleChange}
            />
          </div>

          {/* Diretor e Produtora */}
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="diretor">Diretor:</label>
              <input
                type="text"
                id="diretor"
                name="diretor"
                value={formData.diretor}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="produtora">Produtora:</label>
              <input
                type="text"
                id="produtora"
                name="produtora"
                value={formData.produtora}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          {/* Atores */}
          <div className="form-group">
            <label htmlFor="atores">Atores (separados por vírgula):</label>
            <input
              type="text"
              id="atores"
              name="atores"
              value={formData.atores}
              onChange={handleChange}
              required
            />
          </div>

          {/* Gênero e Linguagem */}
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="id_genero">Gênero:</label>
              <select
                id="id_genero"
                name="id_genero"
                value={formData.id_genero}
                onChange={handleChange}
              >
                <option value="1">Romance</option>
                <option value="2">Drama</option>
                <option value="3">Ação</option>
                <option value="4">Ficção Científica</option>
                <option value="5">Aventura</option>
                <option value="6">Terror</option>
                <option value="9">Biografia</option>
                <option value="10">Comédia</option>
                <option value="12">Animação</option>
              </select>
            </div>
            <div className="form-group">
              <label htmlFor="id_linguagem">Linguagem Original:</label>
              <select
                id="id_linguagem"
                name="id_linguagem"
                value={formData.id_linguagem}
                onChange={handleChange}
              >
                <option value="2">Inglês</option>
                <option value="1">Português</option>
                <option value="9">Coreano</option>
                <option value="7">Japonês</option>
                <option value="4">Francês</option>
                <option value="3">Espanhol</option>
              </select>
            </div>
          </div>

          {/* Botões */}
          <div className="form-actions">
            <button
              type="button"
              className="form-button cancel"
              onClick={() => navigate(-1)}
            >
              Cancelar
            </button>
            <button type="submit" className="form-button submit" disabled={status.loading}>
              {status.loading ? "Salvando..." : (userRole === 'admin' ? "Salvar e Aprovar" : "Enviar para Aprovação")}
            </button>
          </div>
        </form>

        {/* Mensagens de Status (apenas para erros/sucesso do *envio*) */}
        {status.error && !status.loading && (
          <div className="form-message error">{status.error}</div>
        )}
        {status.success && (
          <div className="form-message success">{status.success}</div>
        )}
      </div>
    </div>
  );
};

export default EditarFilme;

(((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((página de busca))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))
import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import MovieCard from '../../components/MovieCard/MovieCard';
import './busca.css'; // Usando o CSS de busca que você enviou

const PaginaBusca = () => {
    const [searchParams] = useSearchParams();
    const query = searchParams.get('query');
    
    const [filmes, setFilmes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!query) return;

        const fetchBusca = async () => {
            setLoading(true);
            setError(null);
            try {
                // Rota GET /api/filmes?busca=...
                const response = await fetch(`http://localhost:8000/api/filmes?busca=${encodeURIComponent(query)}`);
                const data = await response.json();
                if (response.ok) {
                    setFilmes(data);
                } else {
                    throw new Error(data.message || 'Erro ao buscar filmes');
                }
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        fetchBusca();
    }, [query]); // Roda a busca sempre que o 'query' mudar

    if (loading) return <div className="page-status">Buscando filmes...</div>;
    if (error) return <div className="page-status error">Erro: {error}</div>;

    return (
        <div className="busca-container">
            <h1>Resultados para: <span>{query}</span></h1>
            
            <div className="filmes-grid"> {/* Reutiliza o CSS da página de Filmes */
                {filmes.length > 0 ? (
                    filmes.map(filme => (
                        <MovieCard key={filme.id_filme} filme={filme} />
                    ))
                ) : (
                    <p className="page-status">Nenhum filme encontrado para "{query}".</p>
                )}
            </div>
        </div>
    );
};

export default PaginaBusca;

/* O seu ficheiro busca.css está ótimo, mas para consistência */
/* Eu recomendo apagar 'busca.css' e 'busca-grid' */
/* e usar o 'filmes.css' e 'filmes-grid' que já existem. */
/* Mas se preferir manter, este CSS funciona. */

.busca-container {
    max-width: 1200px;
    margin: 3rem auto;
    padding: 2rem 40px;
    color: white;
    font-family: "Montserrat", sans-serif;
}

.busca-container h1 {
    font-size: 2.5rem;
    font-weight: 600;
    margin-bottom: 2rem;
    border-bottom: 2px solid #333;
    padding-bottom: 1rem;
}

.busca-container h1 span {
    color: var(--primary-color, #c80710);
}

/* O 'filmes-grid' (do filmes.css) pode substituir tudo abaixo */
.busca-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
    gap: 20px;
}


((((((((((((((((((((((((((((((((((((((((((((((((((((((((página home))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import MovieCard from '../../components/MovieCard/MovieCard';
import './home.css'; 

// Simulação dos seus componentes que já existem
const SessaoAbertura = () => (
  <div className="home-section-abertura">
    <h1>Bem-vindo ao LetMovie</h1>
    <p>O seu catálogo de filmes, agora colaborativo.</p>
    <Link to="/filmes" className="home-button-cta">Ver Todos os Filmes</Link>
  </div>
);

// O NOVO COMPONENTE DE FILMES DA API
const FilmesDaAPI = () => {
  const [filmes, setFilmes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFilmes = async () => {
      try {
        const response = await fetch('http://localhost:8000/api/filmes');
        const data = await response.json();
        if (response.ok) {
          setFilmes(data.slice(0, 8)); // Pega apenas os 8 primeiros
        }
      } catch (err) {
        console.error("Erro ao buscar filmes para a Home:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchFilmes();
  }, []);

  return (
    <div className="home-section">
      <h2>Filmes Adicionados pela Comunidade</h2>
      {loading ? (
        <p>Carregando filmes...</p>
      ) : (
        <div className="home-filmes-grid">
          {filmes.map(filme => (
            <MovieCard key={filme.id_filme} filme={filme} />
          ))}
        </div>
      )}
    </div>
  );
};

// A PÁGINA HOME COMPLETA
const Home = () => {
  return (
    <div className="home-container">
      <SessaoAbertura />
      {/* <CarrosselFixo />  // Você pode adicionar os seus componentes estáticos aqui */}
      <FilmesDaAPI />
    </div>
  );
};

export default Home;

.home-container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 2rem;
  font-family: 'Inter', sans-serif;
  color: #ffffff;
}
.home-section {
  margin-bottom: 3rem;
}
.home-section h2 {
  font-size: 1.8rem;
  font-weight: 600;
  color: #c80710;
  margin-bottom: 1.5rem;
  padding-bottom: 0.5rem;
  border-bottom: 1px solid #2b2b2b;
}
.home-section-abertura {
  text-align: center;
  padding: 4rem 2rem;
  background-color: #1c1c1c;
  border-radius: 12px;
  margin-bottom: 3rem;
  border: 1px solid #333;
}
.home-section-abertura h1 {
  font-size: 2.5rem;
  margin: 0 0 1rem 0;
  font-family: "Montserrat", sans-serif;
}
.home-section-abertura p {
  font-size: 1.2rem;
  color: #aaa;
  margin-bottom: 2rem;
}
.home-button-cta {
  background-color: #c80710;
  color: #fff;
  padding: 0.8rem 1.5rem;
  border-radius: 8px;
  text-decoration: none;
  font-weight: 600;
  transition: background-color 0.2s ease;
  font-family: "Montserrat", sans-serif;
}
.home-button-cta:hover {
  background-color: #e50914;
}
.home-filmes-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: 20px;
}
.home-filmes-grid .movie-card {
  width: 100%; 
}


(((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((modal de filtro))))))))))))))))))))))))))))))))))))))))))))))))))))))
       import React from 'react';
import './Modal.css';
import 'bootstrap-icons/font/bootstrap-icons.css';

// Componente genérico de Modal
const Modal = ({ isOpen, onClose, children }) => {
  if (!isOpen) {
    return null;
  }

  return (
    // O fundo escuro (overlay)
    <div className="modal-overlay" onClick={onClose}>
      {/* O conteúdo do modal (impede o fecho ao clicar dentro) */}
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close-button" onClick={onClose}>
          <i className="bi bi-x-lg"></i>
        </button>
        {children}
      </div>
    </div>
  );
};

export default Modal;

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.7);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  font-family: 'Inter', sans-serif;
}

.modal-content {
  position: relative;
  background-color: #1c1c1c;
  border-radius: 12px;
  padding: 2.5rem;
  width: 90%;
  max-width: 450px;
  box-shadow: 0 10px 30px rgba(0,0,0,0.5);
  border: 1px solid #333;
  color: #ffffff;
}

.modal-close-button {
  position: absolute;
  top: 1rem;
  right: 1rem;
  background: none;
  border: none;
  color: #888;
  font-size: 1.2rem;
  cursor: pointer;
  transition: all 0.2s ease;
}
.modal-close-button:hover {
  color: #fff;
  transform: scale(1.1);
}

/* Estilos específicos para o Modal de Logout */
.logout-modal-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1.5rem;
}
.logout-modal-content h2 {
  font-size: 1.8rem;
  font-weight: 600;
  margin: 0;
  font-family: "Montserrat", sans-serif;
}
.logout-modal-content p {
  font-size: 1rem;
  color: #aaa;
  margin: 0;
}
.logout-modal-actions {
  display: flex;
  width: 100%;
  gap: 1rem;
}
.logout-modal-button {
  flex: 1;
  padding: 0.8rem 1rem;
  font-size: 1rem;
  font-weight: 600;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
  font-family: "Montserrat", sans-serif;
}
.logout-modal-button.cancel {
  background-color: #444;
  color: #fff;
}
.logout-modal-button.cancel:hover {
  background-color: #555;
}
.logout-modal-button.confirm {
  background-color: #c80710;
  color: #fff;
}
.logout-modal-button.confirm:hover {
  background-color: #e50914;
}

((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((header com modal ))))))))))))))))))))))))))))))))))))))))))))))))))))))
import React, { useState, useEffect } from "react";
import { NavLink, Link, useNavigate, useLocation } from "react-router-dom";
import "bootstrap-icons/font/bootstrap-icons.css";
import "./header.css";
import Dropdown from "../DropdownHeader/dropdownheader";
import { useAuth } from "../../context/authcontext";
import Modal from "../Modal/Modal"; // Importa o Modal

const Header = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const { userRole, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  
  const [showLogoutModal, setShowLogoutModal] = useState(false); // State para o modal
  const [notifications, setNotifications] = useState([]);
  const [loadingNots, setLoadingNots] = useState(false);

  const isAuthPage = location.pathname === '/login' || location.pathname === '/cadastro';

  const handleSearchSubmit = (event) => {
    event.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/busca?query=${encodeURIComponent(searchTerm.trim())}`);
      setSearchTerm("");
    }
  };

  const handleLogoutClick = () => {
    setShowLogoutModal(true); // Abre o modal em vez de deslogar
  };

  const handleConfirmLogout = () => {
    logout();
    setShowLogoutModal(false);
    navigate("/login");
  };

  // --- Lógica de Notificações ---
  const fetchNotifications = async () => {
    if (userRole !== 'admin') return;
    setLoadingNots(true);
    try {
      const response = await fetch("http://localhost:8000/api/filmes/pendentes");
      const data = await response.json();
      if (response.ok) {
        setNotifications(data);
      }
    } catch (err) {
      console.error("Erro ao buscar notificações:", err);
    }
    setLoadingNots(false);
  };

  // Busca notificações quando o dropdown é aberto
  const onNotificationOpen = () => {
    fetchNotifications();
  };

  // Lida com Aprovar/Rejeitar do dropdown
  const handleNotificationAction = async (id, action) => {
    const route = action === 'approve' ? 'aprovar' : 'rejeitar';
    try {
      const body = new URLSearchParams();
      body.append('id_filme', id);
      
      const response = await fetch(`http://localhost:8000/api/filme/${route}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: body.toString()
      });
      
      if (response.ok) {
        setNotifications(prev => prev.filter(n => n.ID !== id));
      }
    } catch (err) {
      console.error(`Erro ao ${action} filme:`, err);
    }
  };

  // Componente Menu de Perfil (O seu, mas com o onClick corrigido)
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
        {/* Este link agora só aparece para Admin */}
        {userRole === "admin" && (
          <li>
            <Link to="/adicionarfilmes" className="profile-menu-item">
              <i className="bi bi-plus-circle-fill"></i>
              <span>Adicionar Filme</span>
            </Link>
          </li>
        )}
        {/* Este link aparece para TODOS (usuário comum tbm adiciona) */}
        {userRole === "comum" && (
           <li>
            <Link to="/adicionarfilmes" className="profile-menu-item">
              <i className="bi bi-plus-circle-fill"></i>
              <span>Adicionar Filme</span>
            </Link>
          </li>
        )}
        {userRole === "admin" && (
            <li>
              <Link to="/notificacoes" className="profile-menu-item">
                <i className="bi bi-bell-fill"></i>
                <span>Ver Notificações</span>
              </Link>
            </li>
        )}
        <li className="profile-menu-item logout" onClick={handleLogoutClick}>
          <i className="bi bi-box-arrow-right"></i>
          <span>Sair</span>
        </li>
      </ul>
    </>
  );

  // Componente Menu de Notificações (Funcional)
  const NotificationsMenu = () => (
    <>
      <div className="notificacoes-menu-header">Notificações</div>
      <ul className="notifications-list">
        {loadingNots ? (
          <li className="notifications-item-empty">Carregando...</li>
        ) : notifications.length === 0 ? (
          <li className="notifications-item-empty">Nenhuma notificação.</li>
        ) : (
          notifications.map(not => (
            <li key={not.ID} className="notifications-item">
              <span className="notifications-item-text">
                O filme <strong>"{not.Titulo}"</strong> aguarda aprovação.
              </span>
              <div className="notifications-item-actions">
                <button 
                  className="notification-action-button approve" 
                  aria-label="Aprovar"
                  onClick={() => handleNotificationAction(not.ID, 'approve')}
                >
                  <i className="bi bi-check-circle-fill"></i>
                </button>
                <button 
                  className="notification-action-button reject" 
                  aria-label="Rejeitar"
                  onClick={() => handleNotificationAction(not.ID, 'reject')}
                >
                  <i className="bi bi-x-circle-fill"></i>
                </button>
              </div>
            </li>
          ))
        )}
      </ul>
      <Link to="/notificacoes" className="notifications-view-all">
        Ver todas
      </Link>
    </>
  );

  return (
    <>
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
                {/* O link "Adicionar Filme" foi para o menu de perfil */}
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
                  <Dropdown 
                    trigger={
                      <button className="icon-button" aria-label="Notificações">
                        <i className="bi bi-bell"></i>
                        {notifications.length > 0 && (
                          <span className="notification-badge">{notifications.length}</span>
                        )}
                      </button>
                    }
                    onOpen={onNotificationOpen} // Busca ao abrir
                  >
                    <NotificationsMenu />
                  </Dropdown>
                )}

                <Dropdown
                  trigger={
                    <button className="icon-button" aria-label="Conta de Usuário">
                      <i className="bi bi-person-circle profile-menu-avatar"></i>
                    </button>
                  }
                >
                  <ProfileMenu />
                </Dropdown>
              </div>
            </div>
          </>
        )}
      </header>

      {/* O Modal de Logout vive aqui, fora do header */}
      <Modal isOpen={showLogoutModal} onClose={() => setShowLogoutModal(false)}>
        <div className="logout-modal-content">
          <h2>Logout</h2>
          <p>Deseja realmente sair?</p>
          <div className="logout-modal-actions">
            <button
              className="logout-modal-button cancel"
              onClick={() => setShowLogoutModal(false)}
            >
              Cancelar
            </button>
            <button
              className="logout-modal-button confirm"
              onClick={handleConfirmLogout}
            >
              Sair
            </button>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default Header;

/* O seu header.css está perfeito, apenas adicione isto ao final */
/* para o badge de notificação e o link de "ver todas" */

.icon-button {
  position: relative; /* Necessário para o badge */
}

.notification-badge {
  position: absolute;
  top: -5px;
  right: -8px;
  background-color: var(--primary-color, #c80710);
  color: white;
  font-size: 10px;
  font-weight: 600;
  border-radius: 50%;
  width: 18px;
  height: 18px;
  display: flex;
  justify-content: center;
  align-items: center;
  border: 2px solid var(--bg-color, #151515);
}

.notifications-list {
  list-style: none;
  margin: 0;
  padding: 0;
  max-height: 400px; 
  overflow-y: auto;
}
.notifications-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 16px;
  border-bottom: 1px solid #222;
  gap: 1rem;
}
.notifications-item-empty {
  padding: 16px;
  text-align: center;
  color: #aaa;
}
.notifications-item-text {
  font-size: 0.9rem;
  color: #ddd;
  line-height: 1.4;
}
.notifications-item-text strong {
  color: #fff;
  font-weight: 600;
}
.notifications-item-actions {
  display: flex;
  gap: 8px;
}
.notification-action-button {
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  padding: 4px;
  border-radius: 50%;
  transition: background-color 0.2s;
}
.notification-action-button.approve {
  color: #28a745;
}
.notification-action-button.reject {
  color: #dc3545;
}
.notification-action-button.reject:hover {
  background-color: rgba(220, 53, 69, 0.1);
}
.notification-action-button.approve:hover {
  background-color: rgba(40, 167, 69, 0.1);
}
.notifications-view-all {
  display: block;
  text-align: center;
  padding: 12px;
  font-size: 0.9rem;
  font-weight: 600;
  color: #aaa;
  text-decoration: none;
  border-top: 1px solid #333;
}
.notifications-view-all:hover {
  color: var(--primary-color);
}

(((((((((((((((((((((((((((((((((((((((((((((((((modal de filtro))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))
import React, { useState } from 'react';
import Modal from '../Modal/Modal';
import './FilterModal.css';

const FilterModal = ({ isOpen, onClose, onFilterSubmit }) => {
  const [genero, setGenero] = useState("");
  const [ano, setAno] = useState("");
  const [ator, setAtor] = useState("");

  const handleFilter = () => {
    onFilterSubmit({ genero, ano, ator });
    onClose();
  };

  const handleClear = () => {
    setGenero("");
    setAno("");
    setAtor("");
    onFilterSubmit({}); // Limpa os filtros
    onClose();
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="filter-modal-content">
        <h2>Filtre seus filmes!</h2>
        
        <div className="filter-form-group">
          <label htmlFor="genero">Gênero:</label>
          <input 
            type="text" 
            id="genero"
            placeholder="Digite o gênero (Ex: Ação)" 
            value={genero}
            onChange={(e) => setGenero(e.target.value)}
          />
        </div>

        <div className="filter-form-group">
          <label htmlFor="ano">Ano:</label>
          <input 
            type="text" 
            id="ano"
            placeholder="Digite o ano de lançamento (Ex: 2020)" 
            value={ano}
            onChange={(e) => setAno(e.target.value)}
          />
        </div>

        <div className="filter-form-group">
          <label htmlFor="ator">Ator:</label>
          <input 
            type="text" 
            id="ator"
            placeholder="Digite o nome do ator" 
            value={ator}
            onChange={(e) => setAtor(e.target.value)}
          />
        </div>

        <div className="filter-modal-actions">
          <button className="filter-button cancel" onClick={handleClear}>
            Limpar
          </button>
          <button className="filter-button confirm" onClick={handleFilter}>
            Filtrar
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default FilterModal;
.filter-modal-content {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  font-family: "Montserrat", sans-serif;
}
.filter-modal-content h2 {
  font-size: 1.8rem;
  font-weight: 600;
  margin: 0;
  text-align: center;
  color: #c80710;
}
.filter-form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}
.filter-form-group label {
  font-size: 0.9rem;
  font-weight: 500;
  color: #aaa;
}
.filter-form-group input {
  background-color: #333;
  border: 1px solid #555;
  border-radius: 8px;
  padding: 0.9rem 1rem;
  color: #fff;
  font-size: 1rem;
  font-family: "Montserrat", sans-serif;
}
.filter-form-group input::placeholder { color: #888; }
.filter-modal-actions {
  display: flex;
  width: 100%;
  gap: 1rem;
  margin-top: 1rem;
}
.filter-button {
  flex: 1; 
  padding: 0.8rem 1rem;
  font-size: 1rem;
  font-weight: 600;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
  font-family: "Montserrat", sans-serif;
}
.filter-button.cancel {
  background-color: #444;
  color: #fff;
}
.filter-button.cancel:hover {
  background-color: #555;
}
.filter-button.confirm {
  background-color: #c80710;
  color: #fff;
}
.filter-button.confirm:hover {
  background-color: #e50914;
}

((((((((((((((((((((((((((((((((((((((((((((((((((((((pagina de filmes ))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))
import React, { useState, useEffect } from 'react';
import MovieCard from '../../components/MovieCard/MovieCard';
import FilterModal from '../../components/FilterModal/FilterModal';
import './filmes.css';
import 'bootstrap-icons/font/bootstrap-icons.css';

const Filmes = () => {
    const [filmes, setFilmes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showFilterModal, setShowFilterModal] = useState(false);
    const [filters, setFilters] = useState({});

    useEffect(() => {
        const fetchFilmes = async () => {
            setLoading(true);
            setError(null);
            
            const params = new URLSearchParams();
            if (filters.busca) { 
                params.append('busca', filters.busca);
            }
            // TODO: Lógica de filtro de Gênero/Ano/Ator no backend
            // if (filters.genero) params.append('genero', filters.genero);
            // if (filters.ano) params.append('ano', filters.ano);
            // if (filters.ator) params.append('ator', filters.ator);

            try {
                const response = await fetch(`http://localhost:8000/api/filmes?${params.toString()}`);
                const data = await response.json();
                if (response.ok) {
                    setFilmes(data);
                } else {
                    throw new Error(data.message || 'Erro ao buscar filmes');
                }
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        fetchFilmes();
    }, [filters]); 

    const handleFilterSubmit = (newFilters) => {
      console.log("Aplicando filtros:", newFilters);
      // O backend SÓ suporta 'busca' por enquanto.
      // A lógica de Gênero/Ano/Ator está pendente.
      // setFilters(prev => ({...prev, ...newFilters})); 
      alert("Lógica de filtro (Gênero, Ano, Ator) ainda não implementada no backend!");
    };

    if (loading) return <div className="page-status">Carregando filmes...</div>;
    if (error) return <div className="page-status error">Erro: {error}</div>;

    return (
        <div className="filmes-page-container">
            <div className="filmes-header">
                <h1>
                    <i className="bi bi-film"></i>
                    <span className='title-seemovie'>Nossos Filmes</span>
                </h1>
                <button 
                  className="filter-button" 
                  onClick={() => setShowFilterModal(true)}
                >
                    <i className="bi bi-filter"></i> Ver Filtros
                </button>
            </div>
            
            <div className="filmes-grid">
              {filmes.length > 0 ? (
                    filmes.map(filme => (
                        <MovieCard key={filme.id_filme} filme={filme} />
                    ))
                ) : (
                    <p className="page-status">Nenhum filme encontrado.</p>
                )}
            </div>

            <FilterModal 
              isOpen={showFilterModal}
              onClose={() => setShowFilterModal(false)}
              onFilterSubmit={handleFilterSubmit}
            />
        </div>
    );
};

export default Filmes;


((((((((((((((((((((((((((((((((((((((((((((((((autenticacao ))))))))))))))))))))))))))))))))))))))))))))))))))
import React, { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [userRole, setUserRole] = useState(null);
  // Estado de 'loading' é crucial para o ProtectedRoute
  const [loadingAuth, setLoadingAuth] = useState(true); 

  useEffect(() => {
    const role = localStorage.getItem("userRole");
    if (role) {
      setUserRole(role);
    }
    setLoadingAuth(false); // Termina de carregar
  }, []);

  const login = (role) => {
    localStorage.setItem("userRole", role);
    setUserRole(role);
  };

  const logout = () => {
    localStorage.removeItem("userRole");
    setUserRole(null);
  };

  return (
    <AuthContext.Provider value={{ userRole, login, logout, loadingAuth }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);


((((((((((((((((((((((((((((((((((((((((((((((((((((((()))))))))))))))))))))))))))))))))))))))))))))))))))))))

app.jsx

import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import { AuthProvider } from "./context/authcontext";

// Layouts e Componentes Globais
import Header from "./components/Header/header";
// Caminhos corrigidos para a pasta 'layouts'
import ProtectedRoute from "./layouts/ProtectedRoute/ProtectedRoute"; 

// Páginas
import Home from "./pages/Home/home";
import Login from "./pages/login/login";
import Cadastro from "./pages/cadastro/cadastro";
import AdicionarFilmes from "./pages/adicionarfilmes/adicionarfilmes";
import Filmes from "./pages/Filmes/filmes";
import Sobre from "./pages/Sobre/sobre"; // (Ficheiro não criado)
import Notificacoes from "./pages/notificacoes/notificacoes"; // (Ficheiro não criado)
import EditarPerfil from "./pages/editarperfil/editarperfil"; // (Ficheiro não criado)
import Perfil from "./pages/perfil/perfil"; // (Ficheiro não criado)
import DetalheFilme from "./pages/detalhefilme/detalhefilme";
import EditarFilme from "./pages/editarfilmes/editarfilmes";
import PaginaBusca from "./pages/Busca/busca";

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <Header />
        <main>
          <Routes>
            {/* --- Rotas Públicas --- */}
            <Route path="/login" element={<Login />} />
            <Route path="/cadastro" element={<Cadastro />} />

            {/* --- Rotas Protegidas (precisa estar logado) --- */}
            <Route element={<ProtectedRoute />}>
              <Route path="/" element={<Home />} />
              <Route path="/filmes" element={<Filmes />} />
              <Route path="/filme/:id" element={<DetalheFilme />} />
              <Route path="/busca" element={<PaginaBusca />} />
              <Route path="/perfil" element={<Perfil />} />
              <Route path="/editarperfil" element={<EditarPerfil />} />
              <Route path="/sobre" element={<Sobre />} />
            </Route>

            {/* --- Rotas de Admin (precisa ser admin) --- */}
            <Route element={<ProtectedRoute adminOnly={true} />}>
              <Route path="/adicionarfilmes" element={<AdicionarFilmes />} />
              <Route path="/editarfilme/:id" element={<EditarFilme />} />
              <Route path="/notificacoes" element={<Notificacoes />} />
            </Route>

          </Routes>
        </main>
      </Router>
    </AuthProvider>
  );
};

export default App;

((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((protect)))))))))))))))))))))))))))))))))))))))))))))))))
import React from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../../context/authcontext"; // Caminho corrigido

const ProtectedRoute = ({ adminOnly = false }) => {
  const { userRole, loadingAuth } = useAuth();
  const location = useLocation();

  // 1. Espera o authcontext terminar de ler o localStorage
  if (loadingAuth) {
    return <div style={{color: "white", textAlign: "center", marginTop: "5rem"}}>Verificando autenticação...</div>;
  }

  // 2. Se não estiver logado, manda para /login
  if (!userRole) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // 3. Se a rota é SÓ para admin e o user não é admin, manda para Home
  if (adminOnly && userRole !== "admin") {
    return <Navigate to="/" replace />;
  }

  // 4. Se passou tudo, deixa o usuário ver a página
  return <Outlet />;
};

export default ProtectedRoute;

((((((((((((((((((((((((((((((((((((((((((((((((((((((((notificacoes))))))))))))))))))))))))))))))))))))))))))))))))))))))))
import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/authcontext';
import './notificacoes.css'; // CSS Novo
import 'bootstrap-icons/font/bootstrap-icons.css';

const Notificacoes = () => {
    const { userRole } = useAuth();
    const [pendentes, setPendentes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Função para buscar os filmes pendentes
    const fetchPendentes = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await fetch('http://localhost:8000/api/filmes/pendentes');
            const data = await response.json();
            if (response.ok) {
                setPendentes(data);
            } else {
                throw new Error(data.message || 'Erro ao buscar pendências');
            }
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    // Busca os filmes ao carregar a página
    useEffect(() => {
        if (userRole === 'admin') {
            fetchPendentes();
        }
    }, [userRole]);

    // Função para aprovar ou rejeitar
    const handleAction = async (id, action) => {
        const route = action === 'approve' ? 'aprovar' : 'rejeitar';
        try {
            const body = new URLSearchParams();
            body.append('id_filme', id);

            const response = await fetch(`http://localhost:8000/api/filme/${route}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                body: body.toString()
            });

            const data = await response.json();
            if (response.ok) {
                // Remove o filme da lista local
                setPendentes(prev => prev.filter(filme => filme.ID !== id));
            } else {
                throw new Error(data.message || `Erro ao ${action} filme`);
            }
        } catch (err) {
            setError(err.message);
        }
    };

    if (userRole !== 'admin') {
        return (
            <div className="notifications-container">
                <h1 className="notifications-title">Acesso Negado</h1>
                <p className="page-status">Você não tem permissão para ver esta página.</p>
            </div>
        );
    }
    
    if (loading) return <div className="page-status">Carregando pendências...</div>;
    if (error) return <div className="page-status error">Erro: {error}</div>;

    return (
        <div className="notifications-container">
            <h1 className="notifications-title">
                <i className="bi bi-bell-fill"></i>
                Filmes Pendentes de Aprovação
            </h1>

            {pendentes.length === 0 ? (
                <p className="page-status">Nenhum filme pendente no momento.</p>
            ) : (
                <ul className="notifications-list-page">
                    {pendentes.map(filme => (
                        <li key={filme.ID} className="notification-item-page">
                            <span className="notification-item-text">
                                <strong>{filme.Titulo}</strong> (ID: {filme.ID})
                            </span>
                            <div className="notification-item-actions">
                                <button 
                                    className="notification-action-button approve"
                                    onClick={() => handleAction(filme.ID, 'approve')}
                                    title="Aprovar"
                                >
                                    <i className="bi bi-check-circle-fill"></i> Aprovar
                                </button>
                                <button 
                                    className="notification-action-button reject"
                                    onClick={() => handleAction(filme.ID, 'reject')}
                                    title="Rejeitar"
                                >
                                    <i className="bi bi-x-circle-fill"></i> Rejeitar
                                </button>
                            </div>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default Notificacoes;

.notifications-container {
    max-width: 900px;
    margin: 3rem auto;
    padding: 2rem;
    color: white;
    font-family: "Montserrat", sans-serif;
}

.notifications-title {
    display: flex;
    align-items: center;
    gap: 1rem;
    font-size: 2rem;
    font-weight: 600;
    color: #c80710;
    margin: 0 0 2rem 0;
    padding-bottom: 1.5rem;
    border-bottom: 1px solid #333;
}
.notifications-title i {
    font-size: 1.8rem;
}

.notifications-list-page {
    list-style: none;
    padding: 0;
    margin: 0;
    display: flex;
    flex-direction: column;
    gap: 1rem;
}

.notification-item-page {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1.5rem;
    background-color: #1c1c1c;
    border: 1px solid #333;
    border-radius: 12px;
}

.notification-item-text {
    font-size: 1.1rem;
    color: #ddd;
}
.notification-item-text strong {
    color: #fff;
    font-weight: 600;
}

.notification-item-actions {
    display: flex;
    gap: 1rem;
}

.notification-action-button {
    background: none;
    border: none;
    font-size: 1rem;
    font-weight: 600;
    font-family: "Montserrat", sans-serif;
    cursor: pointer;
    padding: 0.6rem 1rem;
    border-radius: 8px;
    transition: all 0.2s ease;
    display: flex;
    align-items: center;
    gap: 0.5rem;
}
.notification-action-button i {
    font-size: 1.2rem;
}

.notification-action-button.approve {
    color: #28a745;
    background-color: rgba(40, 167, 69, 0.1);
    border: 1px solid rgba(40, 167, 69, 0.5);
}
.notification-action-button.approve:hover {
    background-color: rgba(40, 167, 69, 0.2);
}

.notification-action-button.reject {
    color: #dc3545;
    background-color: rgba(220, 53, 69, 0.1);
    border: 1px solid rgba(220, 53, 69, 0.5);
}
.notification-action-button.reject:hover {
    background-color: rgba(220, 53, 69, 0.2);
}


