import React, { useState, useEffect } from 'react';
import MovieCard from '../MovieCard/MovieCard';
import '../../pages/Filmes/filmes.css'; // Reusa o CSS

/*
  Este é um componente simples para buscar filmes da API
  e mostrar na Home, como no seu mockup.
  Você pode envolvê-lo no seu "CarouselWrapper".
*/
const FilmesDestaque = ({ title }) => {
    const [filmes, setFilmes] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchFilmes = async () => {
            setLoading(true);
            try {
                // Pega só filmes APROVADOS
                const response = await fetch('http://localhost:8000/api/filmes');
                const data = await response.json();
                if (response.ok) {
                    // Pega só os 6 primeiros para o carrossel
                    setFilmes(data.slice(0, 6)); 
                } else {
                    console.error("Erro ao buscar filmes:", data.message);
                }
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchFilmes();
    }, []);

    if (loading) {
        return <div className="page-status">Carregando {title}...</div>;
    }

    return (
        <div className="filmes-page-container" style={{margin: "0 auto 2rem auto"}}>
            <div className="filmes-header">
                {/* Você pode estilizar isso como no seu mockup `image_4935d9.jpg` */}
                <h1 style={{fontSize: '1.8rem'}}>{title}</h1>
            </div>
            
            <div className="filmes-grid">
                {filmes.map(filme => (
                    <MovieCard key={filme.id_filme} filme={filme} />
                ))}
            </div>
        </div>
    );
};

export default FilmesDestaque;