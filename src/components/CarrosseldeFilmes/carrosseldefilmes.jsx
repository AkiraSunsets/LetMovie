import React, { useRef } from "react";
import './carrosseldefilmes.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import { useNavigate } from 'react-router-dom';

const CarrosselDeFilmes = ({ titulo, icone, filmes }) => {
    const listRef = useRef(null);
    const navigate = useNavigate();

    const handleScrollLeft = () => {
        if (listRef.current) {
            listRef.current.scrollBy({ left: -500, behavior: 'smooth' });
        }
    };

    const handleScrollRight = () => {
        if (listRef.current) {
            listRef.current.scrollBy({ left: 500, behavior: 'smooth' });
        }
    };

    const handleVerMais = (filmeId) => {
        navigate(`/filme/${filmeId}`);
    };

    if (!filmes || filmes.length === 0) {
        return null; 
    }

    return (
        <section className="carrossel-container" aria-label={`Seção de filmes ${titulo}`}>
            <div className="carrossel-header">
                <h2>
                    {icone && <i className={`${icone}`} style={{ color: '#c80710', marginRight: '10px' }} aria-hidden="true"></i>}
                    {titulo}
                </h2>
                <nav className="carrossel-nav"> 
                    <button onClick={handleScrollLeft} aria-label="Rolar para esquerda">
                        <i className="bi bi-chevron-left"></i>
                    </button>
                    <button onClick={handleScrollRight} aria-label="Rolar para direita">
                        <i className="bi bi-chevron-right"></i>
                    </button>
                </nav>
            </div>

            <div className="carrossel-list-container" ref={listRef}>
                <div className="carrossel-list">
                    {filmes.map((filme) => (

                        <article className="carrossel-card" key={filme.id_filme}> 
                            <img 
                                src={filme.poster} 
                                alt={filme.nomeFilme} 
                                className="carrossel-card-poster"
                                onError={(e) => { e.target.src = 'https://placehold.co/200x300/151515/c80710?text=Poster'; }}
                            />
                            <div className="carrossel-card-body">
                                <h4>{filme.nomeFilme}</h4> 
                                <div className="carrossel-card-details">
                                    <span>{filme.ano}</span> 
                                    <span>
                                        <i className="bi bi-star-fill" style={{ color: '#f5c518' }}></i>
                                        4.1 
                                    </span>
                                </div>
                                <button 
                                    className="carrossel-card-button"
                                    onClick={() => handleVerMais(filme.id_filme)}
                                >
                                    Ver Mais
                                </button>
                            </div>
                        </article>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default CarrosselDeFilmes;