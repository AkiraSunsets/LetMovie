import React, { useState, useEffect } from "react";

import Modal from "../Modal/modal";

import "../PopupFiltros/popupfiltros.css";

// Componente de modal para filtros personalizados
const FilterModal = ({
  isOpen,
  onClose,
  onFilterSubmit,
  currentFilters = {},
}) => {
  // estados locais para os campos de formulário

  const [genero, setGenero] = useState("");
  const [ano, setAno] = useState("");
  const [ator, setAtor] = useState("");
  const [poster, setPoster] = useState("");
  const [sinopse, setSinopse] = useState("");


  // Quando o modal abre, sincroniza os estados com os filtros atuais da página
  useEffect(() => {

    if (isOpen) {
      // optional chaining e fallback pra string vazia

      setGenero(currentFilters?.genero ?? "");
      setAno(currentFilters?.ano ?? "");
      setAtor(currentFilters?.ator ?? "");
      setPoster(currentFilters?.poster ?? "");
      setSinopse(currentFilters?.sinopse ?? "");
    }
  }, [isOpen, currentFilters]);

  /* função chamada ao clicar em "Filtrar" */

  const handleFilter = () => {
    // chama onFilterSubmit apenas se for função (mais seguro)

    if (typeof onFilterSubmit === "function") {
      onFilterSubmit({ genero, ano, ator, poster, sinopse });
    } else {
      console.warn("onFilterSubmit não é uma função.");
    }

    onClose(); // fecha o modal
  };

  // função chamada ao clicar em "Cancelar"

  const handleCancel = () => {
    onClose();
  };

  // controle do submit para evitar reload e centralizar lógica

  const handleSubmit = (e) => {
    e.preventDefault();

    handleFilter();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <form className="filter-modal-content" onSubmit={handleSubmit}>
        <h2>Filtre seus filmes de forma personalizada!</h2>

        {/* Campo genero */}

        <div className="filter-form-group">
          <label htmlFor="genero">Gênero:</label>

          <input
            type="text"
            id="genero"
            placeholder="Digite o gênero que deseja pesquisar"
            value={genero}
            onChange={(e) => setGenero(e.target.value)}
          />
        </div>

        {/* Formato para que ano e ator fiquem lado a lado */}

        <div className="filter-form-row">
          <div className="filter-form-group">
            <label htmlFor="ano">Ano:</label>

            <input
              type="number"
              id="ano"
              placeholder="Digite o ano de lançamento do filme"
              value={ano}
              onChange={(e) => setAno(e.target.value)}
            />
          </div>

          <div className="filter-form-group">
            <label htmlFor="ator">Ator:</label>

            <input
              type="text"
              id="ator"
              placeholder="Digite o nome do ator que deseja pesquisar"
              value={ator}
              onChange={(e) => setAtor(e.target.value)}
            />
          </div>
        </div>

        {/* Campo poster */}
        <div className="filter-form-group">
          <label htmlFor="poster">Pôster:</label>

          <input
            type="url"
            id="poster"
            placeholder="Digite a URL do pôster que deseja pesquisar"
            value={poster}
            onChange={(e) => setPoster(e.target.value)}
          />
        </div>

        <div className="filter-form-group">
          <label htmlFor="sinopse">Sinopse:</label>

          <textarea
            id="sinopse"
            placeholder="Digite a sinopse que deseja pesquisar"
            value={sinopse}
            onChange={(e) => setSinopse(e.target.value)}
          />
        </div>

        {/* botões de ação do modal */}
        <div className="filter-modal-actions">
          <button
            type="button"
            className="filter-button cancel"
            onClick={handleCancel}
          >
            Cancelar
          </button>

          {/* submit sem onClick redundante */}
          <button type="submit" className="filter-button confirm">
            Filtrar
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default FilterModal;
