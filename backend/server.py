import os
import re
import json
import mysql.connector
from http.server import SimpleHTTPRequestHandler, HTTPServer
from urllib.parse import parse_qs, urlparse

# --- Conexão ---
try:
    mydb = mysql.connector.connect(
        host="localhost",
        user="root",
        password="root",        
        database="LetMovie"
    )
    print("✅ Conexão 'LetMovie' estabelecida.")
except mysql.connector.Error as err:
    print(f"❌ Erro ao conectar ao MySQL: {err}")
    exit(1)

# --- Classe Principal do Servidor ---
class MyHandle(SimpleHTTPRequestHandler):

    # --- CORS Headers ---
    def send_cors_headers(self):
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, DELETE")
        self.send_header("Access-Control-Allow-Headers", "Content-Type, Authorization")

    def do_OPTIONS(self):
        self.send_response(204) # No Content
        self.send_cors_headers()
        self.end_headers()

    # --- Funções Auxiliares de BD ---
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
        # Limpa relacionamentos antigos
        cursor.execute("DELETE FROM GeneroFilme WHERE id_filme = %s", (id_filme,))
        cursor.execute("DELETE FROM LinguagemFilme WHERE id_filme = %s", (id_filme,))
        cursor.execute("DELETE FROM ProdutoraFilme WHERE id_filme = %s", (id_filme,))
        cursor.execute("DELETE FROM FilmeDiretor WHERE id_filme = %s", (id_filme,))
        cursor.execute("DELETE FROM AtorFilme WHERE id_filme = %s", (id_filme,))
        
        # Insere Novos
        cursor.execute("INSERT INTO GeneroFilme (id_genero, id_filme) VALUES (%s, %s)", (int(data['id_genero']), id_filme))
        cursor.execute("INSERT INTO LinguagemFilme (id_linguagem, id_filme) VALUES (%s, %s)", (int(data['id_linguagem']), id_filme))
        
        id_produtora = self.get_or_create_id(cursor, 'Produtora', data['produtora'])
        cursor.execute("INSERT INTO ProdutoraFilme (id_filme, id_produtora) VALUES (%s, %s)", (id_filme, id_produtora))
        
        id_diretor = self.get_or_create_id(cursor, 'Diretor', data['diretor'])
        cursor.execute("INSERT INTO FilmeDiretor (id_filme, id_diretor) VALUES (%s, %s)", (id_filme, id_diretor))
        
        atores_list = [ator.strip() for ator in data['atores'].split(',')]
        for ator_nome in atores_list:
            if ator_nome:
                id_ator = self.get_or_create_id(cursor, 'Ator', ator_nome)
                cursor.execute("INSERT INTO AtorFilme (id_filme, id_ator) VALUES (%s, %s)", (id_filme, id_ator))
    
    # --- Verificador de Login (Simulado) ---
    def accont_user(self, login, password):
        if login == "admin" and password == "admin123":
            return {"status": "logado", "role": "admin"}
        elif login == "user" and password == "user123":
            return {"status": "logado", "role": "comum"}
        else:
            return {"status": "falha"}

    # --- Métodos GET ---
    def do_GET(self):
        parsed_path = urlparse(self.path)
        path = parsed_path.path
        query_params = parse_qs(parsed_path.query)

        # Rota API: /api/filmes (com Busca e Filtros)
        if path == "/api/filmes":
            try:
                if not mydb.is_connected(): mydb.reconnect()
                cursor = mydb.cursor(dictionary=True)
                
                # --- LÓGICA DE BUSCA E FILTRO ---
                sql = """
                    SELECT 
                        f.ID AS id_filme, f.Titulo AS nomeFilme, f.TempoDuracao AS tempo_duracao,
                        f.Ano AS ano, f.Poster AS poster, f.Sinopse AS sinopse, f.Status AS status,
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
                """
                
                # Lista de condições WHERE
                where_clauses = ["f.Status = 'APROVADO'"]
                params = []

                # Verifica se há um parâmetro de busca
                if 'busca' in query_params:
                    termo_busca = f"%{query_params['busca'][0]}%"
                    # Busca no Título, Atores ou Diretores
                    where_clauses.append("""
                        (f.Titulo LIKE %s 
                        OR a.Nome LIKE %s OR a.Sobrenome LIKE %s
                        OR d.Nome LIKE %s OR d.Sobrenome LIKE %s)
                    """)
                    params.extend([termo_busca, termo_busca, termo_busca, termo_busca, termo_busca])
                
                # (Futuramente, adicione filtros de gênero, ano, etc. aqui)
                
                if where_clauses:
                    sql += " WHERE " + " AND ".join(where_clauses)

                sql += " GROUP BY f.ID ORDER BY f.Titulo;"
                
                cursor.execute(sql, tuple(params))
                filmes = cursor.fetchall()
                cursor.close()

                self.send_response(200)
                self.send_cors_headers()
                self.send_header("Content-type", "application/json; charset=utf-8")
                self.end_headers()
                self.wfile.write(json.dumps(filmes, ensure_ascii=False).encode("utf-8"))

            except Exception as e:
                self.send_response(500)
                self.send_cors_headers()
                self.send_header("Content-type", "application/json; charset=utf-8")
                self.end_headers()
                self.wfile.write(json.dumps({"error": f"Erro ao buscar filmes: {str(e)}"}).encode("utf-8"))

        # Rota API: /api/filme/{id} (Filme individual)
        elif re.match(r"/api/filme/(\d+)", path):
            try:
                filme_id = path.split("/")[-1]
                if not mydb.is_connected(): mydb.reconnect()
                cursor = mydb.cursor(dictionary=True)
                
                sql = """
                    SELECT 
                        f.ID AS id_filme, f.Titulo AS nomeFilme, f.TempoDuracao AS tempo_duracao,
                        f.Ano AS ano, f.Poster AS poster, f.Sinopse AS sinopse, f.Status AS status,
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
                    self.send_cors_headers()
                    self.send_header("Content-type", "application/json; charset=utf-8")
                    self.end_headers()
                    self.wfile.write(json.dumps(filme, ensure_ascii=False).encode("utf-8"))
                else:
                    self.send_response(404)
                    self.send_cors_headers()
                    self.send_header("Content-type", "application/json; charset=utf-8")
                    self.end_headers()
                    self.wfile.write(json.dumps({"error": "Filme não encontrado"}).encode("utf-8"))
            except Exception as e:
                self.send_response(500)
                self.send_cors_headers()
                self.send_header("Content-type", "application/json; charset=utf-8")
                self.end_headers()
                self.wfile.write(json.dumps({"error": f"Erro ao buscar filme: {str(e)}"}).encode("utf-8"))
        
        # Rota API: /api/filmes/pendentes (Para Admin)
        elif path == "/api/filmes/pendentes":
            try:
                if not mydb.is_connected(): mydb.reconnect()
                cursor = mydb.cursor(dictionary=True)
                # Busca apenas filmes com Status PENDENTE
                sql = "SELECT ID AS id_filme, Titulo AS nomeFilme FROM Filme WHERE Status = 'PENDENTE' ORDER BY ID DESC"
                cursor.execute(sql)
                filmes_pendentes = cursor.fetchall()
                cursor.close()
                
                self.send_response(200)
                self.send_cors_headers()
                self.send_header("Content-type", "application/json; charset=utf-8")
                self.end_headers()
                self.wfile.write(json.dumps(filmes_pendentes, ensure_ascii=False).encode("utf-8"))

            except Exception as e:
                self.send_response(500)
                self.send_cors_headers()
                self.send_header("Content-type", "application/json; charset=utf-8")
                self.end_headers()
                self.wfile.write(json.dumps({"error": f"Erro ao buscar filmes pendentes: {str(e)}"}).encode("utf-8"))

        else:
            # Se nenhuma rota de API for encontrada, retorna 404
            self.send_response(404)
            self.send_cors_headers()
            self.send_header("Content-type", "application/json; charset=utf-8")
            self.end_headers()
            self.wfile.write(json.dumps({"error": f"Rota GET '{path}' não encontrada."}).encode("utf-8"))


    # --- Métodos POST ---
    def do_POST(self):
        path = urlparse(self.path).path
        
        def send_json_response(status_code, content):
            self.send_response(status_code)
            self.send_cors_headers()
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
                'sinopse': form_data.get('sinopse', [''])[0].strip() or None,
                'userRole': form_data.get('userRole', ['comum'])[0].strip() # Captura o role
            }

            try:
                # Validação
                if not all([data['titulo'], data['atores'], data['diretor'], data['ano'], 
                            data['duracao'], data['id_genero'], data['produtora'], 
                            data['id_linguagem'], data['poster'], data['sinopse']]):
                    raise ValueError("Todos os campos (incluindo sinopse) são obrigatórios.")
                int(data['ano'])
                int(data['duracao'])
                int(data['id_genero'])
                int(data['id_linguagem'])
            except Exception as ve:
                send_json_response(400, {"status": "erro", "message": f"Dados inválidos: {ve}"})
                return

            try:
                if not mydb.is_connected(): mydb.reconnect()
                cursor = mydb.cursor()
                
                # Determina o status baseado no role
                status_filme = 'APROVADO' if data['userRole'] == 'admin' else 'PENDENTE'
                
                # Salva com o status correto
                sql_filme = "INSERT INTO Filme (Titulo, TempoDuracao, Ano, Poster, Sinopse, Status) VALUES (%s, %s, %s, %s, %s, %s)"
                cursor.execute(sql_filme, (
                    data['titulo'], int(data['duracao']), int(data['ano']), 
                    data['poster'], data['sinopse'], status_filme
                ))
                id_filme = cursor.lastrowid

                self._atualizar_relacionamentos_filme(cursor, id_filme, data)

                mydb.commit() 
                cursor.close()
                send_json_response(200, {"status": "sucesso", "id": id_filme, "message": "Filme processado!"})

            except mysql.connector.Error as err:
                mydb.rollback() 
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
                'sinopse': form_data.get('sinopse', [''])[0].strip() or None,
                'userRole': form_data.get('userRole', ['comum'])[0].strip() # Captura o role
            }

            try:
                if not data['id_filme'].isdigit():
                    raise ValueError("ID do filme é inválido.")
            except Exception as ve:
                send_json_response(400, {"status": "erro", "message": f"Dados inválidos: {ve}"})
                return

            try:
                if not mydb.is_connected(): mydb.reconnect()
                cursor = mydb.cursor()
                id_filme = int(data['id_filme'])
                
                status_filme = 'APROVADO' if data['userRole'] == 'admin' else 'PENDENTE'
                
                sql_filme = """
                    UPDATE Filme SET 
                    Titulo = %s, TempoDuracao = %s, Ano = %s, Poster = %s, Sinopse = %s, Status = %s
                    WHERE ID = %s
                """
                cursor.execute(sql_filme, (
                    data['titulo'], int(data['duracao']), int(data['ano']), 
                    data['poster'], data['sinopse'], status_filme, id_filme
                ))

                self._atualizar_relacionamentos_filme(cursor, id_filme, data)

                mydb.commit() 
                cursor.close()
                send_json_response(200, {"status": "sucesso", "id": id_filme, "message": "Filme atualizado!"})

            except Exception as err:
                mydb.rollback() 
                send_json_response(500, {"status": "erro", "message": f"Erro ao editar filme: {err}"})
        
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
                        "role": resultado["role"]
                    })
                else:
                    send_json_response(401, {"status": "erro", "message": "Usuário ou senha inválidos"})
            except Exception as e:
                send_json_response(500, {"status": "erro", "message": f"Erro no servidor: {e}"})

        # Rota POST: /delete
        elif path == '/delete':
            try:
                content_length = int(self.headers['Content-Length'])
                body = self.rfile.read(content_length).decode('utf-8')
                form_data = parse_qs(body)
                filme_id = int(form_data.get('id', [None])[0])

                if not mydb.is_connected(): mydb.reconnect()
                cursor = mydb.cursor()
                
                # Deleta das tabelas de junção
                cursor.execute("DELETE FROM AtorFilme WHERE id_filme = %s", (filme_id,))
                cursor.execute("DELETE FROM GeneroFilme WHERE id_filme = %s", (filme_id,))
                cursor.execute("DELETE FROM FilmeDiretor WHERE id_filme = %s", (filme_id,))
                cursor.execute("DELETE FROM LinguagemFilme WHERE id_filme = %s", (filme_id,))
                cursor.execute("DELETE FROM ProdutoraFilme WHERE id_filme = %s", (filme_id,))
                cursor.execute("DELETE FROM PaisFilme WHERE id_filme = %s", (filme_id,))
                # Deleta o filme principal
                cursor.execute("DELETE FROM Filme WHERE ID = %s", (filme_id,))
                
                if cursor.rowcount == 0:
                    raise Exception("Filme não encontrado.")

                mydb.commit() 
                cursor.close()
                send_json_response(200, {"status": "sucesso", "message": "Filme deletado com sucesso."})

            except Exception as e:
                mydb.rollback() 
                send_json_response(500, {"status": "erro", "message": f"Erro ao deletar: {str(e)}"})
        
        # --- NOVAS ROTAS DE ADMIN ---

        # Rota POST: /api/filme/aprovar
        elif path == '/api/filme/aprovar':
            try:
                content_length = int(self.headers['Content-Length'])
                body = self.rfile.read(content_length).decode('utf-8')
                form_data = parse_qs(body)
                filme_id = int(form_data.get('id', [None])[0])

                if not mydb.is_connected(): mydb.reconnect()
                cursor = mydb.cursor()
                cursor.execute("UPDATE Filme SET Status = 'APROVADO' WHERE ID = %s", (filme_id,))
                
                if cursor.rowcount == 0:
                    raise Exception("Filme não encontrado para aprovar.")
                
                mydb.commit()
                cursor.close()
                send_json_response(200, {"status": "sucesso", "message": "Filme aprovado!"})
            except Exception as e:
                mydb.rollback()
                send_json_response(500, {"status": "erro", "message": f"Erro ao aprovar: {str(e)}"})
        
        # Rota POST: /api/filme/rejeitar (Deleta o filme)
        elif path == '/api/filme/rejeitar':
            try:
                # Esta rota vai deletar o filme, então reutiliza a lógica de /delete
                # (Seria melhor ter uma função auxiliar de delete)
                content_length = int(self.headers['Content-Length'])
                body = self.rfile.read(content_length).decode('utf-8')
                form_data = parse_qs(body)
                filme_id = int(form_data.get('id', [None])[0])

                if not mydb.is_connected(): mydb.reconnect()
                cursor = mydb.cursor()
                
                # Deleta das tabelas de junção
                cursor.execute("DELETE FROM AtorFilme WHERE id_filme = %s", (filme_id,))
                cursor.execute("DELETE FROM GeneroFilme WHERE id_filme = %s", (filme_id,))
                cursor.execute("DELETE FROM FilmeDiretor WHERE id_filme = %s", (filme_id,))
                cursor.execute("DELETE FROM LinguagemFilme WHERE id_filme = %s", (filme_id,))
                cursor.execute("DELETE FROM ProdutoraFilme WHERE id_filme = %s", (filme_id,))
                cursor.execute("DELETE FROM PaisFilme WHERE id_filme = %s", (filme_id,))
                # Deleta o filme principal
                cursor.execute("DELETE FROM Filme WHERE ID = %s AND Status = 'PENDENTE'", (filme_id,))
                
                if cursor.rowcount == 0:
                     raise Exception("Filme não encontrado ou já aprovado.")

                mydb.commit()
                cursor.close()
                send_json_response(200, {"status": "sucesso", "message": "Filme rejeitado e deletado."})
            except Exception as e:
                mydb.rollback()
                send_json_response(500, {"status": "erro", "message": f"Erro ao rejeitar: {str(e)}"})

        else:
            send_json_response(404, {"status": "erro", "message": "Rota POST não encontrada."})

def main():
    # ... (Não muda)
    server_address = ('', 8000)
    httpd = HTTPServer(server_address, MyHandle)
    print(f"🚀 Servidor rodando em http://localhost:8000")
    print(f"Servindo arquivos do diretório: {os.getcwd()}")
    httpd.serve_forever()

if __name__ == '__main__':
    main()