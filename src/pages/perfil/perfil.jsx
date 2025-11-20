import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/authcontext";
import "./perfil.css"; // Novo CSS
import "bootstrap-icons/font/bootstrap-icons.css";

// Página de Perfil (baseada no mockup image_e8f0a2.png)
// NOTA: O backend não tem uma API de usuário, então estes dados são simulados.
const Perfil = () => {
  const { userRole } = useAuth();

  // Dados simulados
  const userData = {
    nome: userRole === "admin" ? "Administrador" : "Usuário Comum",
    email: userRole === "admin" ? "admin@letmovie.com" : "user@letmovie.com",
    genero: "Não especificado",
    dataNascimento: "01/01/2000",
    sobreMim: "Feliz!.",
  };
return (
    <main className="perfil-container">
      <article className="perfil-card">
        <header className="perfil-title">
          <i className="bi bi-person-circle" aria-hidden="true" />
          <h1 className="perfil-header-title">Perfil</h1>
        </header>

        <section className="perfil-content">
          <figure className="perfil-avatar">
            <img
              src="https://placehold.co/150x150/c80710/white?text=User"
              alt={`Foto de perfil de ${userData.nome}`}
            />
          </figure>

          <div className="perfil-info">
            <div className="perfil-field">
              <h3>Nome Completo</h3>
              <p>{userData.nome}</p>
            </div>

            <div className="perfil-field">
              <h3>Email</h3>
              <p>{userData.email}</p>
            </div>

            <div className="perfil-field-row">
              <div className="perfil-field">
                <h3>Gênero</h3>
                <p>{userData.genero}</p>
              </div>

              <div className="perfil-field">
                <h3>Data de Nascimento</h3>
                <p>{userData.dataNascimento}</p>
              </div>
            </div>

            <div className="perfil-field">
              <h3>Sobre mim</h3>
              <p>{userData.sobreMim}</p>
            </div>

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