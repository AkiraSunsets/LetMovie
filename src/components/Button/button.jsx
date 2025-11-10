import React from "react";  
import "./button.css";
import { Link } from "react-router-dom";

function Button ({buttonText, to = "#", variant = "primary"}) {
    return (
        <Link to={to} className={`button ${variant}`}>
            {buttonText}
        </Link>
    );
}

export default Button;