import React from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import "./detalhefilme.css";
import "bootstrap-icons/font/bootstrap-icons.css";

const DetalheFilme = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [filme, setFilme] = React.useState(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState(null);

  const userRole = localStorage.getItem("userRole");

  useEffect(() => {
    const fetchFilme = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(`https://localhost:8000/api/filmes/${id}`);
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

  const handleDelete = async () => {
    if (!window.confirm("Tem certeza que deseja deletar este filme?")) {
      return;
    }

    try {
      const body = new URLSearchParams();
      body.append("id", id);

      const response = await fetch("https://localhost:8000/delete", {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: body.toString(),
      });

      const data = await response.json();
      if (response.ok) {
        alert("Filme deletado com sucesso!");
        navigate("/filmes");
      } else {
        throw new Error(data.message || "Erro ao deletar o filme");
      }
    } catch (err) {
      console.error(err);
      alert(`Erro: ${err.message}`);
    }
  };

  if (loading) return <div className="detalhe-loading">Carregando...</div>;
  if (error) return <div className="detalhe-error">Erro: {error}</div>;
  if (!filme) return null;

  return (
    <div className="detalhe-container">
      <div
        className="detalhe-backdrop"
        style={{ backgroundImage: `url(${filme.poster})` }}
      >
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

            <div className="detalhe-info">
              <h1 className="detalhe-title">
                {filme.nomeFilme}
                <span className="detalhe-year">({filme.ano})</span>
              </h1>

              <div className="detalhe-meta">
                <span>{filme.tempo_duracao}</span>
                <span className="detalhe-rating">
                  <i className="bi bi-star-fill"></i>
                  {filme.rating}
                </span>
              </div>
              <div className="detalhes-generos">
                {filme.generos?.split(",").map((g) => (
                  <span key={g.trim()} className="detalhe-genero-tag">
                    {g.trim()}
                  </span>
                ))}
              </div>

              <h3 className="detalhe-subtitle">Sinopse</h3>
              <p className="detalhe-sinopse">
                {filme.sinopse || "Nenhuma sinopse disponível"}
              </p>

              <div className="detalhe-crew">
                <div className="crew-item">
                  <strong>Diretor(es)</strong>
                  <span>{filme.diretores || "Não informado"}</span>
                </div>

                <div className="crew-item">
                  <strong>Produtora(s)</strong>
                  <span>{filme.produtoras || "Não informado"}</span>
                </div>

                <div className="crew-item full">
                  <strong>Elenco</strong>
                  <span>{filme.atores || "Não informado"}</span>
                </div>
              </div>

              {userRole === "admin" && (
                <div className="detalhe-admin-actions">
                  <Link
                    to={`/editarfilme/${filme.id_filme}`}
                    className="detalhe-button-edit"
                  >
                    <i className="bi bi-pencil-fill"></i> Editar Filme
                  </Link>
                  <button
                    onClick={handleDelete}
                    className="detalhe-button delete"
                  >
                    <i className="bi bi-trash-fill"></i> Excluir Filme
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DetalheFilme;
