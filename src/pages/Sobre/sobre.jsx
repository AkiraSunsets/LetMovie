import React from "react";
import "./sobre.css";
import "bootstrap-icons/font/bootstrap-icons.css";

const Sobre = () => {
  return (
    <section className="sobre-container" aria-labelledby="about-title">
      
      {/* Cabeçalho da Seção */}
      <header className="sobre-header">
        <h1 id="about-title">
          Sobre o <span className="text-highlight">Let</span>Movie
        </h1>
        <p className="sobre-subtitle">
          Onde a paixão por cinema encontra a tecnologia.
        </p>
      </header>

      <div className="sobre-content">
        {/* Artigo Principal: O Projeto */}
        <article className="sobre-card">
          <div className="icon-box">
            <i className="bi bi-camera-reels-fill" aria-hidden="true"></i>
          </div>
          <h2>O Projeto</h2>
          <p>
            O <strong>LetMovie</strong> é uma plataforma de gerenciamento de filmes desenvolvida com o objetivo de oferecer uma experiência visual imersiva e organizada para amantes do cinema. 
          </p>
          <p>
            Inspirado nas grandes plataformas de streaming, o sistema permite que usuários explorem um catálogo rico, visualizem detalhes técnicos e contribuam ativamente enviando novas sugestões de títulos.
          </p>
        </article>

        {/* Artigo Secundário: Tecnologia */}
        <article className="sobre-card">
          <div className="icon-box">
            <i className="bi bi-code-slash" aria-hidden="true"></i>
          </div>
          <h2>Tecnologia</h2>
          <p>
            Este projeto é uma Aplicação de Página Única (SPA) moderna, construída para ser rápida e responsiva.
          </p>
          <ul className="tech-list">
            <li><strong>Frontend:</strong> React.js + Vite</li>
            <li><strong>Estilização:</strong> CSS Modules (Design System Próprio)</li>
            <li><strong>Backend:</strong> Python (API REST)</li>
            <li><strong>Banco de Dados:</strong> MySQL</li>
          </ul>
        </article>

        {/* Artigo Terciário: Contexto Acadêmico */}
        <article className="sobre-card highlight">
          <div className="icon-box">
            <i className="bi bi-mortarboard-fill" aria-hidden="true"></i>
          </div>
          <h2>Contexto Acadêmico</h2>
          <p>
            O LetMovie foi desenvolvido como projeto prático da disciplina de <strong>Programação Web Frontend</strong>.
          </p>
          <p>
            Realizado no curso Técnico em Desenvolvimento de Sistemas do <strong>SENAI Roberto Mange</strong>, sob orientação da Prof. Mariany Morais.
          </p>
        </article>
      </div>

      {/* Rodapé da Seção com Créditos */}
      <footer className="sobre-footer">
        <p>Desenvolvido com <i className="bi bi-heart-fill heart-icon"></i> por <strong>[Seu Nome Aqui]</strong></p>
      </footer>

    </section>
  );
};

export default Sobre;