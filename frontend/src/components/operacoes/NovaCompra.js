import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../axiosInstance';
import '../../styles/NovaCompra.css';

function NovaCompra() {
    const [clientes, setClientes] = useState([]);
    const [veiculos, setVeiculos] = useState([]);
    const [vendedores, setVendedores] = useState([]);
    const [formData, setFormData] = useState({
        cliente_id: '',
        veiculo_id: '',
        vendedor_id: '',
        valor: '',
        data: '',
    });
    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const token = localStorage.getItem('token');
                if (!token) {
                    alert('Você precisa estar logado para acessar esta página.');
                    navigate('/login');
                    return;
                }

                // Fetch de clientes
                const clientesResponse = await api.get('/clientes', {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                // Fetch de veículos disponíveis para compra
                const veiculosResponse = await api.get('/veiculos/disponiveis?para=compra', {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                // Fetch de vendedores
                const vendedoresResponse = await api.get('/vendedores', {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                setClientes(clientesResponse.data);
                setVeiculos(veiculosResponse.data);
                setVendedores(vendedoresResponse.data);
            } catch (error) {
                console.error('Erro ao carregar dados:', error);
                alert('Erro ao carregar dados. Verifique suas permissões.');
            }
        };

        fetchData();
    }, [navigate]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));

        // Atualiza o valor automaticamente ao selecionar um veículo
        if (name === 'veiculo_id') {
            const selectedVeiculo = veiculos.find((veiculo) => veiculo.veiculoId.toString() === value);
            if (selectedVeiculo) {
                setFormData((prevData) => ({
                    ...prevData,
                    valor: selectedVeiculo.valor,
                }));
            }
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');
            await api.post('/compras', formData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            // Atualizar o status do veículo para "comprado"
            await api.put(`/veiculos/atualizar-status/${formData.veiculo_id}`, {
                status: 'comprado', // Atualiza para "comprado"
                disponivelPara: 'nenhum', // Marca como não disponível
            }, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
            });
            alert('Compra registrada com sucesso!');
            navigate('/operacoes/compras');
        } catch (error) {
            console.error('Erro ao registrar compra:', error);
            alert('Erro ao registrar compra. Tente novamente.');
        }
    };

    const handleCancel = () => {
        navigate('/operacoes/compras');
    };

    return (
        <div className="nova-compra-content">
            <h1>Registrar Nova Compra</h1>
            <form onSubmit={handleSubmit}>
                {/* Seleção do cliente */}
                <label htmlFor="cliente_id">Cliente:</label>
                <select
                    id="cliente_id"
                    name="cliente_id"
                    value={formData.cliente_id}
                    onChange={handleChange}
                    required
                >
                    <option value="">Selecione um cliente</option>
                    {clientes.map((cliente) => (
                        <option key={cliente.clienteId} value={cliente.clienteId}>
                            {cliente.nome}
                        </option>
                    ))}
                </select>

                {/* Seleção do veículo */}
                <label htmlFor="veiculo_id">Veículo:</label>
                <select
                    id="veiculo_id"
                    name="veiculo_id"
                    value={formData.veiculo_id}
                    onChange={handleChange}
                    required
                >
                    <option value="">Selecione um veículo</option>
                    {veiculos.map((veiculo) => (
                        <option key={veiculo.veiculoId} value={veiculo.veiculoId}>
                            {veiculo.modelo} - {veiculo.placa}
                        </option>
                    ))}
                </select>

                {/* Seleção do vendedor */}
                <label htmlFor="vendedor_id">Vendedor:</label>
                <select
                    id="vendedor_id"
                    name="vendedor_id"
                    value={formData.vendedor_id}
                    onChange={handleChange}
                    required
                >
                    <option value="">Selecione um vendedor</option>
                    {vendedores.map((vendedor) => (
                        <option key={vendedor.vendedorId} value={vendedor.vendedorId}>
                            {vendedor.nome}
                        </option>
                    ))}
                </select>

                {/* Valor da compra */}
                <label htmlFor="valor">Valor:</label>
                <input
                    type="number"
                    id="valor"
                    name="valor"
                    value={formData.valor}
                    onChange={handleChange}
                    required
                    readOnly // Campo somente leitura, preenchido automaticamente
                />

                {/* Data da compra */}
                <label htmlFor="data">Data:</label>
                <input
                    type="date"
                    id="data"
                    name="data"
                    value={formData.data}
                    onChange={handleChange}
                    required
                />

                <div className="form-buttons">
                    <button type="submit" className="btn-submit-compra">
                        Registrar Compra
                        </button>
                    <button type="button" onClick={handleCancel} className="btn-cancel">
                        Cancelar Compra
                    </button>
                </div>
            </form>
        </div>
    );
}

export default NovaCompra;
