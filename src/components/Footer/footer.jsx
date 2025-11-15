import React from "react";
import "../Footer/footer.css";

const Footer = () => {
  return (
    <footer className="footer-container">
      <div className="footer-content">
        <div className="footer-logo">
          <span className="logo-let">Let</span>
          <span className="logo-movie">Movie</span>
        </div>
        <span className="footer-text">
          - 2025 | Todos os direitos são reservados.
        </span>
      </div>
    </footer>
  );
};

export default Footer;