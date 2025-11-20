import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../ImageSlider/imageslider.css";

// 1. REMOVIDO O 'slidesData' FALSO
// const slidesData = [ ... ];

// 2. Componente agora recebe 'slides' (filmes) como uma prop
const ImageSlider = ({ slides = [] }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const navigate = useNavigate();

  const goToSlide = (index) => {
    setCurrentIndex(index);
  };

  const handleVerMais = (filmeId) => {
    navigate(`/filme/${filmeId}`);
  };

  // Autoplay
  useEffect(() => {
    // 3. Só roda o autoplay se tiver slides
    if (slides.length === 0) return;

    const autoplayDelay = 4000; // 4 segundos
    const intervalId = setInterval(() => {
      // 4. Usa o 'slides.length' real
      setCurrentIndex((prevIndex) => (prevIndex + 1) % slides.length);
    }, autoplayDelay);

    // Limpa o intervalo quando o componente é desmontado
    return () => clearInterval(intervalId);
  }, [slides.length]); // Recomeça se o número de slides mudar

  // 5. Se não houver slides, não mostra nada
  if (slides.length === 0) {
    return null;
  }

  return (
    <section className="slider-container" aria-label="Destaques">
      <div
        className="slider-carrossel"
        style={{ transform: `translateX(-${currentIndex * 100}%)` }}
      >
        {slides.map((slide, index) => (

          <article className="slide" key={slide.id_filme}>
            <img
              src={slide.poster}
              alt={`Destaque: ${slide.nomeFilme}`}
              className="slide-image"
              onError={(e) => {
                e.target.src =
                  "https://placehold.co/1200x500/151515/c80710?text=Poster";
              }}
            />
            <div className="slide-content">
              <h2>{slide.nomeFilme}</h2>
              <p>
                {slide.sinopse ? `${slide.sinopse.substring(0, 150)}...` : ""}
              </p>
              <button
                className="slide-button"
                onClick={() => handleVerMais(slide.id_filme)}
              >
                Ver Informações
              </button>
            </div>
          </article>
        ))}
      </div>

      <div className="pagination-dots">
        {/* 13. Mapeia os 'slides' reais para os pontinhos */}
        {slides.map((_, index) => (
          <div
            key={index}
            className={`dot ${currentIndex === index ? "active" : ""}`}
            onClick={() => goToSlide(index)}
          ></div>
        ))}
      </div>
    </section>
  );
};

export default ImageSlider;
