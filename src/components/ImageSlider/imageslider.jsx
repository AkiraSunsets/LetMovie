import React, { useState, useEffect } from "react"; // 1. IMPORTE O useEffect
import '../ImageSlider/imageslider.css'; 

//dados do slide 
const slidesData = [
{
    image: new URL('../../assets/images/ComoEuEraAntesDeVoce.svg', import.meta.url).href,
    title: "Como eu era antes de você",
    description: "Descrição do primeiro slide aqui..." 
  },
  {
    image: new URL('../../assets/images/ComoEuEraAntesDeVoce.svg', import.meta.url).href, 
    title: "Outro Título de Filme", 
    description: "Descrição do segundo slide..." 
  },
  {
    image: new URL('../../assets/images/ComoEuEraAntesDeVoce.svg', import.meta.url).href, 
    title: "Outro Título de Filme", 
    description: "Descrição do segundo slide..." 
  },
  {
    image: new URL('../../assets/images/ComoEuEraAntesDeVoce.svg', import.meta.url).href, 
    title: "Outro Título de Filme", 
    description: "Descrição do segundo slide..." 
  },
];

const ImageSlider = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const goToSlide = (index) => {
    setCurrentIndex(index);
  };

  useEffect(() => {

    // Define o tempo em milissegundos (ex: 3000ms = 3 segundos)
    const autoplayDelay = 3000;

    // Cria um intervalo
    const intervalId = setInterval(() => {
      // Atualiza o índice (currentIndex) e usa a forma funcional para garantir que temos sempre o valor anterior correto
      setCurrentIndex((prevIndex) => 
        (prevIndex + 1) % slidesData.length // O '%' faz o carrossel voltar ao início (loop)
      );
    }, autoplayDelay);

    //Limpa o intervalo
    return () => clearInterval(intervalId);

  }, []); 


  return (
    <div className="slider-container">
      {/* Parte que se move */}
      <div
        className="slider-carrossel"
        style={{ transform: `translateX(-${currentIndex * 100}%)` }}
      >
        {slidesData.map((slide, index) => (
          <div className="slide" key={index}>
            <img src={slide.image} alt={slide.title} className="slide-image" />
            <div className="slide-content">
              <h2>{slide.title}</h2>
              <p>{slide.description}</p> 
              <button className="slide-button">Ver Informações</button>
          </div>
          </div>
        ))}
      </div>

      {/* Bolinhas de navegação */}
      <div className="pagination-dots">
        {slidesData.map((_, index) => (
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