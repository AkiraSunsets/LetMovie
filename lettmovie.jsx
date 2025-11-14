import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "../adicionarfilmes/FormFilme.css"; 
import "bootstrap-icons/font/bootstrap-icons.css";
import { useAuth } from "../../context/authcontext"; // 1. Importar o useAuth
\
const EditarFilme = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { userRole } = useAuth(); // 2. Obter o userRole
  const [formData, setFormData] = useState(null); 
  const [status, setStatus] = useState({ loading: true, error: null, success: null });

  useEffect(() => {
    // ... (Lógica de fetchFilme não muda) ...
  }, [id]);

  const handleChange = (e) => { /* ... (sem alteração) ... */ };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus({ loading: true, error: null, success: null });

    try {
      const body = new URLSearchParams();
      for (const key in formData) {
        body.append(key, formData[key]);
      }
      body.append('id_filme', id);
      body.append('userRole', userRole); // 3. Enviar o userRole

      const response = await fetch("http://localhost:8000/api/filme/editar", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: body.toString(),
      });

      const data = await response.json();

      if (response.ok) {
        // 4. Mensagem de sucesso diferente
        const successMsg = userRole === 'admin'
          ? "Filme atualizado e aprovado com sucesso!"
          : "Alterações enviadas para aprovação!";
        
        setStatus({ loading: false, error: null, success: successMsg });
        setTimeout(() => navigate(`/filme/${id}`), 2000); 
      } else {
        throw new Error(data.message || "Erro ao editar filme");
      }
    } catch (err) {
      setStatus({ loading: false, error: err.message, success: null });
    }
  };

  // ... (O resto do seu JSX de 'Carregando' e do formulário não muda) ...
  return (
    <div className="form-page-container">
       {/* ... (o resto do seu JSX do formulário não muda) ... */}
// Oculto para brevidade...
    </div>
  );
};

export default EditarFilme;




import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./FormFilme.css"; 
import "bootstrap-icons/font/bootstrap-icons.css";
import { useAuth } from "../../context/authcontext"; // 1. Importar o useAuth

const AdicionarFilmes = () => {
  const navigate = useNavigate();
  const { userRole } = useAuth(); // 2. Obter o userRole
  const [formData, setFormData] = useState({ /* ... (sem alteração) ... */ });
  const [status, setStatus] = useState({ loading: false, error: null, success: null });

  const handleChange = (e) => { /* ... (sem alteração) ... */ };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus({ loading: true, error: null, success: null });

    try {
      const body = new URLSearchParams();
      for (const key in formData) {
        body.append(key, formData[key]);
      }
      body.append('userRole', userRole); // 3. Enviar o userRole para o backend

      const response = await fetch("http://localhost:8000/cadastro", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: body.toString(),
      });

      const data = await response.json();

      if (response.ok) {
        // 4. Mensagem de sucesso diferente para admin
        const successMsg = userRole === 'admin' 
          ? "Filme APROVADO e adicionado com sucesso!"
          : "Filme enviado para aprovação!";
        
        setStatus({ loading: false, error: null, success: successMsg });
        
        setFormData({ /* ... (limpar formulário, sem alteração) ... */ });
        setTimeout(() => navigate('/filmes'), 2000); 
      } else {
        throw new Error(data.message || "Erro ao adicionar filme");
      }
    } catch (err) {
      setStatus({ loading: false, error: err.message, success: null });
    }
  };

  return (
    <div className="form-page-container">
      {/* ... (o resto do seu JSX do formulário não muda) ... */}
// Oculto para brevidade...
    </div>
  );
};

export default AdicionarFilmes;


import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import "./detalhefilme.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import { useAuth } from "../../context/authcontext"; 

