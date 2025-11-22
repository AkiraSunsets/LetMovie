import React from "react";
import "../Footer/footer.css";

//componente de rodapé do site
const Footer = () => {
  return (
    <footer className="footer-container" role="contentinfo"> 
    {/* Conteúdo principal interno do footer */}
      <div className="footer-content"> 
        
        {/* logo :) */}
        <div className="footer-logo"> 
          <span className="logo-let">Let</span> 
          <span className="logo-movie">Movie</span>
        </div>
        
        {/* texto secundário */}
        <small className="footer-text"> 
          - 2025 | Todos os direitos são reservados.
        </small>
      </div>
    </footer>
  );
};

export default Footer;