import os
import re
import json
import mysql.connector
from http.server import SimpleHTTPRequestHandler, HTTPServer
from urllib.parse import parse_qs, urlparse

# --- Conexão com o Banco de Dados ---
try:
    mydb = mysql.connector.connect(
        host="localhost",
        user="root",
        password="root",        
        database="LetMovie"
    )
    print("✅ Conexão com o banco de dados 'LetMovie' estabelecida.")
except mysql.connector.Error as err:
    print(f"❌ Erro ao conectar ao MySQL: {err}")
    exit(1)

# --- Classe Principal do Servidor ---
class MyHandle(SimpleHTTPRequestHandler):

    # --- CORS Headers ---
    def send_cors_headers(self):
        """Envia os headers de CORS necessários"""
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, DELETE")
        self.send_header("Access-Control-Allow-Headers", "Content-Type, Authorization")

    def do_OPTIONS(self):
        """Responde ao 'pre-flight request' do CORS"""
        self.send_response(204) # No Content
        self.send_cors_headers()
        self.end_headers()

    # --- Funções auxiliares de BD (parse_name, get_or_create_id, _atualizar_relacionamentos_filme) ... ---
    # (Vou omitir as funções auxiliares que não mudaram para focar na correção)

    def parse_name(self, full_name):
        parts = full_name.strip().split(' ', 1)
        nome = parts[0]
        sobrenome = parts[1] if len(parts) > 1 else ''
        return nome, sobrenome

    def get_or_create_id(self, cursor, table_name, name_str, extra_cols=None):
        nome, sobrenome = self.parse_name(name_str)
        
        if table_name == 'Produtora':
            sql_find = "SELECT ID FROM Produtora WHERE Nome = %s"
            cursor.execute(sql_find, (name_str,))
        elif sobrenome:
            sql_find = f"SELECT ID FROM {table_name} WHERE Nome = %s AND Sobrenome = %s"
            cursor.execute(sql_find, (nome, sobrenome))
        else:
            sql_find = f"SELECT ID FROM {table_name} WHERE Nome = %s"
            cursor.execute(sql_find, (nome,))
            
        result = cursor.fetchone()
        
        if result:
            return result[0]
        else:
            if table_name == 'Ator' or table_name == 'Diretor':
                sql_insert = f"INSERT INTO {table_name} (Nome, Sobrenome, id_nacionalidade, id_generopessoa) VALUES (%s, %s, NULL, NULL)"
                cursor.execute(sql_insert, (nome, sobrenome))
            else: # Produtora
                sql_insert = f"INSERT INTO {table_name} (Nome) VALUES (%s)"
                cursor.execute(sql_insert, (name_str,))
                
            return cursor.lastrowid

    def _atualizar_relacionamentos_filme(self, cursor, id_filme, data):
        """Função auxiliar para limpar e recriar relacionamentos N-para-N"""
        
        # Limpa relacionamentos antigos
        cursor.execute("DELETE FROM GeneroFilme WHERE id_filme = %s", (id_filme,))
        cursor.execute("DELETE FROM LinguagemFilme WHERE id_filme = %s", (id_filme,))
        cursor.execute("DELETE FROM ProdutoraFilme WHERE id_filme = %s", (id_filme,))
        cursor.execute("DELETE FROM FilmeDiretor WHERE id_filme = %s", (id_filme,))
        cursor.execute("DELETE FROM AtorFilme WHERE id_filme = %s", (id_filme,))
        
        # Insere Genero
        cursor.execute("INSERT INTO GeneroFilme (id_genero, id_filme) VALUES (%s, %s)", (int(data['id_genero']), id_filme))
        
        # Insere Linguagem
        cursor.execute("INSERT INTO LinguagemFilme (id_linguagem, id_filme) VALUES (%s, %s)", (int(data['id_linguagem']), id_filme))
        
        # Insere Produtora
        id_produtora = self.get_or_create_id(cursor, 'Produtora', data['produtora'])
        cursor.execute("INSERT INTO ProdutoraFilme (id_filme, id_produtora) VALUES (%s, %s)", (id_filme, id_produtora))
        
        # Insere Diretor
        id_diretor = self.get_or_create_id(cursor, 'Diretor', data['diretor'])
        cursor.execute("INSERT INTO FilmeDiretor (id_filme, id_diretor) VALUES (%s, %s)", (id_filme, id_diretor))
        
        # Insere Atores
        atores_list = [ator.strip() for ator in data['atores'].split(',')]
        for ator_nome in atores_list:
            if ator_nome:
                id_ator = self.get_or_create_id(cursor, 'Ator', ator_nome)
                cursor.execute("INSERT INTO AtorFilme (id_filme, id_ator) VALUES (%s, %s)", (id_filme, id_ator))
        
        # (Opcional) Insere País (se o formulário tivesse 'id_pais')
        # if 'id_pais' in data and data['id_pais']:
        #   cursor.execute("INSERT INTO PaisFilme (id_pais, id_filme) VALUES (%s, %s)", (int(data['id_pais']), id_filme))
    
    # --- Verificador de Login (Simulado) ---
    def accont_user(self, login, password):
        """Verifica o login e retorna o 'role' (tipo de usuário)"""
        if login == "admin" and password == "admin123":
            return {"status": "logado", "role": "admin"}
        elif login == "user" and password == "user123":
            return {"status": "logado", "role": "comum"}
        else:
            return {"status": "falha"}

    # --- Métodos GET ---
    def do_GET(self):
        # Adiciona headers CORS para TODAS as requisições GET
        self.send_cors_headers() 
        
        parsed_path = urlparse(self.path)
        path = parsed_path.path 

        # Rota API: /api/filmes
        if path == "/api/filmes":
            try:
                if not mydb.is_connected(): mydb.reconnect()
                cursor = mydb.cursor(dictionary=True)
                
                sql = """
                    SELECT 
                        f.ID AS id_filme, f.Titulo AS nomeFilme, f.TempoDuracao AS tempo_duracao,
                        f.Ano AS ano, f.Poster AS poster,
                        GROUP_CONCAT(DISTINCT g.Nome SEPARATOR ', ') AS generos,
                        GROUP_CONCAT(DISTINCT CONCAT(a.Nome, ' ', a.Sobrenome) SEPARATOR ', ') AS atores,
                        GROUP_CONCAT(DISTINCT CONCAT(d.Nome, ' ', d.Sobrenome) SEPARATOR ', ') AS diretores,
                        GROUP_CONCAT(DISTINCT l.Nome SEPARATOR ', ') AS linguagens
                    FROM Filme f
                    LEFT JOIN GeneroFilme gf ON f.ID = gf.id_filme
                    LEFT JOIN Genero g ON gf.id_genero = g.ID
                    LEFT JOIN AtorFilme af ON f.ID = af.id_filme
                    LEFT JOIN Ator a ON af.id_ator = a.ID
                    LEFT JOIN FilmeDiretor fd ON f.ID = fd.id_filme
                    LEFT JOIN Diretor d ON fd.id_diretor = d.ID
                    LEFT JOIN LinguagemFilme lf ON f.ID = lf.id_filme
                    LEFT JOIN Linguagem l ON lf.id_linguagem = l.ID
                    GROUP BY f.ID ORDER BY f.Titulo;
                """
                cursor.execute(sql)
                filmes = cursor.fetchall()
                cursor.close()

                self.send_response(200)
                self.send_header("Content-type", "application/json; charset=utf-8")
                self.end_headers()
                self.wfile.write(json.dumps(filmes, ensure_ascii=False).encode("utf-8"))
            except Exception as e:
                self.send_error(500, f"Erro ao buscar filmes: {str(e)}")

        # Rota API: /api/filme/{id}
        elif re.match(r"/api/filme/(\d+)", path):
            try:
                filme_id = path.split("/")[-1]
                if not mydb.is_connected(): mydb.reconnect()
                cursor = mydb.cursor(dictionary=True)
                
                sql = """
                    SELECT 
                        f.ID AS id_filme, f.Titulo AS nomeFilme, f.TempoDuracao AS tempo_duracao,
                        f.Ano AS ano, f.Poster AS poster,
                        GROUP_CONCAT(DISTINCT g.Nome SEPARATOR ', ') AS generos,
                        GROUP_CONCAT(DISTINCT CONCAT(a.Nome, ' ', a.Sobrenome) SEPARATOR ', ') AS atores,
                        GROUP_CONCAT(DISTINCT CONCAT(d.Nome, ' ', d.Sobrenome) SEPARATOR ', ') AS diretores,
                        GROUP_CONCAT(DISTINCT l.Nome SEPARATOR ', ') AS linguagens,
                        GROUP_CONCAT(DISTINCT p.Nome SEPARATOR ', ') AS produtoras
                    FROM Filme f
                    LEFT JOIN GeneroFilme gf ON f.ID = gf.id_filme
                    LEFT JOIN Genero g ON gf.id_genero = g.ID
                    LEFT JOIN AtorFilme af ON f.ID = af.id_filme
                    LEFT JOIN Ator a ON af.id_ator = a.ID
                    LEFT JOIN FilmeDiretor fd ON f.ID = fd.id_filme
                    LEFT JOIN Diretor d ON fd.id_diretor = d.ID
                    LEFT JOIN LinguagemFilme lf ON f.ID = lf.id_filme
                    LEFT JOIN Linguagem l ON lf.id_linguagem = l.ID
                    LEFT JOIN ProdutoraFilme pf ON f.ID = pf.id_filme
                    LEFT JOIN Produtora p ON pf.id_produtora = p.ID
                    WHERE f.ID = %s
                    GROUP BY f.ID;
                """
                cursor.execute(sql, (filme_id,))
                filme = cursor.fetchone()
                cursor.close()

                if filme:
                    self.send_response(200)
                    self.send_header("Content-type", "application/json; charset=utf-8")
                    self.end_headers()
                    self.wfile.write(json.dumps(filme, ensure_ascii=False).encode("utf-8"))
                else:
                    self.send_error(404, "Filme não encontrado")
            except Exception as e:
                self.send_error(500, f"Erro ao buscar filme: {str(e)}")

        else:
            # Serve arquivos estáticos (HTML, CSS, JS)
            # Adiciona 'index.html' se o caminho for '/'
            path_to_serve = path
            if path_to_serve == "/":
                path_to_serve = "/index.html" # Supondo que o React gere um index.html

            # Define o 'self.path' para o SimpleHTTPRequestHandler encontrar o arquivo
            # Remove o '/' inicial para construir o caminho do arquivo
            # Isso é arriscado e deve ser ajustado para servir SÓ da pasta 'frontend/build'
            # self.path = os.path.join(os.getcwd(), 'frontend_build', path_to_serve[1:])
            
            # Por enquanto, vamos manter o comportamento original de servir
            # da pasta raiz, mas isso pode não funcionar com o React.
            if path == "/":
                self.path = "/html/index.html" # Mudando para seu 'index.html' antigo como fallback
            elif path == "/sucesso.js":
                self.path = "/js/script.js"

            try:
                # O super().do_GET() não precisa de send_cors_headers()
                # se estiver servindo a mesma origem, mas o React dev server
                # está em outra porta, então este código não será usado.
                return super().do_GET()
            except IOError:
                self.send_error(404, f"Arquivo não encontrado: {self.path}")


    # --- Métodos POST ---
    def do_POST(self):
        path = urlparse(self.path).path
        
        # --- CORREÇÃO AQUI ---
        # Função interna para enviar resposta JSON, AGORA COM HEADERS CORS
        def send_json_response(status_code, content):
            self.send_response(status_code)
            self.send_cors_headers() # <--- ADICIONADO
            self.send_header("Content-type", "application/json; charset=utf-8")
            self.end_headers()
            self.wfile.write(json.dumps(content, ensure_ascii=False).encode('utf-8'))

        # Rota POST: /cadastro (Adicionar Filme)
        if path == "/cadastro":
            content_length = int(self.headers['Content-Length'])
            body = self.rfile.read(content_length).decode('utf-8')
            form_data = parse_qs(body)

            data = {
                'titulo': form_data.get('nome', [''])[0].strip(),
                'atores': form_data.get('atores', [''])[0].strip(),
                'diretor': form_data.get('diretor', [''])[0].strip(),
                'ano': form_data.get('ano', [''])[0].strip(),
                'duracao': form_data.get('duracao', [''])[0].strip() or None,
                'id_genero': form_data.get('id_genero', [''])[0].strip(),
                'produtora': form_data.get('produtora', [''])[0].strip(),
                'id_linguagem': form_data.get('id_linguagem', [''])[0].strip(),
                'poster': form_data.get('urlposter', [''])[0].strip() or None,
            }

            try:
                # (Validação dos dados...)
                if not all([data['titulo'], data['atores'], data['diretor'], data['ano'], 
                            data['duracao'], data['id_genero'], data['produtora'], 
                            data['id_linguagem'], data['poster']]):
                    raise ValueError("Todos os campos são obrigatórios.")
                
                if not data['ano'].isdigit() or not (1900 <= int(data['ano']) <= 2099):
                    raise ValueError("Ano inválido.")
                
                if not data['duracao'].isdigit() or int(data['duracao']) <= 0:
                    raise ValueError("Duração inválida.")
                
                int(data['id_genero'])
                int(data['id_linguagem'])

            except Exception as ve:
                send_json_response(400, {"status": "erro", "message": f"Dados inválidos: {ve}"})
                return

            try:
                if not mydb.is_connected(): mydb.reconnect()
                cursor = mydb.cursor()
                
                cursor.execute("SELECT ID FROM Filme WHERE Titulo = %s", (data['titulo'],))
                if cursor.fetchone():
                    raise mysql.connector.Error(errno=1062, msg="Já existe um filme com esse título!")

                sql_filme = "INSERT INTO Filme (Titulo, TempoDuracao, Ano, Poster) VALUES (%s, %s, %s, %s)"
                cursor.execute(sql_filme, (data['titulo'], int(data['duracao']), int(data['ano']), data['poster']))
                id_filme = cursor.lastrowid

                # Chama a função auxiliar
                self._atualizar_relacionamentos_filme(cursor, id_filme, data)

                mydb.commit() 
                cursor.close()
                send_json_response(200, {"status": "sucesso", "id": id_filme})

            except mysql.connector.Error as err:
                mydb.rollback() 
                if err.errno == 1062:
                    send_json_response(409, {"status": "erro", "message": "Já existe um filme com esse título!"})
                else:
                    send_json_response(500, {"status": "erro", "message": f"Erro de banco de dados: {err.msg}"})
            except Exception as e:
                mydb.rollback()
                send_json_response(500, {"status": "erro", "message": f"Erro interno do servidor: {str(e)}"})

        # Rota POST: /api/filme/editar (Editar Filme)
        elif path == "/api/filme/editar":
            content_length = int(self.headers['Content-Length'])
            body = self.rfile.read(content_length).decode('utf-8')
            form_data = parse_qs(body)

            data = {
                'id_filme': form_data.get('id_filme', [''])[0].strip(),
                'titulo': form_data.get('nome', [''])[0].strip(),
                'atores': form_data.get('atores', [''])[0].strip(),
                'diretor': form_data.get('diretor', [''])[0].strip(),
                'ano': form_data.get('ano', [''])[0].strip(),
                'duracao': form_data.get('duracao', [''])[0].strip() or None,
                'id_genero': form_data.get('id_genero', [''])[0].strip(),
                'produtora': form_data.get('produtora', [''])[0].strip(),
                'id_linguagem': form_data.get('id_linguagem', [''])[0].strip(),
                'poster': form_data.get('urlposter', [''])[0].strip() or None,
            }

            try:
                # (Validação dos dados...)
                if not data['id_filme'].isdigit():
                    raise ValueError("ID do filme é inválido.")
                # (Outras validações iguais ao /cadastro...)

            except Exception as ve:
                send_json_response(400, {"status": "erro", "message": f"Dados inválidos: {ve}"})
                return

            try:
                if not mydb.is_connected(): mydb.reconnect()
                cursor = mydb.cursor()
                
                id_filme = int(data['id_filme'])
                
                # Verifica se o filme existe
                cursor.execute("SELECT ID FROM Filme WHERE ID = %s", (id_filme,))
                if not cursor.fetchone():
                    raise ValueError(f"Filme com ID {id_filme} não encontrado.")

                # Atualiza o filme principal
                sql_filme = """
                    UPDATE Filme SET 
                    Titulo = %s, TempoDuracao = %s, Ano = %s, Poster = %s
                    WHERE ID = %s
                """
                cursor.execute(sql_filme, (
                    data['titulo'], int(data['duracao']), int(data['ano']), 
                    data['poster'], id_filme
                ))

                # Chama a função auxiliar para refazer os relacionamentos
                self._atualizar_relacionamentos_filme(cursor, id_filme, data)

                mydb.commit() 
                cursor.close()
                send_json_response(200, {"status": "sucesso", "id": id_filme})

            except (mysql.connector.Error, ValueError) as err:
                mydb.rollback() 
                send_json_response(500, {"status": "erro", "message": f"Erro ao editar filme: {err}"})
            except Exception as e:
                mydb.rollback()
                send_json_response(500, {"status": "erro", "message": f"Erro interno do servidor: {str(e)}"})
        
        # Rota POST: /send_login
        elif path == "/send_login": 
            try:
                content_length = int(self.headers['Content-Length'])
                body = self.rfile.read(content_length).decode('utf-8')
                form_data = parse_qs(body)

                login_form = form_data.get('email', [''])[0] 
                senha_form = form_data.get('password', [''])[0]

                resultado = self.accont_user(login_form, senha_form)

                if resultado["status"] == "logado":
                    send_json_response(200, {
                        "status": "sucesso", 
                        "message": "Logado!", 
                        "role": resultado["role"] # Envia o "role" para o frontend
                    })
                else:
                    send_json_response(401, {"status": "erro", "message": "Usuário ou senha inválidos"})
            except Exception as e:
                send_json_response(500, {"status": "erro", "message": f"Erro no servidor: {e}"})

        # Rota POST: /delete
        elif path == '/delete':
            filme_id_str = None
            try:
                content_length = int(self.headers['Content-Length'])
                body = self.rfile.read(content_length).decode('utf-8')
                form_data = parse_qs(body)

                filme_id_str = form_data.get('id', [None])[0]
                if not filme_id_str or not filme_id_str.isdigit():
                    send_json_response(400, {"status": "erro", "message": "ID do filme inválido ou não fornecido."})
                    return
                
                filme_id = int(filme_id_str)

                if not mydb.is_connected(): mydb.reconnect()
                cursor = mydb.cursor()
                
                print(f"--- Iniciando exclusão do Filme ID: {filme_id} ---")

                # Deleta de TODAS as tabelas de junção primeiro
                cursor.execute("DELETE FROM AtorFilme WHERE id_filme = %s", (filme_id,))
                cursor.execute("DELETE FROM GeneroFilme WHERE id_filme = %s", (filme_id,))
                cursor.execute("DELETE FROM FilmeDiretor WHERE id_filme = %s", (filme_id,))
                cursor.execute("DELETE FROM LinguagemFilme WHERE id_filme = %s", (filme_id,))
                cursor.execute("DELETE FROM ProdutoraFilme WHERE id_filme = %s", (filme_id,))
                cursor.execute("DELETE FROM PaisFilme WHERE id_filme = %s", (filme_id,))

                # Deleta o filme principal
                cursor.execute("DELETE FROM Filme WHERE ID = %s", (filme_id,))
                
                if cursor.rowcount == 0:
                    print(f"Erro: Filme ID {filme_id} não encontrado na tabela Filme.")
                    mydb.rollback() 
                    send_json_response(404, {"status": "erro", "message": "Filme não encontrado."})
                    return

                # Sucesso!
                mydb.commit() 
                cursor.close()
                print(f"--- Sucesso! Filme ID: {filme_id} deletado. ---")
                send_json_response(200, {"status": "sucesso", "message": "Filme deletado com sucesso."})

            except mysql.connector.Error as err:
                mydb.rollback() 
                print(f"\n❌ ERRO DE BANCO DE DADOS AO DELETAR ID {filme_id_str}: {err}\n")
                send_json_response(500, {"status": "erro", "message": f"Erro de banco de dados: {err.msg}"})
            
            except Exception as e:
                mydb.rollback()
                print(f"\n❌ ERRO INTERNO DO SERVIDOR AO DELETAR ID {filme_id_str}: {e}\n")
                send_json_response(500, {"status": "erro", "message": f"Erro interno do servidor: {str(e)}"})
        
        else:
            # Se a rota POST não for conhecida, responde com erro
            send_json_response(404, {"status": "erro", "message": "Rota POST não encontrada."})

def main():
    initial_dir = os.getcwd()
    # Verifica se está executando de dentro de uma pasta 'server' ou 'backend'
    dir_name = os.path.basename(initial_dir)
    if dir_name == 'server' or dir_name == 'backend':
        new_dir = os.path.join(initial_dir, '..')
        print(f"Executando de dentro da pasta /{dir_name}. Mudando diretório para: {os.path.abspath(new_dir)}")
        os.chdir(new_dir)
    
    server_address = ('', 8000)
    httpd = HTTPServer(server_address, MyHandle)
    print(f"🚀 Servidor rodando em http://localhost:8000")
    print(f"Servindo arquivos do diretório: {os.getcwd()}")
    httpd.serve_forever()

if __name__ == '__main__':
    main()