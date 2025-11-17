import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import 'bootstrap-icons/font/bootstrap-icons.css';
import './busca.css';

const PaginaBusca = () => {
    const [searchParams] = useSearchParams();
    const [filmes, setFilmes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const query = searchParams.get('query');

    useEffect(() => {
        if (!query) {
            setLoading(false);
            setFilmes([]);
            return;
        }

        const fetchBusca = async () => {
            setLoading(true);
            setError(null);
            try {
                // A API de busca no server.py
                const response = await fetch(`http://localhost:8000/api/filmes?busca=${encodeURIComponent(query)}`);
                const data = await response.json();
                if (response.ok) {
                    setFilmes(data);
                } else {
                    throw new Error(data.message);
                }
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchBusca();
    }, [query]); // Re-busca sempre que a query na URL mudar

    return (
        <div className="busca-container">
            <h1>Resultados da Busca por: <span>"{query}"</span></h1>

            {loading && <p>Buscando...</p>}
            {error && <p className="busca-error">Erro: {error}</p>}

            {!loading && !error && filmes.length === 0 && (
                <p>Nenhum filme encontrado para "{query}".</p>
            )}

            {!loading && !error && filmes.length > 0 && (
                <div className="busca-grid">
                    {filmes.map(filme => (
                        <Link to={`/filme/${filme.id_filme}`} className="busca-card" key={filme.id_filme}>
                            <img 
                                src={filme.poster} 
                                alt={filme.nomeFilme} 
                                onError={(e) => {
                                    e.target.onerror = null;
                                    e.target.src = "https://placehold.co/200x300/151515/E50914?text=Indisponivel";
                                }}
                            />
                            <div className="busca-card-info">
                                <h3>{filme.nomeFilme}</h3>
                                <span>{filme.ano}</span>
                            </div>
                        </Link>
                    ))}
                </div>
            )}
        </div>
    );
};

export default PaginaBusca;