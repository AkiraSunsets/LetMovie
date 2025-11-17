import React from "react";  
import "./button.css";
import { Link } from "react-router-dom";

/* Recebe 3 props */
/* buttonText = texto exibido no botão */
/* to = rota para onde ele vai */
/* variant = classe de estilo */

function Button ({buttonText, to = "#", variant = "primary"}) {
    return (
        <Link to={to} className={`button ${variant}`}>
            {buttonText}
        </Link>
    );
}

export default Button;