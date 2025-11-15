import React, { useState, useEffect } from "react";
import MovieCard from "../../components/MovieCard/moviecard";
import FilterModal from "../../components/PopupFiltros/popupfiltros";
import "./filmes.css";

const Filmes = () => {
  const [filmes, setFilmes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showFilterModal, setShowFilterModal] = useState(false); // 2. State do Modal
  const [filters, setFilters] = useState({}); // 3. State dos Filtros
  useEffect(() => {
    const fetchFilmes = async () => {
      setLoading(true);
      setError(null);

      // Constrói a URL com filtros (APENAS A BUSCA FUNCIONA POR ENQUANTO)
      const params = new URLSearchParams();
      if (filters.busca) {
        // (Vem da página de busca, não do modal)
        params.append("busca", filters.busca);
      }
      // TODO: Lógica de filtro de Gênero/Ano/Ator no backend
      // if (filters.genero) params.append('genero', filters.genero);
      // if (filters.ano) params.append('ano', filters.ano);
      // if (filters.ator) params.append('ator', filters.ator);

      try {
        const response = await fetch(
          `http://localhost:8000/api/filmes?${params.toString()}`
        );
        const data = await response.json();
        if (response.ok) {
          setFilmes(data);
        } else {
          throw new Error(data.message || "Erro ao buscar filmes");
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchFilmes();
  }, [filters]); // 4. Roda o fetch sempre que os filtros mudarem

  const handleFilterSubmit = (newFilters) => {
    console.log("Aplicando filtros:", newFilters);
    // O backend SÓ suporta 'busca' por enquanto.
    // A lógica de Gênero/Ano/Ator está pendente.
    // setFilters(prev => ({...prev, ...newFilters}));
    alert(
      "Lógica de filtro (Gênero, Ano, Ator) ainda não implementada no backend!"
    );
  };

  if (loading) return <div className="page-status">Carregando filmes...</div>;
  if (error) return <div className="page-status error">Erro: {error}</div>;

  return (
    <div className="filmes-page-container">
      <div className="filmes-header">
        <h1>
          <i className="bi bi-film"></i>
          <span className="title-seemovie">Nossos Filmes</span>
        </h1>
        {/* 5. Botão para abrir o modal */}
        <button
          className="filter-button"
          onClick={() => setShowFilterModal(true)}
        >
          <i className="bi bi-filter"></i> Ver Filtros
        </button>
      </div>

      <div className="filmes-grid">
        {filmes.length > 0 ? (
          filmes.map((filme) => (
            <MovieCard key={filme.id_filme} filme={filme} />
          ))
        ) : (
          <p className="page-status">Nenhum filme encontrado.</p>
        )}
      </div>

      {/* 6. Renderiza o Modal */}
      <FilterModal
        isOpen={showFilterModal}
        onClose={() => setShowFilterModal(false)}
        onFilterSubmit={handleFilterSubmit}
      />
    </div>
  );
};

export default Filmes;
