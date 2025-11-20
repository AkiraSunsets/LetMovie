import React from "react";
import "../Footer/footer.css";

const Footer = () => {
  return (
    <footer className="footer-container" role="contentinfo"> 
      <div className="footer-content"> 
        <div className="footer-logo"> 
          <span className="logo-let">Let</span> 
          <span className="logo-movie">Movie</span>
        </div>
        <small className="footer-text"> 
          - 2025 | Todos os direitos são reservados.
        </small>
      </div>
    </footer>
  );
};

export default Footer;