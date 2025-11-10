import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import './addfilmes.css';
import 'bootstrap-icons/font/bootstrap.css';

const AdicionarFilmes = ({
  initialData = {},
  onSubmit,
  onCancel,
  titleText = "Adicionar Filme",
}) => {
  const [title, setTitle] = useState(initialData.title || '');
  const [genre, setGenre] = useState(initialData.genre || '');
  const [releaseYear, setReleaseYear] = useState(initialData.releaseYear || '');
  const [posterUrl, setPosterUrl] = useState(initialData.posterUrl || '');
  const [actors, setActores] = useState(initialData.actors || '');
  const [synopsis, setSynopsis] = useState(initialData.synopsis || '');

  const navigate = useNavigate();

  const handleSubmit = (event) => {
    event.preventDefault();
    const movieData = { title, genre, releaseYear, posterUrl, actors, synopsis };

    if (onSubmit) {
      onSubmit(movieData) //chama a função por props
    }
    else {
      console.log('Filme salvo:', movieData);
      navigate('/filmes');
    }
  };

  const handleCancel = () => {
    if (onCancel) {
      onCancel();
    }
    else {
      navigate(-1);
    }
  };

  return (
    <div className="add-movie-container">
      <div className="add-movie-header">
        <i className="bi bi-plus-circle-fill"></i>
        <h1>{titleText}</h1>
      </div>

      <form className="add-movie-form" onSubmit={handleSubmit}>

        <div className="form-full">
          <label htmlFor="title">Título</label>
          <input type="text"
            id="title"
            placeholder="Digite o título do filme"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required />
        </div>

        <div className="form-group">
          <label htmlFor="title">Gênero:</label>
          <input type="text"
            id="genre"
            placeholder="Digite o gênero do filme"
            value={genre}
            onChange={(e) => setGenre(e.target.value)}
            required />
        </div>


        <div className="form-group">
          <label htmlFor="title">Ano de lançamento:</label>
          <input type="year"
            id="releaseYear"
            placeholder="Digite o ano de lançamento do filme"
            value={genre}
            onChange={(e) => setReleaseYear(e.target.value)}
            required />
        </div>

        <div className="form-full">
          <label htmlFor="posterUrl">Atores:</label>
          <input type="text"
            id="actors"
            placeholder="Digite o nome dos autores (separado por vírgulas)"
            value={actors}
            onChange={(e) => setActores(e.target.value)}
            required />
        </div>

        <div className="form-full">
          <label htmlFor="posterUrl">Sinopse:</label>
          <textarea
            id="synopsis"
            placeholder="Digite a sinopse do filme"
            value={synopsis}
            onChange={(e) => setSynopsis(e.target.value)}
            rows="5"
            />
        </div>

      
      </form>
    </div>
  )

}


export default AdicionarFilmes;
