carrossel de filme comandado pela seta:

- movierow.jsx

import React, { useRef } from 'react';
import './MovieRow.css';
import 'bootstrap-icons/font/bootstrap-icons.css'; // (Você já deve ter isso)

// 1. Dados de exemplo (você receberia isso de uma API)
const dummyData = [
  { id: 1, title: 'Alerta Vermelho', year: 2021, rating: 4.1, img: 'https://img.elo7.com.br/product/main/3F02D64/poster-alerta-vermelho-red-notice-com-moldura-filme.jpg' },
  { id: 2, title: 'Alerta Vermelhaaa', year: 2021, rating: 4.1, img: 'https://img.elo7.com.br/product/main/3F02D64/poster-alerta-vermelho-red-notice-com-moldura-filme.jpg' },
  { id: 3, title: 'Alerta Vermelho', year: 2021, rating: 4.1, img: 'https://img.elo7.com.br/product/main/3F02D64/poster-alerta-vermelho-red-notice-com-moldura-filme.jpg' },
  { id: 4, title: 'Alerta Vermelho', year: 2021, rating: 4.1, img: 'https://img.elo7.com.br/product/main/3F02D64/poster-alerta-vermelho-red-notice-com-moldura-filme.jpg' },
  { id: 5, title: 'Alerta Vermelho', year: 2021, rating: 4.1, img: 'https://img.elo7.com.br/product/main/3F02D64/poster-alerta-vermelho-red-notice-com-moldura-filme.jpg' },
  { id: 6, title: 'Alerta Vermelho', year: 2021, rating: 4.1, img: 'https://img.elo7.com.br/product/main/3F02D64/poster-alerta-vermelho-red-notice-com-moldura-filme.jpg' },
  { id: 7, title: 'Alerta Vermelho', year: 2021, rating: 4.1, img: 'https://img.elo7.com.br/product/main/3F02D64/poster-alerta-vermelho-red-notice-com-moldura-filme.jpg' },
];

