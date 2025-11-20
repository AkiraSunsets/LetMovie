import React from "react";
import "./autenticacao.css";

const Autenticacao = ({ children }) => {
  return (
    <section className="login-page">
      <div className="login-container">
        <div className="login-content">
          <figure className="login-image">
            <img
              src={
                new URL("../../assets/images/popcorn.svg", import.meta.url).href
              }
              alt="Ilustração de pipoca e claquete" 
            />
          </figure>

          <div className="login-form-content">{children}</div>
        </div>
      </div>
    </section>
  );
};

export default Autenticacao;
