import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./home.css"; 
import Button from "../../components/Button/button";
import ImageSlider from "../../components/ImageSlider/imageslider"; 
import CarrosselDeFilmes from "../../components/CarrosseldeFilmes/carrosseldefilmes"; 
import GenreCarousel from "../../components/Generos/generos"; 

const Home = () => {
  const [generos, setGeneros] = useState([]);
  const [filmesPopulares, setFilmesPopulares] = useState([]);
  const [filmesRecentes, setFilmesRecentes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchHomeData = async () => {
      try {
        setLoading(true);
        // Busca os dados da rota /api/home
        const response = await fetch("http://localhost:8000/api/home");
        if (!response.ok) {
          throw new Error(`Falha ao buscar dados: ${response.statusText}`);
        }
        const data = await response.json();

        // Armazena os dados reais nos states
        setGeneros(data.generos || []);
        setFilmesPopulares(data.filmes_populares || []);
        setFilmesRecentes(data.filmes_recentes || []);
        setError(null);
      } catch (err) {
        setError(err.message); 
        console.error("Erro em fetchHomeData:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchHomeData();
  }, []); // Roda apenas uma vez

  // Se estiver carregando
  if (loading) {
    return <div className="home-status-message">Carregando...</div>;
  }

  // Se der erro
  if (error) {
    return (
        <div className="home-status-message error">
            <strong>Error: {error}</strong>
            <p>Não foi possível conectar ao servidor. Verifique se o `server.py` está rodando.</p>
        </div>
    );
  }

  // Página completa
  return (
    <div className="home-page-container">
      {/* ===== Seção do Banner "Welcome" ===== */}
      <section className="home-banner">
        <div className="home-banner-content">
          <h1>
            Welcome to Let<span className="logo-movie-span">Movie</span>
          </h1>
          <p>
            Gerencie sua coleção de filmes com estilo. Adicione, edite e descubra
            novos títulos com a interface elegante do LetMovie.
          </p>
          <div className="button-group">
            <Button
              buttonText="Adicionar Filme"
              to="/adicionarfilmes"
              variant="primary"
            />
            <Button 
              buttonText="Ver Filmes" 
              to="/filmes" 
              variant="secondary" 
            />
          </div>
        </div>
      </section>

      {/* ===== Carrossel de Gêneros ===== */}
      <GenreCarousel generos={generos} />

      {/* ===== Carrossel "Mais Populares"  ===== */}
      <CarrosselDeFilmes
        titulo="Mais Populares"
        icone="bi bi-fire" 
        filmes={filmesPopulares}
      />

      {/* ===== Slider ===== */}
      <section className="home-slider-section">
        {/* Passa os 5 primeiros filmes recentes para o slider */}
        <ImageSlider slides={filmesRecentes.slice(0, 5)} /> 
      </section>

      {/* ===== Carrossel "Mais Recentes"  ===== */}
      <CarrosselDeFilmes
        titulo="Mais Recentes"
        icone="bi bi-clock-history"
        filmes={filmesRecentes}
      />
    </div>
  );
};

export default Home;