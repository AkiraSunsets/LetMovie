import React, { useState } from 'react';
import './login.css';
import { Link } from 'react-router-dom';

const Login = () => {
  const [login, setLogin] = useState('');
  const [password, setPassword] = useState('');
  
  const handleSubmit = (event) => {
    event.preventDefault();
    console.log("Tentativa de login com: ", { login, password });
  };

  return (
    <div className='login-page'>
      <div className='login-container'>
        
        {/* Logo */}
        <div className="login-logo-container">
          <span className='logo-let'>Let</span>
          <span className='logo-movie'>Movie</span>
        </div>

        {/* Conteúdo principal */}
        <div className='login-content'>
          
          {/* Imagem */}
          <div className='login-image'>
            <img 
              src={new URL('../../assets/images/popcorn.svg', import.meta.url).href} 
              alt="Pipoca e claquete" 
            />
          </div>

          {/* Formulário */}
          <div className='login-form-content'>
            <h2>Login</h2>
            
            <form onSubmit={handleSubmit} className='login-form'>
              <label htmlFor="login-input">Login:</label>
              <input 
                type='text'
                id='login-input'
                placeholder='Digite seu email ou nome de usuário'
                value={login}
                onChange={(e) => setLogin(e.target.value)}
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

              <button type='submit' className='login-button'>
                Entrar
              </button>
            </form>

            {/* Esqueci a senha */}
            <div className='login-links'>
              <Link to="#" className='forgot-password'>
                Esqueceu a senha?
              </Link>
              <p className='cadastrar'>
              <Link to="#" className='sign-up'>
                <span className='signup-white'>Não possui uma conta?</span>
                <span className='signup-underline'> Cadastre-se</span>
              </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
