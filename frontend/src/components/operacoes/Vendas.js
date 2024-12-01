import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../axiosInstance';
import '../../styles/Vendas.css';

function Vendas() {
    const [vendas, setVendas] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedVendas, setSelectedVendas] = useState([]);
    const navigate = useNavigate();

    // Fetch de vendas
    useEffect(() => {
        const fetchVendas = async () => {
            try {
                const token = localStorage.getItem('token');
                if (!token) {
                    alert('Você precisa estar logado para acessar esta página.');
                    navigate('/login');
                    return;
                }

                const response = await api.get('/vendas', {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                setVendas(response.data);
            } catch (error) {
                console.error('Erro ao buscar vendas:', error);
                alert('Erro ao carregar vendas. Verifique suas permissões.');
            }
        };

        fetchVendas();
    }, [navigate]);

    // Lida com a seleção de checkboxes
    const handleSelectVenda = (vendaId) => {
        setSelectedVendas((prevSelected) => {
            if (prevSelected.includes(vendaId)) {
                return prevSelected.filter(id => id !== vendaId);
            } else {
                return [...prevSelected, vendaId];
            }
        });
    };

    // Lida com a busca
    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
    };

    // Filtra vendas com base no termo de busca
    const filteredVendas = vendas.filter(venda =>
        venda.cod_venda.toLowerCase().includes(searchTerm.toLowerCase()) ||
        venda.cliente_nome.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Redireciona para a página de nova venda
    const handleNovaVenda = () => {
        navigate('./nova');
    };

    // Atualiza uma venda
    /*
    const handleEditVenda = () => {
        if (selectedVendas.length === 1) {
            navigate(`/vendas/editar/${selectedVendas[0]}`);
        } else {
            alert('Selecione apenas uma venda para editar.');
        }
    };
    */

    // Deleta vendas selecionadas
    const handleDeleteVendas = async () => {
        try {
            const token = localStorage.getItem('token');
            await Promise.all(selectedVendas.map(id =>
                api.delete(`/vendas/${id}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                })
            ));
            setVendas(vendas.filter(venda => !selectedVendas.includes(venda.vendaId)));
            setSelectedVendas([]);
            alert('Venda(s) deletada(s) com sucesso.');
        } catch (error) {
            console.error('Erro ao deletar venda(s):', error);
            alert('Erro ao deletar venda(s). Verifique suas permissões.');
        }
    };

    return (
        <div className="vendas-content">
            <h1>Vendas</h1>
            <p>Gerenciamento de vendas realizadas.</p>

            {/* Barra de Pesquisa */}
            <input
                type="text"
                placeholder="Pesquisar por Código ou Cliente"
                value={searchTerm}
                onChange={handleSearchChange}
                className="search-bar"
            />

            {/* Botões de Ação */}
            <button onClick={handleNovaVenda} className="btn-nova-venda action-button">
                Nova Venda
            </button>
            {/** 
            <button
                onClick={handleEditVenda}
                disabled={selectedVendas.length !== 1}
                className="btn-editar-venda action-button"
            >
                Editar Venda
            </button>
            */}
            <button
                onClick={handleDeleteVendas}
                disabled={selectedVendas.length === 0}
                className="btn-deletar-venda action-button"
            >
                Deletar Venda
            </button>

            {/* Tabela de Vendas */}
            {filteredVendas.length > 0 ? (
                <table className="vendas-table">
                    <thead>
                        <tr>
                            <th></th> {/* Checkbox */}
                            <th>Código da Venda</th>
                            <th>Data</th>
                            <th>Cliente</th>
                            <th>Vendedor</th>
                            <th>Veículo</th>
                            <th>Valor Total</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredVendas.map((venda) => (
                            <tr key={venda.vendaId}>
                                <td>
                                    <input
                                        type="checkbox"
                                        checked={selectedVendas.includes(venda.vendaId)}
                                        onChange={() => handleSelectVenda(venda.vendaId)}
                                    />
                                </td>
                                <td>{venda.cod_venda}</td>
                                <td>{venda.data}</td>
                                <td>{venda.cliente_nome}</td>
                                <td>{venda.vendedor_nome}</td>
                                <td>{venda.veiculo_modelo}</td>
                                <td>{venda.valor_total}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            ) : (
                <p>Nenhuma venda encontrada.</p>
            )}
        </div>
    );
}

export default Vendas;