const DetalheFilme = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  // ... (outros states: filme, loading, error...)
  const { userRole } = useAuth(); 

  useEffect(() => { /* ... (não muda) ... */ }, [id]);
  const handleDelete = async () => { /* ... (não muda) ... */ };

  // ... (ifs de loading/error não mudam) ...

  return (
    <div className="detalhe-container">
      {/* ... (backdrop e content) ... */}
      <div className="detalhe-content">
        {/* ... (poster) ... */}
        <div className="detalhe-info">
          {/* ... (título, meta, gêneros, sinopse, crew ...) */}

          {/* Lógica dos Botões */}
          <div className="detalhe-actions">
            {/* Botão Voltar (Cancelar) - APARECE PARA TODOS */}
            <button
              onClick={() => navigate(-1)} // -1 navega para a página anterior
              className="detalhe-button back"
            >
              <i className="bi bi-arrow-left-circle"></i> Voltar
            </button>
            
            {/* Botões de Admin - SÓ APARECEM PARA ADMIN */}
            {userRole === "admin" && (
              <>
                <Link
                  to={`/editarfilme/${filme.id_filme}`}
                  className="detalhe-button edit"
                >
                  <i className="bi bi-pencil-fill"></i> Editar
                </Link>
                <button
                  onClick={handleDelete}
                  className="detalhe-button delete"
                >
                  <i className="bi bi-trash-fill"></i> Excluir
                </button>
              </>
            )}
          </div>
          
        </div>
      </div>
    </div>
  );
};

export default DetalheFilme;


/* ... (todo o seu css de detalhefilme) ... */

/* Mude .detalhe-admin-actions para .detalhe-actions */
.detalhe-actions {
  margin-top: auto; /* Empurra para o fundo */
  padding-top: 1.5rem;
  border-top: 1px solid #333;
  display: flex;
  gap: 1rem;
  flex-wrap: wrap; /* Permite quebrar a linha em telas pequenas */
}

/* ... (estilos de .detalhe-button .edit e .delete) ... */

/* Novo estilo para o botão "Voltar" (Cancelar) */
.detalhe-button.back {
  background-color: #444;
  color: #fff;
  margin-right: auto; /* Joga os botões de admin para a direita */
}
.detalhe-button.back:hover {
  background-color: #555;
}

import React, { useState, useEffect } from "react";
// ... (outros imports: NavLink, Link, useNavigate, useLocation...)
import { useAuth } from "../../context/authcontext";
import Dropdown from "../DropdownHeader/dropdownheader";
import Modal from "../Modal/Modal"; // 1. Importar o Modal

