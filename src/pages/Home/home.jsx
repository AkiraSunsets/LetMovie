import React from "react";
import { Link } from "react-router-dom";
import "./home.css";
import Button from "../../components/Button/button";
import ImageSlider from "../../components/ImageSlider/imageslider";
import CarrosselDeFilmes from "../../components/CarrosseldeFilmes/carrosseldefilmes";


const dummyData = [
  { id: 1, title: 'Alerta Vermelho', year: 2021, rating: 4.1, img: 'https://www.papodecinema.com.br/wp-content/uploads/2021/09/20210908-alerta-vermelho-papo-de-cinema-cartaz-1.webp' },
  { id: 2, title: 'Bagagem de Risco', year: 2024, rating: 3.8, img: 'https://m.media-amazon.com/images/M/MV5BMTA0MDQ3NmMtY2NmMC00MTJmLTk0MTMtZjAzZDU1OTg5ZmE3XkEyXkFqcGc@._V1_FMjpg_UX1000_.jpg' },
  { id: 3, title: 'O Projeto Adam', year: 2019, rating: 4.1, img: 'https://www.papodecinema.com.br/wp-content/uploads/2022/03/20220312-adamproject_main_payoff_vertical_27x40_rgb_pre_pt-br.webp' },
  { id: 4, title: 'Alerta Vermelho', year: 2021, rating: 4.1, img: 'https://img.elo7.com.br/product/main/3F02D64/poster-alerta-vermelho-red-notice-com-moldura-filme.jpg' },
  { id: 5, title: 'Alerta Vermelho', year: 2021, rating: 4.1, img: 'https://img.elo7.com.br/product/main/3F02D64/poster-alerta-vermelho-red-notice-com-moldura-filme.jpg' },
  { id: 6, title: 'Alerta Vermelho', year: 2021, rating: 4.1, img: 'https://img.elo7.com.br/product/main/3F02D64/poster-alerta-vermelho-red-notice-com-moldura-filme.jpg' },
  { id: 7, title: 'Alerta Vermelho', year: 2021, rating: 4.1, img: 'https://img.elo7.com.br/product/main/3F02D64/poster-alerta-vermelho-red-notice-com-moldura-filme.jpg' },
];

const Home = () => {
  return (
    <div className="home-page">
           {" "}
      <section className="home-content">
                <h1>Welcome to LetMovie</h1>               {" "}
        <p>
          Gerencie sua coleção de filmes com estilo. Adicione, edite e descubra
          novos títulos com a interface elegante do LetMovie.
        </p>
                        {/*botões coloridos*/}       {" "}
        <div className="button-group">
                 {" "}
          <Button
            buttonText="Adicionar Filmes"
            to="/adicionarfilmes"
            variant="primary"
          />
                 {" "}
          <Button buttonText="Ver Filmes" to="/filmes" variant="secondary" />   
             {" "}
        </div>
             {" "}
      </section>

      <section>
         <CarrosselDeFilmes
        
                  titulo="Filmes Populares"
                  icone="bi bi-film"
                  filmes={dummyData}
                />
      </section>
      
      <section className="home-slider-section">
                <ImageSlider />     {" "}
      </section>
         
    </div>
  );
};

export default Home;
