import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import "./detalhefilme.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import { useAuth } from "../../context/authcontext";

// Modal Simples para substituir window.confirm
const ConfirmModal = ({ show, onClose, onConfirm, title, message }) => {
  if (!show) return null;
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <h2 style={{marginTop: 0}}>{title}</h2>
        <p>{message}</p>
        <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
          <button onClick={onClose} className="detalhe-button back" style={{flex: 1}}>
            Cancelar
          </button>
          <button onClick={onConfirm} className="detalhe-button delete" style={{flex: 1}}>
            Confirmar
          </button>
        </div>
      </div>
    </div>
  );
};

const DetalheFilme = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [filme, setFilme] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false); // State para o modal
  const [toastMessage, setToastMessage] = useState(null); // State para alerts

  const { userRole } = useAuth();

  // Função para mostrar toast (substitui alert)
  const showToast = (message, type = 'error') => {
    setToastMessage({ text: message, type });
    setTimeout(() => {
      setToastMessage(null);
    }, 3000);
  };

  useEffect(() => {
    const fetchFilme = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(`http://localhost:8000/api/filme/${id}`);
        if (!response.ok) {
          throw new Error("Filme não encontrado");
        }
        const data = await response.json();
        setFilme(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchFilme();
  }, [id]);

  // Abre o modal de confirmação
  const handleDeleteClick = () => {
    setShowConfirmModal(true);
  };

  // Ação de deletar (só roda se confirmar no modal)
  const handleConfirmDelete = async () => {
    setShowConfirmModal(false); // Fecha o modal

    try {
      const body = new URLSearchParams();
      body.append("id", id);
      // NOVO: Envia o userRole para o backend checar a permissão
      body.append("userRole", userRole); 

      const response = await fetch("http://localhost:8000/delete", {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: body.toString(),
      });

      const data = await response.json();
      if (response.ok) {
        showToast("Filme deletado com sucesso!", "success");
        navigate("/filmes");
      } else {
        throw new Error(data.message || "Erro ao deletar o filme");
      }
    } catch (err) {
      console.error(err);
      showToast(`Erro: ${err.message}`, "error");
    }
  };

  if (loading) return <div className="detalhe-loading">Carregando...</div>;
  if (error) return <div className="detalhe-error">Erro: {error}</div>;
  if (!filme) return null;

  // Gera nota aleatória (pois o banco não tem)
  const rating = ((filme.id_filme % 20) / 10 + 3.0).toFixed(1);

  return (
    <>
      {/* Componente Toast para substituir alerts */}
      {toastMessage && (
        <div className={`toast-message ${toastMessage.type}`}>
          {toastMessage.text}
        </div>
      )}

      {/* Componente Modal para substituir confirm */}
      <ConfirmModal
        show={showConfirmModal}
        onClose={() => setShowConfirmModal(false)}
        onConfirm={handleConfirmDelete}
        title="Confirmar Exclusão"
        message="Tem certeza que deseja deletar este filme?"
      />

    <div className="detalhe-container">
      <div
        className="detalhe-backdrop"
        style={{ backgroundImage: `url(${filme.poster})` }}
      ></div>

      <div className="detalhe-content">
        <div className="detalhe-poster">
          <img
            src={filme.poster}
            alt={`Pôster de ${filme.nomeFilme}`}
            onError={(e) => {
              e.target.onerror = null;
              e.target.src =
                "https://placehold.co/300x450/151515/E50914?text=Imagem+Indisponivel";
            }}
          />
        </div>

        <div className="detalhe-info">
          <h1 className="detalhe-title">
            {filme.nomeFilme}
            <span className="detalhe-year">({filme.ano})</span>
          </h1>

          <div className="detalhe-meta">
            <span>{filme.tempo_duracao} min</span>
            <span className="detalhe-rating">
              <i className="bi bi-star-fill"></i>
              {rating}
            </span>
          </div>

          <div className="detalhes-generos">
            {filme.generos?.split(",").map((g) => (
              <span key={g.trim()} className="detalhe-genero-tag">
                {g.trim()}
              </span>
            ))}
          </div>

          <h3 className="detalhe-subtitle">Sinopse:</h3>
          <p className="detalhe-sinopse">
            {filme.sinopse || "Nenhuma sinopse disponível."}
          </p>

          <div className="detalhe-crew">
            <div className="crew-item">
              <strong>Diretor(es):</strong>
              <span>{filme.diretores || "Não informado"}</span>
            </div>
            <div className="crew-item">
              <strong>Produtora(s):</strong>
              <span>{filme.produtoras || "Não informado"}</span>
            </div>
            <div className="crew-item full">
              <strong>Elenco:</strong>
              <span>{filme.atores || "Não informado"}</span>
            </div>
          </div>

          <div className="detalhe-actions">
            {/* Botão Voltar */}
            <button
              onClick={() => navigate(-1)}
              className="detalhe-button back"
            >
              <i className="bi bi-arrow-left-circle"></i> Voltar
            </button>

            {/* --- CORREÇÃO AQUI --- */}
            {/* EDITAR – agora qualquer usuário pode editar */}
            <Link
              to={`/editarfilme/${filme.id_filme}`}
              className="detalhe-button edit"
            >
              <i className="bi bi-pencil-fill"></i> Editar
            </Link>

            {/* EXCLUIR – continua restrito ao admin */}
            {userRole === "admin" && (
              <button
                onClick={handleDeleteClick} // Alterado para abrir o modal
                className="detalhe-button delete"
              >
                <i className="bi bi-trash-fill"></i> Excluir
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
    </>
  );
};

export default DetalheFilme;