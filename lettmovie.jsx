css geral

.form-filme-container {
  max-width: 900px;
  margin: 2rem auto;
  padding: 2rem 3rem;
  background-color: var(--search-bg, #2b2b2b);
  border-radius: 12px;
  color: #fff;
}

.form-filme-title {
  font-size: 2.5rem;
  font-weight: 600;
  color: var(--primary-color, #c80710);
  margin-bottom: 2rem;
  display: flex;
  align-items: center;
  gap: 1rem;
}

.form-filme {
  display: grid;
  grid-template-columns: 1fr 1fr; /* 2 colunas */
  gap: 1.5rem 2rem; /* 1.5rem vertical, 2rem horizontal */
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

/* Faz um campo ocupar 2 colunas */
.form-group.full-width {
  grid-column: 1 / -1;
}

.form-group label {
  font-size: 0.9rem;
  color: #aaa;
  font-weight: 500;
}

.form-group input,
.form-group select,
.form-group textarea {
  background-color: #333;
  border: 1px solid #555;
  border-radius: 8px;
  padding: 0.9rem 1rem;
  color: #fff;
  font-size: 1rem;
  font-family: 'Inter', sans-serif;
}
.form-group input:focus,
.form-group select:focus,
.form-group textarea:focus {
  outline: none;
  border-color: var(--primary-color, #c80710);
  box-shadow: 0 0 5px rgba(229, 9, 20, 0.5);
}

.form-group textarea {
  resize: vertical;
  min-height: 120px;
}

.form-actions {
  grid-column: 1 / -1;
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  margin-top: 2rem;
}

.form-button {
  border: none;
  border-radius: 8px;
  padding: 0.9rem 2rem;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
}

.form-button.cancel {
  background-color: #444;
  color: #fff;
}
.form-button.cancel:hover {
  background-color: #555;
}

.form-button.submit {
  background-color: var(--primary-color, #c80710);
  color: #fff;
}
.form-button.submit:hover {
  background-color: #e50914;
}

/* Mensagens de feedback */
.form-message {
  grid-column: 1 / -1;
  text-align: center;
  margin-top: 1rem;
  font-size: 1rem;
  padding: 1rem;
  border-radius: 8px;
}
.form-message.success {
  background-color: #28a745;
  color: #fff;
}
.form-message.error {
  background-color: #dc3545;
  color: #fff;
}


----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
página adicionar filme

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './FormFilme.css'; // Reutiliza o CSS
import 'bootstrap-icons/font/bootstrap-icons.css';

const AdicionarFilmes = () => {
  const [formData, setFormData] = useState({
    nome: '',
    ano: '',
    duracao: '',
    id_genero: '',
    id_linguagem: '',
    produtora: '',
    diretor: '',
    atores: '',
    urlposter: '',
  });
  const [message, setMessage] = useState(null); // {type: 'success', text: '...'}
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage(null);

    // Converte o formulário para o formato x-www-form-urlencoded
    const body = new URLSearchParams();
    for (const key in formData) {
      body.append(key, formData[key]);
    }

    try {
      const response = await fetch('http://localhost:8000/cadastro', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: body.toString(),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage({ type: 'success', text: 'Filme adicionado com sucesso!' });
        setTimeout(() => {
          navigate(`/filme/${data.id}`); // Redireciona para a página do novo filme
        }, 1500);
      } else {
        throw new Error(data.message || 'Erro ao adicionar filme.');
      }
    } catch (err) {
      console.error(err);
      setMessage({ type: 'error', text: err.message });
    }
  };

  return (
    <div className="form-filme-container">
      <h1 className="form-filme-title">
        <i className="bi bi-plus-circle-fill"></i>
        Adicionar Novo Filme
      </h1>

      <form className="form-filme" onSubmit={handleSubmit}>
        
        {/* Linha 1 */}
        <div className="form-group full-width">
          <label htmlFor="nome">Título do Filme</label>
          <input type="text" id="nome" name="nome" value={formData.nome} onChange={handleChange} required />
        </div>

        {/* Linha 2 */}
        <div className="form-group">
          <label htmlFor="ano">Ano de Lançamento</label>
          <input type="number" id="ano" name="ano" value={formData.ano} onChange={handleChange} required />
        </div>
        <div className="form-group">
          <label htmlFor="duracao">Duração (em minutos)</label>
          <input type="number" id="duracao" name="duracao" value={formData.duracao} onChange={handleChange} required />
        </div>

        {/* Linha 3 */}
        <div className="form-group">
          <label htmlFor="id_genero">Gênero (ID)</label>
          {/* TODO: Substituir por um <select> com dados da API */}
          <input type="number" id="id_genero" name="id_genero" value={formData.id_genero} onChange={handleChange} required placeholder="Ex: 1 para Romance, 2 para Drama" />
        </div>
        <div className="form-group">
          <label htmlFor="id_linguagem">Linguagem (ID)</label>
          {/* TODO: Substituir por um <select> com dados da API */}
          <input type="number" id="id_linguagem" name="id_linguagem" value={formData.id_linguagem} onChange={handleChange} required placeholder="Ex: 2 para Inglês, 9 para Coreano" />
        </div>

        {/* Linha 4 */}
        <div className="form-group">
          <label htmlFor="produtora">Produtora</label>
          <input type="text" id="produtora" name="produtora" value={formData.produtora} onChange={handleChange} required />
        </div>
        <div className="form-group">
          <label htmlFor="diretor">Diretor</label>
          <input type="text" id="diretor" name="diretor" value={formData.diretor} onChange={handleChange} required />
        </div>

        {/* Linha 5 */}
        <div className="form-group full-width">
          <label htmlFor="atores">Atores (separados por vírgula)</label>
          <input type="text" id="atores" name="atores" value={formData.atores} onChange={handleChange} required />
        </div>
        
        {/* Linha 6 */}
        <div className="form-group full-width">
          <label htmlFor="urlposter">URL do Pôster</label>
          <input type="text" id="urlposter" name="urlposter" value={formData.urlposter} onChange={handleChange} required />
        </div>

        {/* Mensagens e Botões */}
        {message && (
          <div className={`form-message ${message.type}`}>
            {message.text}
          </div>
        )}

        <div className="form-actions">
          <button type="button" className="form-button cancel" onClick={() => navigate(-1)}>
            Cancelar
          </button>
          <button type="submit" className="form-button submit">
            Salvar Filme
          </button>
        </div>
      </form>
    </div>
  );
};

export default AdicionarFilmes;


-------------------------------------------------------------------------------------------------------------------------------
detalhe do filme

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import './detalhefilme.css'; // Novo CSS
import 'bootstrap-icons/font/bootstrap-icons.css';

const DetalheFilme = () => {
  const { id } = useParams(); // Pega o ID da URL
  const navigate = useNavigate();
  const [filme, setFilme] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Pega o 'role' do usuário para mostrar/esconder botões
  const userRole = localStorage.getItem('userRole');

  useEffect(() => {
    const fetchFilme = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(`http://localhost:8000/api/filme/${id}`);
        if (!response.ok) {
          throw new Error('Filme não encontrado');
        }
        const data = await response.json();
        setFilme(data);
      } catch (err) {
        console.error(err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchFilme();
  }, [id]); // Re-busca se o ID mudar

  const handleDelete = async () => {
    if (!window.confirm("Tem certeza que deseja excluir este filme? Esta ação não pode ser desfeita.")) {
      return;
    }
    
    try {
      const body = new URLSearchParams();
      body.append('id', id);

      const response = await fetch('http://localhost:8000/delete', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: body.toString(),
      });
      
      const data = await response.json();
      if (response.ok) {
        alert('Filme excluído com sucesso!');
        navigate('/filmes'); // Volta para a listagem
      } else {
        throw new Error(data.message || 'Erro ao excluir');
      }
    } catch (err) {
      console.error(err);
      alert(`Erro: ${err.message}`);
    }
  };

  if (loading) return <div className="detalhe-loading">Carregando...</div>;
  if (error) return <div className="detalhe-error">Erro: {error}</div>;
  if (!filme) return null;

  // Gera nota aleatória (banco não tem)
  const rating = (Math.random() * (4.8 - 3.5) + 3.5).toFixed(1);

  return (
    <div className="detalhe-container">
      <div className="detalhe-backdrop" style={{ backgroundImage: `url(${filme.poster})` }}></div>
      <div className="detalhe-content">
        
        <div className="detalhe-poster">
          <img 
            src={filme.poster} 
            alt={`Pôster de ${filme.nomeFilme}`}
            onError={(e) => { e.target.onerror = null; e.target.src="https://placehold.co/300x450/151515/E50914?text=Imagem+Indisponivel"; }}
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
              <i className="bi bi-star-fill"></i> {rating}
            </span>
          </div>

          <div className="detalhe-generos">
            {filme.generos?.split(',').map(g => (
              <span key={g.trim()} className="detalhe-genero-tag">{g.trim()}</span>
            ))}
          </div>

          <h3 className="detalhe-subtitle">Sinopse</h3>
          <p className="detalhe-sinopse">
            {/* O banco não tem sinopse, então usamos um placeholder */}
            Esta é uma sinopse de exemplo para o filme "{filme.nomeFilme}".
            Em um projeto real, este campo viria da API após ser adicionado
            no formulário de cadastro.
          </p>

          <div className="detalhe-crew">
            <div className="crew-item">
              <strong>Diretor(es)</strong>
              <span>{filme.diretores || 'Não informado'}</span>
            </div>
            <div className="crew-item">
              <strong>Produtora(s)</strong>
              <span>{filme.produtoras || 'Não informado'}</span>
            </div>
          </div>
          
          <div className="detalhe-crew">
            <div className="crew-item full-width">
              <strong>Elenco</strong>
              <span>{filme.atores || 'Não informado'}</span>
            </div>
          </div>

          {/* === BOTÕES DE ADMIN === */}
          {userRole === 'admin' && (
            <div className="detalhe-admin-actions">
              <Link to={`/editarfilme/${filme.id_filme}`} className="detalhe-button edit">
                <i className="bi bi-pencil-fill"></i> Editar Filme
              </Link>
              <button onClick={handleDelete} className="detalhe-button delete">
                <i className="bi bi-trash-fill"></i> Excluir Filme
              </button>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

export default DetalheFilme;


detalhe filme.css

.detalhe-container {
  position: relative;
  min-height: 90vh;
  color: #fff;
  display: flex;
  align-items: center; /* Centraliza o conteúdo verticalmente */
  padding: 4rem 0; /* Espaçamento superior/inferior */
}

.detalhe-backdrop {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-size: cover;
  background-position: center;
  filter: blur(20px) brightness(0.3); /* Desfoque e escurecimento */
  -webkit-filter: blur(20px) brightness(0.3);
  z-index: 1;
}

.detalhe-content {
  position: relative;
  z-index: 2;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
  display: flex;
  gap: 3rem;
  align-items: flex-start; /* Alinha o poster e as infos no topo */
}

.detalhe-poster {
  flex-shrink: 0; /* Impede que o poster encolha */
}

.detalhe-poster img {
  width: 300px;
  height: 450px;
  object-fit: cover;
  border-radius: 12px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
  border: 2px solid rgba(255, 255, 255, 0.1);
}

.detalhe-info {
  flex-grow: 1;
}

.detalhe-title {
  font-size: 3rem;
  font-weight: 700;
  margin: 0 0 0.5rem 0;
}

.detalhe-year {
  font-weight: 300;
  color: #ccc;
  margin-left: 1rem;
}

.detalhe-meta {
  display: flex;
  gap: 1.5rem;
  font-size: 1.1rem;
  color: #ccc;
  margin-bottom: 1.5rem;
}

.detalhe-rating {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #f5c518;
  font-weight: 600;
}

.detalhe-generos {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-bottom: 2rem;
}

.detalhe-genero-tag {
  background-color: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  padding: 0.4rem 0.8rem;
  border-radius: 20px;
  font-size: 0.9rem;
}

.detalhe-subtitle {
  font-size: 1.5rem;
  font-weight: 600;
  color: var(--primary-color, #c80710);
  margin-top: 2rem;
  margin-bottom: 0.75rem;
}

.detalhe-sinopse {
  font-size: 1rem;
  line-height: 1.6;
  color: #ddd;
  max-width: 70ch; /* Limita a largura do texto */
}

.detalhe-crew {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.5rem;
  margin-top: 1.5rem;
}

.crew-item {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}
.crew-item.full-width {
  grid-column: 1 / -1;
}
.crew-item strong {
  font-weight: 600;
  font-size: 1rem;
  color: #aaa;
}
.crew-item span {
  font-size: 1rem;
  color: #ddd;
}

/* Botões de Admin */
.detalhe-admin-actions {
  display: flex;
  gap: 1rem;
  margin-top: 3rem;
  padding-top: 2rem;
  border-top: 1px solid #333;
}

.detalhe-button {
  border: none;
  border-radius: 8px;
  padding: 0.9rem 1.5rem;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  text-decoration: none;
}
.detalhe-button.edit {
  background-color: #007bff; /* Azul */
  color: #fff;
}
.detalhe-button.edit:hover {
  background-color: #0056b3;
}
.detalhe-button.delete {
  background-color: #dc3545; /* Vermelho */
  color: #fff;
}
.detalhe-button.delete:hover {
  background-color: #c82333;
}

/* Loading/Error */
.detalhe-loading,
.detalhe-error {
  font-size: 1.5rem;
  text-align: center;
  color: #aaa;
  padding: 5rem;
}
.detalhe-error {
  color: var(--primary-color, #c80710);
}

/* Responsividade */
@media (max-width: 768px) {
  .detalhe-content {
    flex-direction: column;
    align-items: center;
    text-align: center;
  }
  .detalhe-info {
    width: 100%;
  }
  .detalhe-title {
    font-size: 2.5rem;
  }
  .detalhe-meta, .detalhe-generos {
    justify-content: center;
  }
  .detalhe-crew {
    grid-template-columns: 1fr;
    text-align: left;
  }
  .detalhe-admin-actions {
    flex-direction: column;
  }
  .detalhe-button {
    justify-content: center;
  }
}

-----------------------------------------------------------------------------------------------
editarfilme

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import '../adicionarfilmes/FormFilme.css'; // Reutiliza o CSS
import 'bootstrap-icons/font/bootstrap-icons.css';

const EditarFilme = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState(null); // Inicia nulo
  const [message, setMessage] = useState(null);
  const [loading, setLoading] = useState(true);

  // 1. Busca os dados atuais do filme
  useEffect(() => {
    const fetchFilme = async () => {
      try {
        setLoading(true);
        const response = await fetch(`http://localhost:8000/api/filme/${id}`);
        if (!response.ok) throw new Error('Filme não encontrado');
        
        const data = await response.json();
        
        // Adapta os dados da API para o formulário
        setFormData({
          id_filme: data.id_filme,
          nome: data.nomeFilme,
          ano: data.ano,
          duracao: data.tempo_duracao,
          urlposter: data.poster,
          // TODO: O backend precisa retornar os IDs, não os nomes, para
          // preencher os campos 'id_genero' e 'id_linguagem' corretamente.
          // Por enquanto, usaremos placeholders.
          id_genero: '', 
          id_linguagem: '',
          produtora: data.produtoras || '',
          diretor: data.diretores || '',
          atores: data.atores || '',
        });
      } catch (err) {
        console.error(err);
        setMessage({ type: 'error', text: err.message });
      } finally {
        setLoading(false);
      }
    };
    fetchFilme();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // 2. Envia os dados atualizados
  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage(null);

    const body = new URLSearchParams();
    for (const key in formData) {
      body.append(key, formData[key]);
    }

    try {
      const response = await fetch('http://localhost:8000/api/filme/editar', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: body.toString(),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage({ type: 'success', text: 'Filme atualizado com sucesso!' });
        setTimeout(() => {
          navigate(`/filme/${id}`); // Volta para a página do filme
        }, 1500);
      } else {
        throw new Error(data.message || 'Erro ao atualizar filme.');
      }
    } catch (err) {
      console.error(err);
      setMessage({ type: 'error', text: err.message });
    }
  };

  if (loading) return <div className="form-filme-container">Carregando dados do filme...</div>;
  if (!formData) return <div className="form-filme-container error">Filme não encontrado.</div>;

  return (
    <div className="form-filme-container">
      <h1 className="form-filme-title">
        <i className="bi bi-pencil-fill"></i>
        Editar Filme
      </h1>

      <form className="form-filme" onSubmit={handleSubmit}>
        
        {/* Campo 'id_filme' escondido, mas necessário para o backend */}
        <input type="hidden" name="id_filme" value={formData.id_filme} />

        {/* Linha 1 */}
        <div className="form-group full-width">
          <label htmlFor="nome">Título do Filme</label>
          <input type="text" id="nome" name="nome" value={formData.nome} onChange={handleChange} required />
        </div>

        {/* Linha 2 */}
        <div className="form-group">
          <label htmlFor="ano">Ano de Lançamento</label>
          <input type="number" id="ano" name="ano" value={formData.ano} onChange={handleChange} required />
        </div>
        <div className="form-group">
          <label htmlFor="duracao">Duração (em minutos)</label>
          <input type="number" id="duracao" name="duracao" value={formData.duracao} onChange={handleChange} required />
        </div>

        {/* Linha 3 */}
        <div className="form-group">
          <label htmlFor="id_genero">Gênero (ID)</label>
          <input type="number" id="id_genero" name="id_genero" value={formData.id_genero} onChange={handleChange} required placeholder="Insira o ID do gênero" />
        </div>
        <div className="form-group">
          <label htmlFor="id_linguagem">Linguagem (ID)</label>
          <input type="number" id="id_linguagem" name="id_linguagem" value={formData.id_linguagem} onChange={handleChange} required placeholder="Insira o ID da linguagem" />
        </div>

        {/* Linha 4 */}
        <div className="form-group">
          <label htmlFor="produtora">Produtora</label>
          <input type="text" id="produtora" name="produtora" value={formData.produtora} onChange={handleChange} required />
        </div>
        <div className="form-group">
          <label htmlFor="diretor">Diretor</label>
          <input type="text" id="diretor" name="diretor" value={formData.diretor} onChange={handleChange} required />
        </div>

        {/* Linha 5 */}
        <div className="form-group full-width">
          <label htmlFor="atores">Atores (separados por vírgula)</label>
          <input type="text" id="atores" name="atores" value={formData.atores} onChange={handleChange} required />
        </div>
        
        {/* Linha 6 */}
        <div className="form-group full-width">
          <label htmlFor="urlposter">URL do Pôster</label>
          <input type="text" id="urlposter" name="urlposter" value={formData.urlposter} onChange={handleChange} required />
        </div>

        {/* Mensagens e Botões */}
        {message && (
          <div className={`form-message ${message.type}`}>
            {message.text}
          </div>
        )}

        <div className="form-actions">
          <button type="button" className="form-button cancel" onClick={() => navigate(-1)}>
            Cancelar
          </button>
          <button type="submit" className="form-button submit">
            Salvar Alterações
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditarFilme;

------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
notificações admin

import React from 'react';
import './notificacoes.css'; // Novo CSS
import 'bootstrap-icons/font/bootstrap-icons.css';

// Dados de exemplo (mock) - substitua pela API
const mockNotificacoes = [
  { id: 1, tipo: 'Adição', titulo: 'Duna: Parte 2' },
  { id: 2, tipo: 'Edição', titulo: 'Como eu era antes de você' },
  { id: 3, tipo: 'Adição', titulo: 'Oppenheimer' },
];

const Notificacoes = () => {
  // TODO: Fazer fetch das notificações pendentes da API
  const notificacoes = mockNotificacoes;

  const handleApprove = (id) => {
    alert(`Aprovando item ${id}. (API não implementada)`);
    // TODO: Chamar API POST /api/filme/aprovar/{id}
  };
  
  const handleReject = (id) => {
    alert(`Rejeitando item ${id}. (API não implementada)`);
    // TODO: Chamar API POST /api/filme/rejeitar/{id}
  };

  return (
    <div className="notificacoes-container">
      <h1 className="notificacoes-title">
        <i className="bi bi-bell-fill"></i>
        Aprovações Pendentes
      </h1>

      {notificacoes.length === 0 ? (
        <p className="notificacoes-empty">Nenhuma pendência no momento.</p>
      ) : (
        <ul className="notificacoes-list">
          {notificacoes.map((item) => (
            <li key={item.id} className="notificacao-card">
              <div className="notificacao-info">
                <span className={`notificacao-badge ${item.tipo.toLowerCase()}`}>
                  {item.tipo}
                </span>
                <p className="notificacao-text">
                  Solicitação de <strong>{item.tipo}</strong> para o filme: <strong>"{item.titulo}"</strong>
                </p>
              </div>
              <div className="notificacao-actions">
                <button 
                  className="notificacao-btn approve" 
                  aria-label="Aprovar"
                  onClick={() => handleApprove(item.id)}
                >
                  <i className="bi bi-check-lg"></i> Aprovar
                </button>
                <button 
                  className="notificacao-btn reject" 
                  aria-label="Rejeitar"
                  onClick={() => handleReject(item.id)}
                >
                  <i className="bi bi-x-lg"></i> Rejeitar
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


notificacoes.css
.notificacoes-container {
  max-width: 1000px;
  margin: 2rem auto;
  padding: 0 2rem;
  color: #fff;
}

.notificacoes-title {
  font-size: 2.5rem;
  font-weight: 600;
  color: var(--primary-color, #c80710);
  margin-bottom: 2rem;
  display: flex;
  align-items: center;
  gap: 1rem;
}

.notificacoes-empty {
  font-size: 1.2rem;
  text-align: center;
  color: #888;
  padding: 3rem;
  background-color: var(--search-bg, #2b2b2b);
  border-radius: 12px;
}

.notificacoes-list {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.notificacao-card {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap; /* Para responsividade */
  gap: 1rem;
  background-color: var(--search-bg, #2b2b2b);
  padding: 1.5rem 2rem;
  border-radius: 12px;
  border: 1px solid #333;
}

.notificacao-info {
  display: flex;
  align-items: center;
  gap: 1.5rem;
  flex-grow: 1;
}

.notificacao-badge {
  font-size: 0.8rem;
  font-weight: 700;
  padding: 0.4rem 0.8rem;
  border-radius: 20px;
  text-transform: uppercase;
}
.notificacao-badge.adição {
  background-color: #28a745; /* Verde */
  color: #fff;
}
.notificacao-badge.edição {
  background-color: #007bff; /* Azul */
  color: #fff;
}

.notificacao-text {
  font-size: 1rem;
  margin: 0;
}
.notificacao-text strong {
  color: #fff;
  font-weight: 500;
}

.notificacao-actions {
  display: flex;
  gap: 1rem;
  flex-shrink: 0; /* Impede que os botões encolham */
}

.notificacao-btn {
  border: none;
  border-radius: 8px;
  padding: 0.75rem 1.5rem;
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: all 0.2s ease;
}

.notificacao-btn.approve {
  background-color: #28a745;
  color: #fff;
}
.notificacao-btn.approve:hover {
  background-color: #218838;
}

.notificacao-btn.reject {
  background-color: #dc3545;
  color: #fff;
}
.notificacao-btn.reject:hover {
  background-color: #c82333;
}

@media (max-width: 768px) {
  .notificacao-card {
    flex-direction: column;
    align-items: flex-start;
  }
  .notificacao-actions {
    width: 100%;
  }
  .notificacao-btn {
    flex-grow: 1;
    justify-content: center;
  }
}


-------------------------------------------------------------------------------------------------------------------------------------
header atualizado 

import React, { useState, useEffect } from "react";
import { NavLink, Link, useNavigate, useLocation } from "react-router-dom";
import "bootstrap-icons/font/bootstrap-icons.css";
import "./header.css";
import Dropdown from "../Dropdown/Dropdown"; // Importa o Dropdown

const Header = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [userRole, setUserRole] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  // Verifica o 'userRole' no localStorage
  // Usamos useEffect para atualizar quando o localStorage mudar (ex: login/logout)
  useEffect(() => {
    const role = localStorage.getItem("userRole");
    setUserRole(role);

    // Ouve por mudanças no localStorage (ex: evento de login/logout)
    const handleStorageChange = () => {
      setUserRole(localStorage.getItem("userRole"));
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []); // Roda na montagem

  // Esconde o menu em páginas de auth
  const isAuthPage = location.pathname === "/login" || location.pathname === "/cadastro";

  const handleSearchSubmit = (event) => {
    event.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/busca?query=${encodeURIComponent(searchTerm.trim())}`);
      setSearchTerm("");
    }
  };

  const handleLogout = () => {
    // Limpa o localStorage e redireciona
    localStorage.removeItem("userRole");
    setUserRole(null);
    navigate("/login");
  };

  // ---- Componentes dos Menus Dropdown ----

  const ProfileMenu = () => (
    <>
      <div className="profile-menu-header">
        <i className="bi bi-person-circle profile-menu-avatar"></i>
        <span className="profile-menu-user">
          {userRole === 'admin' ? 'Administrador' : 'Usuário Comum'}
        </span>
      </div>
      <ul className="profile-menu-list">
        <Link to="/perfil" className="profile-menu-item">
          <i className="bi bi-person-fill"></i>
          <span>Meu Perfil</span>
        </Link>
        <Link to="/editarperfil" className="profile-menu-item">
          <i className="bi bi-gear-fill"></i>
          <span>Editar Perfil</span>
        </Link>

        {/* Links Específicos do Admin */}
        {userRole === 'admin' && (
          <>
            <Link to="/adicionarfilmes" className="profile-menu-item">
              <i className="bi bi-plus-circle-fill"></i>
              <span>Adicionar Filme</span>
            </Link>
            <Link to="/notificacoes" className="profile-menu-item">
              <i className="bi bi-bell-fill"></i>
              <span>Aprovações</span>
            </Link>
          </>
        )}
        
        {/* Link de Logout */}
        <li className="profile-menu-item logout" onClick={handleLogout}>
          <i className="bi bi-box-arrow-right"></i>
          <span>Sair</span>
        </li>
      </ul>
    </>
  );

  const NotificationsMenu = () => (
    <>
      <div className="notifications-menu-header">Notificações</div>
      <ul className="notifications-list">
        {/* Exemplo de Notificação (você vai preencher isso com dados da API) */}
        <li className="notification-item">
          <span className="notification-item-text">
            <strong>"Filme Novo"</strong> foi enviado para aprovação.
          </span>
          <div className="notification-item-actions">
            <button className="notification-action-btn approve" aria-label="Aprovar">
              <i className="bi bi-check-circle-fill"></i>
            </button>
            <button className="notification-action-btn reject" aria-label="Rejeitar">
              <i className="bi bi-x-circle-fill"></i>
            </button>
          </div>
        </li>
        <li className="notification-item">
          <span className="notification-item-text">
            <strong>"Edição em Alerta Vermelho"</strong> foi enviada para aprovação.
          </span>
          <div className="notification-item-actions">
            <button className="notification-action-btn approve" aria-label="Aprovar">
              <i className="bi bi-check-circle-fill"></i>
            </button>
            <button className="notification-action-btn reject" aria-label="Rejeitar">
              <i className="bi bi-x-circle-fill"></i>
            </button>
          </div>
        </li>
        {/* Exemplo de Menu Vazio */}
        {/* <li className="notifications-empty">Nenhuma notificação nova.</li> */}
      </ul>
    </>
  );


  // ---- Renderização Principal do Header ----

  return (
    <header className={`header ${isAuthPage ? "auth-header" : ""}`}>
      <div className="logo">
        <Link to="/" className="logo-link">
          <span className="logo-let">Let</span>
          <span className="logo-movie">Movie</span>
        </Link>
      </div>

      {/* Só mostra o menu se NÃO for página de auth E o usuário estiver logado */}
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
              {/* O link de Adicionar Filme agora fica no menu de perfil do admin */}
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
              {/* Só mostra notificações para o Admin */}
              {userRole === 'admin' && (
                <Dropdown trigger={
                  <button className="icon-button" aria-label="Notificações">
                    <i className="bi bi-bell"></i>
                  </button>
                }>
                  <NotificationsMenu />
                </Dropdown>
              )}
              
              {/* Botão de Perfil/Usuário */}
              <Dropdown trigger={
                <button className="icon-button" aria-label="Conta do Usuário">
                  <i className="bi bi-person-circle"></i>
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


cssheader


/* Seu CSS original... (Vou adicionar/modificar apenas o necessário) */
:root {
  --primary-color: #c80710;
  --bg-color: #151515;
  --text-color: #ffffff;
  --search-bg: #2b2b2b;
}

.header {
  display: flex;
  align-items: center;
  /* Removido justify-content para centralizar com margin */
  background-color: var(--bg-color);
  padding: 0 30px;
  height: 60px;
}

/* NOVO: Regra para centralizar o logo nas páginas de Auth */
.header.auth-header {
  justify-content: center;
}
.header.auth-header .logo {
  margin-right: 0;
}
/* Fim da regra nova */

.logo-link {
  text-decoration: none;
}

.logo {
  font-size: 28px;
  font-weight: bold;
  margin-right: 30px;
}

.logo-let {
  color: var(--text-color);
  font-family: "Montserrat", sans-serif;
}

.logo-movie {
  color: var(--primary-color);
  font-family: "Montserrat", sans-serif;
}

.nav-main {
  flex-grow: 1;
}

.nav-list {
  list-style: none;
  display: flex;
  margin: 0;
  padding: 0;
  gap: 30px;
}

.nav-item a {
  display: inline-block;
  color: white;
  text-decoration: none;
  font-size: 16px;
  font-family: "Montserrat", sans-serif;
  padding: 20px 0; /* 20px (cima/baixo) garante que a área clicável seja boa */
  border-bottom: 3px solid transparent;
  transition: border-color 0.3s, color 0.3s;
}

.nav-item a:hover {
  border-bottom-color: var(--primary-color);
}

.nav-item a.active-link {
  border-bottom-color: var(--primary-color);
  color: var(--primary-color);
}

.header-right-section {
  display: flex;
  align-items: center;
  gap: 20px;
}

.search-form {
  display: flex;
  align-items: center;
  background-color: var(--search-bg);
  border-radius: 10px;
  padding: 5px 15px;
  width: 300px;
}

.search-button {
  background: none;
  border: none;
  color: #aaa;
  font-size: 18px;
  cursor: pointer;
  padding: 0;
}

.search-input {
  background: none;
  border: none;
  color: var(--text-color);
  width: 100%;
  font-size: 16px;
  outline: none;
}

.search-input::placeholder {
  color: #999;
}

.section-icons {
  display: flex;
  gap: 30px;
}

.icon-button {
  background: none;
  border: none;
  color: var(--text-color);
  font-size: 20px;
  cursor: pointer;
  padding: 0;
  opacity: 0.9;
  transition: color 0.3s, transform 0.2s ease;
  position: relative; /* Para futuros badges de notificação */
}

.icon-button i {
  color: #ffffff;
}

.icon-button:hover i {
  color: var(--primary-color);
  transform: scale(1.1);
}


------------------------------------------------------------------------------------------------------------------
dropdown header

import React, { useState, useEffect, useRef } from 'react';
import './Dropdown.css';

/**
 * Componente de Dropdown reutilizável.
 * @param {React.ReactNode} trigger - O elemento que aciona o dropdown (ex: um ícone).
 * @param {React.ReactNode} children - O conteúdo que vai dentro do menu popup.
 */
const Dropdown = ({ trigger, children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const node = useRef();

  // Fecha o dropdown se clicar fora dele
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (node.current && !node.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className="dropdown" ref={node}>
      <div className="dropdown-trigger" onClick={() => setIsOpen(!isOpen)}>
        {trigger}
      </div>
      {isOpen && (
        <div className="dropdown-menu">
          {children}
        </div>
      )}
    </div>
  );
};

export default Dropdown;


dropdown css

/* :root vem do seu header.css */
.dropdown {
  position: relative;
  display: inline-block;
}

.dropdown-trigger {
  cursor: pointer;
}

.dropdown-menu {
  position: absolute;
  top: 100%; /* Começa abaixo do gatilho */
  right: 0;
  margin-top: 15px; /* Espaço entre o ícone e o menu */
  background-color: var(--bg-color, #151515);
  border: 1px solid #333;
  border-radius: 8px;
  width: 260px;
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.7);
  z-index: 1000;
  padding: 0.5rem 0;
  color: var(--text-color, #fff);
  font-family: 'Inter', sans-serif;
}

/* --- Estilos do Menu de Perfil --- */
.profile-menu-header {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 0.75rem 1rem;
  border-bottom: 1px solid #333;
}

.profile-menu-avatar {
  font-size: 2.5rem;
  color: #aaa;
}

.profile-menu-user {
  font-size: 1rem;
  font-weight: 600;
}

.profile-menu-list {
  list-style: none;
  margin: 0;
  padding: 0.5rem 0;
}

.profile-menu-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 0.75rem 1rem;
  cursor: pointer;
  text-decoration: none;
  color: #ddd;
  font-size: 0.95rem;
}

.profile-menu-item:hover {
  background-color: #252525;
}

.profile-menu-item i {
  font-size: 1.1rem;
  width: 20px; /* Alinha os ícones */
  text-align: center;
  color: #aaa;
}

.profile-menu-item.logout {
  border-top: 1px solid #333;
  color: var(--primary-color, #c80710);
  font-weight: 500;
}
.profile-menu-item.logout:hover {
  background-color: rgba(200, 7, 16, 0.1);
}

/* --- Estilos do Menu de Notificação --- */
.notifications-menu-header {
  padding: 0.75rem 1rem;
  font-size: 1.1rem;
  font-weight: 600;
  border-bottom: 1px solid #333;
}

.notifications-list {
  list-style: none;
  margin: 0;
  padding: 0;
  max-height: 400px;
  overflow-y: auto;
}

.notification-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  border-bottom: 1px solid #222;
}
.notification-item:last-child {
  border-bottom: none;
}

.notification-item-text {
  font-size: 0.9rem;
  color: #ddd;
  line-height: 1.4;
}
.notification-item-text strong {
  color: #fff;
  font-weight: 500;
}

.notification-item-actions {
  display: flex;
  gap: 8px;
}

.notification-action-btn {
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  padding: 4px;
  border-radius: 50%;
  transition: background-color 0.2s;
}

.notification-action-btn.approve {
  color: #28a745; /* Verde */
}
.notification-action-btn.approve:hover {
  background-color: rgba(40, 167, 69, 0.1);
}

.notification-action-btn.reject {
  color: #dc3545; /* Vermelho */
}
.notification-action-btn.reject:hover {
  background-color: rgba(220, 53, 69, 0.1);
}

.notifications-empty {
  padding: 2rem 1rem;
  text-align: center;
  color: #888;
}

------------------------------------------------------------------------------------------------------------------------------------------------------



