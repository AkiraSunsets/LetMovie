import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import '../../components/MovieForm/movieform.css';
import "bootstrap-icons/font/bootstrap-icons.css";
import { useAuth } from "../../context/authcontext"; 


//componente principal
const EditarFilme = () => {
  const { id } = useParams(); // Pega o ID do filme da URL
  const navigate = useNavigate(); // Para navegação programática
  const { userRole } = useAuth(); // Pega o papel do usuário (admin ou comum)
  // Estado do formulário
  const [formData, setFormData] = useState(null); // Dados do filme carregados
  const [status, setStatus] = useState({
    loading: true,
    error: null,
    success: null,
  });

  // Busca os dados atuais do filme
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
            id_genero: "1", 
            produtora: data.produtoras || "",
            id_linguagem: "2", 
            urlposter: data.poster || "",
            sinopse: data.sinopse || "",
          });
        } else {
          throw new Error(data.message || "Filme não encontrado");
        }
      } catch (err) {
        setStatus({ loading: false, error: err.message, success: null });
      } finally {
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
    setStatus({ loading: true, error: null, success: null });

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

if (status.loading) {
  return (
    <div
      style={{
        color: "white",
        textAlign: "center",
        marginTop: "80px",       
        fontSize: "32px",        
        fontFamily: '"Montserrat", sans-serif', 
      }}
    >
      Carregando...
    </div>
  );
}

if (status.error && !formData) {
  return (
    <div
      style={{
        color: "red",
        textAlign: "center",
        marginTop: "80px",       
        fontSize: "32px",        
        fontFamily: '"Montserrat", sans-serif',
      }}
    >
      Erro: {status.error}
    </div>
  );
}

// Se o formData não carregou por algum motivo (mesmo sem erro), não renderiza o form
if (!formData) return null;



  return (
    <div className="form-page-container">
      <div className="form-filme-container">
        <h1>
          <i className="bi bi-pencil-fill"></i>
          <span className="title-addmovie">Editar Filme</span>
        </h1>
        <form onSubmit={handleSubmit} className="form-filme">
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

          <div className="form-group">
            <label htmlFor="sinopse">Sinopse:</label>
            <textarea
              id="sinopse"
              name="sinopse"
              value={formData.sinopse}
              onChange={handleChange}
            />
          </div>

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

export default EditarFilme;