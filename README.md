# 🎬 LetMovie

LetMovie é um projeto de site de gerenciamento de filmes e catálogo de streaming, focado em uma interface visual imersiva e um sistema de gerenciamento de conteúdo moderado.

A plataforma permite que usuários comuns descubram e enviem novos filmes para o catálogo, enquanto Administradores têm o poder de aprovar, rejeitar ou excluir envios para manter a qualidade do acervo.

## 🚀 Funcionalidades Principais

* **CRUD Completo de Filmes:** Usuários podem Adicionar, Editar e Visualizar filmes.
* **Sistema de Permissão Dupla:** Diferenciação clara de interface e permissões entre "Usuário Normal" e "Administrador (ADM)".
* **Moderação de Conteúdo:** Administradores possuem um painel de "Notificações Pendentes" para Aprovar (botão verde) ou Rejeitar (botão vermelho) os envios dos usuários.
* **Deleção Segura:** Apenas ADMs podem ver o botão "Excluir" e devem confirmar a ação em um modal de segurança.
* **Busca e Filtragem:** O site conta com uma funcionalidade de busca no header e um modal de filtros avançados (por Gênero, Ano, Ator, etc.).
* **Gerenciamento de Perfil:** Usuários podem visualizar e editar seus perfis.

## 🎨 Design (Figma)

O protótipo de alta fidelidade e o guia de estilo do projeto estão disponíveis no Figma:

* **[Link do Figma: LetMovie](https://www.figma.com/design/f8fInLkXSSzOIzIR6Hgd3c/LetMovie?node-id=2-3&t=G1Ou9W4XivFofvhZ-1)**

## 💻 Tecnologias Utilizadas

* **Frontend:** React.js
* **Backend:** Python (com `http.server` e `mysql.connector`)
* **Banco de Dados:** MySQL
* **Estilização:** CSS Puro e CSS Modules

<p align="left" style="display:flex; gap:20px;">
  <img src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/react/react-original.svg" width="60" />
  <img src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/vitejs/vitejs-original.svg" width="60" />
  <img src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/css3/css3-original-wordmark.svg" width="60"/>
  <img src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/python/python-original.svg" width="60" />
  <img src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/bootstrap/bootstrap-original-wordmark.svg" width="60" />
  <img src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/mysql/mysql-original-wordmark.svg" width="60" />
</p>

## 🔧 Instalação e Execução

Para rodar o projeto localmente, siga os três passos abaixo, na ordem:

### 1. Banco de Dados (MySQL)

Antes de tudo, o banco de dados precisa estar criado e populado.

1.  Abra seu gerenciador de banco de dados (MySQL Workbench, DBeaver, etc.).
2.  Execute o arquivo `LetMovie.sql` (fornecido no projeto) para criar o banco de dados `LetMovie` e todas as tabelas e dados necessários.

### 2. Backend (Python)

O servidor Python é responsável por se conectar ao banco de dados e fornecer a API para o frontend.

1.  Navegue até a pasta do backend:
    ```bash
    cd backend
    ```
2.  Crie e ative um ambiente virtual (virtual environment):
    ```bash
    py -m venv env
    .\env\Scripts\activate
    ```
3.  Instale as dependências do Python:
    ```bash
    pip install -r requirements.txt
    ```
4.  ** Alterar a senha**
    * Abra o arquivo `server.py` em um editor de código.
    * Localize a linha de conexão do `mysql.connector` (próximo à linha 11).
    * **Altere a senha** no parâmetro `password="root"` para a senha que você usa no seu MySQL.
    ```python
    mydb = mysql.connector.connect(
        host="localhost",
        user="root",
        password="SUA_SENHA_AQUI", # Altere aqui
        database="LetMovie"
    )
    ```
5.  Inicie o servidor:
    ```bash
    py server.py
    ```
*O backend estará rodando e pronto para receber conexões em `http://localhost:8000`.*

### 3. Frontend (React)

O frontend React consome a API do backend e renderiza a interface do usuário.

1.  Em um **novo terminal**, navegue até a pasta do frontend (pode ser a raiz do projeto):
2.  Instale os pacotes do Node.js:
    ```bash
    npm install
    ```
3.  Inicie a aplicação React:
    ```bash
    npm run dev
    ```
*O site estará acessível no seu navegador, geralmente em `http://localhost:5173`.*




