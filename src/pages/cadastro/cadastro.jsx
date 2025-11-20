import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Autenticacao from "../../layouts/Autenticacao/autenticacao";

//estado para armazenar os dados do formulário
const Cadastro = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(""); //estado para mensagens de erro
  const navigate = useNavigate(); //redireciomanento

  //função chamada ao enviar o formulário
  const handleSubmit = async (event) => {
    event.preventDefault(); 
    setError(""); //limpa erros anteriores
    console.log("Tentativa de cadastro com: ", { username, email });
    console.log("Cadastro (simulado) com sucesso. Redirecionando para login.");
    navigate("/login"); //redireciona para a pagina de login
  };

  return (
    <Autenticacao> {/* Layout que centraliza o formulário */}
      <h2>Criar Conta</h2>
      <p className="auth-subtitle">Comece sua jornada!</p>

      <form onSubmit={handleSubmit} className="login-form">

        {/* Campo de usuario */}
        <label htmlFor="username-input">Nome de Usuário:</label>
        <input
          type="text"
          id="username-input"
          placeholder="Digite seu nome de usuário"
          value={username}
          onChange={(e) => setUsername(e.target.value)} //atualiza o estado
          required
        />

        {/* Campo de email */}
        <label htmlFor="email-input">Email:</label>
        <input
          type="email"
          id="email-input"
          placeholder="Digite seu email"
          value={email}
          onChange={(e) => setEmail(e.target.value)} //atualiza o estado
          required
        />

        {/* Campo de senha */}
        <label htmlFor="password-input">Senha:</label>
        <input
          type="password"
          id="password-input"
          placeholder="Digite sua senha"
          value={password}
          onChange={(e) => setPassword(e.target.value)} //atualiza o estado
          required
        />

        {/* Mostra mensagem de erro se existir */}
        {error && (
          <p
            style={{ color: "#E50914", marginTop: "10px", textAlign: "center" }}
          >
            {error}
          </p>
        )}


        {/* Botão de envio */}
        <button type="submit" className="login-button">
          Entrar
        </button>
      </form>

       {/* Links de navegação para login */}
      <nav className="login-links">
        <p className="cadastrar">
          <Link to="/login" className="sign-up">
            <span className="signup-white">Já possui uma conta?</span>
            <span className="signup-underline"> Fazer login</span>
          </Link>
        </p>
      </nav>
    </Autenticacao>
  );
};

export default Cadastro;