import React from "react";
import "./autenticacao.css"; 

const Autenticacao = ({ children }) => {
  return (

    // Container principal da página de login
    <div className="login-page"> 

    {/* Container que centraliza o conteúdo do login */}
      <div className="login-container">

      {/* Conteúdo do login: imagem e formulário */}
        <div className="login-content">

          {/* imagem decorativa do login */}
          <div className="login-image">
            <img
              src={
                 new URL("../../assets/images/popcorn.svg", import.meta.url).href 
              }
              alt="Pipoca e claquete"
            />
          </div>
          
           {/* Área onde o formulário de login (ou outro conteúdo passado via children) será renderizado */}
          <div className="login-form-content">{children}</div>
        </div>
      </div>
    </div>
  );
};

export default Autenticacao;