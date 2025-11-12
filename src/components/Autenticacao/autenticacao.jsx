import React from "react";
import "../../pages/Login/login.css";

const Autenticacao = ({ children }) => {
  return (
    <div className="login-page">
      <div className="login-container">
        
        {/* O LOGO FOI REMOVIDO DESTE ARQUIVO */}

        <div className="login-content">
          <div className="login-image">
            <img
              src={
                new URL("../../assets/images/popcorn.svg", import.meta.url).href
              }
              alt="Pipoca e claquete"
            />
          </div>
          <div className="login-form-content">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Autenticacao;