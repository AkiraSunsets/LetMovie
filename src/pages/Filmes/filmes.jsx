import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import MovieCard from '../../components/MovieCard/MovieCard';
import FilterModal from '../../components/PopupFiltros/popupfiltros';
import './filmes.css';
import 'bootstrap-icons/font/bootstrap-icons.css';

function useQuery() {
    return new URLSearchParams(useLocation().search);
}

const Filmes = () => {
    const [filmes, setFilmes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showFilterModal, setShowFilterModal] = useState(false);
    
    const query = useQuery();
    
    // State de filtros com os 5 campos
    const [filters, setFilters] = useState(() => {
        const generoFromUrl = query.get('genero');
        return {
            genero: generoFromUrl || '',
            ano: '',
            ator: '',
            poster: '', // NOVO
            sinopse: '' // NOVO
        };
    });

    useEffect(() => {
        const fetchFilmes = async () => {
            setLoading(true);
            setError(null);
            
            const params = new URLSearchParams();
            
            // Adiciona todos os 5 filtros se eles existirem
            if (filters.genero) params.append('genero', filters.genero);
            if (filters.ano) params.append('ano', filters.ano);
            if (filters.ator) params.append('ator', filters.ator);
            if (filters.poster) params.append('poster', filters.poster); // NOVO
            if (filters.sinopse) params.append('sinopse', filters.sinopse); // NOVO

            try {
                // Envia os 5 filtros para o backend
                const response = await fetch(`http://localhost:8000/api/filmes?${params.toString()}`);
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
    }, [filters]); 

    const handleFilterSubmit = (newFilters) => {
      console.log("Aplicando filtros:", newFilters);
      setFilters(newFilters);
    };

    // Limpa todos os 5 filtros
    const handleClearFilters = () => {
        setFilters({ genero: '', ano: '', ator: '', poster: '', sinopse: '' });
    };

    if (loading) return <div className="page-status">Carregando filmes...</div>;
    if (error) return <div className="page-status error">Erro: {error}</div>;

    // Verifica se algum dos 5 filtros está ativo
    const hasActiveFilters = filters.genero || filters.ano || filters.ator || filters.poster || filters.sinopse;

    return (
        <div className="filmes-page-container">
            <div className="filmes-header">
                <h1>
                    <i className="bi bi-film"></i>
                    <span className='title-seemovie'>Nossos Filmes</span>
                </h1>
                <button 
                  className="filter-button" 
                  onClick={() => setShowFilterModal(true)}
                >
                    <i className="bi bi-filter"></i> Ver Filtros
                </button>
            </div>
            
            {/* Exibe todos os 5 filtros ativos */}
            {hasActiveFilters && (
                <div className="active-filters">
                    <span>Filtros ativos: </span>
                    {filters.genero && <span className="filter-tag">Gênero: {filters.genero}</span>}
                    {filters.ano && <span className="filter-tag">Ano: {filters.ano}</span>}
                    {filters.ator && <span className="filter-tag">Ator: {filters.ator}</span>}
                    {filters.poster && <span className="filter-tag">Pôster: {filters.poster}</span>}
                    {filters.sinopse && <span className="filter-tag">Sinopse: {filters.sinopse}</span>}
                    <button className="clear-filters-btn" onClick={handleClearFilters}>
                        Limpar filtros
                    </button>
                </div>
            )}

            <div className="filmes-grid">
              {filmes.length > 0 ? (
                    filmes.map(filme => (
                        <MovieCard key={filme.id_filme} filme={filme} />
                    ))
                ) : (
                    <p className="page-status">Nenhum filme encontrado para estes filtros.</p>
                )}
            </div>

            <FilterModal 
              isOpen={showFilterModal}
              onClose={() => setShowFilterModal(false)}
              onFilterSubmit={handleFilterSubmit}
              currentFilters={filters} // Passa os filtros atuais para o modal
            />
        </div>
    );
};

export default Filmes;