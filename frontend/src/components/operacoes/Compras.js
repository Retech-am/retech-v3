import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../axiosInstance';
import '../../styles/Compras.css';

function Compras() {
    const [compras, setCompras] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCompras, setSelectedCompras] = useState([]);
    const navigate = useNavigate();

    // Fetch das compras
    useEffect(() => {
        const fetchCompras = async () => {
            try {
                const token = localStorage.getItem('token');
                if (!token) {
                    alert('Você precisa estar logado para acessar esta página.');
                    navigate('/login');
                    return;
                }

                const response = await api.get('/compras', {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                setCompras(response.data);
            } catch (error) {
                console.error('Erro ao buscar compras:', error);
                alert('Erro ao carregar compras. Verifique suas permissões.');
            }
        };

        fetchCompras();
    }, [navigate]);

    // Lida com a seleção de checkboxes
    const handleSelectCompra = (compraId) => {
        setSelectedCompras((prevSelected) => {
            if (prevSelected.includes(compraId)) {
                return prevSelected.filter(id => id !== compraId);
            } else {
                return [...prevSelected, compraId];
            }
        });
    };

    // Lida com a busca
    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
    };

    // Filtra compras com base no termo de busca
    const filteredCompras = compras.filter(compra =>
        compra.cod_compra.toLowerCase().includes(searchTerm.toLowerCase()) ||
        compra.cliente_nome.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Redireciona para a página de nova compra
    const handleNovaCompra = () => {
        navigate('/operacoes/compras/nova');
    };

    // Redireciona para a página de edição
    /*
    const handleEditCompra = () => {
        if (selectedCompras.length === 1) {
            navigate(`/compras/editar/${selectedCompras[0]}`);
        } else {
            alert('Selecione apenas uma compra para editar.');
        }
    };
    */

    // Deleta compras selecionadas
    const handleDeleteCompras = async () => {
        try {
            const token = localStorage.getItem('token');
            await Promise.all(selectedCompras.map(id =>
                api.delete(`/compras/${id}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                })
            ));
            setCompras(compras.filter(compra => !selectedCompras.includes(compra.compraId)));
            setSelectedCompras([]);
            alert('Compra(s) deletada(s) com sucesso.');
        } catch (error) {
            console.error('Erro ao deletar compra(s):', error);
            alert('Erro ao deletar compra(s). Verifique suas permissões.');
        }
    };

    return (
        <div className="compras-content">
            <h1>Compras</h1>
            <p>Gerenciamento de compras registradas.</p>

            {/* Barra de Pesquisa */}
            <input
                type="text"
                placeholder="Pesquisar por Código ou Cliente"
                value={searchTerm}
                onChange={handleSearchChange}
                className="search-bar"
            />

            {/* Botões de Ação */}
            <button onClick={handleNovaCompra} className="btn-nova-compra action-button">
                Nova Compra
            </button>
            {/*
            <button
                onClick={handleEditCompra}
                disabled={selectedCompras.length !== 1}
                className="btn-editar-compra action-button"
            >
                Editar Compra
            </button>
            */}
            <button
                onClick={handleDeleteCompras}
                disabled={selectedCompras.length === 0}
                className="btn-deletar-compra action-button"
            >
                Deletar Compra
            </button>

            {/* Tabela de Compras */}
            {filteredCompras.length > 0 ? (
                <table className="compras-table">
                    <thead>
                        <tr>
                            <th></th> {/* Checkbox */}
                            <th>Código da Compra</th>
                            <th>Data</th>
                            <th>Cliente</th>
                            <th>Vendedor</th>
                            <th>Veículo</th>
                            <th>Valor</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredCompras.map((compra) => (
                            <tr key={compra.compraId}>
                                <td>
                                    <input
                                        type="checkbox"
                                        checked={selectedCompras.includes(compra.compraId)}
                                        onChange={() => handleSelectCompra(compra.compraId)}
                                    />
                                </td>
                                <td>{compra.cod_compra}</td>
                                <td>{compra.data}</td>
                                <td>{compra.cliente_nome}</td>
                                <td>{compra.vendedor_nome}</td>
                                <td>{compra.veiculo_modelo}</td>
                                <td>{compra.valor}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            ) : (
                <p>Nenhuma compra encontrada.</p>
            )}
        </div>
    );
}

export default Compras;
