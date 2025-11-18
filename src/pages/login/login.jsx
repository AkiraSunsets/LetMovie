import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Autenticacao from "../../layouts/Autenticacao/autenticacao"; 
import { useAuth } from "../../context/authcontext";

const Login = () => {
  // States do formulário
  const [loginInput, setLoginInput] = useState(""); // Guarda o email ou usuário
  const [password, setPassword] = useState("");     // Guarda a senha
  const [error, setError] = useState("");           // Mensagem de erro
  const { login } = useAuth();                      // Função do contexto de autenticação
  const navigate = useNavigate();                   // Navegação programática

  // Função chamada quando envia o formulário
  const handleSubmit = async (event) => {
    event.preventDefault(); // Evita reload da página
    setError("");           // Limpa erro anterior

    try {
      // Prepara os dados para envio
      const formData = new URLSearchParams();
      formData.append("email", loginInput);
      formData.append("password", password);

      // Chamada ao backend
      const response = await fetch("http://localhost:8000/send_login", {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded", // Formulário URL encoded
        },
        body: formData.toString(),
      });

      const data = await response.json(); // Recebe resposta

      if (response.ok) {
        login(data.role); // Atualiza contexto de autenticação
        navigate("/");    // Redireciona para home
      } else {
        // Mostra erro do backend ou mensagem padrão
        setError(data.message || "Login ou senhas incorretos, tente novamente.");
      }
    } catch (err) {
      console.error("Erro de rede ou fetch:", err);
      setError("Não foi possível conectar ao servidor. Tente novamente.");
    }
  };

  return (
    <Autenticacao>
      <h2>Login</h2>

      {/* Formulário de login */}
      <form onSubmit={handleSubmit} className="login-form">
        <label htmlFor="login-input">Login:</label>
        <input
          type="text"
          id="login-input"
          placeholder="Digite seu email ou nome de usuário"
          value={loginInput}
          onChange={(e) => setLoginInput(e.target.value)} // Atualiza state
          required
        />

        <label htmlFor="password-input">Senha:</label>
        <input
          type="password"
          id="password-input"
          placeholder="Digite sua senha"
          value={password}
          onChange={(e) => setPassword(e.target.value)} // Atualiza state
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

        {/* Botão de enviar */}
        <button type="submit" className="login-button">
          Entrar
        </button>
      </form>

      {/* Links de ajuda e cadastro */}
      <div className="login-links">
        <Link to="/recuperar-senha" className="forgot-password">
          Esqueceu a senha?
        </Link>
        <p className="cadastrar">
          <Link to="/cadastro" className="sign-up">
            <span className="signup-white">Não possui uma conta?</span>
            <span className="signup-underline"> Cadastre-se</span>
          </Link>
        </p>
      </div>
    </Autenticacao>
  );
};

export default Login;
