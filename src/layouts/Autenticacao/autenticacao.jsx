import React from "react";
import "./autenticacao.css";

/*
  Layout semântico para páginas de autenticação.
  Usa <main>, <section>, <figure> e <article> adequadamente.
*/
const Autenticacao = ({ children }) => {
  return (
    <main className="login-page"> {/* Área principal da página */}

      <section className="login-container"> {/* Conteúdo central da página */}
        
        <article className="login-content"> {/* Bloco que agrupa imagem + formulário */}

          <figure className="login-image"> {/* pipoca e claquete */}
            <img
              src={new URL("../../assets/images/popcorn.svg", import.meta.url).href}
              alt="Ilustração de pipoca e claquete"
            />
          </figure>

          <section className="login-form-content"> {/* Região onde o formulário será exibido */}
            {children}
          </section>

        </article>
      </section>

    </main>
  );
};

export default Autenticacao;
