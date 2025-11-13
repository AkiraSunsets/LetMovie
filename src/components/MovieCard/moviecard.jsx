import React from 'react';
import { Link } from 'react-router-dom';
import '../../components/MovieCard/moviecard.css';
import 'bootstrap-icons/font/bootstrap-icons.css'; // Para o ícone de estrela


const MovieCard = ({ filme }) => {
  // Desestrutura o objeto 'filme' que vem da API
  const { id_filme, nomeFilme, ano, poster } = filme;

  // Placeholder para a classificação (rating), já que a API não o fornece
  // Vamos gerar um número aleatório "fixo" baseado no ID para parecer real
  const rating = React.useMemo(() => {
    // Garante que o ID é um número antes de fazer contas
    const numId = parseFloat(id_filme) || 1;
    return (numId % 2 + 3.5).toFixed(1); // Gera algo entre 3.5 e 4.5
  }, [id_filme]);

  return (
    <div className="movie-card">
      <div className="movie-card-poster">
        <img 
          src={poster} 
          alt={`Pôster de ${nomeFilme}`} 
          onError={(e) => {
            // Fallback em caso de imagem quebrada
            e.target.onerror = null; 
            e.target.src = "https://placehold.co/300x450/151515/E50914?text=Poster+Indisponível";
          }}
        />
      </div>
      <div className="movie-card-info">
        <h3 className="movie-card-title">{nomeFilme}</h3>
        <div className="movie-card-meta">
          <span className="movie-card-year">{ano}</span>
          <span className="movie-card-rating">
            <i className="bi bi-star-fill"></i>
            {rating}
          </span>
        </div>
      </div>
      <Link to={`/filme/${id_filme}`} className="movie-card-button">
        Ver Mais
      </Link>
    </div>
  );
};

export default MovieCard;