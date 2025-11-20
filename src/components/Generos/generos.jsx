import React, { useRef } from "react";
import { Link } from "react-router-dom";
import "./generos.css";
import "bootstrap-icons/font/bootstrap-icons.css";

/*prop de generos*/
const genreIcons = {
  Ação: "bi bi-lightning-charge-fill",
  Aventura: "bi bi-compass-fill",
  Comédia: "bi bi-emoji-smile-fill",
  Drama: "bi bi-mask",
  Romance: "bi bi-heart-fill",
  Animação: "bi bi-palette-fill",
  "Ficção Científica": "bi bi-broadcast-pin",
  Terror: "bi bi-bug-fill",
  Biografia: "bi bi-person-vcard-fill",
  "Comédia Romantica": "bi bi-balloon-heart-fill",
  Crime: "bi bi-fingerprint",
  Musical: "bi bi-music-note-beamed",
  Fantasia: "bi bi-stars",
  Policial: "bi bi-shield-shaded",
  Mistério: "bi bi-question-diamond-fill",
  Histórico: "bi bi-bank-fill",
  Default: "bi bi-tag-fill", // Ícone padrão
};

const GenreCarousel = ({ generos }) => {
  // Referência usada para controlar o scroll horizontal
  const scrollRef = useRef(null);

  //função que controla a lista horizontalmente, define se ela rola para a esquerda ou direita
  const scroll = (direction) => {
    if (scrollRef.current) {
      const scrollAmount = direction === "left" ? -300 : 300;
      scrollRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
    }
  };

  //evita que o carrossel renderize vazio
  if (!generos || generos.length === 0) {
    return null;
  }

  return (
    <section
      className="genre-carousel-container"
      aria-label="Filtros de Gênero"
    >
      <button
        className="genre-nav-btn left"
        onClick={() => scroll("left")}
        aria-label="Rolar gêneros para esquerda"
      >
        <i className="bi bi-chevron-left"></i>
      </button>

      <div className="genre-list" ref={scrollRef} role="list">
        {generos.map((genero) => (
          <Link
            key={genero.ID}
            to={`/filmes?genero=${encodeURIComponent(genero.Nome)}`}
            className="genre-button"
            role="listitem"
          >
            <i
              className={genreIcons[genero.Nome] || genreIcons.Default}
              aria-hidden="true"
            ></i>
            <span>{genero.Nome}</span>
          </Link>
        ))}
      </div>

      <button
        className="genre-nav-btn right"
        onClick={() => scroll("right")}
        aria-label="Rolar gêneros para direita"
      >
        <i className="bi bi-chevron-right"></i>
      </button>
    </section>
  );
};

export default GenreCarousel;