const MovieRow = () => {
  // 2. Cria a referência para a lista
  const listRef = useRef(null);

  // 3. Funções para controlar o scroll
  const handleScrollLeft = () => {
    if (listRef.current) {
      listRef.current.scrollBy({
        left: -500, // Role 500px para a esquerda
        behavior: 'smooth',
      });
    }
  };

  const handleScrollRight = () => {
    if (listRef.current) {
      listRef.current.scrollBy({
        left: 500, // Role 500px para a direita
        behavior: 'smooth',
      });
    }
  };

  return (
    <div className="movie-row-container">
      {/* --- CABEÇALHO --- */}
      <div className="movie-row-header">
        <h2 className="movie-row-title">
          <i className="bi bi-fire" style={{ color: 'var(--primary-color)' }}></i>
          Mais Populares
        </h2>
        <div className="movie-row-nav">
          <button onClick={handleScrollLeft} aria-label="Rolar para esquerda">
            <i className="bi bi-chevron-left"></i>
          </button>
          <button onClick={handleScrollRight} aria-label="Rolar para direita">
            <i className="bi bi-chevron-right"></i>
          </button>
        </div>
      </div>

      {/* --- LISTA DE FILMES (A "JANELA") --- */}
      <div className="movie-list-container" ref={listRef}>
        {/* --- A LISTA QUE SE MOVE (O "TRILHO") --- */}
        <div className="movie-list">
          {dummyData.map((movie) => (
            <div className="movie-card" key={movie.id}>
              <img src={movie.img} alt={movie.title} className="movie-card-poster" />
              <div className="movie-card-body">
                <h4>{movie.title}</h4>
                <div className="movie-card-meta">
                  <span>{movie.year}</span>
                  <span>
                    <i className="bi bi-star-fill" style={{ color: '#f5c518' }}></i>
                    {movie.rating}
                  </span>
                </div>
                <button className="movie-card-button">Ver Mais</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MovieRow;


movierow.css

/* Usando as variáveis que você definiu no seu header.css */
:root {
  --primary-color: #c80710;
  --bg-color: #151515;
  --text-color: #ffffff;
}

.movie-row-container {
  margin: 20px 0;
  padding-left: 30px; /* Alinha com o padding do seu header */
}

/* --- Cabeçalho (Título e Setas) --- */
.movie-row-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-right: 30px; /* Alinha com o padding do seu header */
  margin-bottom: 10px;
}

.movie-row-title {
  color: var(--text-color);
  font-size: 1.5rem;
  display: flex;
  align-items: center;
  gap: 10px;
  margin: 0;
}

.movie-row-nav button {
  background-color: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: var(--text-color);
  width: 36px;
  height: 36px;
  border-radius: 50%;
  cursor: pointer;
  margin-left: 10px;
  transition: background-color 0.3s;
}

.movie-row-nav button:hover {
  background-color: rgba(255, 255, 255, 0.2);
}

/* --- A "Janela" de Rolagem --- */
.movie-list-container {
  overflow-x: scroll; /* Habilita o scroll horizontal */
  overflow-y: hidden; /* Esconde o scroll vertical (se houver) */
  
  /* Esconde a barra de rolagem (funciona em Firefox) */
  scrollbar-width: none; 
  
  /* Esconde a barra de rolagem (funciona em Chrome, Safari, Edge) */
  &::-webkit-scrollbar {
    display: none; 
  }
}

/* --- O "Trilho" com os Cards --- */
.movie-list {
  display: flex;
  flex-direction: row; /* Coloca os itens lado a lado */
  gap: 15px; /* Espaço entre os cards */
  padding-bottom: 10px; /* Espaço para a sombra (se houver) */
}

/* --- Card Individual --- */
.movie-card {
  /* Impede que o card encolha */
  flex: 0 0 auto; 
  width: 200px; /* Largura fixa do card */
  background-color: #1c1c1c;
  border-radius: 8px;
  overflow: hidden;
  transition: transform 0.3s ease;
}

.movie-card:hover {
  transform: scale(1.05); /* Efeito de zoom */
  z-index: 10;
}

.movie-card-poster {
  width: 100%;
  height: 300px; /* Altura fixa para o poster */
  object-fit: cover; /* Garante que a imagem cubra o espaço */
  display: block;
}

.movie-card-body {
  padding: 15px;
  color: var(--text-color);
}

.movie-card-body h4 {
  font-size: 1.1rem;
  margin: 0 0 10px 0;
  /* Trunca o texto se for muito longo */
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.movie-card-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.9rem;
  color: #aaa;
  margin-bottom: 15px;
}

.movie-card-meta span {
  display: flex;
  align-items: center;
  gap: 5px;
}

.movie-card-button {
  width: 100%;
  padding: 10px;
  background-color: var(--primary-color);
  color: var(--text-color);
  border: none;
  border-radius: 5px;
  font-weight: bold;
  cursor: pointer;
  transition: background-color 0.3s;
}

.movie-card-button:hover {
  background-color: #e50914; /* Um tom mais claro/forte de vermelho */
}
---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
login.jsx

import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './login.css'; 

// Opcional: Se você tiver uma imagem de fundo para a página inteira
// const loginBg = new URL('../../assets/images/login-bg.jpg', import.meta.url).href;

const Login = () => {
  const [login, setLogin] = useState('');
  const [password, setPassword] = useState('');

  // Função para lidar com o envio do formulário
  const handleSubmit = (event) => {
    event.preventDefault();
    // Aqui você adicionaria sua lógica de autenticação
    console.log('Tentativa de Login com:', { login, password });
  };

  return (
    // 1. O wrapper de página inteira (para o fundo desfocado)
    <div className="login-page-wrapper"> {/* style={{ backgroundImage: `url(${loginBg})` }} */}
      
      {/* 2. O container centralizado */}
      <div className="login-container">
        
        {/* Logo (como no seu Header) */}
        <div className="login-logo-container">
          <Link to="/" className="logo-link">
            <span className="logo-let">Let</span>
            <span className="logo-movie">Movie</span>
          </Link>
        </div>

        {/* 3. Conteúdo principal com 2 colunas */}
        <div className="login-content">
          
          {/* Coluna da Esquerda (Gráfico) */}
          <div className="login-graphic-side">
            {/* Aqui você pode adicionar sua imagem SVG ou PNG da pipoca.
              Ex: <img src={new URL('../../assets/images/popcorn.svg', import.meta.url).href} alt="Pipoca e claquete" /> 
            */}
          </div>

          {/* Coluna da Direita (Formulário) */}
          <div className="login-form-side">
            <h2>Login</h2>
            <form onSubmit={handleSubmit} className="login-form">
              
              <label htmlFor="login-input">Login:</label>
              <input 
                type="text" 
                id="login-input"
                placeholder="Digite seu email ou usuário"
                value={login}
                onChange={(e) => setLogin(e.target.value)}
                required 
              />

              <label htmlFor="password-input">Password:</label>
              <input 
                type="password" 
                id="password-input"
                placeholder="Digite sua senha"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required 
              />

              <button type="submit" className="login-submit-button">
                Entrar
              </button>
            </form>

            {/* Links abaixo do formulário */}
            <div className="login-links">
              <Link to="/esqueci-senha" className="forgot-password-link">
                Esqueceu a senha?
              </Link>
              <p className="signup-text">
                Não possui uma conta? 
                <Link to="/cadastro" className="signup-link">
                  Cadastre-se
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;


login.css

/* Usando as variáveis globais que você já tem */
:root {
  --primary-color: #c80710;
  --bg-color: #151515;
  --text-color: #ffffff;
  --search-bg: #2b2b2b; /* Cor de input que já usamos */
}

/* 1. O Wrapper da Página Inteira */
.login-page-wrapper {
  min-height: 100vh;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  box-sizing: border-box;

  /* Descomente as linhas abaixo para adicionar a imagem de fundo 
    desfocada (como na sua foto) 
  */
  /*
  background-image: url('URL_DA_SUA_IMAGEM_DE_FUNDO.jpg');
  background-size: cover;
  background-position: center;
  */

  /* Se não houver imagem, usa a cor de fundo padrão */
  background-color: var(--bg-color); 
}

/* 2. O Card/Container Central */
.login-container {
  width: 100%;
  max-width: 900px; /* Largura do "card" */
  
  /* Fundo escuro com transparência */
  background-color: rgba(21, 21, 21, 0.85); 

  border-radius: 15px;
  padding: 40px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
  
  /* Efeito de vidro (desfoca o que está atrás) */
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  
  position: relative; /* Necessário para o logo */
}

/* 3. Logo (estilo pego do seu header.css) */
.login-logo-container {
  position: absolute;
  top: 40px;
  left: 40px;
}
.logo-link { 
  text-decoration: none; 
}
.logo-let { 
  color: var(--text-color); 
  font-family: "Montserrat", sans-serif; 
  font-size: 28px; 
  font-weight: bold; 
}
.logo-movie { 
  color: var(--primary-color); 
  font-family: "Montserrat", sans-serif; 
  font-size: 28px; 
  font-weight: bold; 
}

/* 4. Conteúdo (Layout de 2 colunas) */
.login-content {
  display: grid;
  grid-template-columns: 1fr 1fr;
  align-items: center;
  gap: 40px;
  
  /* Garante que o conteúdo não fique em cima do logo */
  margin-top: 50px; 
}

/* 5. Coluna da Esquerda (Gráfico) */
.login-graphic-side {
  /* Adicione sua imagem da pipoca aqui. 
    Estas linhas ajudam a centralizá-la.
  */
  display: flex;
  align-items: center;
  justify-content: center;
}
/* Estilo de exemplo para a imagem */
.login-graphic-side img {
  max-width: 100%;
  height: auto;
}

/* 6. Coluna da Direita (Formulário) */
.login-form-side {
  color: var(--text-color);
}

.login-form-side h2 {
  font-size: 2.5rem;
  font-weight: bold;
  text-align: left;
  margin-bottom: 30px;
  font-family: "Montserrat", sans-serif;
}

.login-form {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.login-form label {
  font-size: 1rem;
  font-weight: 600;
  font-family: "Montserrat", sans-serif;
  margin-bottom: -10px; /* Coloca o label mais perto do input */
}

.login-form input[type="text"],
.login-form input[type="password"] {
  background-color: var(--search-bg);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 8px;
  padding: 15px;
  color: var(--text-color);
  font-size: 1rem;
  font-family: "Montserrat", sans-serif;
  outline: none;
  transition: border-color 0.3s, box-shadow 0.3s;
}

/* Efeito ao focar no input */
.login-form input[type="text"]:focus,
.login-form input[type="password"]:focus {
  border-color: var(--primary-color);
  box-shadow: 0 0 10px rgba(200, 7, 16, 0.5);
}

.login-submit-button {
  background-color: var(--primary-color);
  color: var(--text-color);
  border: none;
  border-radius: 8px;
  padding: 15px;
  font-size: 1.1rem;
  font-weight: bold;
  font-family: "Montserrat", sans-serif;
  cursor: pointer;
  transition: background-color 0.3s;
  margin-top: 10px;
}

.login-submit-button:hover {
  background-color: #e50914; /* Tom mais forte de vermelho */
}

/* 7. Links (Esqueceu a senha? / Cadastre-se) */
.login-links {
  margin-top: 25px;
  text-align: center;
  font-family: "Montserrat", sans-serif;
}

.forgot-password-link,
.signup-link {
  color: #aaa;
  text-decoration: none;
  font-size: 0.9rem;
  transition: color 0.3s, text-decoration 0.3s;
}

.forgot-password-link:hover,
.signup-link:hover {
  color: var(--primary-color);
  text-decoration: underline;
}

.signup-text {
  color: #aaa;
  font-size: 0.9rem;
  margin-top: 15px;
}
.signup-link {
  color: var(--text-color); /* Link de cadastro tem mais destaque */
  font-weight: bold;
  margin-left: 5px;
}

---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

addfilme.jsx

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './addfilmes.css';
import 'bootstrap-icons/font/bootstrap-icons.css';

const AdicionarFilmes = () => {
  // Estados para cada campo do formulário
  const [title, setTitle] = useState('');
  const [genre, setGenre] = useState('');
  const [releaseYear, setReleaseYear] = useState('');
  const [posterUrl, setPosterUrl] = useState('');
  const [actors, setActors] = useState('');
  const [synopsis, setSynopsis] = useState('');

  const navigate = useNavigate();

  // Função para lidar com o envio
  const handleSubmit = (event) => {
    event.preventDefault();
    // Coleta os dados do formulário
    const movieData = {
      title,
      genre,
      releaseYear,
      posterUrl,
      actors,
      synopsis,
    };
    // Lógica para salvar os dados (ex: enviar para uma API)
    console.log('Filme a ser salvo:', movieData);

    // Após salvar, redireciona para a página de filmes ou home
    navigate('/filmes'); 
  };

  // Função para o botão "Cancelar"
  const handleCancel = () => {
    navigate(-1); // Navega para a página anterior
  };

  return (
    <div className="add-movie-container">
      {/* --- CABEÇALHO --- */}
      <div className="add-movie-header">
        <i className="bi bi-plus-circle-fill"></i>
        <h1>Adicionar Filme</h1>
      </div>

      {/* --- FORMULÁRIO --- */}
      <form className="add-movie-form" onSubmit={handleSubmit}>
        
        {/* Título */}
        <div className="form-group full-width">
          <label htmlFor="title">Título:</label>
          <input
            type="text"
            id="title"
            placeholder="Digite o nome do filme"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>

        {/* Gênero */}
        <div className="form-group">
          <label htmlFor="genre">Gênero:</label>
          <input
            type="text"
            id="genre"
            placeholder="Digite o gênero do filme"
            value={genre}
            onChange={(e) => setGenre(e.target.value)}
          />
        </div>

        {/* Ano de Lançamento */}
        <div className="form-group">
          <label htmlFor="releaseYear">Ano de Lançamento:</label>
          <input
            type="text"
            id="releaseYear"
            placeholder="Digite o ano de lançamento"
            value={releaseYear}
            onChange={(e) => setReleaseYear(e.target.value)}
          />
        </div>

        {/* URL do Pôster */}
        <div className="form-group full-width">
          <label htmlFor="posterUrl">URL do Pôster:</label>
          <input
            type="text"
            id="posterUrl"
            placeholder="Digite a URL do pôster"
            value={posterUrl}
            onChange={(e) => setPosterUrl(e.target.value)}
            required
          />
        </div>

        {/* Atores */}
        <div className="form-group full-width">
          <label htmlFor="actors">Atores:</label>
          <input
            type="text"
            id="actors"
            placeholder="Digite os nomes dos atores (separados por vírgula)"
            value={actors}
            onChange={(e) => setActors(e.target.value)}
          />
        </div>

        {/* Sinopse (usando textarea) */}
        <div className="form-group full-width">
          <label htmlFor="synopsis">Sinopse:</label>
          <textarea
            id="synopsis"
            placeholder="Digite a sinopse do filme"
            value={synopsis}
            onChange={(e) => setSynopsis(e.target.value)}
            rows="5"
          />
        </div>

        {/* --- BOTÕES DE AÇÃO --- */}
        <div className="form-actions">
          <button type="button" className="btn btn-secondary" onClick={handleCancel}>
            Cancelar
          </button>
          <button type="submit" className="btn btn-primary">
            Salvar
          </button>
        </div>
      </form>
    </div>
  );
};

export default AdicionarFilmes;

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './addfilmes.css';
import 'bootstrap-icons/font/bootstrap-icons.css';

const AdicionarFilmes = ({
  initialData = {},      // dados iniciais do filme (para edição)
  onSubmit,              // função para salvar
  onCancel,              // função ao clicar em cancelar
  titleText = "Adicionar Filme", // título da página
}) => {
  // Estados controlados (com dados iniciais)
  const [title, setTitle] = useState(initialData.title || '');
  const [genre, setGenre] = useState(initialData.genre || '');
  const [releaseYear, setReleaseYear] = useState(initialData.releaseYear || '');
  const [posterUrl, setPosterUrl] = useState(initialData.posterUrl || '');
  const [actors, setActors] = useState(initialData.actors || '');
  const [synopsis, setSynopsis] = useState(initialData.synopsis || '');

  const navigate = useNavigate();

  const handleSubmit = (event) => {
    event.preventDefault();
    const movieData = { title, genre, releaseYear, posterUrl, actors, synopsis };

    if (onSubmit) {
      onSubmit(movieData); // chama a função passada por props
    } else {
      console.log('Filme salvo:', movieData);
      navigate('/filmes');
    }
  };

  const handleCancel = () => {
    if (onCancel) {
      onCancel();
    } else {
      navigate(-1);
    }
  };

  return (
    <div className="add-movie-container">
      {/* --- CABEÇALHO --- */}
      <div className="add-movie-header">
        <i className="bi bi-plus-circle-fill"></i>
        <h1>{titleText}</h1>
      </div>

      {/* --- FORMULÁRIO --- */}
      <form className="add-movie-form" onSubmit={handleSubmit}>
        
        <div className="form-group full-width">
          <label htmlFor="title">Título:</label>
          <input
            type="text"
            id="title"
            placeholder="Digite o nome do filme"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="genre">Gênero:</label>
          <input
            type="text"
            id="genre"
            placeholder="Digite o gênero do filme"
            value={genre}
            onChange={(e) => setGenre(e.target.value)}
          />
        </div>

        <div className="form-group">
          <label htmlFor="releaseYear">Ano de Lançamento:</label>
          <input
            type="text"
            id="releaseYear"
            placeholder="Digite o ano de lançamento"
            value={releaseYear}
            onChange={(e) => setReleaseYear(e.target.value)}
          />
        </div>

        <div className="form-group full-width">
          <label htmlFor="posterUrl">URL do Pôster:</label>
          <input
            type="text"
            id="posterUrl"
            placeholder="Digite a URL do pôster"
            value={posterUrl}
            onChange={(e) => setPosterUrl(e.target.value)}
            required
          />
        </div>

        <div className="form-group full-width">
          <label htmlFor="actors">Atores:</label>
          <input
            type="text"
            id="actors"
            placeholder="Digite os nomes dos atores (separados por vírgula)"
            value={actors}
            onChange={(e) => setActors(e.target.value)}
          />
        </div>

        <div className="form-group full-width">
          <label htmlFor="synopsis">Sinopse:</label>
          <textarea
            id="synopsis"
            placeholder="Digite a sinopse do filme"
            value={synopsis}
            onChange={(e) => setSynopsis(e.target.value)}
            rows="5"
          />
        </div>

        {/* --- BOTÕES DE AÇÃO --- */}
        <div className="form-actions">
          <button type="button" className="btn btn-secondary" onClick={handleCancel}>
            Cancelar
          </button>
          <button type="submit" className="btn btn-primary">
            Salvar
          </button>
        </div>
      </form>
    </div>
  );
};

export default AdicionarFilmes;


<AdicionarFilmes 
  initialData={{
    title: "Inception",
    genre: "Ficção Científica",
    releaseYear: "2010",
    posterUrl: "https://...",
    actors: "Leonardo DiCaprio, Joseph Gordon-Levitt",
    synopsis: "Um ladrão invade sonhos para roubar segredos corporativos."
  }}
  titleText="Editar Filme"
  onSubmit={(dados) => console.log("Filme atualizado:", dados)}
  onCancel={() => console.log("Edição cancelada")}
/>


addfilme.css

/* Usando as variáveis de cor que já definimos */
:root {
  --primary-color: #c80710;
  --bg-color: #151515;
  --text-color: #ffffff;
  --search-bg: #2b2b2b; /* Fundo de input */
}

/* Container principal do formulário */
.add-movie-container {
  max-width: 800px;
  margin: 40px auto; /* Centraliza na página */
  padding: 40px;
  /* Cor de fundo do "card" (pode ser a mesma do body ou levemente diferente) */
  background-color: var(--bg-color); 
  border-radius: 15px;
  color: var(--text-color);
  font-family: "Montserrat", sans-serif;
}

/* Cabeçalho "Adicionar Filme" */
.add-movie-header {
  display: flex;
  align-items: center;
  gap: 15px;
  margin-bottom: 30px;
  padding-bottom: 20px;
  border-bottom: 1px solid var(--search-bg); /* Linha divisória */
}

.add-movie-header h1 {
  margin: 0;
  font-size: 2rem;
}

.add-movie-header .bi-plus-circle-fill {
  font-size: 2rem;
  color: var(--primary-color);
}

/* Layout do Formulário (usando CSS Grid) */
.add-movie-form {
  display: grid;
  /* Cria 2 colunas de tamanho igual */
  grid-template-columns: 1fr 1fr;
  /* Espaço entre as colunas e linhas */
  gap: 25px;
}

/* Grupo de Label + Input */
.form-group {
  display: flex;
  flex-direction: column;
  gap: 8px; /* Espaço entre label e input */
}

/* Modificador para fazer um item ocupar as 2 colunas */
.form-group.full-width {
  grid-column: 1 / -1; /* Ocupa da coluna 1 até a última (-1) */
}

.form-group label {
  font-size: 1rem;
  font-weight: 600;
  color: #eee; /* Um pouco mais suave que o branco total */
}

/* Estilo padrão para inputs e textarea */
.form-group input[type="text"],
.form-group textarea {
  background-color: var(--search-bg);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 8px;
  padding: 15px;
  color: var(--text-color);
  font-size: 1rem;
  font-family: "Montserrat", sans-serif;
  outline: none;
  transition: border-color 0.3s, box-shadow 0.3s;
}

.form-group input[type="text"]::placeholder,
.form-group textarea::placeholder {
  color: #777;
}

.form-group input[type="text"]:focus,
.form-group textarea:focus {
  border-color: var(--primary-color);
  box-shadow: 0 0 10px rgba(200, 7, 16, 0.5);
}

.form-group textarea {
  min-height: 120px;
  resize: vertical; /* Permite que o usuário redimensione verticalmente */
}

/* Container dos botões */
.form-actions {
  grid-column: 1 / -1; /* Ocupa as 2 colunas */
  display: flex;
  justify-content: flex-end; /* Alinha botões à direita */
  gap: 15px;
  margin-top: 20px;
}

/* --- Estilos genéricos de botão --- */
.btn {
  padding: 12px 24px;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: bold;
  font-family: "Montserrat", sans-serif;
  cursor: pointer;
  transition: all 0.3s ease;
}

/* Botão Primário (Vermelho) */
.btn.btn-primary {
  background-color: var(--primary-color);
  color: var(--text-color);
}

.btn.btn-primary:hover {
  background-color: #e50914; /* Tom mais forte de vermelho */
  transform: scale(1.02);
}

/* Botão Secundário (Escuro) */
.btn.btn-secondary {
  background-color: var(--search-bg);
  color: #ccc;
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.btn.btn-secondary:hover {
  background-color: #3a3a3a;
  color: var(--text-color);
}

---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
editarperfil.jsx

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './EditProfile.css'; 
import 'bootstrap-icons/font/bootstrap-icons.css';

// URL da imagem do avatar de exemplo
const avatarExemplo = new URL('../../assets/images/avatar-exemplo.png', import.meta.url).href; // Ajuste este caminho

const EditProfile = () => {
  // Estados para os campos do formulário
  const [nomeCompleto, setNomeCompleto] = useState('');
  const [genero, setGenero] = useState('');
  const [dataNascimento, setDataNascimento] = useState('');
  const [sobreMim, setSobreMim] = useState('');

  const navigate = useNavigate();

  // Função para salvar o perfil
  const handleSubmit = (event) => {
    event.preventDefault();
    const profileData = {
      nomeCompleto,
      genero,
      dataNascimento,
      sobreMim,
    };
    console.log('Perfil a ser salvo:', profileData);
    // Lógica para enviar dados para a API
    navigate(-1); // Volta para a página anterior após salvar
  };

  // Função para o botão "Cancelar"
  const handleCancel = () => {
    navigate(-1); // Volta para a página anterior
  };

  return (
    <div className="edit-profile-container">
      {/* --- CABEÇALHO --- */}
      <div className="edit-profile-header">
        <i className="bi bi-check-square-fill"></i>
        <h1>Editar perfil</h1>
      </div>

      {/* --- SEÇÃO DO AVATAR --- */}
      <div className="avatar-section">
        <img src={avatarExemplo} alt="Avatar" className="avatar-image" />
        <div className="avatar-actions">
          <button type="button" className="btn btn-avatar">
            Mudar foto
          </button>
          <button type="button" className="btn btn-avatar-danger">
            Apagar foto
          </button>
        </div>
      </div>

      {/* --- FORMULÁRIO --- */}
      <form className="edit-profile-form" onSubmit={handleSubmit}>
        
        {/* Nome Completo */}
        <div className="form-group full-width">
          <label htmlFor="nomeCompleto">Nome Completo:</label>
          <input
            type="text"
            id="nomeCompleto"
            placeholder="Digite seu nome completo"
            value={nomeCompleto}
            onChange={(e) => setNomeCompleto(e.target.value)}
          />
        </div>

        {/* Gênero */}
        <div className="form-group">
          <label htmlFor="genero">Gênero:</label>
          <input
            type="text"
            id="genero"
            placeholder="Digite seu gênero"
            value={genero}
            onChange={(e) => setGenero(e.target.value)}
          />
        </div>

        {/* Data de Nascimento */}
        <div className="form-group">
          <label htmlFor="dataNascimento">Data de Nascimento:</label>
          <input
            type="text" // Pode ser mudado para type="date"
            id="dataNascimento"
            placeholder="Digite sua data de nascimento"
            value={dataNascimento}
            onChange={(e) => setDataNascimento(e.target.value)}
          />
        </div>

        {/* Sobre mim */}
        <div className="form-group full-width">
          <label htmlFor="sobreMim">Sobre mim:</label>
          <textarea
            id="sobreMim"
            placeholder="Digite um pouco sobre você"
            value={sobreMim}
            onChange={(e) => setSobreMim(e.target.value)}
            rows="5"
          />
        </div>

        {/* --- BOTÕES DE AÇÃO --- */}
        <div className="form-actions">
          <button type="button" className="btn btn-secondary" onClick={handleCancel}>
            Cancelar
          </button>
          <button type="submit" className="btn btn-primary">
            Salvar
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditProfile;


editarperfil.css

/* Usando as variáveis de cor que já definimos */
:root {
  --primary-color: #c80710;
  --bg-color: #151515;
  --text-color: #ffffff;
  --search-bg: #2b2b2b; /* Fundo de input */
  --input-bg-light: #d4d4d4; /* Cor do input claro */
  --placeholder-color-light: #6b6b6b; /* Cor do placeholder claro */
}

/* Container principal do formulário */
.edit-profile-container {
  max-width: 800px;
  margin: 40px auto; /* Centraliza na página */
  padding: 40px;
  background-color: var(--bg-color); 
  border-radius: 15px;
  color: var(--text-color);
  font-family: "Montserrat", sans-serif;
}

/* Cabeçalho "Editar perfil" */
.edit-profile-header {
  display: flex;
  align-items: center;
  gap: 15px;
  margin-bottom: 30px;
}

.edit-profile-header h1 {
  margin: 0;
  font-size: 2rem;
}

.edit-profile-header .bi-check-square-fill {
  font-size: 2rem;
  color: var(--primary-color);
}

/* --- Seção do Avatar --- */
.avatar-section {
  display: flex;
  align-items: center;
  gap: 20px;
  margin-bottom: 30px;
  padding-bottom: 30px;
  border-bottom: 1px solid var(--search-bg);
}

.avatar-image {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid var(--primary-color);
}

.avatar-actions {
  display: flex;
  gap: 15px;
}

.btn.btn-avatar {
  background-color: var(--text-color);
  color: #000;
  font-weight: bold;
  border: none;
  border-radius: 20px;
  padding: 10px 20px;
  cursor: pointer;
}

.btn.btn-avatar-danger {
  background-color: var(--primary-color);
  color: var(--text-color);
  font-weight: bold;
  border: none;
  border-radius: 20px;
  padding: 10px 20px;
  cursor: pointer;
}

/* --- Layout do Formulário (Grid) --- */
.edit-profile-form {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 25px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.form-group.full-width {
  grid-column: 1 / -1;
}

.form-group label {
  font-size: 1rem;
  font-weight: 600;
  color: #eee;
}

/* Estilo dos inputs (claros, como na imagem) */
.form-group input[type="text"],
.form-group textarea {
  background-color: var(--input-bg-light); /* Fundo claro */
  border: 1px solid #b0b0b0;
  border-radius: 25px; /* Bordas bem arredondadas */
  padding: 15px 20px;
  color: #000; /* Texto escuro */
  font-size: 0.9rem;
  font-family: "Montserrat", sans-serif;
  outline: none;
  transition: border-color 0.3s, box-shadow 0.3s;
}

.form-group input[type="text"]::placeholder,
.form-group textarea::placeholder {
  color: var(--placeholder-color-light); /* Placeholder cinza */
}

.form-group input[type="text"]:focus,
.form-group textarea:focus {
  border-color: var(--primary-color);
  box-shadow: 0 0 10px rgba(200, 7, 16, 0.5);
}

.form-group textarea {
  border-radius: 15px; /* Textarea um pouco menos arredondado */
  min-height: 120px;
  resize: vertical;
}

/* Container dos botões */
.form-actions {
  grid-column: 1 / -1; 
  display: flex;
  justify-content: flex-end; 
  gap: 15px;
  margin-top: 20px;
}

/* Estilos genéricos de botão (reutilizados) */
.btn {
  padding: 12px 24px;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: bold;
  font-family: "Montserrat", sans-serif;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn.btn-primary {
  background-color: var(--primary-color);
  color: var(--text-color);
}
.btn.btn-primary:hover {
  background-color: #e50914;
}

.btn.btn-secondary {
  background-color: var(--search-bg);
  color: #ccc;
  border: 1px solid rgba(255, 255, 255, 0.2);
}
.btn.btn-secondary:hover {
  background-color: #3a3a3a;
  color: var(--text-color);
}

--------------------------
header.jsx

import React, { useState, useEffect, useRef } from "react"; // NOVO: importado useEffect e useRef
import { NavLink, Link, useNavigate } from "react-router-dom";
import "bootstrap-icons/font/bootstrap-icons.css";
import "./header.css";

const Header = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  // NOVO: Estados para controlar os menus dropdown
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchResults, setSearchResults] = useState([]); // Para os resultados da busca

  // NOVO: Refs para detectar cliques fora dos menus
  const profileMenuRef = useRef(null);
  const searchMenuRef = useRef(null);

  // NOVO: Lógica de clique fora
  useEffect(() => {
    const handleClickOutside = (event) => {
      // Fecha o menu de perfil se clicar fora
      if (profileMenuRef.current && !profileMenuRef.current.contains(event.target)) {
        setIsProfileOpen(false);
      }
      // Fecha o menu de busca se clicar fora
      if (searchMenuRef.current && !searchMenuRef.current.contains(event.target)) {
        setIsSearchOpen(false);
      }
    };

    // Adiciona o listener
    document.addEventListener("mousedown", handleClickOutside);
    
    // Limpa o listener ao desmontar o componente
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []); // O array vazio garante que isso rode apenas uma vez

  // ATUALIZADO: handleSearchChange
  const handleSearchChange = (event) => {
    const query = event.target.value;
    setSearchTerm(query);

    if (query.length > 0) {
      // Simula uma busca (substitua pela sua lógica de API)
      setSearchResults([
        { id: 1, title: `Como eu era antes de você` },
        { id: 2, title: `Busca por: ${query}` },
      ]);
      setIsSearchOpen(true);
    } else {
      setIsSearchOpen(false);
      setSearchResults([]);
    }
  };

  // ATUALIZADO: handleSearchSubmit
  const handleSearchSubmit = (event) => {
    event.preventDefault();
    if (searchTerm.trim()) {
      const encodedSearchTerm = encodeURIComponent(searchTerm.trim());
      navigate(`/busca?query=${encodedSearchTerm}`);
      setSearchTerm("");
      setIsSearchOpen(false); // Fecha o dropdown ao enviar
    }
  };

  // NOVO: Handler para o menu de perfil
  const toggleProfileMenu = () => {
    setIsProfileOpen(!isProfileOpen);
  };
  
  // NOVO: Handler de Sair (logout)
  const handleLogout = () => {
    console.log("Usuário deslogado");
    setIsProfileOpen(false);
    navigate('/login'); // Exemplo: redireciona para o login
  };

  return (
    <header className="header">
      {/* ... Logo e Navegação (sem mudanças) ... */}
      <div className="logo">
        <Link to="/" className="logo-link">
          <span className="logo-let">Let</span>
          <span className="logo-movie">Movie</span>
        </Link>
      </div>

      <nav className="nav-main">
        <ul className="nav-list">
          <li className="nav-item">
            <NavLink to="/" className={({ isActive }) => (isActive ? "active-link" : "")}>
              Home
            </NavLink>
          </li>
          <li className="nav-item">
            <NavLink to="/filmes" className={({ isActive }) => (isActive ? "active-link" : "")}>
              Filmes
            </NavLink>
          </li>
          <li className="nav-item">
            <NavLink to="/adicionarfilmes" className={({ isActive }) => (isActive ? "active-link" : "")}>
              Adicionar Filme
            </NavLink>
          </li>
          <li className="nav-item">
            <NavLink to="/sobre" className={({ isActive }) => (isActive ? "active-link" : "")}>
              Sobre
            </NavLink>
          </li>
        </ul>
      </nav>

      {/* --- Seção da Direita (Busca e Ícones) --- */}
      <div className="header-right-section">

        {/* NOVO: Wrapper para o menu de busca */}
        <div className="search-wrapper" ref={searchMenuRef}>
          <form className="search-form" onSubmit={handleSearchSubmit}>
            <input
              type="text"
              placeholder="Buscar filmes..."
              value={searchTerm}
              onChange={handleSearchChange}
              onFocus={() => searchTerm.length > 0 && setIsSearchOpen(true)} // Reabre se focar
              className="search-input"
            />
            <button type="submit" className="search-button" aria-label="Buscar">
              <i className="bi bi-search"></i>
            </button>
          </form>

          {/* NOVO: Menu dropdown de busca */}
          {isSearchOpen && (
            <div className="search-dropdown">
              <ul>
                {searchResults.map((result) => (
                  <li key={result.id}>
                    <i className="bi bi-search"></i>
                    <span>{result.title}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* --- Container dos Ícones --- */}
        <div className="section-icons">
          <button className="icon-button" aria-label="Favoritos">
            <i className="bi bi-heart"></i>
          </button>
          <button className="icon-button" aria-label="Notificações">
            <i className="bi bi-bell"></i>
            {/* NOVO: Ponto de notificação (exemplo) */}
            <span className="notification-dot"></span>
          </button>

          {/* NOVO: Wrapper para o menu de perfil */}
          <div className="profile-menu-wrapper" ref={profileMenuRef}>
            <button className="icon-button" aria-label="Conta do Usuário" onClick={toggleProfileMenu}>
              <i className="bi bi-person-circle"></i>
            </button>

            {/* NOVO: Menu dropdown de perfil */}
            {isProfileOpen && (
              <div className="profile-dropdown">
                <div className="profile-dropdown-header">
                  <i className="bi bi-person-circle"></i>
                  <span>User</span>
                </div>
                <ul>
                  <li>
                    <Link to="/editar-perfil" onClick={() => setIsProfileOpen(false)}>
                      <i className="bi bi-pencil-fill"></i>
                      <span>Editar perfil</span>
                    </Link>
                  </li>
                  <li>
                    <Link to="/adicionarfilmes" onClick={() => setIsProfileOpen(false)}>
                      <i className="bi bi-plus-circle-fill"></i>
                      <span>Adicionar Filme</span>
                    </Link>
                  </li>
                  <li onClick={handleLogout}>
                    <i className="bi bi-box-arrow-right"></i>
                    <span>Sair</span>
                  </li>
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;


header.css

/* --- Wrappers dos Menus (para posicionamento) --- */
.search-wrapper,
.profile-menu-wrapper {
  position: relative;
}

/* --- Estilo do Menu Dropdown (Base) --- */
.search-dropdown,
.profile-dropdown {
  position: absolute;
  top: 130%; /* Posição abaixo do header */
  right: 0;
  width: 280px; /* Largura dos menus */
  background-color: #1c1c1c; /* Cor escura (diferente do header) */
  border-radius: 12px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
  z-index: 1000;
  overflow: hidden;
  border: 1px solid rgba(255, 255, 255, 0.1);
}

/* --- Dropdown de Busca --- */
.search-dropdown ul {
  list-style: none;
  margin: 0;
  padding: 10px;
}

.search-dropdown li {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 10px;
  color: #aaa;
  font-size: 0.9rem;
  border-radius: 8px;
  cursor: pointer;
  transition: background-color 0.2s;
}

.search-dropdown li:hover {
  background-color: var(--search-bg);
  color: var(--text-color);
}

/* --- Dropdown de Perfil --- */
.profile-dropdown-header {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 15px;
  font-size: 1.1rem;
  font-weight: bold;
  color: var(--text-color);
  border-bottom: 1px solid var(--search-bg);
}

.profile-dropdown ul {
  list-style: none;
  margin: 0;
  padding: 10px;
}

/* Estilo dos links (li > a) e do botão Sair (li) */
.profile-dropdown li {
  display: flex;
  align-items: center;
  gap: 12px;
  color: #ccc;
  font-size: 1rem;
  border-radius: 8px;
  cursor: pointer;
  transition: background-color 0.2s, color 0.2s;
}

.profile-dropdown li a {
  display: flex;
  align-items: center;
  gap: 12px;
  color: inherit; /* Herda a cor do <li> */
  text-decoration: none;
  width: 100%;
  padding: 14px 10px;
}

/* Estilo para o <li> que é um botão (Sair) */
.profile-dropdown li:not(:has(a)) {
   padding: 14px 10px;
}

.profile-dropdown li:hover {
  background-color: var(--search-bg);
  color: var(--text-color);
}

/* Estilo para o <li> "Sair" ao passar o mouse */
.profile-dropdown li:last-child:hover {
  background-color: var(--primary-color);
  color: var(--text-color);
}

.profile-dropdown li i {
  font-size: 1.1rem;
  width: 20px; /* Alinha os ícones */
  text-align: center;
}

/* --- Ponto de Notificação --- */
.icon-button .notification-dot {
  position: absolute;
  top: 0;
  right: 0;
  width: 8px;
  height: 8px;
  background-color: var(--primary-color);
  border-radius: 50%;
  border: 1px solid var(--bg-color);
}

--------------------------

perfil.jsx

/* Usando as variáveis de cor que já definimos */
:root {
  --primary-color: #c80710;
  --bg-color: #151515;
  --text-color: #ffffff;
  --search-bg: #2b2b2b;
}

.profile-page-container {
  max-width: 1000px;
  margin: 20px auto;
  color: var(--text-color);
  font-family: "Montserrat", sans-serif;
}

/* --- 1. CABEÇALHO DO PERFIL --- */
.profile-header {
  background-color: var(--search-bg); /* Fundo caso a imagem falhe */
  border-radius: 15px;
  overflow: hidden; /* Garante que o banner não "vaze" */
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.3);
}

.profile-banner {
  height: 250px;
  background-size: cover;
  background-position: center;
  border-bottom: 1px solid var(--primary-color);
}

.profile-info-bar {
  display: flex;
  justify-content: space-between;
  align-items: flex-end; /* Alinha tudo na base */
  padding: 0 40px;
  
  /* Puxa esta seção para cima, sobrepondo o banner */
  margin-top: -60px; 
}

.profile-avatar-section {
  display: flex;
  align-items: flex-end;
  gap: 20px;
}

.profile-avatar {
  width: 120px;
  height: 120px;
  border-radius: 50%;
  border: 4px solid var(--primary-color);
  background-color: var(--bg-color); /* Fundo para o avatar */
  object-fit: cover;
}

.profile-names {
  margin-bottom: 10px;
}

.profile-names h2 {
  font-size: 2rem;
  font-weight: bold;
  margin: 0;
  color: var(--text-color);
}

.profile-names p {
  font-size: 1rem;
  color: #aaa;
  margin: 0;
}

.profile-header-actions {
  margin-bottom: 15px;
}

.btn.btn-edit-profile {
  background-color: var(--text-color);
  color: #000;
  border: none;
  border-radius: 20px;
  padding: 10px 20px;
  font-size: 0.9rem;
  font-weight: bold;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: all 0.3s ease;
}

.btn.btn-edit-profile:hover {
  transform: scale(1.05);
  background-color: #eee;
}

/* --- 2. CORPO DO PERFIL --- */
.profile-body {
  padding: 30px 0;
}

/* Estatísticas */
.profile-stats {
  display: flex;
  justify-content: center;
  gap: 40px;
  padding: 20px;
  background-color: var(--search-bg);
  border-radius: 10px;
  margin-bottom: 30px;
}

.stat-item {
  text-align: center;
}

.stat-item strong {
  font-size: 1.5rem;
  font-weight: bold;
  display: block;
  color: var(--text-color);
}

.stat-item span {
  font-size: 0.9rem;
  color: #aaa;
}

/* Abas de Navegação */
.profile-tabs {
  display: flex;
  gap: 10px;
  border-bottom: 1px solid var(--search-bg);
  margin-bottom: 30px;
}

.tab-item {
  background: none;
  border: none;
  color: #aaa;
  font-family: "Montserrat", sans-serif;
  font-size: 1rem;
  font-weight: 600;
  padding: 15px 25px;
  cursor: pointer;
  border-bottom: 3px solid transparent;
  transition: color 0.3s, border-color 0.3s;
}

.tab-item:hover {
  color: var(--text-color);
}

.tab-item.active {
  color: var(--primary-color);
  border-bottom-color: var(--primary-color);
}

/* Grid de Filmes */
.profile-content-grid {
  display: grid;
  /* Cria um grid responsivo */
  grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
  gap: 20px;
}

.grid-movie-poster {
  border-radius: 8px;
  overflow: hidden;
  transition: transform 0.3s ease;
  aspect-ratio: 2 / 3; /* Proporção de poster (largura / altura) */
}

.grid-movie-poster:hover {
  transform: scale(1.05);
  cursor: pointer;
}

.grid-movie-poster img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}


perfil.jsx

import React from 'react';
import { useNavigate }L from 'react-router-dom';
import './UserProfile.css';
import 'bootstrap-icons/font/bootstrap-icons.css';

// --- DADOS DE EXEMPLO ---
// Você buscaria isso de uma API ou do estado do usuário
const userData = {
  name: "Akira (Usuário)",
  username: "@akira_dev",
  joinDate: "Membro desde Nov de 2025",
  stats: {
    moviesWatched: 128,
    following: 54,
    followers: 89,
  },
  avatarUrl: new URL('../../assets/images/avatar-exemplo.png', import.meta.url).href, // O mesmo avatar do EditProfile
  bannerUrl: new URL('../../assets/images/profile-banner.jpg', import.meta.url).href, // Você precisará de uma imagem de banner
};

// Filmes de exemplo para a "Minha Lista"
const myList = [
  { id: 1, img: 'https://img.elo7.com.br/product/main/3F02D64/poster-alerta-vermelho-red-notice-com-moldura-filme.jpg' },
  { id: 2, img: 'https://img.elo7.com.br/product/main/3F02D64/poster-alerta-vermelho-red-notice-com-moldura-filme.jpg' },
  { id: 3, img: 'https://img.elo7.com.br/product/main/3F02D64/poster-alerta-vermelho-red-notice-com-moldura-filme.jpg' },
  { id: 4, img: 'https://img.elo7.com.br/product/main/3F02D64/poster-alerta-vermelho-red-notice-com-moldura-filme.jpg' },
];
// --- FIM DOS DADOS DE EXEMPLO ---


const UserProfile = () => {
  const navigate = useNavigate();

  const goToEditProfile = () => {
    navigate('/editar-perfil'); // Ajuste o caminho se for diferente
  };

  return (
    <div className="profile-page-container">
      
      {/* --- 1. CABEÇALHO DO PERFIL (BANNER E AVATAR) --- */}
      <header className="profile-header">
        
        {/* Banner (Capa) */}
        <div 
          className="profile-banner" 
          style={{ backgroundImage: `url(${userData.bannerUrl})` }}
        >
        </div>

        {/* Informações Principais */}
        <div className="profile-info-bar">
          <div className="profile-avatar-section">
            <img src={userData.avatarUrl} alt="Avatar" className="profile-avatar" />
            <div className="profile-names">
              <h2>{userData.name}</h2>
              <p>{userData.username}</p>
            </div>
          </div>
          <div className="profile-header-actions">
            <button className="btn btn-edit-profile" onClick={goToEditProfile}>
              <i className="bi bi-pencil-fill"></i>
              Editar Perfil
            </button>
          </div>
        </div>
      </header>

      {/* --- 2. CORPO DO PERFIL (STATS, ABAS, CONTEÚDO) --- */}
      <div className="profile-body">
        
        {/* Estatísticas */}
        <section className="profile-stats">
          <div className="stat-item">
            <strong>{userData.stats.moviesWatched}</strong>
            <span>Filmes Vistos</span>
          </div>
          <div className="stat-item">
            <strong>{userData.stats.following}</strong>
            <span>Seguindo</span>
          </div>
          <div className="stat-item">
            <strong>{userData.stats.followers}</strong>
            <span>Seguidores</span>
          </div>
        </section>

        {/* Abas de Navegação */}
        <nav className="profile-tabs">
          <button className="tab-item active">Minha Lista</button>
          <button className="tab-item">Favoritos</button>
          <button className="tab-item">Avaliações</button>
        </nav>

        {/* Conteúdo das Abas (Grid de Filmes) */}
        <section className="profile-content-grid">
          {myList.map(movie => (
            <div className="grid-movie-poster" key={movie.id}>
              <img src={movie.img} alt="Poster do filme" />
            </div>
          ))}
        </section>

      </div>
    </div>
  );
};

export default UserProfile;


------------------------

