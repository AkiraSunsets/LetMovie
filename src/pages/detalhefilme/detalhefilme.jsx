import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import "./detalhefilme.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import { useAuth } from "../../context/authcontext";

// Modal de confirmação
const ConfirmModal = ({ show, onClose, onConfirm, title, message }) => {
  if (!show) return null;  // Se show=false, não renderiza nada
  return (
    <div className="modal-overlay" onClick={onClose}>  {/* Overlay do modal que fecha ao clicar fora */}
      <div className="modal-content" onClick={(e) => e.stopPropagation()}> {/* Conteúdo do modal, evita que o clique feche o modal */}
        <h2 style={{marginTop: 0}}>{title}</h2>
        <p>{message}</p>
        <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>  {/* Botões Cancelar e Confirmar */}
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


// componente detalhe filme
const DetalheFilme = () => {
  const { id } = useParams(); //pega o id do filme da url
  const navigate = useNavigate(); //navegação programática
  const [filme, setFilme] = useState(null); //armazena os dados dos filmes
  const [loading, setLoading] = useState(true); //estado de carregamento 
  const [error, setError] = useState(null); //estado de erro
  const [showConfirmModal, setShowConfirmModal] = useState(false); // modal de confirmação
  const [toastMessage, setToastMessage] = useState(null); // State para alerts

  const { userRole } = useAuth(); //pega se é usuario comum ou admin

  // Função para mostrar toasts
  const showToast = (message, type = 'error') => {
    setToastMessage({ text: message, type });
    setTimeout(() => {
      setToastMessage(null); //remove a mensagem depois de 3s
    }, 3000);
  };

  //fetch do filme
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
  }, [id]); //sempre que o id mudar, refaz a busca

  // Abre o modal de confirmação
  const handleDeleteClick = () => {
    setShowConfirmModal(true); //abre o modal
  };

  // Ação de deletar (só roda se confirmar no modal)
  const handleConfirmDelete = async () => {
    setShowConfirmModal(false); // Fecha o modal

    try {
      const body = new URLSearchParams();
      body.append("id", id);
      // Envia o userRole para o backend checar a permissão
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
        navigate("/filmes"); //redireciona para a lista
      } else {
        throw new Error(data.message || "Erro ao deletar o filme");
      }
    } catch (err) {
      console.error(err);
      showToast(`Erro: ${err.message}`, "error");
    }
  };
  //estados de loading e error 
  if (loading) return <div className="detalhe-loading">Carregando...</div>;
  if (error) return <div className="detalhe-error">Erro: {error}</div>;
  if (!filme) return null; //se não houver filme, não renderiza nada

  // Nota aleatória do filme (exemplo)
  const rating = ((filme.id_filme % 20) / 10 + 3.0).toFixed(1);

  return (
    <>
      {/* Componente Toast*/}
      {toastMessage && (
        <div className={`toast-message ${toastMessage.type}`}>
          {toastMessage.text}
        </div>
      )}

      {/* Componente Modal de confirmação*/}
      <ConfirmModal
        show={showConfirmModal}
        onClose={() => setShowConfirmModal(false)}
        onConfirm={handleConfirmDelete}
        title="Confirmar Exclusão"
        message="Tem certeza que deseja deletar este filme?"
      />

    {/* container principal do detalhe */}
    <div className="detalhe-container">

      {/* poster */}
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

        {/* informações do filme */}
        <div className="detalhe-info">
          <h1 className="detalhe-title">
            {filme.nomeFilme}
            <span className="detalhe-year">({filme.ano})</span>
          </h1>

          {/* duração e estrelas */}
          <div className="detalhe-meta">
            <span>{filme.tempo_duracao} min</span>
            <span className="detalhe-rating">
              <i className="bi bi-star-fill"></i>
              {rating}
            </span>
          </div>
          
          {/* generos */}
          <div className="detalhes-generos">
            {filme.generos?.split(",").map((g) => (
              <span key={g.trim()} className="detalhe-genero-tag">
                {g.trim()}
              </span>
            ))}
          </div>

          {/* sinopse */}

          <h3 className="detalhe-subtitle">Sinopse:</h3>
          <p className="detalhe-sinopse">
            {filme.sinopse || "Nenhuma sinopse disponível."}
          </p>

          {/* elenco */}
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

          {/* botoes de acao */}
          <div className="detalhe-actions">
            {/* Botão Voltar */}
            <button
              onClick={() => navigate(-1)}
              className="detalhe-button back"
            >
              <i className="bi bi-arrow-left-circle"></i> Voltar
            </button>

            {/*qualquer usuário pode editar */}
            <Link
              to={`/editarfilme/${filme.id_filme}`}
              className="detalhe-button edit"
            >
              <i className="bi bi-pencil-fill"></i> Editar
            </Link>

            {/* EXCLUIR – restrito ao admin */}
            {userRole === "admin" && (
              <button
                onClick={handleDeleteClick} //abrir o modal
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