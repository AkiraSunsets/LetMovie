import React, { useRef } from "react";
import './carrosseldefilmes.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import { useNavigate } from 'react-router-dom'; // Importar o useNavigate

const CarrosselDeFilmes = ({ titulo, icone, filmes }) => {
    const listRef = useRef(null);
    const navigate = useNavigate(); // Hook para navegação

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

    // Função para o botão "Ver Mais"
    const handleVerMais = (filmeId) => {
        navigate(`/filme/${filmeId}`);
    };

    // Se não houver filmes, não mostra nada
    if (!filmes || filmes.length === 0) {
        return null; 
    }

    return (
        <div className="carrossel-container">
            <div className="carrossel-header">
                <h2>
                    {/* Corrigido para a cor vermelha e espaçamento */}
                    {icone && <i className={`${icone}`} style={{ color: '#c80710', marginRight: '10px' }}></i>}
                    {titulo}
                </h2>
                <div className="carrossel-nav">
                    <button onClick={handleScrollLeft} aria-label="Rolar para esquerda">
                        <i className="bi bi-chevron-left"></i>
                    </button>
                    <button onClick={handleScrollRight} aria-label="Rolar para direita">
                        <i className="bi bi-chevron-right"></i>
                    </button>
                </div>
            </div>

            <div className="carrossel-list-container" ref={listRef}>
                <div className="carrossel-list">
                    {/* 1. Mapeia os 'filmes' recebidos como prop */}
                    {filmes.map((filme) => (
                        <div className="carrossel-card" key={filme.id_filme}> {/* 2. USA 'id_filme' */}
                            <img 
                                src={filme.poster} // 3. USA 'poster'
                                alt={filme.nomeFilme} // 4. USA 'nomeFilme'
                                className="carrossel-card-poster"
                                // Fallback para imagem quebrada
                                onError={(e) => { e.target.src = 'https://placehold.co/200x300/151515/c80710?text=Poster'; }}
                            />
                            <div className="carrossel-card-body">
                                <h4>{filme.nomeFilme}</h4> {/* 5. USA 'nomeFilme' */}
                                <div className="carrossel-card-details">
                                    <span>{filme.ano}</span> {/* 6. USA 'ano' */}
                                    <span>
                                        <i className="bi bi-star-fill" style={{ color: '#f5c518' }}></i>
                                        4.1 {/* 7. Rating fixo (como no mockup) */}
                                    </span>
                                </div>
                                {/* 8. Adiciona onClick para navegar */}
                                <button 
                                    className="carrossel-card-button"
                                    onClick={() => handleVerMais(filme.id_filme)}
                                >
                                    Ver Mais
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default CarrosselDeFilmes;