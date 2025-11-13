import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import '../../components/MovieForm/movieform.css';
import 'bootstrap-icons/font/bootstrap-icons.css';

const EditarFilme = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        id_filme: id,
        nome: '',
        atores: '',
        diretor: '',
        ano: '',
        duracao: '',
        id_genero: '1',
        produtora: '',
        id_linguagem: '2',
        urlposter: '',
        sinopse: ''
    });
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState(null);

    // 1. Busca os dados atuais do filme
    useEffect(() => {
        const fetchFilme = async () => {
            try {
                // CORRIGIDO: Rota correta
                const response = await fetch(`http://localhost:8000/api/filme/${id}`);
                const data = await response.json();
                
                if (response.ok) {
                    setFormData({
                        id_filme: data.id_filme,
                        nome: data.nomeFilme || '',
                        atores: data.atores || '',
                        diretor: data.diretores || '',
                        ano: data.ano || '',
                        duracao: data.tempo_duracao || '',
                        // NOTA: O backend ainda não retorna os IDs de genero/linguagem
                        // O ideal seria o backend retornar (ex: id_genero: 2)
                        id_genero: '1', // Placeholder
                        produtora: data.produtoras || '',
                        id_linguagem: '2', // Placeholder
                        urlposter: data.poster || '',
                        sinopse: data.sinopse || ''
                    });
                } else {
                    throw new Error(data.message);
                }
            } catch (err) {
                setMessage({ type: 'error', text: err.message });
            } finally {
                setLoading(false);
            }
        };
        fetchFilme();
    }, [id]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    // 2. Envia os dados editados
    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage(null);

        try {
            const body = new URLSearchParams();
            for (const key in formData) {
                body.append(key, formData[key]);
            }

            const response = await fetch('http://localhost:8000/api/filme/editar', {
                method: 'POST',
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                body: body.toString()
            });

            const data = await response.json();

            if (response.ok) {
                setMessage({ type: 'success', text: data.message });
                setTimeout(() => {
                    navigate(`/filme/${id}`); // Volta para a página do filme
                }, 2000);
            } else {
                throw new Error(data.message || 'Erro ao editar filme.');
            }
        } catch (err) {
            setMessage({ type: 'error', text: err.message });
        }
    };

    if (loading) {
        return <div style={{color: 'white', textAlign: 'center', marginTop: '5rem', fontSize: '2rem'}}>Carregando...</div>;
    }

    return (
        <div className="form-filme-container">
            <h1><i className="bi bi-pencil-fill"></i> Editar Filme</h1>
            
            <form onSubmit={handleSubmit} className="form-filme">
                {/* Campos do formulário (idênticos ao de Adicionar) */}
                <div className="form-group">
                    <label htmlFor="nome">Título do Filme</label>
                    <input type="text" id="nome" name="nome" value={formData.nome} onChange={handleChange} required />
                </div>
                
                <div className="form-group">
                    <label htmlFor="urlposter">URL do Pôster</label>
                    <input type="url" id="urlposter" name="urlposter" value={formData.urlposter} onChange={handleChange} required />
                </div>

                <div className="form-row">
                    <div className="form-group">
                        <label htmlFor="ano">Ano de Lançamento</label>
                        <input type="number" id="ano" name="ano" value={formData.ano} onChange={handleChange} required />
                    </div>
                    <div className="form-group">
                        <label htmlFor="duracao">Duração (em minutos)</label>
                        <input type="number" id="duracao" name="duracao" value={formData.duracao} onChange={handleChange} required />
                    </div>
                </div>

                <div className="form-group">
                    <label htmlFor="sinopse">Sinopse</label>
                    <textarea id="sinopse" name="sinopse" value={formData.sinopse} onChange={handleChange} required />
                </div>
                
                <div className="form-row">
                    <div className="form-group">
                        <label htmlFor="diretor">Diretor</label>
                        <input type="text" id="diretor" name="diretor" value={formData.diretor} onChange={handleChange} required />
                    </div>
                    <div className="form-group">
                        <label htmlFor="produtora">Produtora</label>
                        <input type="text" id="produtora" name="produtora" value={formData.produtora} onChange={handleChange} required />
                    </div>
                </div>
                
                <div className="form-group">
                    <label htmlFor="atores">Atores (separados por vírgula)</label>
                    <input type="text" id="atores" name="atores" value={formData.atores} onChange={handleChange} required />
                </div>

                <div className="form-row">
                    <div className="form-group">
                        <label htmlFor="id_genero">Gênero</label>
                        <select id="id_genero" name="id_genero" value={formData.id_genero} onChange={handleChange}>
                            <option value="1">Romance</option>
                            <option value="2">Drama</option>
                            <option value="3">Ação</option>
                            <option value="4">Ficção Científica</option>
                            <option value="5">Aventura</option>
                            <option value="6">Terror</option>
                            <option value="9">Biografia</option>
                            <option value="10">Comédia</option>
                            <option value="12">Animação</option>
                        </select>
                    </div>
                    <div className="form-group">
                        <label htmlFor="id_linguagem">Linguagem Original</label>
                        <select id="id_linguagem" name="id_linguagem" value={formData.id_linguagem} onChange={handleChange}>
                            <option value="2">Inglês</option>
                            <option value="1">Português</option>
                            <option value="9">Coreano</option>
                            <option value="7">Japonês</option>
                            <option value="4">Francês</option>
                            <option value="3">Espanhol</option>
                        </select>
                    </div>
                </div>
                
                <div className="form-actions">
                    <button type="button" className="form-button cancel" onClick={() => navigate(-1)}>Cancelar</button>
                    <button type="submit" className="form-button submit">Enviar Edição</button>
                </div>
            </form>

            {message && (
                <div className={`form-message ${message.type}`}>
                    {message.text}
                </div>
            )}
        </div>
    );
};

export default EditarFilme;