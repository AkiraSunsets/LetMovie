import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../../components/MovieForm/movieform.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import { useAuth } from "../../context/authcontext";

// componente funcional que representa o forms de add filmes
const AdicionarFilmes = () => {
  const navigate = useNavigate(); //navegação entre paginas
  const { userRole } = useAuth(); //userrole do contexto da autenticação

  const [formData, setFormData] = useState({
    //estado para armazenar os dados do forms
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

  //controla status de envio (loading, erro ou sucesso)
  const [status, setStatus] = useState({
    loading: false,
    error: null,
    success: null,
  });

  //função para atualizar o estado formData quando o usuário digita algo
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  //função chamada ao enviar o forms
  const handleSubmit = async (e) => {
    e.preventDefault(); //evita recarregar a página
    setStatus({ loading: true, error: null, success: null }); //indica que o envio começou

    try {
      //constroi o corpo da resquisicao como url encoded
      const body = new URLSearchParams();
      for (const key in formData) {
        body.append(key, formData[key]);
      }
      body.append("userRole", userRole); //envia o role do usuario

      //faz a requisicao post para o backend
      const response = await fetch("http://localhost:8000/cadastro", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: body.toString(),
      });

      const data = await response.json();

      //define a mensaggem de sucesso de acordo com o usuário
      if (response.ok) {
        const successMsg =
          userRole === "admin"
            ? "Filme adicionado com sucesso!"
            : "Filme enviado para aprovação!";

        //atualiza o estado com sucesso
        setStatus({ loading: false, error: null, success: successMsg });

        //reseta os campos do formulário
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

        // Redireciona ambos os usuários para /filmes dps de 2 segundos
        setTimeout(() => navigate("/filmes"), 2000);
      } else {
        throw new Error(data.message || "Erro ao adicionar filme");
      }

      //atualiza o caso dê erro
    } catch (err) {
      setStatus({ loading: false, error: err.message, success: null });
    }
  };

  return (
    //container principal
    <div className="form-page-container">
      <div className="form-filme-container">
        <h1>
          <i className="bi bi-plus-circle-fill"></i>
          <span className="title-addmovie">Adicionar Filme</span>
        </h1>

        {/*forms de cadastro de filme */}
        <form onSubmit={handleSubmit} className="form-filme">
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

          <div className="form-group">
            <label htmlFor="urlposter">URL do Pôster:</label>
            <input
              type="url"
              id="urlposter"
              name="urlposter"
              value={formData.urlposter}
              onChange={handleChange}
              placeholder="Ex: https://image.com/..."
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
                <option value="7">Mistério</option>
                <option value="8">Suspense</option>
                <option value="9">Biografia</option>
                <option value="10">Comédia</option>
                <option value="11">Crime</option>
                <option value="12">Animação</option>
                <option value="13">Musical</option>
                <option value="14">Fantasia</option>
                <option value="15">Documentário</option>
                <option value="16">Comédia Romântica</option>
                <option value="17">Policial</option>
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
                <option value="1">Português</option>
                <option value="2">Inglês</option>
                <option value="3">Espanhol</option>
                <option value="4">Francês</option>
                <option value="5">Alemão</option>
                <option value="6">Italiano</option>
                <option value="7">Japonês</option>
                <option value="8">Chinês</option>
                <option value="9">Coreano</option>
                <option value="10">Russo</option>
                <option value="11">Árabe</option>
                <option value="12">Grego</option>
                <option value="13">Turco</option>
                <option value="14">Sueco</option>
                <option value="15">Hebraico</option>
                <option value="16">Tailandês</option>
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
            <button
              type="submit"
              className="form-button submit"
              disabled={status.loading}
            >
              {status.loading
                ? "Enviando..."
                : userRole === "admin"
                ? "Adicionar Filme"
                : "Enviar para Aprovação"}
            </button>
          </div>
        </form>

        {/* Mensagens de erro e sucesso */}
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
