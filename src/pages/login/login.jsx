import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Autenticacao from "../../components/Autenticacao/autenticacao";
import { useAuth } from "../../context/authcontext";
import "./login.css"; // Lembre-se de renomear para Auth.css e mover

const Login = () => {
  const [loginInput, setLoginInput] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");

    try {
      const formData = new URLSearchParams();
      formData.append("email", loginInput);
      formData.append("password", password);

      const response = await fetch("http://localhost:8000/send_login", {
        method: "POST",
        headers: {
          "Content-Type": "application/x-form-urlencoded",
        },
        body: formData.toString(),
      });

      const data = await response.json();

      if (response.ok) {
        login(data.role);
        navigate("/")
      } else {
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
      <form onSubmit={handleSubmit} className="login-form">
        <label htmlFor="login-input">Login:</label>
        <input
          type="text"
          id="login-input"
          placeholder="Digite seu email ou nome de usuário"
          value={loginInput}
          onChange={(e) => setLoginInput(e.target.value)}
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
          <p style={{ color: "#E50914", marginTop: "10px", textAlign: "center" }}>
            {error}
          </p>
        )}
        <button type="submit" className="login-button">
          Entrar
        </button>
      </form>
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