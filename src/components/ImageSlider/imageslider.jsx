import React, { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import '../ImageSlider/imageslider.css'; 

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
    <div className="slider-container">
      <div
        className="slider-carrossel"
        style={{ transform: `translateX(-${currentIndex * 100}%)` }}
      >
        {/* 6. Mapeia os 'slides' (filmes) recebidos como prop */}
        {slides.map((slide, index) => (
          <div className="slide" key={slide.id_filme}> {/* 7. Usa 'id_filme' */}
            <img 
                src={slide.poster} // 8. Usa 'poster'
                alt={slide.nomeFilme} // 9. Usa 'nomeFilme'
                className="slide-image"
                onError={(e) => { e.target.src = 'https://placehold.co/1200x500/151515/c80710?text=Poster'; }}
            />
            <div className="slide-content">
              <h2>{slide.nomeFilme}</h2> {/* 10. Usa 'nomeFilme' */}
              {/* 11. Usa 'sinopse', truncada para não ficar muito grande */}
              <p>{slide.sinopse ? `${slide.sinopse.substring(0, 150)}...` : ''}</p> 
              <button 
                className="slide-button"
                onClick={() => handleVerMais(slide.id_filme)} // 12. Adiciona onClick
              >
                Ver Informações
              </button>
            </div>
          </div>
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
    </div>
  );
};

export default ImageSlider;