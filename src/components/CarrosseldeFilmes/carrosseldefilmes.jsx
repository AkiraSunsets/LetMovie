import React, { useRef } from "react";
import './carrosseldefilmes.css';
import 'bootstrap-icons/font/bootstrap-icons.css';

const CarrosselDeFilmes = ({ titulo, icone, filmes }) => {
    const listRef = useRef(null); {/* cria a lista de referência */ }

    {/* controlar o scroll */ }
    const handleScrollLeft = () => {

        if (listRef.current) {
            listRef.current.scrollBy({
                left: -500, //lógica para rolar a tela para a esquerda 
                behavior: 'smooth' //passagem suave 
            });
        }
    };

    const handleScrollRight = () => {
        if (listRef.current) {
            listRef.current.scrollBy({
                left: 500, //lógica para rolar a tela para direita
                behavior: 'smooth' //passagem suave
            });
        }
    };

    return (
        <div className="carrossel-container">

            {/* Cabeçalho */}
            <div className="carrossel-header">
                <h2>
                    {icone && <i className={`${icone}`} style={{ color: '#E50914', margin: 10 }}></i>}
                    {titulo}
                </h2>

                <div className="carrrossel-nav">
                    <button onClick={handleScrollLeft} aria-label="Rolar para esquerda">
                        <i className="bi bi-chevron-left"></i>
                    </button>
                    <button onClick={handleScrollRight} aria-label="Rolar para direita">
                        <i className="bi bi-chevron-right"></i>
                    </button>
                </div>
            </div>

            <div className="carrossel-list-container" ref={listRef}>   {/* usa o reflist pra puxar a função das setas acima */}
                <div className="carrossel-list">
                    {filmes.map((movie) => (
                        <div className="carrossel-card" key={movie.id}>
                            <img src={movie.img} alt={movie.title} className="carrossel-card-poster" />
                            <div className="carrossel-card-body">
                                <h4>{movie.title}</h4>
                                <div className="carrossel-card-details">
                                    <span>{movie.year}</span>
                                    <span>
                                        <i className="bi bi-star-fill" style={{ color: '#f5c518' }}></i>
                                        {movie.rating}
                                    </span>
                                </div>
                                <button className="carrossel-card-button">Ver Mais</button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default CarrosselDeFilmes;