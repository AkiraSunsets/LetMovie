import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

import './movieform.css';
import 'bootstrap-icons/font/bootstrap-icons.css';

const MovieForm = ({
  initialData = {},
  onSubmit,
  onCancel,
  titleText = "Adicionar Filme",
}) => {

  const [title, setTitle] = useState(initialData.title || '');
  const [genre, setGenre] = useState(initialData.genre || '');
  const [releaseYear, setReleaseYear] = useState(initialData.releaseYear || '');
  const [posterUrl, setPosterUrl] = useState(initialData.posterUrl || ''); // CAMPO ADICIONADO
  const [actors, setActors] = useState(initialData.actors || '');
  const [synopsis, setSynopsis] = useState(initialData.synopsis || '');

  const navigate = useNavigate();

  const handleSubmit = (event) => {
    event.preventDefault();
    const movieData = { title, genre, releaseYear, posterUrl, actors, synopsis };

    if (onSubmit) {
      onSubmit(movieData); // Chama a função vinda das props
    } else {
      console.log('Filme salvo:', movieData);
      navigate('/filmes');
    }
  };

  // Lida com o cancelamento
  const handleCancel = () => {
    if (onCancel) {
      onCancel(); // Chama a função vinda das props
    } else {
      navigate(-1); // Volta para a página anterior
    }
  };

  return (
    <div className="add-movie-container">
      <div className="add-movie-header">
        <i className="bi bi-plus-circle-fill"></i>
        <h2>{titleText}</h2> {/* Usa o título dinâmico */}
      </div>

      <form className="add-movie-form" onSubmit={handleSubmit}>

        <div className="form-group form-full">
          <label htmlFor="title">Título</label>
          <input type="text"
            id="title"
            placeholder="Digite o título do filme"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required />
        </div>

        <div className="form-group">
          {/* CORREÇÃO: htmlFor="genre" */}
          <label htmlFor="genre">Gênero:</label>
          <input type="text"
            id="genre"
            placeholder="Digite o gênero do filme"
            value={genre}
            onChange={(e) => setGenre(e.target.value)}
            required />
        </div>

        <div className="form-group">
          {/* CORREÇÃO: htmlFor="releaseYear" */}
          <label htmlFor="releaseYear">Ano de lançamento:</label>
          <input type="number"
            id="releaseYear"
            placeholder="Digite o ano de lançamento do filme"
            value={releaseYear}
            onChange={(e) => setReleaseYear(e.target.value)}
            min="1888"
            max={new Date().getFullYear()}
            required />
        </div>

        {/* CAMPO FALTANTE ADICIONADO */}
        <div className="form-group form-full">
          <label htmlFor="posterUrl">URL do Pôster:</label>
          <input type="text"
            id="posterUrl"
            placeholder="Digite a URL do pôster"
            value={posterUrl}
            onChange={(e) => setPosterUrl(e.target.value)}
            required />
        </div>

        <div className="form-group form-full">
          {/* CORREÇÃO: htmlFor="actors" */}
          <label htmlFor="actors">Atores:</label>
          <input type="text"
            id="actors"
            placeholder="Digite o nome dos atores (separado por vírgulas)"
            value={actors}
            onChange={(e) => setActors(e.target.value)}
            required />
        </div>

        <div className="form-group form-full">
          {/* CORREÇÃO: htmlFor="synopsis" */}
          <label htmlFor="synopsis">Sinopse:</label>
          <textarea
            id="synopsis"
            placeholder="Digite a sinopse do filme"
            value={synopsis}
            onChange={(e) => setSynopsis(e.target.value)}
            rows="5"
          />
        </div>

        {/* ---- Botões de ação */}
        <div className="form-actions">
          <button type="button" className=" button button-secondary" onClick={handleCancel}>
            Cancelar
          </button>
          <button type="submit" className="button button-primary">
            Salvar
          </button>
        </div>
      </form>
    </div>
  );
};

export default MovieForm;