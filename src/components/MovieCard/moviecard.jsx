import React from 'react';
import { Link } from 'react-router-dom';
import '../../components/MovieCard/moviecard.css';
import 'bootstrap-icons/font/bootstrap-icons.css'; 

const MovieCard = ({ filme }) => {
  const { id_filme, nomeFilme, ano, poster, generos, sinopse } = filme;

  const rating = React.useMemo(() => {
    const numId = parseFloat(id_filme) || 1; 
    return (numId % 2 + 3.5).toFixed(1); 
  }, [id_filme]);

  const displayGenre = generos ? generos.split(',')[0].trim() : 'Gênero indefinido';


  return (
    <article className="movie-card"> 

      <figure className="movie-card-poster"> 
        <img 
          src={poster} 
          alt={`Pôster de ${nomeFilme}`} 
          onError={(e) => {
            e.target.onerror = null; 
            e.target.src = "https://placehold.co/300x450/151515/E50914?text=Poster+Indisponível";
          }}
        />
      </figure>

      <div className="movie-card-info"> 
        <h3 className="movie-card-title">{nomeFilme}</h3> 
        
        <p className="movie-card-genre">{displayGenre}</p>

        <p className="movie-card-synopsis">
          {sinopse || "Nenhuma sinopse disponível."}
        </p>

        <div className="movie-card-meta"> 
          <span className="movie-card-year">{ano}</span> 
          <span className="movie-card-rating">
            <i className="bi bi-star-fill"></i> 
            {rating} 
          </span>
        </div>
      </div>
      <Link to={`/filme/${id_filme}`} className="movie-card-button" aria-label={`Ver detalhes de ${nomeFilme}`}> 
        Ver Mais 
      </Link>
    </article>
  );
};

export default MovieCard;