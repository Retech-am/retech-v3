import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../styles/Perfil.css';

function Perfil() {
    const [vendedores, setVendedores] = useState([]);
    const [selectedVendedorIds, setSelectedVendedorIds] = useState([]);
    const [perfil, setPerfil] = useState(null);
    const [isGerente, setIsGerente] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchPerfil = async () => {
            try {
                const response = await axios.get('http://localhost:3001/api/vendedores/perfil', {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`,
                    },
                });
                setPerfil(response.data);
                setIsGerente(response.data.cargo === 'Gerente');
            } catch (error) {
                console.error('Erro ao carregar perfil:', error);
            }
        };

        fetchPerfil();
    }, []);

    useEffect(() => {
        if (isGerente) {
            const fetchVendedores = async () => {
                try {
                    const response = await axios.get('http://localhost:3001/api/vendedores', {
                        headers: {
                            Authorization: `Bearer ${localStorage.getItem('token')}`,
                        },
                    });
                    setVendedores(response.data);
                } catch (error) {
                    console.error('Erro ao carregar vendedores:', error);
                }
            };

            fetchVendedores();
        }
    }, [isGerente]);

    const handleSelectVendedor = (vendedorId) => {
        setSelectedVendedorIds((prevSelected) => {
            if (prevSelected.includes(vendedorId)) {
                return prevSelected.filter(id => id !== vendedorId);
            } else {
                return [...prevSelected, vendedorId];
            }
        });
    };

    const handleEditG = () => {
        if (selectedVendedorIds.length === 1) {
            const vendedorId = selectedVendedorIds[0];
            navigate(`/perfil/editar/${vendedorId}`);
        } else {
            alert('Selecione apenas um vendedor para editar.');
        }
    };

    const handleEdit = async () => {
        try {
            if (!perfil) return;

            // Atualiza o perfil do vendedor logado ou selecionado
            await axios.put(`http://localhost:3001/api/vendedores/${perfil.vendedorId}`, perfil, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
            });
            alert('Alterações salvas com sucesso!');
        } catch (error) {
            console.error('Erro ao salvar alterações:', error);
            alert('Erro ao salvar alterações.');
        }
    };

    const handleDelete = async () => {
        try {
            await Promise.all(
                selectedVendedorIds.map((vendedorId) =>
                    axios.delete(`http://localhost:3001/api/vendedores/${vendedorId}`, {
                        headers: {
                            Authorization: `Bearer ${localStorage.getItem('token')}`,
                        },
                    })
                )
            );
            alert('Vendedores deletados com sucesso!');
            setVendedores(vendedores.filter((v) => !selectedVendedorIds.includes(v.vendedorId)));
            setSelectedVendedorIds([]);
        } catch (error) {
            console.error('Erro ao deletar vendedores:', error);
            alert('Erro ao deletar vendedores.');
        }
    };

    const handlePromote = async () => {
        try {
            await Promise.all(
                selectedVendedorIds.map((vendedorId) =>
                    axios.put(`http://localhost:3001/api/vendedores/promover/${vendedorId}`, {}, {
                        headers: {
                            Authorization: `Bearer ${localStorage.getItem('token')}`,
                        },
                    })
                )
            );
            alert('Vendedores promovidos com sucesso!');
            window.location.reload();
        } catch (error) {
            console.error('Erro ao promover vendedores:', error);
            alert('Erro ao promover vendedores.');
        }
    };

    const handleCancel = () => {
        navigate('/home'); // Redireciona para a tela Home
    };

    return (
        <div>
            <h1>Perfil</h1>
            {isGerente ? (
                <div>
                    <h2>Lista de Vendedores</h2>
                    <input
                        type="text"
                        placeholder="Pesquisar por Nome ou Email"
                        className="search-bar"
                    />
                    <div className="action-buttons">
                        <button
                            onClick={handleEditG}
                            disabled={selectedVendedorIds.length !== 1}
                            className="btn-action"
                        >
                            Editar
                        </button>
                        <button
                            onClick={handlePromote}
                            disabled={selectedVendedorIds.length === 0}
                            className="btn-action"
                        >
                            Promover
                        </button>
                        <button
                            onClick={handleDelete}
                            disabled={selectedVendedorIds.length === 0}
                            className="btn-action"
                        >
                            Deletar
                        </button>
                    </div>
                    <table className="vendedores-table">
                        <thead>
                            <tr>
                                <th></th> {/* Checkbox */}
                                <th>Matrícula</th>
                                <th>Nome</th>
                                <th>Email</th>
                                <th>Cargo</th>
                            </tr>
                        </thead>
                        <tbody>
                            {vendedores.map((vendedor) => (
                                <tr key={vendedor.vendedorId}>
                                    <td>
                                        <input
                                            type="checkbox"
                                            checked={selectedVendedorIds.includes(vendedor.vendedorId)}
                                            onChange={() => handleSelectVendedor(vendedor.vendedorId)}
                                        />
                                    </td>
                                    <td>{vendedor.matricula}</td>
                                    <td>{vendedor.nome}</td>
                                    <td>{vendedor.email}</td>
                                    <td>{vendedor.cargo}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            ) : (
                <div>
                    <h2>Meu Perfil</h2>
                    <form>
                        <label>
                            Matrícula:
                            <input type="text" value={perfil?.matricula || ''} readOnly />
                        </label>
                        <label>
                            Cargo:
                            <input type="text" value={perfil?.cargo || ''} readOnly />
                        </label>
                        <label>
                            Nome:
                            <input
                                type="text"
                                value={perfil?.nome || ''}
                                onChange={(e) => setPerfil({ ...perfil, nome: e.target.value })}
                                required
                            />
                        </label>
                        <label>
                            Email:
                            <input
                                type="email"
                                value={perfil?.email || ''}
                                onChange={(e) => setPerfil({ ...perfil, email: e.target.value })}
                                required
                            />
                        </label>
                        <label>
                            Senha:
                            <input
                                type="password"
                                value={perfil?.senha || ''}
                                onChange={(e) => setPerfil({ ...perfil, senha: e.target.value })}
                            />
                        </label>
                        <div className="action-buttons">
                            <button type="button" onClick={handleEdit} className="btn-save">
                                Salvar Alterações
                            </button>
                            <button type="button" onClick={handleCancel} className="btn-cancel">
                                Cancelar
                            </button>
                        </div>
                    </form>
                </div>
            )}
        </div>
    );
}

export default Perfil;
