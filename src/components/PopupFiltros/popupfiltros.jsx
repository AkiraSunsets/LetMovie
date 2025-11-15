import React, { useState } from 'react';
import Modal from '../Modal/Modal';
import '../PopupFiltros/popupfiltros.css';

const FilterModal = ({ isOpen, onClose, onFilterSubmit }) => {
  const [genero, setGenero] = useState("");
  const [ano, setAno] = useState("");
  const [ator, setAtor] = useState("");

  const handleFilter = () => {
    onFilterSubmit({ genero, ano, ator });
    onClose();
  };

  const handleClear = () => {
    setGenero("");
    setAno("");
    setAtor("");
    onFilterSubmit({}); // Limpa os filtros
    onClose();
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="filter-modal-content">
        <h2>Filtre seus filmes!</h2>
        
        <div className="filter-form-group">
          <label htmlFor="genero">Gênero:</label>
          <input 
            type="text" 
            id="genero"
            placeholder="Digite o gênero (Ex: Ação)" 
            value={genero}
            onChange={(e) => setGenero(e.target.value)}
          />
        </div>

        <div className="filter-form-group">
          <label htmlFor="ano">Ano:</label>
          <input 
            type="text" 
            id="ano"
            placeholder="Digite o ano de lançamento (Ex: 2020)" 
            value={ano}
            onChange={(e) => setAno(e.target.value)}
          />
        </div>

        <div className="filter-form-group">
          <label htmlFor="ator">Ator:</label>
          <input 
            type="text" 
            id="ator"
            placeholder="Digite o nome do ator" 
            value={ator}
            onChange={(e) => setAtor(e.target.value)}
          />
        </div>

        <div className="filter-modal-actions">
          <button className="filter-button cancel" onClick={handleClear}>
            Limpar
          </button>
          <button className="filter-button confirm" onClick={handleFilter}>
            Filtrar
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default FilterModal;