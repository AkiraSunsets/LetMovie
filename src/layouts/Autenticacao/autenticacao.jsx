import React from "react";
import "./autenticacao.css"; 

const Autenticacao = ({ children }) => {
  return (
    <div className="login-page">
      <div className="login-container">

        <div className="login-content">
          <div className="login-image">
            <img
              src={
                "/assets/images/popcorn.svg" 
              }
              alt="Pipoca e claquete"
            />
          </div>
          <div className="login-form-content">{children}</div>
        </div>
      </div>
    </div>
  );
};

export default Autenticacao;