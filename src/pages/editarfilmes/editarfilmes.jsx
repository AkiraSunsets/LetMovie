import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import MovieForm from "../../components/MovieForm/movieform";

const EditarFilmePage = () => {
  const navigate = useNavigate();
  const { id } = useParams(); // Pega o ID do filme da URL (ex: /editar/123)
  
  // Estado para guardar os dados do filme que será editado
  const [movieData, setMovieData] = useState(null);
  const [loading, setLoading] = useState(true);

  // 1. Busca os dados do filme (Simulado)
  useEffect(() => {
    // --- LÓGICA DE API (SIMULADA) ---
    // Você deve buscar os dados do filme com o 'id'
    console.log(`Buscando dados do filme com ID: ${id}`);
    const dadosSimuladosDoFilme = {
      title: 'Filme Exemplo para Editar',
      genre: 'Ação',
      releaseYear: '2020',
      posterUrl: 'https://exemplo.com/poster.jpg',
      actors: 'Ator 1, Atriz 2',
      synopsis: 'Esta é uma sinopse de exemplo.'
    };
    // Simula uma pequena demora da rede
    setTimeout(() => {
        setMovieData(dadosSimuladosDoFilme);
        setLoading(false);
    }, 500);
    // ---------------------------------
  }, [id]); // Roda sempre que o ID mudar

  // 2. Esta é a sua lógica de "Editar" (o "coiso" que é só dessa página)
  const handleEditMovie = (formData) => {
    // 1. Chame sua API para ATUALIZAR o filme com o 'id'
    console.log('--- LÓGICA DE EDITAR ---');
    console.log(`Salvando filme ATUALIZADO (ID: ${id}):`, formData);
    
    // 2. Lógica de feedback
    alert('Filme atualizado com sucesso!');

    // 3. Redireciona
    navigate('/filmes');
  };

  // 3. Mostra um "Carregando..." enquanto busca os dados
  if (loading) {
    return <div style={{color: 'white', textAlign: 'center', marginTop: '50px', fontFamily: '"Montserrat", sans-serif', fontSize: '1.5rem'}}>Carregando dados do filme...</div>;
  }

  // 4. Renderiza o formulário com os dados pré-preenchidos
  return (
    <MovieForm 
      titleText="Editar Filme"
      initialData={movieData} // Passa os dados para o formulário
      onSubmit={handleEditMovie} // Passa a função de submissão
    />
  );
};

export default EditarFilmePage;