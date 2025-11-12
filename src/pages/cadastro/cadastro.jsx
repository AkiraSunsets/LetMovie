
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Autenticacao from "../../components/Autenticacao/autenticacao";
import "../login/login.css"; 

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

    /*
    // Lógica de Fetch para quando o backend estiver pronto
    
    try {
      const formData = new URLSearchParams();
      formData.append('username', username);
      formData.append('email', email);
      formData.append('password', password);

      const response = await fetch('http://localhost:8000/api/cadastro_usuario', { 
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: formData.toString(),
      });

      const data = await response.json();

      if (response.ok) {
        console.log("Cadastro bem sucedido:", data.message);
        navigate('/login'); 
      } else {
        setError(data.message || 'Não foi possível realizar o cadastro.');
      }
    } catch (err) {
      console.error("Erro de rede ou fetch:", err);
      setError("Não foi possível conectar ao servidor. Tente novamente.");
    }
    */

    console.log("Cadastro (simulado) com sucesso. Redirecionando para login.");
    navigate('/login');
  };

  return (
    <Autenticacao>
        <h2>Criar Conta</h2>
      <p className='auth-subtitle'>Comece sua jornada!</p>
      
      <form onSubmit={handleSubmit} className='login-form'>
        <label htmlFor="username-input">Nome de Usuário:</label>
        <input 
          type='text'
          id='username-input'
          placeholder='Digite seu nome de usuário'
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />

        <label htmlFor="email-input">Email:</label>
        <input 
          type='email'
          id='email-input'
          placeholder='Digite seu email'
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <label htmlFor="password-input">Senha:</label>
        <input 
          type='password'
          id='password-input'
          placeholder='Digite sua senha'
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        {error && (
          <p style={{ color: '#E50914', marginTop: '10px', textAlign: 'center' }}>
            {error}
          </p>
        )}

        <button type='submit' className='login-button'>
          Entrar
        </button>
      </form>

      {/* Links específicos de Cadastro */}
      <div className='login-links'>
        <p className='cadastrar'>
          <Link to="/login" className='sign-up'>
            <span className='signup-white'>Já possui uma conta?</span>
            <span className='signup-underline'> Fazer login</span>
          </Link>
        </p>
      </div>
    </Autenticacao>
  );
};

export default Cadastro;