import React from "react";
import "../Footer/footer.css";

const Footer = () => {
  return (
    <footer className="footer-container"> {/* container principal que contem fundo, padding e borda superior */}
      <div className="footer-content"> {/* agrupa a logo e o texto lado a lado*/}
        <div className="footer-logo"> {/* logo */}
          <span className="logo-let">Let</span> 
          <span className="logo-movie">Movie</span>
        </div>
        <span className="footer-text"> {/*texto informativo*/}
          - 2025 | Todos os direitos são reservados.
        </span>
      </div>
    </footer>
  );
};

export default Footer;