const Header = () => {
  // ... (outros states: searchTerm, notifications, loading...)
  const { userRole, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [showLogoutModal, setShowLogoutModal] = useState(false); // 2. State para o modal

  const isAuthPage = location.pathname === '/login' || location.pathname === '/cadastro';

  const handleSearchSubmit = (event) => { /* ... (não muda) ... */ };

  // 3. O "Sair" do dropdown AGORA SÓ ABRE O MODAL
  const handleLogoutClick = () => {
    setShowLogoutModal(true);
  };

  // 4. Esta é a lógica de logout real, chamada pelo botão "Sair" do modal
  const handleConfirmLogout = () => {
    logout();
    setShowLogoutModal(false);
    navigate("/login");
  };

  // ... (Componentes ProfileMenu e NotificationsMenu ... )
  // No seu ProfileMenu, mude o 'onClick' do 'Sair':
  // <li className="profile-menu-item logout" onClick={handleLogoutClick}> 
  //   ...
  // </li>
  
  return (
    <header className={`header ${isAuthPage ? 'auth-header' : ""}`}>
      {/* ... (todo o seu JSX do header ... ) */}

      {/* 5. Adicionar o Modal no final do seu JSX */}
      <Modal isOpen={showLogoutModal} onClose={() => setShowLogoutModal(false)}>
        <div className="logout-modal-content">
          <h2>Logout</h2>
          <p>Deseja realmente sair?</p>
          <div className="logout-modal-actions">
            <button 
              className="logout-modal-button cancel" 
              onClick={() => setShowLogoutModal(false)}
            >
              Cancelar
            </button>
            <button 
              className="logout-modal-button confirm"
              onClick={handleConfirmLogout}
            >
              Sair
            </button>
          </div>
        </div>
      </Modal>

    </header>
  );
};

export default Header;

/* ... (todo o seu css de filmes.css) ... */

/* Estilo para o botão de filtro no header da página */
.filter-button {
  background-color: #2b2b2b;
  color: #fff;
  border: 1px solid #444;
  padding: 0.6rem 1rem;
  border-radius: 8px;
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: all 0.2s ease;
}

.filter-button i {
  font-size: 1.1rem;
}

.filter-button:hover {
  background-color: #c80710;
  border-color: #c80710;
}






import os
import re
import json
import mysql.connector
from http.server import SimpleHTTPRequestHandler, HTTPServer
from urllib.parse import parse_qs, urlparse

# ... (Conexão e funções auxiliares: send_cors_headers, parse_name, etc. não mudam) ...

class MyHandle(SimpleHTTPRequestHandler):
    # ... (do_OPTIONS, parse_name, get_or_create_id, _atualizar_relacionamentos_filme, accont_user, do_GET ... não mudam) ...

    # --- Métodos POST ---
    def do_POST(self):
        path = urlparse(self.path).path
        
        def send_json_response(status_code, content):
            # ... (não muda) ...
        
        # --- Rota POST: /cadastro (Adicionar Filme) ---
        if path == "/cadastro":
            # ... (ler 'form_data' ... não muda) ...
            
            data = {
                'titulo': form_data.get('nome', [''])[0].strip(),
                'atores': form_data.get('atores', [''])[0].strip(),
                # ... (outros campos) ...
                'sinopse': form_data.get('sinopse', [''])[0].strip() or None,
                'userRole': form_data.get('userRole', ['comum'])[0].strip() # <-- NOVO: Captura o role
            }

            # ... (try/except de validação ... não muda) ...

            try:
                if not mydb.is_connected(): mydb.reconnect()
                cursor = mydb.cursor()
                
                # --- LÓGICA CORRIGIDA ---
                # Determina o status baseado no role
                status_filme = 'APROVADO' if data['userRole'] == 'admin' else 'PENDENTE'
                
                # Salva com o status correto
                sql_filme = "INSERT INTO Filme (Titulo, TempoDuracao, Ano, Poster, Sinopse, Status) VALUES (%s, %s, %s, %s, %s, %s)"
                cursor.execute(sql_filme, (
                    data['titulo'], int(data['duracao']), int(data['ano']), 
                    data['poster'], data['sinopse'], status_filme # <-- Passa o status
                ))
                id_filme = cursor.lastrowid

                self._atualizar_relacionamentos_filme(cursor, id_filme, data)

                mydb.commit() 
                cursor.close()
                send_json_response(200, {"status": "sucesso", "id": id_filme, "message": "Filme processado!"}) # Mensagem genérica

            except Exception as e:
                # ... (error handling não muda) ...

        # --- Rota POST: /api/filme/editar (Editar Filme) ---
        elif path == "/api/filme/editar":
            # ... (ler 'form_data' ... não muda) ...

            data = {
                'id_filme': form_data.get('id_filme', [''])[0].strip(),
                'titulo': form_data.get('nome', [''])[0].strip(),
                # ... (outros campos) ...
                'sinopse': form_data.get('sinopse', [''])[0].strip() or None,
                'userRole': form_data.get('userRole', ['comum'])[0].strip() # <-- NOVO: Captura o role
            }

            # ... (try/except de validação ... não muda) ...

            try:
                if not mydb.is_connected(): mydb.reconnect()
                cursor = mydb.cursor()
                id_filme = int(data['id_filme'])
                
                # --- LÓGICA CORRIGIDA ---
                # Determina o status baseado no role
                status_filme = 'APROVADO' if data['userRole'] == 'admin' else 'PENDENTE'
                
                # Atualiza o filme principal (e define o status correto)
                sql_filme = """
                    UPDATE Filme SET 
                    Titulo = %s, TempoDuracao = %s, Ano = %s, Poster = %s, Sinopse = %s, Status = %s
                    WHERE ID = %s
                """
                cursor.execute(sql_filme, (
                    data['titulo'], int(data['duracao']), int(data['ano']), 
                    data['poster'], data['sinopse'], status_filme, id_filme # <-- Passa o status
                ))

                self._atualizar_relacionamentos_filme(cursor, id_filme, data)

                mydb.commit() 
                cursor.close()
                send_json_response(200, {"status": "sucesso", "id": id_filme, "message": "Filme atualizado!"})

            except Exception as err:
                # ... (error handling não muda) ...
        
        # ... (Resto do do_POST: /send_login, /delete, /aprovar, /rejeitar ... não mudam) ...
# Oculto para brevidade...
