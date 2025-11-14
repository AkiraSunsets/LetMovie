import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Autenticacao from "../../layouts/Autenticacao/autenticacao";

const Cadastro = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    console.log("Tentativa de cadastro com: ", { username, email });
    // Lógica de cadastro (simulada)
    console.log("Cadastro (simulado) com sucesso. Redirecionando para login.");
    navigate("/login");
  };

  return (
    <Autenticacao>
      <h2>Criar Conta</h2>
      <p className="auth-subtitle">Comece sua jornada!</p>

      <form onSubmit={handleSubmit} className="login-form">
        {/* ... (o resto do seu formulário de cadastro) ... */}
        <label htmlFor="username-input">Nome de Usuário:</label>
        <input
          type="text"
          id="username-input"
          placeholder="Digite seu nome de usuário"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
        <label htmlFor="email-input">Email:</label>
        <input
          type="email"
          id="email-input"
          placeholder="Digite seu email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <label htmlFor="password-input">Senha:</label>
        <input
          type="password"
          id="password-input"
          placeholder="Digite sua senha"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        {error && (
          <p
            style={{ color: "#E50914", marginTop: "10px", textAlign: "center" }}
          >
            {error}
          </p>
        )}
        <button type="submit" className="login-button">
          Entrar
        </button>
      </form>

      <div className="login-links">
        <p className="cadastrar">
          <Link to="/login" className="sign-up">
            <span className="signup-white">Já possui uma conta?</span>
            <span className="signup-underline"> Fazer login</span>
          </Link>
        </p>
      </div>
    </Autenticacao>
  );
};

export default Cadastro;