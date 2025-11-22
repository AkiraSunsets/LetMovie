import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/authcontext";
import "./perfil.css"; 
import "bootstrap-icons/font/bootstrap-icons.css";

// Página de Perfil
const Perfil = () => {
  const { userRole } = useAuth();

  // Dados Simulados
  const userData = {
    nome: userRole === "admin" ? "Administrador" : "Usuário Comum",
    email: userRole === "admin" ? "admin@letmovie.com" : "user@letmovie.com",
    genero: "Feminino",
    dataNascimento: "01/01/2000",
    sobreMim: "Feliz!.",
  };

  return (
    // Container Principal
    <main className="perfil-container">

      {/* Card de Perfil */}
      <article className="perfil-card">

        {/* Cabeçalho do Perfil */}
        <header className="perfil-title">
          <i className="bi bi-person-circle" aria-hidden="true" />
          <h1 className="perfil-header-title">Perfil</h1>
        </header>

        {/* Conteúdo do Perfil */}
        <section className="perfil-content">

          {/* Avatar */}
          <figure className="perfil-avatar">
            <img
              src="https://i.pinimg.com/1200x/62/45/44/624544c54200da39b9fd507498509092.jpg"
              alt={`Foto de perfil de ${userData.nome}`}
            />
          </figure>

          {/* Informações do Usuário */}
          <div className="perfil-info">

            {/* Campo: Nome */}
            <div className="perfil-field">
              <h3>Nome Completo</h3>
              <p>{userData.nome}</p>
            </div>

            {/* Campo: Email */}
            <div className="perfil-field">
              <h3>Email</h3>
              <p>{userData.email}</p>
            </div>

            {/* Linha de Campos */}
            <div className="perfil-field-row">

              {/* Campo: Gênero */}
              <div className="perfil-field">
                <h3>Gênero</h3>
                <p>{userData.genero}</p>
              </div>

              {/* Campo: Data de Nascimento */}
              <div className="perfil-field">
                <h3>Data de Nascimento</h3>
                <p>{userData.dataNascimento}</p>
              </div>
            </div>

            {/* Campo: Sobre mim */}
            <div className="perfil-field">
              <h3>Sobre mim</h3>
              <p>{userData.sobreMim}</p>
            </div>

            {/* Botões de Ação */}
            <div className="perfil-actions">
              <Link to="/editarperfil" className="perfil-button-edit">
                Editar
              </Link>
            </div>

          </div>
        </section>
      </article>
    </main>
  );
};

export default Perfil;
