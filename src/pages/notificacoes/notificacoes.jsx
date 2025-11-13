import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/authcontext';
import './notificacoes.css';
import 'bootstrap-icons/font/bootstrap-icons.css';

const Notificacoes = () => {
    const { userRole } = useAuth();
    const [pendentes, setPendentes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchPendentes = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await fetch('http://localhost:8000/api/filmes/pendentes');
            const data = await response.json();
            if (response.ok) {
                setPendentes(data);
            } else {
                throw new Error(data.message);
            }
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    // Busca inicial
    useEffect(() => {
        if (userRole === 'admin') {
            fetchPendentes();
        }
    }, [userRole]);

    const handleAction = async (id, action) => {
        // 'action' deve ser 'aprovar' ou 'rejeitar'
        try {
            const body = new URLSearchParams();
            body.append('id', id);

            const response = await fetch(`http://localhost:8000/api/filme/${action}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                body: body.toString()
            });

            const data = await response.json();
            if (response.ok) {
                // Remove o item da lista localmente e recarrega a lista
                setPendentes(prev => prev.filter(filme => filme.id_filme !== id));
                // Opcional: recarregar tudo com fetchPendentes()
            } else {
                throw new Error(data.message);
            }
        } catch (err) {
            alert(`Erro ao ${action} filme: ${err.message}`);
        }
    };

    if (userRole !== 'admin') {
        return <div className="notificacoes-container">Acesso negado.</div>;
    }

    if (loading) {
        return <div className="notificacoes-container">Carregando...</div>;
    }

    if (error) {
        return <div className="notificacoes-container">Erro: {error}</div>;
    }

    return (
        <div className="notificacoes-container">
            <h1>
                <i className="bi bi-bell-fill"></i>
                <span className='title-notificacoes'>
                    Notificações Pendentes
                </span>
                
            </h1>

            {pendentes.length === 0 ? (
                <p>Nenhum filme pendente de aprovação.</p>
            ) : (
                <ul className="notificacoes-lista-pagina">
                    {pendentes.map(filme => (
                        <li key={filme.id_filme} className="notificacao-item-pagina">
                            <div className="notificacao-info">
                                <strong>{filme.nomeFilme}</strong>
                                <span> (Ano: {filme.ano})</span>
                            </div>
                            <div className="notificacao-actions">
                                <button
                                    className="action-btn approve"
                                    onClick={() => handleAction(filme.id_filme, 'aprovar')}
                                    aria-label="Aprovar"
                                >
                                    <i className="bi bi-check-circle-fill"></i> Aprovar
                                </button>
                                <button
                                    className="action-btn reject"
                                    onClick={() => handleAction(filme.id_filme, 'rejeitar')}
                                    aria-label="Rejeitar"
                                >
                                    <i className="bi bi-x-circle-fill"></i> Rejeitar
                                </button>
                            </div>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default Notificacoes;