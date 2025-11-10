import React, { useState } from "react";
import "bootstrap-icons/font/bootstrap-icons.css";
import "./carrosselcategorias.css";

/* definindo nome das categorias */
const categories = [
  { name: "Ação", icon: "bi-bullseye", key: "acao" },
  { name: "Aventura", icon: "bi-map", key: "aventura" },
  { name: "Comédia", icon: "bi-emoji-laughing", key: "comedia" },
  { name: "Drama", icon: "bi-masks-theater", key: "drama" },
  { name: "Romance", icon: "bi-heart-fill", key: "romance" },
  { name: "Animação", icon: "bi-palette-fill", key: "animacao" },
];

function CarrosselCategorias({ onSelectCategory }) {
  const [selected, setSelected] = useState("acao");

  const handleCategoryClick = (key) => {
    setSelected(key);
    if (onSelectCategory) onSelectCategory(key); // chama função do pai
  };

  const scroll = (direction) => {
    const container = document.querySelector(".categorias-list");
    container.scrollBy({
      left: direction === "left" ? -200 : 200,
      behavior: "smooth",
    });
  };

  return (
    <div className="carrossel-categorias">
      <button className="nav-btn left" onClick={() => scroll("left")}>
        <i className="bi bi-chevron-left"></i>
      </button>

      <div className="categorias-list">
        {categories.map((category) => (
          <div
            key={category.key}
            className={`categorias-item ${
              selected === category.key ? "active" : ""
            }`}
            onClick={() => handleCategoryClick(category.key)}
          >
            <i className={`bi ${category.icon}`}></i>
            <span>{category.name}</span>
          </div>
        ))}
      </div>

      <button className="nav-btn right" onClick={() => scroll("right")}>
        <i className="bi bi-chevron-right"></i>
      </button>
    </div>
  );
}

export default CarrosselCategorias;
