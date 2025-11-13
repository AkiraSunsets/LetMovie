import React, { useState, useEffect } from 'react';
import MovieCard from '../../components/MovieCard/moviecard';
import './filmes.css';

const Filmes = () => {
    const [filmes, setFilmes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchFilmes = async () => {
            setLoading(true);
            setError(null);
            try {
                // Rota GET /api/filmes só retorna filmes 'APROVADOS'
                const response = await fetch('http://localhost:8000/api/filmes');
                const data = await response.json();
                if (response.ok) {
                    setFilmes(data);
                } else {
                    throw new Error(data.message || 'Erro ao buscar filmes');
                }
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        fetchFilmes();
    }, []);

    if (loading) return <div className="page-status">Carregando filmes...</div>;
    if (error) return <div className="page-status error">Erro: {error}</div>;

    return (
        <div className="filmes-page-container">
            <div className="filmes-header">
                <h1>
                    <i className="bi bi-film"></i>
                    <span className='title-seemovie'
                    >Nossos Filmes
                    </span>
                </h1>
                <button className="filter-button">
                    <i className="bi bi-filter"></i> Ver Filtros
                </button>
            </div>

            <div className="filmes-grid">
                {filmes.length > 0 ? (
                    filmes.map(filme => (
                        <MovieCard key={filme.id_filme} filme={filme} />
                    ))
                ) : (
                    <p>Nenhum filme encontrado.</p>
                )}
            </div>
        </div>
    );
};

export default Filmes;