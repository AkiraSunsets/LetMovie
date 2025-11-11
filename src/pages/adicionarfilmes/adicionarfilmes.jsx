import React from 'react';
import { useNavigate } from 'react-router-dom';
import MovieForm from '../components/MovieForm/MovieForm'; 

const AdicionarFilmePage = () => {
  const navigate = useNavigate();

  const handleAddMovie = (movieData) => {

    // 1. Chame sua API para CRIAR o filme
    console.log('--- LÓGICA DE ADICIONAR ---');
    console.log('Salvando NOVO filme:', movieData);
    
    // 2. Lógica de feedback (ex: mostrar notificação de sucesso)
    alert('Filme adicionado com sucesso!');

    // 3. Redireciona o usuário
    navigate('/filmes'); // ou para a página de admin
  };

  return (
    <MovieForm 
      titleText="Adicionar Filme"
      onSubmit={handleAddMovie} 
    />
  );
};

export default AdicionarFilmePage;