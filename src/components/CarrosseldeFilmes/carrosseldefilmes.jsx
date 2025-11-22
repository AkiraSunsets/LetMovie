import React, { useRef } from "react";
import './carrosseldefilmes.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import { useNavigate } from 'react-router-dom';

//Componente de carrossel de filmes
const CarrosselDeFilmes = ({ titulo, icone, filmes }) => {
    const listRef = useRef(null); // referencia q controla a rolagem horizontal
    const navigate = useNavigate(); 

    //função para rolar para a esquerda 
    const handleScrollLeft = () => {
        if (listRef.current) {
            listRef.current.scrollBy({ left: -500, behavior: 'smooth' });
        }
    };

    //função para rolar a direita 
    const handleScrollRight = () => {
        if (listRef.current) {
            listRef.current.scrollBy({ left: 500, behavior: 'smooth' });
        }
    };

    //navega para a página de detalhes do filme 
    const handleVerMais = (filmeId) => {
        navigate(`/filme/${filmeId}`);
    };

    //evita renderizar carrossel vazio
    if (!filmes || filmes.length === 0) {
        return null; 
    }

    return (
        <section className="carrossel-container" aria-label={`Seção de filmes ${titulo}`}>
            <header className="carrossel-header">
                <h2>
                    {icone && <i className={`${icone}`} style={{ color: '#c80710', marginRight: '10px' }} aria-hidden="true"></i>}
                    {titulo}
                </h2>

                {/* controles de navegação */}
                <nav className="carrossel-nav"> 
                    <button onClick={handleScrollLeft} aria-label="Rolar para esquerda">
                        <i className="bi bi-chevron-left"></i>
                    </button>
                    <button onClick={handleScrollRight} aria-label="Rolar para direita">
                        <i className="bi bi-chevron-right"></i>
                    </button>
                </nav>
            </header>

            {/* container de lista rolável */}
            <div className="carrossel-list-container" ref={listRef}>
                <div className="carrossel-list" role="list">
                    {filmes.map((filme) => (

                        <article className="carrossel-card" role="listitem" key={filme.id_filme}> 
                            <img 
                                src={filme.poster} 
                                alt={filme.nomeFilme} 
                                className="carrossel-card-poster"
                                onError={(e) => { e.target.src = 'https://placehold.co/200x300/151515/c80710?text=Poster'; }}
                            />
                            <div className="carrossel-card-body">
                                <h4>{filme.nomeFilme}</h4> 
                                <footer className="carrossel-card-details">
                                    <span>{filme.ano}</span> 
                                    <span>
                                        <i className="bi bi-star-fill" style={{ color: '#f5c518' }}></i>
                                        4.1 
                                    </span>
                                </footer>
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