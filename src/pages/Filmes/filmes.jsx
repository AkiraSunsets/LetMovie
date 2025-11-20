import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import MovieCard from '../../components/MovieCard/moviecard';
import FilterModal from '../../components/PopupFiltros/popupfiltros';
import './filmes.css';
import 'bootstrap-icons/font/bootstrap-icons.css';

function useQuery() {
    return new URLSearchParams(useLocation().search);
}

const Filmes = () => {
    // States principais
    const [filmes, setFilmes] = useState([]); // lista de filmes
    const [loading, setLoading] = useState(true); // controle de loading
    const [error, setError] = useState(null); // controle de erros
    const [showFilterModal, setShowFilterModal] = useState(false); // modal de filtros

    const query = useQuery(); // captura query params da URL
    
    // State de filtros com 5 campos (genero, ano, ator, poster, sinopse)
    const [filters, setFilters] = useState(() => {
        const generoFromUrl = query.get('genero'); // verifica se o gênero veio na URL
        return {
            genero: generoFromUrl || '',
            ano: '',
            ator: '',
            poster: '', 
            sinopse: '' 
        };
    });

    // Efeito que busca filmes sempre que filtros mudam
    useEffect(() => {
        const fetchFilmes = async () => {
            setLoading(true);
            setError(null);
            
            const params = new URLSearchParams();
            
            // Adiciona cada filtro que estiver preenchido nos parâmetros da URL
            if (filters.genero) params.append('genero', filters.genero);
            if (filters.ano) params.append('ano', filters.ano);
            if (filters.ator) params.append('ator', filters.ator);
            if (filters.poster) params.append('poster', filters.poster); 
            if (filters.sinopse) params.append('sinopse', filters.sinopse); 

            try {
                // Envia os 5 filtros para o backend
                const response = await fetch(`http://localhost:8000/api/filmes?${params.toString()}`);
                const data = await response.json();
                
                if (response.ok) {
                    setFilmes(data); // popula lista de filmes
                } else {
                    throw new Error(data.message || 'Erro ao buscar filmes'); // captura erro do backend
                }
            } catch (err) {
                setError(err.message); // seta erro
            } finally {
                setLoading(false);  // termina loading
            }
        };
        
        fetchFilmes();
    }, [filters]);  // roda sempre que filters mudar

    // Função chamada quando filtros são aplicados no modal
    const handleFilterSubmit = (newFilters) => {
      console.log("Aplicando filtros:", newFilters);
      setFilters(newFilters);
    };

    // Limpa todos os filtros
    const handleClearFilters = () => {
        setFilters({ genero: '', ano: '', ator: '', poster: '', sinopse: '' });
    };

    // Renderiza status de carregamento ou erro
    if (loading) return <div className="page-status">Carregando filmes...</div>;
    if (error) return <div className="page-status error">Erro: {error}</div>;

    // Verifica se algum dos 5 filtros está ativo
    const hasActiveFilters = filters.genero || filters.ano || filters.ator || filters.poster || filters.sinopse;

    return (
        <section className="filmes-page-container">
            
            <header className="filmes-header">
                <h1>
                    <i className="bi bi-film" aria-hidden="true"></i>
                    <span className='title-seemovie'>Nossos Filmes</span>
                </h1>
                <button 
                  className="filter-button" 
                  onClick={() => setShowFilterModal(true)}
                  aria-haspopup="dialog"
                >
                    <i className="bi bi-filter" aria-hidden="true"></i> Ver Filtros
                </button>
            </header>
            
             {/* Exibe filtros ativos */}
            {hasActiveFilters && (
                <div className="active-filters" role='status'>
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

            <section className="filmes-grid" aria-label='Lista de filmes'>
              {filmes.length > 0 ? (
                    filmes.map(filme => (
                        <MovieCard key={filme.id_filme} filme={filme} />
                    ))
                ) : (
                    <p className="page-status">Nenhum filme encontrado para estes filtros.</p>
                )}
            </section>

            <FilterModal 
              isOpen={showFilterModal}
              onClose={() => setShowFilterModal(false)}
              onFilterSubmit={handleFilterSubmit}
              currentFilters={filters} // Passa os filtros atuais para o modal
            />
        </section>
    );
};

export default Filmes;