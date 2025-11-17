import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import 'bootstrap-icons/font/bootstrap-icons.css';
import './busca.css';

const PaginaBusca = () => {
    const [searchParams] = useSearchParams(); //puxa os parametros da URL
    const [filmes, setFilmes] = useState([]); // estado para armazenar filmes retornados
    const [loading, setLoading] = useState(true); //estado para mostrar loading
    const [error, setError] = useState(null); //esrado para erros
    const query = searchParams.get('query'); //pega o valor da query da URL

    //dispara toda vez que a query muda
    useEffect(() => {
        if (!query) { //se não houver query
            setLoading(false); //para o loading
            setFilmes([]); //limpa a lista de filmes
            return;
        }

        const fetchBusca = async () => {
            setLoading(true); //inicia loading
            setError(null); //limpa o erro
            try {
                // Faz a requisição para o backend, passando a query
                const response = await fetch(`http://localhost:8000/api/filmes?busca=${encodeURIComponent(query)}`);
                const data = await response.json();
                if (response.ok) {
                    setFilmes(data); // atualiza os filmes com resultados
                } else {
                    throw new Error(data.message); //lança erro se a resposta não estive ok
                }
            } catch (err) {
                setError(err.message); //atualiza o estado de erro
            } finally {
                setLoading(false); //finaliza loading
            }
        };

        fetchBusca(); //executa a função
    }, [query]); // Re-busca sempre que a query na URL mudar

    return (
        <div className="busca-container"> 
            <h1>Resultados da Busca por: 
                <span>"{query}"</span>
                </h1> {/* Título com destaque para a query */}

            {/* Mensagem de carregamento */}
            {loading && <p>Buscando...</p>}
            {error && <p className="busca-error">Erro: {error}</p>}

            {/* Caso não encontre filmes */}
            {!loading && !error && filmes.length === 0 && (
                <p>Nenhum filme encontrado para "{query}".</p>
            )}

            {/* Lista de filmes encontrados */}
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

                            {/* Informações do filme */}
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