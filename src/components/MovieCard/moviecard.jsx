import React from 'react';
import { Link } from 'react-router-dom';
import '../../components/MovieCard/moviecard.css';
import 'bootstrap-icons/font/bootstrap-icons.css'; 

/* Componente que recebe um objeto filme como prop */
const MovieCard = ({ filme }) => {

  //Quebra em partes os dados do filme
  const { id_filme, nomeFilme, ano, poster, generos, sinopse } = filme; // 1. Adicionado generos, sinopse

  //lógica para a classificação, pois a API não fornece
  const rating = React.useMemo(() => {
    const numId = parseFloat(id_filme) || 1; //garante que seja um número
    return (numId % 2 + 3.5).toFixed(1); // Gera valor entre 3.5 e 4.5
  }, [id_filme]);

  // 2. Pega o primeiro gênero da lista (ex: "Ação, Aventura" vira "Ação")
  const displayGenre = generos ? generos.split(',')[0].trim() : 'Gênero indefinido';

  return (
    <div className="movie-card"> {/* container principal do card */}

      <div className="movie-card-poster"> {/* area do poster do filme */}
        <img 
          src={poster} 
          alt={`Pôster de ${nomeFilme}`} 
          onError={(e) => {

            // Imagem reserva em caso de imagem quebrada
            e.target.onerror = null; 
            e.target.src = "https://placehold.co/300x450/151515/E50914?text=Poster+Indisponível";
          }}
        />
      </div>

      <div className="movie-card-info"> {/* Área com informações do filme */}
        <h3 className="movie-card-title">{nomeFilme}</h3> {/* Título do filme */}
        
        {/* 3. GÊNERO ADICIONADO */}
        <p className="movie-card-genre">{displayGenre}</p>

        {/* 4. SINOPSE ADICIONADA */}
        <p className="movie-card-synopsis">
          {sinopse || "Nenhuma sinopse disponível."}
        </p>

        <div className="movie-card-meta"> {/* Meta informações: ano e classificação */}
          <span className="movie-card-year">{ano}</span> {/* Ano do filme */}
          <span className="movie-card-rating">
            <i className="bi bi-star-fill"></i> {/* Ícone de estrela */}
            {rating} {/* Nota do filme */}
          </span>
        </div>
      </div>
      <Link to={`/filme/${id_filme}`} className="movie-card-button"> {/* botão para a página detalhada do filme */}
        Ver Mais 
      </Link>
    </div>
  );
};

export default MovieCard;