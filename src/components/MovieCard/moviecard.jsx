import React from "react";
import { Link } from "react-router-dom";
import "../../components/MovieCard/moviecard.css";
import "bootstrap-icons/font/bootstrap-icons.css";

//card individual
const MovieCard = ({ filme }) => {
  const { id_filme, nomeFilme, ano, poster, generos, sinopse } = filme;

  //gera uma lógica para o rating baseado no id
  const rating = React.useMemo(() => {
    const numId = parseFloat(id_filme) || 1;
    return ((numId % 2) + 3.5).toFixed(1);
  }, [id_filme]);

  //exibe apenas o primeiro genero da lista
  // Substitui a vírgula por um ponto para ficar bonito e mostra tudo
  const displayGenre = generos
    ? generos.replace(/,/g, " • ")
    : "Gênero indefinido";

  return (
    <article className="movie-card">
      {/* poster do filme */}
      <figure className="movie-card-poster">
        <img
          src={poster}
          alt={`Pôster de ${nomeFilme}`}
          onError={(e) => {
            e.target.onerror = null;
            e.target.src =
              "https://placehold.co/300x450/151515/E50914?text=Poster+Indisponível";
          }}
        />
      </figure>

      {/* bloco de informações principais */}
      <div className="movie-card-info">
        {/* titulo do filme */}
        <h3 className="movie-card-title">{nomeFilme}</h3>

        {/* genero */}
        <p className="movie-card-genre">{displayGenre}</p>

        {/* sinopse com else de que se não houver sinopse */}
        <p className="movie-card-synopsis">
          {sinopse || "Nenhuma sinopse disponível."}
        </p>

        {/* dados secundários */}
        <div className="movie-card-meta">
          {/* ano */}
          <time className="movie-card-year">{ano}</time>

          {/* classificação */}
          <data className="movie-card-rating">
            <i className="bi bi-star-fill"></i>
            {rating}
          </data>
        </div>
      </div>

      {/* página de detalhes */}
      <Link
        to={`/filme/${id_filme}`}
        className="movie-card-button"
        aria-label={`Ver detalhes de ${nomeFilme}`}
      >
        Ver Mais
      </Link>
    </article>
  );
};

export default MovieCard;
