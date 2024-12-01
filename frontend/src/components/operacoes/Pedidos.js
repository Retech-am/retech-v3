import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../axiosInstance';
import '../../styles/Pedidos.css';

function Pedidos() {
    const [pedidos, setPedidos] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedPedidos, setSelectedPedidos] = useState([]);
    const navigate = useNavigate();

    // Fetch dos pedidos
    useEffect(() => {
        const fetchPedidos = async () => {
            try {
                const token = localStorage.getItem('token');
                if (!token) {
                    alert('Você precisa estar logado para acessar esta página.');
                    navigate('/login');
                    return;
                }

                const response = await api.get('/pedidos', {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                setPedidos(response.data);
            } catch (error) {
                console.error('Erro ao buscar pedidos:', error);
                alert('Erro ao carregar pedidos. Verifique suas permissões.');
            }
        };

        fetchPedidos();
    }, [navigate]);

    // Lida com a seleção de checkboxes
    const handleSelectPedido = (pedidoId) => {
        setSelectedPedidos((prevSelected) => {
            if (prevSelected.includes(pedidoId)) {
                return prevSelected.filter(id => id !== pedidoId);
            } else {
                return [...prevSelected, pedidoId];
            }
        });
    };

    // Lida com a busca
    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
    };

    // Filtra pedidos com base no termo de busca
    const filteredPedidos = pedidos.filter(pedido =>
        pedido.cod_pedido.toLowerCase().includes(searchTerm.toLowerCase()) ||
        pedido.cliente_nome.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Redireciona para a página de novo pedido
    const handleNovoPedido = () => {
        navigate('./novo');
    };

    // Atualiza um pedido (implementação futura)
    /*
    const handleEditPedido = () => {
        if (selectedPedidos.length === 1) {
            navigate(`/operacoes/pedidos/editar/${selectedPedidos[0]}`);
        } else {
            alert('Selecione apenas um pedido para editar.');
        }
    };
    */

    // Deleta pedidos selecionados
    const handleDeletePedidos = async () => {
        try {
            const token = localStorage.getItem('token');
            await Promise.all(selectedPedidos.map(id =>
                api.delete(`/pedidos/${id}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                })
            ));
            setPedidos(pedidos.filter(pedido => !selectedPedidos.includes(pedido.pedidoId)));
            setSelectedPedidos([]);
            alert('Pedido(s) deletado(s) com sucesso.');
        } catch (error) {
            console.error('Erro ao deletar pedido(s):', error);
            alert('Erro ao deletar pedido(s). Verifique suas permissões.');
        }
    };

    return (
        <div className="pedidos-content">
            <h1>Pedidos</h1>
            <p>Gerenciamento de pedidos registrados.</p>

            {/* Barra de Pesquisa */}
            <input
                type="text"
                placeholder="Pesquisar por Código ou Cliente"
                value={searchTerm}
                onChange={handleSearchChange}
                className="search-bar"
            />

            {/* Botões de Ação */}
            <button onClick={handleNovoPedido} className="btn-novo-pedido action-button">
                Novo Pedido
            </button>
            {/*
            <button
                onClick={handleEditPedido}
                disabled={selectedPedidos.length !== 1}
                className="btn-editar-pedido action-button"
            >
                Editar Pedido
            </button>
            */}
            <button
                onClick={handleDeletePedidos}
                disabled={selectedPedidos.length === 0}
                className="btn-deletar-pedido action-button"
            >
                Deletar Pedido
            </button>

            {/* Tabela de Pedidos */}
            {filteredPedidos.length > 0 ? (
                <table className="pedidos-table">
                    <thead>
                        <tr>
                            <th></th> {/* Checkbox */}
                            <th>Código do Pedido</th>
                            <th>Data</th>
                            <th>Cliente</th>
                            <th>Montadora</th>
                            <th>Modelo</th>
                            <th>Ano</th>
                            <th>Cor</th>
                            <th>Valor</th>
                            <th>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredPedidos.map((pedido) => (
                            <tr key={pedido.pedidoId}>
                                <td>
                                    <input
                                        type="checkbox"
                                        checked={selectedPedidos.includes(pedido.pedidoId)}
                                        onChange={() => handleSelectPedido(pedido.pedidoId)}
                                    />
                                </td>
                                <td>{pedido.cod_pedido}</td>
                                <td>{pedido.data}</td>
                                <td>{pedido.cliente_nome}</td>
                                <td>{pedido.montadora_nome}</td>
                                <td>{pedido.modelo}</td>
                                <td>{pedido.ano}</td>
                                <td>{pedido.cor}</td>
                                <td>{pedido.valor}</td>
                                <td>{pedido.status}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            ) : (
                <p>Nenhum pedido encontrado.</p>
            )}
        </div>
    );
}

export default Pedidos;
